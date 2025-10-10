import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { OrderflowTradeAnalyticsController } from './orderflow-trade-analytics.controller';
import { OrderflowTradeAnalyticsService } from './orderflow-trade-analytics.service';
import { ORDERFLOW_ANALYTICS } from './orderflow-trade-analytics.constants';

@Module({
    controllers: [OrderflowTradeAnalyticsController],
    providers: [
        OrderflowTradeAnalyticsService,
        {
            provide: ORDERFLOW_ANALYTICS,
            useExisting: OrderflowTradeAnalyticsService,
        },
    ],
    exports: [ORDERFLOW_ANALYTICS, OrderflowTradeAnalyticsService],
})
export class OrderflowTradeAnalyticsModule implements OnModuleInit {
    private readonly logger = new Logger(OrderflowTradeAnalyticsModule.name);

    onModuleInit() {
        this.logger.log('✅ OrderflowTradeAnalyticsModule initialized');
    }
}
