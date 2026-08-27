// The merged flow+verdict row the backend pushes over the websocket. Backend owned
// (spec 0002): this mirrors the backend's FlowVerdictRow. Promote to a shared/ contract
// only if it stabilizes and gains more consumers.
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
