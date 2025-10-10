import { Injectable, Logger } from '@nestjs/common';
import {
    Trade,
    TradeSide,
    OrderBook,
    PluginMeta,
    PluginContext,
    PluginHook,
} from '@barfinex/types';
import { IngestTradeDto } from './dto/ingest-trade.dto';
import { IngestOrderbookDto } from './dto/ingest-orderbook.dto';
import { QueryMetricsDto } from './dto/query-metrics.dto';
import {
    OrderbookSnapshot,
    OrderflowState,
    SymbolMetrics,
    DEFAULT_CFG,
    AnalyticsConfig,
} from './types/metrics.types';

import { DetectorPluginService } from '@barfinex/detector';

@Injectable()
export class OrderflowTradeAnalyticsService extends DetectorPluginService {
    protected readonly logger = new Logger(OrderflowTradeAnalyticsService.name);
    private readonly cfg: AnalyticsConfig = { ...DEFAULT_CFG };
    private readonly state = new Map<string, OrderflowState>();

    readonly name = 'OrderflowTradeAnalytics';

    readonly meta: PluginMeta = {
        studioGuid: 'orderflow-trade-analytics-dev',
        title: 'Orderflow & Trade Analytics',
        description:
            'Аналитика по трейдам и ордербуку: delta ratio, CVD, VWAP крупных сделок, дисбаланс стакана',
        version: '0.1.0',
        author: 'Barfinex',
        visibility: 'public',
        pluginApi: '/plugins-api/orderflow-trade-analytics-dev',
    };

    // 🔹 Публичный API для стратегий
    api = {
        ingestTrade: (dto: IngestTradeDto) => this.ingestTrade(dto),
        ingestOrderbook: (dto: IngestOrderbookDto) => this.ingestOrderbook(dto),
        getMetrics: (dto: QueryMetricsDto) => this.getMetrics(dto),
        getDebugState: (symbol: string) => this.getDebugState(symbol),
        getOrderBookImbalanceFromState: (symbol: string) =>
            this.getOrderBookImbalanceFromState(symbol),
        getTradeDeltaByLastN: (symbol: string, n: number) =>
            this.getTradeDeltaByLastN(symbol, n),
        getBigTradesVWAPFromState: (symbol: string, thresholdUsd: number) =>
            this.getBigTradesVWAPFromState(symbol, thresholdUsd),
    };

    // ================= Plugin Hooks =================

    async [PluginHook.onStart](ctx: PluginContext): Promise<void> {
        this.logger.log(`[onStart] ${this.name} for ${ctx.detectorContext.name}`);
    }

    async [PluginHook.onInit](ctx: PluginContext): Promise<void> {
        this.logger.log(`[onInit] ${this.name} for ${ctx.detectorContext.name}`);
    }

    async [PluginHook.onTrade](_ctx: PluginContext, trade: Trade): Promise<void> {
        this.ingestTrade({
            symbol: trade.symbol.name,
            price: trade.price,
            volume: trade.volume,
            side: trade.side,
            time: trade.time,
        });
    }

    async [PluginHook.onOrderBookUpdate](
        _ctx: PluginContext,
        orderBook: OrderBook,
    ): Promise<void> {
        this.ingestOrderbook({
            symbol: orderBook.symbol.name,
            bids: orderBook.bids,
            asks: orderBook.asks,
            time: orderBook.time,
        });
    }

    // ================= Internal Logic =================

    private ensure(symbol: string): OrderflowState {
        if (!this.state.has(symbol)) {
            this.state.set(symbol, {
                trades: [],
                cvd: 0,
                lastPrice: undefined,
                orderbook: undefined,
                lastUpdate: Date.now(),
            });
        }
        return this.state.get(symbol)!;
    }

    public ingestTrade(dto: IngestTradeDto): void {
        const st = this.ensure(dto.symbol);
        const trade: Trade = {
            symbol: { name: dto.symbol } as any,
            price: dto.price,
            volume: dto.volume,
            side: dto.side,
            time: dto.time ?? Date.now(),
        };
        st.lastPrice = trade.price;
        st.trades.unshift(trade);
        if (st.trades.length > this.cfg.maxTradesMemory) st.trades.pop();
        st.cvd += trade.side === TradeSide.LONG ? trade.volume : -trade.volume;
        st.lastUpdate = Date.now();
    }

