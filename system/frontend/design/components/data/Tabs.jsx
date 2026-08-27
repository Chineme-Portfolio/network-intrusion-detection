import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Tabs({ tabs = [], value, onChange, variant = 'underline', size = 'md', style }) {
  const seg = variant === 'segmented';
  const h = size === 'sm' ? 'var(--control-h-sm)' : 'var(--control-h-md)';
  return (
    <div role="tablist" style={{
      display: 'inline-flex', alignItems: 'stretch',
      gap: seg ? 0 : 'var(--space-16)',
      height: h,
      background: seg ? 'var(--surface-inset)' : 'transparent',
      border: seg ? '1px solid var(--border-control)' : 'none',
      borderBottom: seg ? '1px solid var(--border-control)' : '1px solid var(--border-hairline)',
      borderRadius: seg ? 'var(--radius-sm)' : 0,
      padding: seg ? 2 : 0, ...style,
    }}>
      {tabs.map((t) => {
        const tab = typeof t === 'string' ? { value: t, label: t } : t;
        const on = tab.value === value;
        return (
          <button key={tab.value} role="tab" aria-selected={on}
            onClick={() => onChange && onChange(tab.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-6)',
              padding: seg ? '0 var(--space-10)' : '0 0 1px',
              background: seg && on ? 'var(--surface-control)' : 'transparent',
              border: 'none',
              borderBottom: seg ? 'none' : `2px solid ${on ? 'var(--accent)' : 'transparent'}`,
              borderRadius: seg ? 'var(--radius-xs)' : 0,
              font: 'var(--type-ui)', fontSize: size === 'sm' ? 'var(--fs-11)' : 'var(--fs-12)',
              color: on ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition-control)',
            }}
          >
            {tab.icon ? <Icon name={tab.icon} size={12} /> : null}
            {tab.label}
            {tab.count != null ? (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-10)', color: on ? 'var(--accent)' : 'var(--text-faint)' }}>{tab.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
