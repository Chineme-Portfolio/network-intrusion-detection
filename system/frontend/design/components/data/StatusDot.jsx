import React from 'react';

const TONES = {
  live: 'var(--status-live)', warn: 'var(--status-warn)',
  idle: 'var(--status-idle)', offline: 'var(--status-offline)',
  alert: 'var(--verdict-malicious-solid)',
};

export function StatusDot({ tone = 'idle', pulse, label, size = 6, mono, style }) {
  const color = TONES[tone] || TONES.idle;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-6)', ...style }}>
      <span style={{
        width: size, height: size, flex: '0 0 auto', borderRadius: 'var(--radius-pill)',
        background: color, boxShadow: tone === 'live' ? `0 0 6px ${color}` : 'none',
        animation: pulse ? 'caught-live-pulse var(--dur-pulse) var(--ease-in-out) infinite' : 'none',
      }} />
      {label ? (
        <span style={{
          font: mono ? 'var(--type-data-dense)' : 'var(--type-ui)',
          fontWeight: mono ? 400 : 500, color: 'var(--text-secondary)',
        }}>{label}</span>
      ) : null}
    </span>
  );
}
