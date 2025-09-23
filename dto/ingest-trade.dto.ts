import { ApiProperty } from '@nestjs/swagger';
import { TradeSide } from '@barfinex/types';

export class IngestTradeDto {
    @ApiProperty({ example: 'BTCUSDT' }) symbol: string;
    @ApiProperty({ enum: TradeSide }) side: TradeSide;
    @ApiProperty({ example: 65000 }) price: number;
    @ApiProperty({ example: 0.5 }) volume: number;
    @ApiProperty({ required: false, example: Date.now() }) time?: number;
}
