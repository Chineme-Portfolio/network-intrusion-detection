import React from 'react';

const SEGMENTS = 10;

export function ConfidenceMeter({
  value = 0, verdict = 'benign', threshold, segments = SEGMENTS,
  showValue = true, width = 96, size = 'md', label, style,
}) {
  const pct = Math.max(0, Math.min(1, value));
  const filled = Math.round(pct * segments);
  const low = threshold != null && pct < threshold;
  const fill = low ? 'var(--amber-400)'
    : verdict === 'malicious' ? 'var(--verdict-malicious-solid)'
    : verdict === 'unknown' ? 'var(--ink-600)' : 'var(--steel-300)';
  const h = size === 'sm' ? 4 : size === 'lg' ? 10 : 6;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-8)', ...style }}>
      {label ? (
        <span style={{
          font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
          color: 'var(--text-faint)',
        }}>{label}</span>
      ) : null}
      <span style={{ display: 'flex', gap: 2, width, height: h }} role="meter" aria-valuenow={pct}>
        {Array.from({ length: segments }, (_, i) => (
          <span key={i} style={{
            flex: 1, background: i < filled ? fill : 'var(--ink-750)',
            borderRadius: 1, transition: 'background-color var(--dur-fast) var(--ease-out)',
          }} />
        ))}
      </span>
      {showValue ? (
        <span style={{
          font: 'var(--type-data-strong)', fontSize: size === 'sm' ? 'var(--fs-11)' : 'var(--fs-12)',
          color: low ? 'var(--amber-400)' : 'var(--text-secondary)', letterSpacing: 'var(--tracking-data)',
        }}>{pct.toFixed(2)}</span>
      ) : null}
    </span>
  );
}
