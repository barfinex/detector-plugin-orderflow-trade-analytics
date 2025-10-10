import { ApiProperty } from '@nestjs/swagger';
import { Trade, OrderBook, Symbol } from '@barfinex/types';

/** Конфигурация аналитики */
export type AnalyticsConfig = {
    maxTradesMemory: number;
    bigTradeUsd: number;
};

export const DEFAULT_CFG: AnalyticsConfig = {
    maxTradesMemory: 1000,
    bigTradeUsd: 50_000,
};

export type OrderbookSnapshot = OrderBook;

/** Внутреннее состояние по символу */
export type OrderflowState = {
    trades: Trade[];
    orderbook?: OrderbookSnapshot;
    cvd: number;
    lastPrice?: number;
    lastUpdate: number;
};

/** Ответ контроллера с метриками */
export class SymbolMetrics {
    @ApiProperty() symbol: string;
    @ApiProperty({ nullable: true }) lastPrice: number | null;
    @ApiProperty({ description: 'Доля покупок в общем объеме за окно (0..1)' })
    deltaRatio: number;
    @ApiProperty({ description: 'Cumulative Volume Delta (скользящий)' })
    cvd: number;
    @ApiProperty({ nullable: true, description: 'VWAP крупных сделок' })
    vwapBigTrades: number | null;
    @ApiProperty({ nullable: true, description: 'Imbalance bid/ask' })
    orderbookImbalance: number | null;
    @ApiProperty() tradesWindow: number;
    @ApiProperty() lastUpdate: number;
}
