import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function MetricStat({ label, value, unit, delta, deltaTone = 'neutral', hint, size = 'md', align = 'left', style }) {
  const font = size === 'lg' ? 'var(--type-metric-lg)' : size === 'sm' ? 'var(--type-data-strong)' : 'var(--type-metric)';
  const dcolor = deltaTone === 'warn' ? 'var(--amber-400)' : deltaTone === 'accent' ? 'var(--cyan-400)' : 'var(--text-muted)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: align === 'right' ? 'flex-end' : 'flex-start', ...style }}>
      <span style={{
        font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
        <span style={{ font, color: 'var(--text-primary)', letterSpacing: 'var(--tracking-data)' }}>{value}</span>
        {unit ? <span style={{ font: 'var(--type-data-dense)', color: 'var(--text-faint)' }}>{unit}</span> : null}
        {delta ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, font: 'var(--type-data-dense)', color: dcolor, paddingLeft: 'var(--space-4)' }}>
            <Icon name="trending-up" size={10} />{delta}
          </span>
        ) : null}
      </span>
      {hint ? <span style={{ font: 'var(--type-ui)', fontWeight: 400, fontSize: 'var(--fs-11)', color: 'var(--text-faint)' }}>{hint}</span> : null}
    </div>
  );
}
