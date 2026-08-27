import React from 'react';
import { Icon } from './Icon.jsx';

const BOX = { sm: 22, md: 28, lg: 34 };

export function IconButton({ icon, label, size = 'md', variant = 'ghost', active, disabled, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const lit = (hover || active) && !disabled;
  const solid = variant === 'solid';
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: BOX[size], height: BOX[size], padding: 0,
        color: disabled ? 'var(--text-disabled)' : solid ? 'var(--on-accent)'
          : active ? 'var(--accent)' : hover ? 'var(--text-primary)' : 'var(--text-muted)',
        background: solid ? (lit ? 'var(--accent-hover)' : 'var(--accent)')
          : lit ? 'var(--surface-control)' : 'transparent',
        border: `1px solid ${variant === 'secondary' ? 'var(--border-control)' : solid ? 'var(--accent)' : 'transparent'}`,
        borderRadius: 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-control)', ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
    </button>
  );
}
