import React from 'react';
import { Icon } from './Icon.jsx';

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };

export function Select({ label, options = [], value, onChange, size = 'md', mono, disabled, fullWidth, style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: fullWidth ? 'block' : 'inline-block', width: fullWidth ? '100%' : undefined }}>
      {label ? (
        <span style={{
          display: 'block', font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-6)',
        }}>{label}</span>
      ) : null}
      <span style={{
        position: 'relative', display: 'flex', alignItems: 'center', height: H[size],
        background: 'var(--surface-control)',
        border: `1px solid ${focus ? 'var(--border-focus)' : 'var(--border-control)'}`,
        borderRadius: 'var(--radius-sm)', boxShadow: focus ? 'var(--ring-focus)' : 'none',
        transition: 'var(--transition-control)', ...style,
      }}>
        <select
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: 'none', WebkitAppearance: 'none', width: '100%', height: '100%',
            padding: '0 26px 0 var(--space-8)', background: 'none', border: 'none', outline: 'none',
            font: mono ? 'var(--type-data-strong)' : 'var(--type-ui)',
            color: disabled ? 'var(--text-disabled)' : 'var(--text-body)',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return <option key={opt.value} value={opt.value} style={{ background: 'var(--surface-panel)' }}>{opt.label}</option>;
          })}
        </select>
        <Icon name="chevron-down" size={12} color="var(--text-faint)"
          style={{ position: 'absolute', right: 'var(--space-8)', pointerEvents: 'none' }} />
      </span>
    </label>
  );
}
