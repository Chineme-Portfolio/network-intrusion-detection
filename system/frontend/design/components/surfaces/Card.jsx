import React from 'react';

export function Card({ title, meta, children, footer, interactive, selected, onClick, padding = 'var(--space-16)', style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: selected ? 'var(--surface-row-selected)' : 'var(--surface-raised)',
        border: `1px solid ${selected ? 'var(--accent)' : interactive && hover ? 'var(--border-strong)' : 'var(--border-hairline)'}`,
        borderRadius: 'var(--radius-md)', padding,
        cursor: interactive ? 'pointer' : 'default',
        transition: 'var(--transition-control)', ...style,
      }}
    >
      {(title || meta) ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-8)', marginBottom: 'var(--space-10)' }}>
          {title ? <span style={{ font: 'var(--type-panel-title)', color: 'var(--text-primary)' }}>{title}</span> : null}
          {meta ? <span style={{ marginLeft: 'auto', font: 'var(--type-data-dense)', color: 'var(--text-faint)' }}>{meta}</span> : null}
        </div>
      ) : null}
      {children}
      {footer ? (
        <div style={{
          marginTop: 'var(--space-12)', paddingTop: 'var(--space-10)',
          borderTop: '1px solid var(--border-hairline)', font: 'var(--type-data-dense)', color: 'var(--text-faint)',
        }}>{footer}</div>
      ) : null}
    </div>
  );
}
