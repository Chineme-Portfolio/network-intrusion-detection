import { Module } from '@nestjs/common';

import { HealthController } from './health.controller';

// Layer 0 wires only /health. Control providers, the Redis verdict subscriber,
// and the WS gateway join here in K1 (logic in providers, not controllers,
// code-standards.md Section 4).
@Module({
  controllers: [HealthController],
})
export class AppModule {}
