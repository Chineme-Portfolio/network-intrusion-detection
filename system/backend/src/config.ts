// Backend configuration, from the environment only (code-standards.md Section 6).

export const REDIS_URL = process.env.REDIS_URL ?? 'redis://redis:6379';
export const PORT = Number(process.env.PORT ?? 3000);

// The browser origin allowed to open the websocket. Single-user demo, no credentials,
// so `*` is acceptable; override in deploy.
export const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*';

// How long an unmatched flow or verdict is held waiting for its pair before the sweep
// drops it, and how often the sweep runs (spec 0002 AC-4).
export const HOLD_WINDOW_MS = Number(process.env.HOLD_WINDOW_MS ?? 10_000);
export const SWEEP_INTERVAL_MS = Number(process.env.SWEEP_INTERVAL_MS ?? 2_000);

// Redis channels and the websocket event name (the same strings across services,
// code-standards.md Section 8).
export const FLOWS_CHANNEL = 'flows';
export const VERDICTS_CHANNEL = 'verdicts';
export const FLOW_VERDICT_EVENT = 'flow_verdict';
