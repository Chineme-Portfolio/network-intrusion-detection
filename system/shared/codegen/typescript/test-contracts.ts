// Contract validation, TypeScript side (AC-2, AC-3).
//
// The compiler is the test. A valid payload typed as the generated interface must
// compile; a payload missing a required field must NOT (proved with @ts-expect-error).
// Run codegen first, then: npm run typecheck  (tsc --noEmit).

import type { FlowRecord } from '../../generated/typescript/flow_record';
import type { Verdict } from '../../generated/typescript/verdict';
import type { RegistryManifest } from '../../generated/typescript/registry_manifest';

// --- Valid payloads must type check ---

const flow: FlowRecord = {
  schema_version: '1.0.0',
  flow_id: '6f9619ff-8b86-d011-b42d-00c04fc964ff',
  ts: '2026-08-12T14:22:07.412Z',
  src_ip: '10.4.19.22',
  src_port: 51204,
  dst_ip: '192.168.10.50',
  dst_port: 80,
  protocol: 6,
  features: { destination_port: 80 },
  ground_truth: 'BENIGN',
};

const verdict: Verdict = {
  schema_version: '1.0.0',
  flow_id: '6f9619ff-8b86-d011-b42d-00c04fc964ff',
  model_id: 'dt_classweight',
  verdict: 'malicious',
  score: 0.97,
  score_kind: 'calibrated',
  latency_ms: 3.2,
  ts: '2026-08-12T14:22:07.500Z',
};

const manifest: RegistryManifest = {
  schema_version: '1.0.0',
  default_model_id: 'dt_classweight',
  models: [
    {
      model_id: 'dt_classweight',
      display_name: 'Inertia (decision tree)',
      family: 'tree',
      path: 'models/dt_classweight.joblib',
      supports_proba: true,
      metrics: { recall: 0.997, precision: 0.994, fn: 340, fp: 690 },
    },
  ],
};

// --- A payload missing a required field must be rejected by the compiler ---

// @ts-expect-error score_kind is required on Verdict
const badVerdict: Verdict = {
  schema_version: '1.0.0',
  flow_id: '6f9619ff-8b86-d011-b42d-00c04fc964ff',
  model_id: 'dt_classweight',
  verdict: 'malicious',
  score: 0.97,
  latency_ms: 3.2,
  ts: '2026-08-12T14:22:07.500Z',
};

// Reference each binding so noUnusedLocals passes (the compile itself is the assertion).
void flow;
void verdict;
void manifest;
void badVerdict;
