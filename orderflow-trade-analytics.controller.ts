import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderflowTradeAnalyticsService } from './orderflow-trade-analytics.service';
import { IngestTradeDto } from './dto/ingest-trade.dto';
import { IngestOrderbookDto } from './dto/ingest-orderbook.dto';
import { QueryMetricsDto } from './dto/query-metrics.dto';
import { SymbolMetrics } from './types/metrics.types';

@ApiTags('orderflow-trade-analytics')
@Controller('/plugins-api/orderflow-trade-analytics-dev')
export class OrderflowTradeAnalyticsController {
    constructor(private readonly svc: OrderflowTradeAnalyticsService) { }

    @Post('/ingest/trade')
    @ApiOperation({ summary: 'Инжест трейдов (orderflow)' })
    @ApiOkResponse({ description: 'OK' })
    ingestTrade(@Body() dto: IngestTradeDto) {
        this.svc.ingestTrade(dto);
        return { ok: true };
    }

    @Post('/ingest/orderbook')
    @ApiOperation({ summary: 'Инжест снапшотов ордербука' })
    @ApiOkResponse({ description: 'OK' })
    ingestOrderbook(@Body() dto: IngestOrderbookDto) {
        this.svc.ingestOrderbook(dto);
        return { ok: true };
    }

    @Get('/metrics')
    @ApiOperation({ summary: 'Текущие метрики по символу' })
    @ApiOkResponse({ type: SymbolMetrics })
    getMetrics(@Query() query: QueryMetricsDto): SymbolMetrics {
        return this.svc.getMetrics(query);
    }

    @Get('/state/:symbol')
    @ApiOperation({ summary: 'Сырые агрегаты по символу (для дебага)' })
    getState(@Param('symbol') symbol: string) {
        return this.svc.getDebugState(symbol);
    }
}
