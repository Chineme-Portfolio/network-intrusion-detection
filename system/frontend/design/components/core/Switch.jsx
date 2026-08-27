import React from 'react';

export function Switch({ label, checked, onChange, disabled, size = 'md', style }) {
  const w = size === 'sm' ? 24 : 30;
  const h = size === 'sm' ? 14 : 16;
  const knob = h - 4;
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-8)',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          position: 'relative', display: 'inline-block', width: w, height: h, flex: '0 0 auto',
          background: checked ? 'var(--accent)' : 'var(--ink-700)',
          border: `1px solid ${checked ? 'var(--accent)' : 'var(--border-control)'}`,
          borderRadius: 'var(--radius-pill)',
          transition: 'background-color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        }}
      >
        <span style={{
          position: 'absolute', top: 1, left: checked ? w - knob - 3 : 1,
          width: knob, height: knob, borderRadius: 'var(--radius-pill)',
          background: checked ? 'var(--on-accent)' : 'var(--steel-400)',
          transition: `left var(--dur-fast) var(--ease-out)`,
        }} />
      </span>
      {label ? <span style={{ font: 'var(--type-ui)', fontWeight: 400, color: 'var(--text-body)' }}>{label}</span> : null}
    </label>
  );
}
