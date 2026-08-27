import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Subject } from 'rxjs';

import type { FlowRecord } from './contracts/flow_record';
import type { Verdict } from './contracts/verdict';
import { HOLD_WINDOW_MS, SWEEP_INTERVAL_MS } from './config';

// The row the UI renders: the flow's attributes joined with its verdict. Backend owned
// (assembled here), not a shared/ contract, until a second consumer needs it (spec 0002).
export interface FlowVerdictRow {
  flow_id: string;
  ts: string;
  src_ip: string;
  src_port: number;
  dst_ip: string;
  dst_port: number;
  protocol: number;
  verdict: 'benign' | 'malicious';
  score: number;
  score_kind: 'calibrated' | 'uncalibrated';
  model_id: string;
  latency_ms: number;
  ground_truth: string | null;
}

interface Held<T> {
  value: T;
  at: number;
}

/**
 * Correlate the two Redis streams by flow_id and emit one merged row per pair.
 *
 * Either side may arrive first (the flow, or its verdict) and is held briefly. An entry
 * whose pair never arrives (an orphan verdict, or a flow that was featurizer rejected and
 * so never got a verdict) is evicted by an active timer sweep, so the maps stay bounded
 * even when the stream idles (spec 0002 AC-4).
 */
@Injectable()
export class CorrelationService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger('Correlation');
  private readonly flows = new Map<string, Held<FlowRecord>>();
  private readonly verdicts = new Map<string, Held<Verdict>>();
  private sweepTimer?: ReturnType<typeof setInterval>;

  readonly merged$ = new Subject<FlowVerdictRow>();

  onModuleInit(): void {
    this.sweepTimer = setInterval(() => this.sweep(), SWEEP_INTERVAL_MS);
  }

  onModuleDestroy(): void {
    if (this.sweepTimer) clearInterval(this.sweepTimer);
    this.merged$.complete();
  }

  acceptFlow(flow: FlowRecord): void {
    const id = flow.flow_id;
    const pending = this.verdicts.get(id);
    if (pending) {
      this.verdicts.delete(id);
      this.emit(flow, pending.value);
    } else {
      this.flows.set(id, { value: flow, at: Date.now() });
    }
  }

  acceptVerdict(verdict: Verdict): void {
    const id = verdict.flow_id;
    const pending = this.flows.get(id);
    if (pending) {
      this.flows.delete(id);
      this.emit(pending.value, verdict);
    } else {
      this.verdicts.set(id, { value: verdict, at: Date.now() });
    }
  }

  private emit(flow: FlowRecord, verdict: Verdict): void {
    this.merged$.next({
      flow_id: flow.flow_id,
      ts: verdict.ts,
      src_ip: flow.src_ip,
      src_port: flow.src_port,
      dst_ip: flow.dst_ip,
      dst_port: flow.dst_port,
      protocol: flow.protocol,
      verdict: verdict.verdict,
      score: verdict.score,
      score_kind: verdict.score_kind,
      model_id: verdict.model_id,
      latency_ms: verdict.latency_ms,
      ground_truth: verdict.ground_truth ?? null,
    });
  }

  private sweep(): void {
    const cutoff = Date.now() - HOLD_WINDOW_MS;
    let dropped = 0;
    for (const [id, held] of this.flows) {
      if (held.at < cutoff) {
        this.flows.delete(id);
        dropped += 1;
      }
    }
    for (const [id, held] of this.verdicts) {
      if (held.at < cutoff) {
        this.verdicts.delete(id);
        dropped += 1;
      }
    }
    if (dropped > 0) {
      this.log.warn(
        `swept ${dropped} unmatched entries (flows held=${this.flows.size}, verdicts held=${this.verdicts.size})`,
      );
    }
  }
}
