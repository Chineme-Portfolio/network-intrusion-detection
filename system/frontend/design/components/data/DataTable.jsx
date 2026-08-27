import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* The centrepiece surface. Legibility at 11–12px and 30+ visible rows beats every
   other consideration: hairline row rules, no zebra striping, mono values, and a
   2px left edge that carries selection or a malicious verdict. */
export function DataTable({
  columns = [], rows = [], rowKey = 'id', dense, selectedKey, onRowClick,
  rowTone, stickyHeader = true, sortKey, sortDir = 'desc', onSort, emptyLabel = 'No flows match the current filter',
  animateNew, style,
}) {
  const rowH = dense ? 'var(--row-h-dense)' : 'var(--row-h)';
  return (
    <div style={{ width: '100%', overflow: 'auto', ...style }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} onClick={() => c.sortable && onSort && onSort(c.key)}
                style={{
                  position: stickyHeader ? 'sticky' : 'static', top: 0, zIndex: 2,
                  width: c.width, textAlign: c.align || 'left',
                  padding: `0 var(--space-8)`, height: 26,
                  background: 'var(--surface-raised)',
                  borderBottom: '1px solid var(--border-subtle)',
                  font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
                  textTransform: 'uppercase', color: 'var(--text-muted)',
                  cursor: c.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start' }}>
                  {c.label}
                  {c.sortable && sortKey === c.key ? (
                    <Icon name={sortDir === 'asc' ? 'chevron-down' : 'chevron-down'} size={10}
                      color="var(--accent)" style={{ transform: sortDir === 'asc' ? 'rotate(180deg)' : 'none' }} />
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{
              padding: 'var(--space-32) var(--space-12)', textAlign: 'center',
              font: 'var(--type-ui)', fontWeight: 400, color: 'var(--text-faint)',
            }}>{emptyLabel}</td></tr>
          ) : rows.map((r, i) => {
            const key = r[rowKey] != null ? r[rowKey] : i;
            const tone = rowTone ? rowTone(r) : undefined;
            const selected = selectedKey != null && key === selectedKey;
            const edge = selected ? 'var(--accent)' : tone === 'alert' ? 'var(--verdict-malicious-solid)' : tone === 'warn' ? 'var(--amber-400)' : 'transparent';
            return (
              <tr key={key}
                onClick={() => onRowClick && onRowClick(r)}
                style={{
                  height: rowH,
                  background: selected ? 'var(--surface-row-selected)' : tone === 'alert' ? 'var(--verdict-malicious-bg)' : 'transparent',
                  boxShadow: `inset 2px 0 0 ${edge}`,
                  cursor: onRowClick ? 'pointer' : 'default',
                  animation: animateNew && r.isNew ? 'caught-row-in var(--dur-slow) var(--ease-out)' : 'none',
                }}
                onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = tone === 'alert' ? 'rgba(228,87,46,.19)' : 'var(--surface-row-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = selected ? 'var(--surface-row-selected)' : tone === 'alert' ? 'var(--verdict-malicious-bg)' : 'transparent'; }}
              >
                {columns.map((c) => (
                  <td key={c.key} style={{
                    padding: '0 var(--space-8)', textAlign: c.align || 'left',
                    borderBottom: '1px solid var(--border-hairline)',
                    font: c.mono === false ? 'var(--type-ui)' : dense ? 'var(--type-data-dense)' : 'var(--type-data)',
                    fontWeight: c.emphasis ? 500 : 400,
                    letterSpacing: c.mono === false ? undefined : 'var(--tracking-data)',
                    color: c.muted ? 'var(--text-muted)' : c.emphasis ? 'var(--text-primary)' : 'var(--text-body)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
