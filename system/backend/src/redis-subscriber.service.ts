import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

import type { FlowRecord } from './contracts/flow_record';
import type { Verdict } from './contracts/verdict';
import { CorrelationService } from './correlation.service';
import { FLOWS_CHANNEL, REDIS_URL, VERDICTS_CHANNEL } from './config';

/**
 * Subscribe the Redis `flows` and `verdicts` channels and hand each message to the
 * correlator. A single subscriber connection carries both channels (ioredis, the
 * project's Redis client). An unparseable message is logged and skipped, never fatal
 * (code-standards.md Section 5).
 */
@Injectable()
export class RedisSubscriberService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger('RedisSubscriber');
  private sub?: Redis;

  constructor(private readonly correlation: CorrelationService) {}

  async onModuleInit(): Promise<void> {
    this.sub = new Redis(REDIS_URL, { lazyConnect: false });
    this.sub.on('error', (err) => this.log.error(`[backend] redis error: ${err.message}`));
    this.sub.on('message', (channel, message) => this.onMessage(channel, message));
    await this.sub.subscribe(FLOWS_CHANNEL, VERDICTS_CHANNEL);
    this.log.log(`subscribed to ${FLOWS_CHANNEL}, ${VERDICTS_CHANNEL}`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.sub?.quit();
  }

  private onMessage(channel: string, message: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(message);
    } catch {
      this.log.warn(`[backend] dropping unparseable message on ${channel}`);
      return;
    }
    if (channel === FLOWS_CHANNEL) {
      this.correlation.acceptFlow(parsed as FlowRecord);
    } else if (channel === VERDICTS_CHANNEL) {
      this.correlation.acceptVerdict(parsed as Verdict);
    }
  }
}
