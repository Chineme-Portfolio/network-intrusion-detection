import type { CSSProperties, ReactNode } from 'react';

// Ported from the design export. The dense monospace table, the live flow list
// (ui-registry.md). Fixed layout; every column sets a width.
export interface DataTableColumn<Row> {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  mono?: boolean;
  emphasis?: boolean;
  muted?: boolean;
  sortable?: boolean;
  render?: (row: Row) => ReactNode;
}

interface DataTableProps<Row> {
  columns: Array<DataTableColumn<Row>>;
  rows: Row[];
  rowKey?: string;
  dense?: boolean;
  selectedKey?: string | number;
  onRowClick?: (row: Row) => void;
  rowTone?: (row: Row) => 'alert' | 'warn' | undefined;
  stickyHeader?: boolean;
  emptyLabel?: string;
  animateNew?: boolean;
  style?: CSSProperties;
}

export function DataTable<Row>({
  columns,
  rows,
  rowKey = 'id',
  dense,
  selectedKey,
  onRowClick,
  rowTone,
  stickyHeader = true,
  emptyLabel = 'No flows yet',
  animateNew,
  style,
}: DataTableProps<Row>) {
  const rowH = dense ? 'var(--row-h-dense)' : 'var(--row-h)';
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', ...style }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  position: stickyHeader ? 'sticky' : 'static', top: 0, zIndex: 2,
                  width: c.width, textAlign: c.align ?? 'left', padding: '0 var(--space-8)', height: 26,
                  background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-subtle)',
                  font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
                  color: 'var(--text-muted)', whiteSpace: 'nowrap', userSelect: 'none',
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 'var(--space-32) var(--space-12)', textAlign: 'center', font: 'var(--type-ui)', fontWeight: 400, color: 'var(--text-faint)' }}>
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((r, i) => {
              const key = ((r as Record<string, unknown>)[rowKey] as string | number | undefined) ?? i;
              const tone = rowTone ? rowTone(r) : undefined;
              const selected = selectedKey != null && key === selectedKey;
              const edge = selected ? 'var(--accent)' : tone === 'alert' ? 'var(--verdict-malicious-solid)' : tone === 'warn' ? 'var(--amber-400)' : 'transparent';
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(r)}
                  style={{
                    height: rowH,
                    background: selected ? 'var(--surface-row-selected)' : tone === 'alert' ? 'var(--verdict-malicious-bg)' : 'transparent',
                    boxShadow: `inset 2px 0 0 ${edge}`,
                    cursor: onRowClick ? 'pointer' : 'default',
                    animation: animateNew && (r as { isNew?: boolean }).isNew ? 'caught-row-in var(--dur-slow) var(--ease-out)' : 'none',
                  }}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      style={{
                        padding: '0 var(--space-8)', textAlign: c.align ?? 'left', borderBottom: '1px solid var(--border-hairline)',
                        font: c.mono === false ? 'var(--type-ui)' : dense ? 'var(--type-data-dense)' : 'var(--type-data)',
                        fontWeight: c.emphasis ? 500 : 400,
                        letterSpacing: c.mono === false ? undefined : 'var(--tracking-data)',
                        color: c.muted ? 'var(--text-muted)' : c.emphasis ? 'var(--text-primary)' : 'var(--text-body)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}
                    >
                      {c.render ? c.render(r) : ((r as Record<string, ReactNode>)[c.key])}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
