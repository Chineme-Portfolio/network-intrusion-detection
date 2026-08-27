import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Tag({ children, onRemove, active, mono = true, icon, title, style }) {
  return (
    <span title={title} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', height: 20,
      padding: onRemove ? '0 3px 0 var(--space-6)' : '0 var(--space-6)',
      background: active ? 'var(--accent-quiet)' : 'var(--surface-control)',
      border: `1px solid ${active ? 'rgba(79,175,188,.38)' : 'var(--border-control)'}`,
      borderRadius: 'var(--radius-sm)',
      color: active ? 'var(--cyan-300)' : 'var(--text-secondary)',
      font: mono ? 'var(--type-data-dense)' : 'var(--type-ui)', fontWeight: mono ? 400 : 500,
      letterSpacing: mono ? 'var(--tracking-data)' : undefined, whiteSpace: 'nowrap', ...style,
    }}>
      {icon ? <Icon name={icon} size={10} /> : null}
      {children}
      {onRemove ? (
        <span onClick={onRemove} role="button" aria-label="Remove" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 14, height: 14, cursor: 'pointer', color: 'var(--text-faint)',
        }}><Icon name="x" size={9} /></span>
      ) : null}
    </span>
  );
}
