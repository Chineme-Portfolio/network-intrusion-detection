import React from 'react';
import { Icon } from '../core/Icon.jsx';

const TONES = {
  neutral: { fg: 'var(--text-secondary)', bg: 'rgba(166,180,198,.07)', bd: 'var(--border-subtle)' },
  accent: { fg: 'var(--cyan-300)', bg: 'var(--accent-quiet)', bd: 'rgba(79,175,188,.38)' },
  warn: { fg: 'var(--amber-400)', bg: 'var(--status-warn-bg)', bd: 'var(--status-warn-border)' },
  quiet: { fg: 'var(--text-faint)', bg: 'transparent', bd: 'var(--border-hairline)' },
};

export function Badge({ children, tone = 'neutral', icon, mono, count, style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, height: 16, padding: '0 5px',
      background: t.bg, border: `1px solid ${t.bd}`, borderRadius: 'var(--radius-xs)', color: t.fg,
      font: mono ? 'var(--type-data-dense)' : 'var(--font-sans)',
      fontSize: mono ? 'var(--fs-10)' : 'var(--fs-10)', fontWeight: mono ? 500 : 600,
      letterSpacing: mono ? 'var(--tracking-data)' : 'var(--tracking-label)',
      textTransform: mono ? 'none' : 'uppercase', lineHeight: 1, whiteSpace: 'nowrap', ...style,
    }}>
      {icon ? <Icon name={icon} size={10} /> : null}
      {children}
      {count != null ? <span style={{ fontFamily: 'var(--font-mono)', opacity: 0.8 }}>{count}</span> : null}
    </span>
  );
}