    public ingestOrderbook(dto: IngestOrderbookDto): void {
        const st = this.ensure(dto.symbol);
        const ob: OrderbookSnapshot = {
            symbol: { name: dto.symbol } as any,
            bids: dto.bids ?? [],
            asks: dto.asks ?? [],
            time: dto.time ?? Date.now(),
        };
        st.orderbook = ob as any;
        st.lastUpdate = Date.now();
    }

    public getMetrics(q: QueryMetricsDto): SymbolMetrics {
        const st = this.ensure(q.symbol);
        const windowTrades =
            q.windowSec && q.windowSec > 0
                ? st.trades.filter(
                    (t) => (Date.now() - (t.time ?? 0)) / 1000 <= q.windowSec!,
                )
                : st.trades;

        const buyVol = windowTrades
            .filter((t) => t.side === TradeSide.LONG)
            .reduce((s, t) => s + t.volume, 0);
        const sellVol = windowTrades
            .filter((t) => t.side === TradeSide.SHORT)
            .reduce((s, t) => s + t.volume, 0);
        const deltaRatio = buyVol + sellVol > 0 ? buyVol / (buyVol + sellVol) : 0.5;

        const bigs = windowTrades.filter(
            (t) => t.volume * t.price >= (q.bigTradeUsd ?? this.cfg.bigTradeUsd),
        );
        const vwapBig = bigs.length
            ? bigs.reduce((s, t) => s + t.price * t.volume, 0) /
            (bigs.reduce((s, t) => s + t.volume, 0) + 1e-9)
            : null;

        return {
            symbol: q.symbol,
            lastPrice: st.lastPrice ?? null,
            deltaRatio,
            cvd: st.cvd,
            vwapBigTrades: vwapBig,
            orderbookImbalance: st.orderbook
                ? this.getOrderBookImbalanceFromState(q.symbol)
                : null,
            tradesWindow: windowTrades.length,
            lastUpdate: st.lastUpdate,
        };
    }

    public getDebugState(symbol: string) {
        const st = this.ensure(symbol);
        return {
            trades: st.trades,
            orderbook: st.orderbook,
            cvd: st.cvd,
            lastPrice: st.lastPrice,
            lastUpdate: st.lastUpdate,
        };
    }

    // ================= VolumeFollow Helpers =================

    /** Orderbook imbalance */
    public getOrderBookImbalanceFromState(symbol: string): number | null {
        const st = this.ensure(symbol);
        if (!st.orderbook) return null;
        const bidVol = st.orderbook.bids.reduce((s, b) => s + (b.volume ?? 0), 0);
        const askVol = st.orderbook.asks.reduce((s, a) => s + (a.volume ?? 0), 0);
        return bidVol / (askVol + 1e-9);
    }

    /** Delta of last N trades */
    public getTradeDeltaByLastN(symbol: string, n: number): number {
        const st = this.ensure(symbol);
        const recent = st.trades.slice(0, n);
        if (!recent.length) return 0.5;

        const buyVol = recent
            .filter((t) => t.side === TradeSide.LONG)
            .reduce((s, t) => s + t.volume, 0);
        const sellVol = recent
            .filter((t) => t.side === TradeSide.SHORT)
            .reduce((s, t) => s + t.volume, 0);

        const total = buyVol + sellVol;
        return total > 0 ? buyVol / (total + 1e-9) : 0.5;
    }

    /** VWAP of big trades */
    public getBigTradesVWAPFromState(
        symbol: string,
        thresholdUsd: number,
    ): number | null {
        const st = this.ensure(symbol);
        const bigs = st.trades.filter(
            (t) => (t.volume ?? 0) * (t.price ?? 0) >= thresholdUsd,
        );
        if (!bigs.length) return null;

        const value = bigs.reduce(
            (s, t) => s + (t.price ?? 0) * (t.volume ?? 0),
            0,
        );
        const vol = bigs.reduce((s, t) => s + (t.volume ?? 0), 0);
        return value / (vol + 1e-9);
    }
}
