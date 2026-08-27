import { Controller, Get } from '@nestjs/common';

// devops.md Section 4: every HTTP service exposes /health. Layer 0 is liveness
// only; readiness (ml-service reachable, Redis subscribed) is added in K1.
@Controller('health')
export class HealthController {
  @Get()
  health(): { status: string } {
    return { status: 'ok' };
  }
}
