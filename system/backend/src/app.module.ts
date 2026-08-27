import { Module } from '@nestjs/common';

import { HealthController } from './health.controller';
import { CorrelationService } from './correlation.service';
import { FlowVerdictGateway } from './flow-verdict.gateway';
import { RedisSubscriberService } from './redis-subscriber.service';

// K1: the Redis verdict/flow subscriber, the flow+verdict correlator, and the WebSocket
// gateway that relays merged rows to the browser. Logic lives in providers, not
// controllers (code-standards.md Section 4). The control REST API arrives with F1.
@Module({
  controllers: [HealthController],
  providers: [CorrelationService, RedisSubscriberService, FlowVerdictGateway],
})
export class AppModule {}
