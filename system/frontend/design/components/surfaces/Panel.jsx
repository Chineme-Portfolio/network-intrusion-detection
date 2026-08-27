import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Panel({
  title, eyebrow, meta, icon, actions, children, footer,
  flush, scroll, tone = 'default', style, bodyStyle,
}) {
  const alert = tone === 'alert';
  return (
    <section style={{
      display: 'flex', flexDirection: 'column', minHeight: 0,
      background: 'var(--surface-panel)',
      border: `1px solid ${alert ? 'var(--verdict-malicious-border)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: alert ? 'var(--glow-alert)' : 'var(--shadow-panel)',
      overflow: 'hidden', ...style,
    }}>
      {(title || actions || eyebrow) ? (
        <header style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-8)', flex: '0 0 auto',
          minHeight: 34, padding: '0 var(--space-10) 0 var(--space-12)',
          borderBottom: '1px solid var(--border-hairline)',
          background: 'var(--surface-raised)',
        }}>
          {icon ? <Icon name={icon} size={13} color={alert ? 'var(--verdict-malicious-fg)' : 'var(--text-muted)'} /> : null}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-8)', minWidth: 0 }}>
            {eyebrow ? (
              <span style={{
                font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
                color: 'var(--text-faint)',
              }}>{eyebrow}</span>
            ) : null}
            {title ? (
              <h2 style={{
                font: 'var(--type-panel-title)', color: 'var(--text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{title}</h2>
            ) : null}
            {meta ? (
              <span style={{ font: 'var(--type-data-dense)', color: 'var(--text-faint)', letterSpacing: 'var(--tracking-data)' }}>{meta}</span>
            ) : null}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>{actions}</div>
        </header>
      ) : null}
      <div style={{
        flex: '1 1 auto', minHeight: 0, padding: flush ? 0 : 'var(--space-12)',
        overflow: scroll ? 'auto' : 'visible', ...bodyStyle,
      }}>{children}</div>
      {footer ? (
        <footer style={{
          flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 'var(--space-8)',
          minHeight: 32, padding: '0 var(--space-12)',
          borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-raised)',
          font: 'var(--type-data-dense)', color: 'var(--text-faint)',
        }}>{footer}</footer>
      ) : null}
    </section>
  );
}
