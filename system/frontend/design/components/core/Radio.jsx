import React from 'react';

export function Radio({ label, hint, checked, onChange, disabled, name, style }) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: hint ? 'flex-start' : 'center', gap: 'var(--space-8)',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <input type="radio" name={name} checked={!!checked} disabled={disabled}
        onChange={() => onChange && onChange(true)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 14, height: 14, marginTop: hint ? 2 : 0, flex: '0 0 auto',
        background: 'var(--surface-inset)',
        border: `1px solid ${checked ? 'var(--accent)' : 'var(--border-control)'}`,
        borderRadius: 'var(--radius-pill)', transition: 'var(--transition-control)',
      }}>
        {checked ? <span style={{ width: 6, height: 6, borderRadius: 'var(--radius-pill)', background: 'var(--accent)' }} /> : null}
      </span>
      {label ? (
        <span>
          <span style={{ font: 'var(--type-ui)', fontWeight: 400, color: 'var(--text-body)' }}>{label}</span>
          {hint ? (
            <span style={{ display: 'block', marginTop: 2, font: 'var(--type-ui)', fontWeight: 400, fontSize: 'var(--fs-11)', color: 'var(--text-faint)' }}>{hint}</span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
