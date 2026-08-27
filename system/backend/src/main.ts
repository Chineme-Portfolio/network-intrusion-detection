import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

// Layer 0: the backend boots and answers /health. The control REST API and the
// WebSocket verdict gateway (subscribe Redis `verdicts` -> emit to clients) are
// built with the keystone (K1); see architecture.md and code-standards.md Section 4.
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  // 0.0.0.0 so the container port is reachable from the host.
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
