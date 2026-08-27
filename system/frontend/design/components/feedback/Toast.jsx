import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';

const TONES = {
  neutral: { ic: 'var(--text-muted)', icon: 'info', bd: 'var(--border-strong)' },
  live: { ic: 'var(--cyan-400)', icon: 'circle-check', bd: 'rgba(79,175,188,.38)' },
  warn: { ic: 'var(--amber-400)', icon: 'triangle-alert', bd: 'var(--status-warn-border)' },
  alert: { ic: 'var(--verdict-malicious-fg)', icon: 'shield-alert', bd: 'var(--verdict-malicious-border)' },
};

export function Toast({ tone = 'neutral', title, message, meta, action, onDismiss, icon, style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <div role="status" style={{
      display: 'flex', alignItems: 'flex-start', gap: 'var(--space-8)',
      width: 320, padding: 'var(--space-10) var(--space-10) var(--space-10) var(--space-12)',
      background: 'var(--surface-overlay)', border: `1px solid ${t.bd}`,
      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-overlay)', ...style,
    }}>
      <Icon name={icon || t.icon} size={13} color={t.ic} style={{ marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-8)' }}>
          <span style={{ font: 'var(--type-ui)', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
          {meta ? <span style={{ marginLeft: 'auto', font: 'var(--type-data-dense)', fontSize: 'var(--fs-10)', color: 'var(--text-faint)' }}>{meta}</span> : null}
        </div>
        {message ? (
          <div style={{ marginTop: 3, font: 'var(--type-ui)', fontWeight: 400, fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-snug)' }}>{message}</div>
        ) : null}
        {action ? <div style={{ marginTop: 'var(--space-8)' }}>{action}</div> : null}
      </div>
      {onDismiss ? <IconButton icon="x" label="Dismiss" size="sm" onClick={onDismiss} /> : null}
    </div>
  );
}
