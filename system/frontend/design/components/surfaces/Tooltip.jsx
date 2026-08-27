import React from 'react';

const SIDE = {
  top: { bottom: '100%', left: '50%', transform: 'translate(-50%,-6px)' },
  bottom: { top: '100%', left: '50%', transform: 'translate(-50%,6px)' },
  left: { right: '100%', top: '50%', transform: 'translate(-6px,-50%)' },
  right: { left: '100%', top: '50%', transform: 'translate(6px,-50%)' },
};

export function Tooltip({ content, side = 'top', mono, children, style }) {
  const [show, setShow] = React.useState(false);
  return (
    <span
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
    >
      {children}
      {show ? (
        <span role="tooltip" style={{
          position: 'absolute', zIndex: 60, ...SIDE[side],
          padding: '4px var(--space-8)', maxWidth: 240, width: 'max-content',
          background: 'var(--surface-tooltip)', border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-xs)', boxShadow: 'var(--shadow-popover)',
          font: mono ? 'var(--type-data-dense)' : 'var(--type-ui)', fontWeight: 400, fontSize: 'var(--fs-11)',
          color: 'var(--text-body)', pointerEvents: 'none', whiteSpace: mono ? 'pre' : 'normal',
        }}>{content}</span>
      ) : null}
    </span>
  );
}
