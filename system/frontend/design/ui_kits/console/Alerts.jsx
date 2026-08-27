const {
  Panel, DataTable, VerdictChip, ConfidenceMeter, Badge, Button, IconButton, InlineAlert,
  MetricStat, Tabs, Tag, Icon,
} = window.CaughtDesignSystem_eb3eb1;

const STATE = { open: ['warn', 'open'], ack: ['accent', 'acknowledged'], closed: ['quiet', 'closed'] };

function Alerts({ model, onInspect }) {
  const alerts = window.CaughtData.alerts;
  const [sel, setSel] = React.useState(alerts[0].id);
  const [tab, setTab] = React.useState('open');
  const current = alerts.find((a) => a.id === sel);
  const rows = alerts.filter((a) => (tab === 'all' ? true : tab === 'open' ? a.state === 'open' : a.state !== 'open'));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gridTemplateRows: 'auto 1fr', gap: 'var(--space-12)', padding: 'var(--space-12)', height: '100%', minHeight: 0 }}>
      <div style={{ gridColumn: '1 / -1' }}>
        <InlineAlert tone="alert" title="42 malicious flows from 10.4.19.22 in the last 31 seconds"
          action={<Button size="sm" icon="eye" onClick={() => onInspect && onInspect()}>Open in stream</Button>}>
          Sequential destination ports on 10.4.2.9, escalating packet rate, no completed handshakes. Peak confidence 0.97 from {model}.
        </InlineAlert>
      </div>

      <Panel eyebrow="CLUSTERS" title="Alerts" meta={rows.length + ' shown'} icon="shield-alert" flush scroll
        style={{ minHeight: 0 }}
        actions={<>
          <Tabs variant="segmented" size="sm" value={tab} onChange={setTab} tabs={[{ value: 'open', label: 'Open' }, { value: 'handled', label: 'Handled' }, { value: 'all', label: 'All' }]} />
          <IconButton icon="download" label="Export alerts" size="sm" />
        </>}
        footer={<span>Clustered by source host and pattern · 5 minute window</span>}>
        <DataTable rowKey="id" rows={rows} selectedKey={sel} onRowClick={(r) => setSel(r.id)}
          rowTone={(r) => (r.state === 'open' ? 'alert' : undefined)}
          columns={[
            { key: 'first', label: 'First seen', width: '90px', muted: true },
            { key: 'host', label: 'Source host', width: '124px', emphasis: true },
            { key: 'target', label: 'Target', width: '110px' },
            { key: 'pattern', label: 'Pattern', width: '146px', mono: false },
            { key: 'flows', label: 'Flows', width: '64px', align: 'right' },
            { key: 'window', label: 'Window', width: '74px', align: 'right', muted: true },
            { key: 'peak', label: 'Peak', width: '128px', render: (r) => <ConfidenceMeter value={r.peak} verdict="malicious" width={60} size="sm" /> },
            { key: 'state', label: 'State', width: '108px', render: (r) => <Badge tone={STATE[r.state][0]}>{STATE[r.state][1]}</Badge> },
          ]} />
      </Panel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', minHeight: 0, overflow: 'auto' }}>
        <Panel tone={current.state === 'open' ? 'alert' : 'default'} eyebrow="SELECTED" title={current.pattern} icon="target">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            <VerdictChip verdict="malicious" size="hero" solid confidence={current.peak} />
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px var(--space-10)', font: 'var(--type-data-dense)' }}>
              <span style={{ color: 'var(--text-faint)' }}>source</span><span style={{ color: 'var(--text-primary)' }}>{current.host}</span>
              <span style={{ color: 'var(--text-faint)' }}>target</span><span style={{ color: 'var(--text-body)' }}>{current.target}</span>
              <span style={{ color: 'var(--text-faint)' }}>flows</span><span style={{ color: 'var(--text-body)' }}>{current.flows}</span>
              <span style={{ color: 'var(--text-faint)' }}>window</span><span style={{ color: 'var(--text-body)' }}>{current.window}</span>
              <span style={{ color: 'var(--text-faint)' }}>first seen</span><span style={{ color: 'var(--text-body)' }}>{current.first}</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
              <Tag>:445 ×18</Tag><Tag>:139 ×9</Tag><Tag>:3389 ×7</Tag><Tag>:22 ×5</Tag>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
              <Button icon="flag" fullWidth>Acknowledge</Button>
              <Button variant="caution" icon="ban" fullWidth>Block host</Button>
            </div>
          </div>
        </Panel>
        <Panel eyebrow="LAST HOUR" title="Alert volume" icon="trending-up">
          <div style={{ display: 'flex', gap: 'var(--space-16)', marginBottom: 'var(--space-12)' }}>
            <MetricStat label="Clusters" value="7" size="sm" />
            <MetricStat label="Flows" value="377" size="sm" />
            <MetricStat label="Hosts" value="3" size="sm" />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 46 }}>
            {[3, 5, 2, 8, 14, 9, 22, 31, 18, 42, 27, 12].map((v, i) => (
              <span key={i} style={{ flex: 1, height: (v / 42 * 100) + '%', background: i > 8 ? 'var(--verdict-malicious-solid)' : 'var(--ink-650)', borderRadius: 1 }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)', font: 'var(--type-data-dense)', fontSize: 'var(--fs-10)', color: 'var(--text-faint)' }}>
            <span>13:22</span><span>14:22</span>
          </div>
        </Panel>
      </div>
    </div>
  );
}

Object.assign(window, { Alerts });
