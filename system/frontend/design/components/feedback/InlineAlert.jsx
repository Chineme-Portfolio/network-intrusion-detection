import React from 'react';
import { Icon } from '../core/Icon.jsx';

const TONES = {
  info: { fg: 'var(--text-body)', icon: 'info', ic: 'var(--cyan-400)', bg: 'var(--accent-quiet)', bd: 'rgba(79,175,188,.32)' },
  warn: { fg: 'var(--text-body)', icon: 'triangle-alert', ic: 'var(--amber-400)', bg: 'var(--status-warn-bg)', bd: 'var(--status-warn-border)' },
  alert: { fg: 'var(--text-primary)', icon: 'shield-alert', ic: 'var(--verdict-malicious-fg)', bg: 'var(--verdict-malicious-bg)', bd: 'var(--verdict-malicious-border)' },
  quiet: { fg: 'var(--text-secondary)', icon: 'info', ic: 'var(--text-faint)', bg: 'transparent', bd: 'var(--border-subtle)' },
};

export function InlineAlert({ tone = 'info', title, children, action, icon, style }) {
  const t = TONES[tone] || TONES.info;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 'var(--space-8)',
      padding: 'var(--space-10) var(--space-12)',
      background: t.bg, border: `1px solid ${t.bd}`, borderRadius: 'var(--radius-sm)', ...style,
    }}>
      <Icon name={icon || t.icon} size={13} color={t.ic} style={{ marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? (
          <div style={{ font: 'var(--type-ui)', fontWeight: 600, color: t.fg, marginBottom: children ? 3 : 0 }}>{title}</div>
        ) : null}
        {children ? (
          <div style={{ font: 'var(--type-ui)', fontWeight: 400, fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-snug)', textWrap: 'pretty' }}>{children}</div>
        ) : null}
      </div>
      {action ? <div style={{ flex: '0 0 auto', marginLeft: 'var(--space-4)' }}>{action}</div> : null}
    </div>
  );
}
