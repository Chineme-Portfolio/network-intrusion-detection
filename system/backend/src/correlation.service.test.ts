import 'reflect-metadata';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CorrelationService, type FlowVerdictRow } from './correlation.service';

// Minimal fixtures with only the fields the correlator reads (the contract types are
// erased at runtime, so plain objects are enough).
const makeFlow = (id: string) =>
  ({ flow_id: id, src_ip: '10.0.0.1', src_port: 1234, dst_ip: '192.168.10.50', dst_port: 80, protocol: 6, ts: 't-flow' }) as never;

const makeVerdict = (id: string, verdict: 'benign' | 'malicious' = 'malicious') =>
  ({ flow_id: id, model_id: 'dt', verdict, score: 0.9, score_kind: 'calibrated', latency_ms: 1, ts: 't-verdict', ground_truth: 'DDoS' }) as never;

describe('CorrelationService', () => {
  let svc: CorrelationService;

  beforeEach(() => {
    vi.useFakeTimers();
    svc = new CorrelationService();
    svc.onModuleInit();
  });

  afterEach(() => {
    svc.onModuleDestroy();
    vi.useRealTimers();
  });

  it('merges when the flow arrives before its verdict (covers AC-4)', () => {
    const rows: FlowVerdictRow[] = [];
    svc.merged$.subscribe((r) => rows.push(r));

    svc.acceptFlow(makeFlow('a'));
    expect(rows).toHaveLength(0); // held, waiting for its verdict

    svc.acceptVerdict(makeVerdict('a'));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ flow_id: 'a', src_ip: '10.0.0.1', dst_port: 80, verdict: 'malicious', ground_truth: 'DDoS' });
  });

  it('merges when the verdict arrives before its flow (covers AC-4)', () => {
    const rows: FlowVerdictRow[] = [];
    svc.merged$.subscribe((r) => rows.push(r));

    svc.acceptVerdict(makeVerdict('b'));
    expect(rows).toHaveLength(0);

    svc.acceptFlow(makeFlow('b'));
    expect(rows).toHaveLength(1);
    expect(rows[0].flow_id).toBe('b');
  });

  it('sweeps an orphan verdict, so a much-later flow cannot resurrect it (covers AC-4)', () => {
    const rows: FlowVerdictRow[] = [];
    svc.merged$.subscribe((r) => rows.push(r));

    svc.acceptVerdict(makeVerdict('orphan-v'));
    vi.advanceTimersByTime(60_000); // well past the hold window + several sweep ticks
    expect(rows).toHaveLength(0);

    svc.acceptFlow(makeFlow('orphan-v')); // the verdict is gone, so this is a new orphan, not a match
    expect(rows).toHaveLength(0);
  });

  it('sweeps an orphan flow (a featurizer-rejected flow never gets a verdict) (covers AC-4)', () => {
    const rows: FlowVerdictRow[] = [];
    svc.merged$.subscribe((r) => rows.push(r));

    svc.acceptFlow(makeFlow('orphan-f'));
    vi.advanceTimersByTime(60_000);

    svc.acceptVerdict(makeVerdict('orphan-f')); // the flow is gone, so nothing to merge
    expect(rows).toHaveLength(0);
  });
});
