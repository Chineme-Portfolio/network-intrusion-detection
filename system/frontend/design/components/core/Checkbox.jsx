import React from 'react';
import { Icon } from './Icon.jsx';

export function Checkbox({ label, checked, indeterminate, onChange, disabled, hint, style }) {
  const on = checked || indeterminate;
  return (
    <label style={{
      display: 'inline-flex', alignItems: hint ? 'flex-start' : 'center', gap: 'var(--space-8)',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 14, height: 14, marginTop: hint ? 2 : 0, flex: '0 0 auto',
          background: on ? 'var(--accent)' : 'var(--surface-inset)',
          border: `1px solid ${on ? 'var(--accent)' : 'var(--border-control)'}`,
          borderRadius: 'var(--radius-xs)', transition: 'var(--transition-control)',
        }}
      >
        {indeterminate
          ? <span style={{ width: 7, height: 1, background: 'var(--on-accent)' }} />
          : checked ? <Icon name="check" size={10} color="var(--on-accent)" /> : null}
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
