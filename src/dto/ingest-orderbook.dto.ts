import { ApiProperty } from '@nestjs/swagger';

export class OrderbookLevelDto {
    @ApiProperty() price: number;
    @ApiProperty() volume: number;
}

export class IngestOrderbookDto {
    @ApiProperty({ example: 'BTCUSDT' }) symbol: string;
    @ApiProperty({ type: [OrderbookLevelDto] }) bids: OrderbookLevelDto[];
    @ApiProperty({ type: [OrderbookLevelDto] }) asks: OrderbookLevelDto[];
    @ApiProperty({ required: false, example: Date.now() }) time?: number;
}
