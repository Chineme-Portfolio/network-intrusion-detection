import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* The one component the whole product turns on: it must be readable at 11px in a
   scrolling row and unmistakable at hero size. Benign is achromatic on purpose —
   only malicious spends the vermilion. */
const VERDICTS = {
  benign: { label: 'BENIGN', icon: 'shield-check', fg: 'var(--verdict-benign-fg)', bg: 'var(--verdict-benign-bg)', bd: 'var(--verdict-benign-border)', solidBg: 'var(--steel-300)' },
  malicious: { label: 'MALICIOUS', icon: 'shield-alert', fg: 'var(--verdict-malicious-fg)', bg: 'var(--verdict-malicious-bg)', bd: 'var(--verdict-malicious-border)', solidBg: 'var(--verdict-malicious-solid)' },
  unknown: { label: 'UNSCORED', icon: 'circle-dot', fg: 'var(--verdict-unknown-fg)', bg: 'var(--verdict-unknown-bg)', bd: 'var(--verdict-unknown-border)', solidBg: 'var(--ink-600)' },
};

const SIZES = {
  sm: { h: 16, pad: '0 5px', fs: 'var(--fs-10)', icon: 10, gap: 4 },
  md: { h: 22, pad: '0 var(--space-8)', fs: 'var(--fs-11)', icon: 12, gap: 6 },
  hero: { h: 34, pad: '0 var(--space-12)', fs: 'var(--fs-14)', icon: 16, gap: 8 },
};

export function VerdictChip({ verdict = 'benign', size = 'sm', confidence, solid, label, style }) {
  const v = VERDICTS[verdict] || VERDICTS.unknown;
  const s = SIZES[size] || SIZES.sm;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap, height: s.h, padding: s.pad,
      background: solid ? v.solidBg : v.bg,
      border: `1px solid ${solid ? v.solidBg : v.bd}`,
      borderRadius: 'var(--radius-xs)',
      color: solid ? 'var(--ink-1000)' : v.fg,
      whiteSpace: 'nowrap', ...style,
    }}>
      <Icon name={v.icon} size={s.icon} />
      <span style={{
        font: 'var(--font-sans)', fontSize: s.fs, fontWeight: 'var(--fw-semibold)',
        letterSpacing: 'var(--tracking-label)', lineHeight: 1,
      }}>{label || v.label}</span>
      {confidence != null ? (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: s.fs, fontWeight: 'var(--fw-medium)', lineHeight: 1,
          opacity: solid ? 0.72 : 0.78, paddingLeft: 2,
        }}>{Number(confidence).toFixed(2)}</span>
      ) : null}
    </span>
  );
}
