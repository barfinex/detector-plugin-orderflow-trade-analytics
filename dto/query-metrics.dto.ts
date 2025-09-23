import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryMetricsDto {
    @ApiPropertyOptional({ example: 'BTCUSDT' })
    symbol!: string;

    @ApiPropertyOptional({ description: 'Окно в секундах для расчетов', example: 300 })
    windowSec?: number;

    @ApiPropertyOptional({ description: 'Порог крупной сделки в USD', example: 50000 })
    bigTradeUsd?: number;
}
