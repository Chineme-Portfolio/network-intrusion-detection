import { DataTable, type DataTableColumn } from './components/DataTable';
import { VerdictChip } from './components/VerdictChip';
import { ConfidenceMeter } from './components/ConfidenceMeter';
import { StatusDot } from './components/StatusDot';
import { Icon } from './components/Icon';
import { useFlowStream, type StreamRow } from './lib/socket';

// K1 UI: the LiveFlows core (spec 0002). AppShell frame + a status header + the streaming
// flow/verdict table. The model switcher (F1), filter bar, and the FlowDetail drawer are
// deferred; the components are ported from the design export (ui-registry.md), not invented.

const PROTO: Record<number, string> = { 1: 'ICMP', 6: 'TCP', 17: 'UDP' };
const proto = (n: number): string => PROTO[n] ?? String(n);
const fmtTime = (ts: string): string => {
  try {
    return new Date(ts).toISOString().slice(11, 23); // HH:MM:SS.mmm
  } catch {
    return ts;
  }
};

const COLUMNS: Array<DataTableColumn<StreamRow>> = [
  { key: 'time', label: 'Time', width: '104px', muted: true, render: (r) => fmtTime(r.ts) },
  { key: 'src', label: 'Source', width: '150px', emphasis: true, render: (r) => `${r.src_ip}:${r.src_port}` },
  { key: 'dst', label: 'Destination', width: '156px', render: (r) => `${r.dst_ip}:${r.dst_port}` },
  { key: 'proto', label: 'Proto', width: '56px', muted: true, render: (r) => proto(r.protocol) },
  { key: 'verdict', label: 'Verdict', width: '148px', render: (r) => <VerdictChip verdict={r.verdict} confidence={r.score} /> },
  {
    key: 'conf',
    label: 'Confidence',
    width: '116px',
    render: (r) => <ConfidenceMeter value={r.score} verdict={r.verdict} threshold={0.8} width={56} size="sm" showValue={false} />,
  },
  { key: 'truth', label: 'Ground truth', width: '132px', muted: true, render: (r) => r.ground_truth ?? '—' },
];

const NAV = [
  { icon: 'activity', label: 'Live flows', active: true },
  { icon: 'triangle-alert', label: 'Alerts', active: false },
  { icon: 'cpu', label: 'Models', active: false },
  { icon: 'radar', label: 'Sources', active: false },
];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

export default function App() {
  const { rows, connected, total, malicious, modelId } = useFlowStream();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '196px 1fr', height: '100%', background: 'var(--surface-app)', color: 'var(--text-body)' }}>
      <aside style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-subtle)', background: 'var(--surface-panel)', padding: 'var(--space-16) var(--space-12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-24)' }}>
          <Icon name="shield" size={18} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>Caught</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map((n) => (
            <div
              key={n.label}
              title={n.active ? undefined : 'Arrives in a later slice'}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 'var(--radius-sm)',
                background: n.active ? 'var(--surface-row-selected)' : 'transparent',
                color: n.active ? 'var(--text-primary)' : 'var(--text-muted)',
                font: 'var(--type-ui)', opacity: n.active ? 1 : 0.5, cursor: n.active ? 'default' : 'not-allowed',
              }}
            >
              <Icon name={n.icon} size={14} />
              <span>{n.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <StatusDot tone={connected ? 'live' : 'offline'} pulse={connected} mono label={connected ? 'stream connected' : 'disconnected'} />
          <StatusDot tone={modelId ? 'live' : 'idle'} mono label={modelId ? `${modelId} loaded` : 'awaiting model'} />
        </div>
      </aside>

      <main style={{ display: 'grid', gridTemplateRows: '44px 1fr 26px', minHeight: 0 }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 var(--space-16)', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Console</span>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Live flows</h1>
          <div style={{ marginLeft: 'auto' }}>
            <StatusDot tone={connected ? 'live' : 'offline'} pulse={connected} mono label={connected ? 'CSV replay · streaming' : 'waiting for stream'} />
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, padding: 'var(--space-12)', gap: 'var(--space-12)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-32)', alignItems: 'flex-end' }}>
            <Stat label="Flows scored" value={total.toLocaleString()} />
            <Stat label="Malicious" value={malicious.toLocaleString()} />
            <Stat label="Showing" value={rows.length.toLocaleString()} />
          </div>
          <div style={{ flex: 1, minHeight: 0, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-panel)', overflow: 'hidden' }}>
            <DataTable<StreamRow>
              dense
              animateNew
              rowKey="flow_id"
              rows={rows}
              columns={COLUMNS}
              emptyLabel={connected ? 'Waiting for the first classified flow…' : 'Connecting to the stream…'}
              rowTone={(r) => (r.verdict === 'malicious' ? 'alert' : r.score < 0.8 ? 'warn' : undefined)}
            />
          </div>
        </div>

        <footer style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)', padding: '0 var(--space-16)', borderTop: '1px solid var(--border-subtle)', font: 'var(--type-data-dense)', color: 'var(--text-faint)' }}>
          <span>model {modelId ?? '—'}</span>
          <span>threshold 0.80</span>
          <span style={{ marginLeft: 'auto' }}>{total.toLocaleString()} flows · {malicious.toLocaleString()} malicious</span>
        </footer>
      </main>
    </div>
  );
}
