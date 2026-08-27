import React from 'react';
import { Icon } from './Icon.jsx';

const HEIGHT = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const PAD = { sm: '0 var(--space-8)', md: '0 var(--space-12)', lg: '0 var(--space-16)' };
const FS = { sm: 'var(--fs-11)', md: 'var(--fs-12)', lg: 'var(--fs-13)' };

const TONES = {
  primary: { bg: 'var(--accent)', fg: 'var(--on-accent)', bd: 'var(--accent)', bgHover: 'var(--accent-hover)' },
  secondary: { bg: 'var(--surface-control)', fg: 'var(--text-body)', bd: 'var(--border-control)', bgHover: 'var(--surface-control-hover)' },
  ghost: { bg: 'transparent', fg: 'var(--text-secondary)', bd: 'transparent', bgHover: 'var(--surface-control)' },
  caution: { bg: 'var(--surface-control)', fg: 'var(--amber-400)', bd: 'var(--status-warn-border)', bgHover: 'var(--status-warn-bg)' },
};

export function Button({
  children, variant = 'secondary', size = 'md', icon, iconEnd, disabled,
  active, fullWidth, type = 'button', style, ...rest
}) {
  const t = TONES[variant] || TONES.secondary;
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const lit = (hover || active) && !disabled;
  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined,
        alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)',
        height: HEIGHT[size], padding: PAD[size], font: 'var(--type-ui)', fontSize: FS[size],
        color: disabled ? 'var(--text-disabled)' : t.fg,
        background: disabled ? 'var(--surface-control)' : lit ? t.bgHover : t.bg,
        border: `1px solid ${disabled ? 'var(--border-hairline)' : t.bd}`,
        borderRadius: 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer',
        whiteSpace: 'nowrap', transition: 'var(--transition-control)',
        transform: press && !disabled ? 'translateY(1px)' : 'none',
        ...style,
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size={size === 'lg' ? 14 : 12} /> : null}
      {children}
      {iconEnd ? <Icon name={iconEnd} size={size === 'lg' ? 14 : 12} /> : null}
    </button>
  );
}
