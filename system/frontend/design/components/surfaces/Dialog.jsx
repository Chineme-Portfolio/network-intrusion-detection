import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
import { Icon } from '../core/Icon.jsx';

export function Dialog({ open = true, title, icon, description, children, footer, width = 420, onClose, tone = 'default' }) {
  if (!open) return null;
  const alert = tone === 'alert';
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 'var(--space-24)',
      background: 'var(--scrim)', backdropFilter: 'var(--blur-scrim)',
    }}>
      <div role="dialog" aria-label={title} style={{
        width, maxWidth: '100%', background: 'var(--surface-overlay)',
        border: `1px solid ${alert ? 'var(--verdict-malicious-border)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-overlay)', overflow: 'hidden',
      }}>
        <header style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-8)', minHeight: 38,
          padding: '0 var(--space-8) 0 var(--space-16)',
          borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-raised)',
        }}>
          {icon ? <Icon name={icon} size={14} color={alert ? 'var(--verdict-malicious-fg)' : 'var(--text-muted)'} /> : null}
          <h2 style={{ font: 'var(--type-panel-title)', fontSize: 'var(--fs-14)', color: 'var(--text-primary)' }}>{title}</h2>
          <span style={{ marginLeft: 'auto' }}>
            {onClose ? <IconButton icon="x" label="Close" size="sm" onClick={onClose} /> : null}
          </span>
        </header>
        <div style={{ padding: 'var(--space-16)' }}>
          {description ? (
            <p style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', marginBottom: children ? 'var(--space-16)' : 0, textWrap: 'pretty' }}>{description}</p>
          ) : null}
          {children}
        </div>
        {footer ? (
          <footer style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-8)',
            padding: 'var(--space-12) var(--space-16)',
            borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-raised)',
          }}>{footer}</footer>
        ) : null}
      </div>
    </div>
  );
}
