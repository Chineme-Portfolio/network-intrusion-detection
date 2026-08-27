import React from 'react';
import { Icon } from './Icon.jsx';

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };

export function Input({
  label, hint, icon, mono, size = 'md', invalid, disabled, fullWidth,
  suffix, style, wrapperStyle, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const border = invalid ? 'var(--status-warn-border)' : focus ? 'var(--border-focus)' : 'var(--border-control)';
  return (
    <label style={{ display: fullWidth ? 'block' : 'inline-block', width: fullWidth ? '100%' : undefined, ...wrapperStyle }}>
      {label ? (
        <span style={{
          display: 'block', font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-6)',
        }}>{label}</span>
      ) : null}
      <span style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-6)', height: H[size],
        padding: '0 var(--space-8)', background: disabled ? 'var(--surface-app)' : 'var(--surface-inset)',
        border: `1px solid ${border}`, borderRadius: 'var(--radius-sm)',
        boxShadow: focus ? 'var(--ring-focus)' : 'none',
        transition: 'var(--transition-control)',
      }}>
        {icon ? <Icon name={icon} size={12} color="var(--text-faint)" /> : null}
        <input
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, background: 'none', border: 'none', outline: 'none', padding: 0,
            font: mono ? 'var(--type-data)' : 'var(--type-ui)', fontWeight: 400,
            letterSpacing: mono ? 'var(--tracking-data)' : undefined,
            color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)', ...style,
          }}
          {...rest}
        />
        {suffix ? (
          <span style={{ font: 'var(--type-data-dense)', color: 'var(--text-faint)' }}>{suffix}</span>
        ) : null}
      </span>
      {hint ? (
        <span style={{
          display: 'block', marginTop: 'var(--space-4)', font: 'var(--type-ui)', fontWeight: 400,
          fontSize: 'var(--fs-11)', color: invalid ? 'var(--amber-400)' : 'var(--text-faint)',
        }}>{hint}</span>
      ) : null}
    </label>
  );
}
