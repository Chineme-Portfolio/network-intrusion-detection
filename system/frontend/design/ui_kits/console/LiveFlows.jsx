const {
  Panel, DataTable, VerdictChip, ConfidenceMeter, MetricStat, Tabs, Tag, Input, Checkbox,
  Switch, IconButton, Button, Badge, InlineAlert, StatusDot, Tooltip, Icon,
} = window.CaughtDesignSystem_eb3eb1;

const FLOW_COLUMNS = (onOpen) => [
  { key: 'ts', label: 'Time', width: '96px', muted: true, sortable: true },
  { key: 'src', label: 'Source', width: '162px', emphasis: true },
  { key: 'dst', label: 'Destination', width: '170px' },
  { key: 'proto', label: 'Proto', width: '52px', muted: true },
  { key: 'service', label: 'Service', width: '68px', muted: true },
  { key: 'pkts', label: 'Pkts', width: '54px', align: 'right' },
  { key: 'bytes', label: 'Bytes', width: '72px', align: 'right', render: (r) => r.bytes.toLocaleString() },
  { key: 'dur', label: 'Dur', width: '62px', align: 'right', render: (r) => r.dur + 'ms' },
  {
    key: 'verdict', label: 'Verdict', width: '142px',
    render: (r) => <VerdictChip verdict={r.verdict} confidence={r.confidence} />,
  },
  {
    key: 'conf', label: 'Confidence', width: '112px',
    render: (r) => <ConfidenceMeter value={r.confidence} verdict={r.verdict} threshold={0.8} width={56} size="sm" showValue={false} />,
  },
  {
    key: 'go', label: '', width: '30px', align: 'right',
    render: (r) => <Icon name="chevron-right" size={12} color="var(--text-faint)" />,
  },
];

function KpiStrip({ flows }) {
  const mal = flows.filter((f) => f.verdict === 'malicious').length;
  const low = flows.filter((f) => f.confidence < 0.8).length;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-32)',
      padding: 'var(--space-10) var(--space-16)',
      background: 'var(--surface-panel)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
    }}>
      <MetricStat label="Flows scored" value={(12439 + flows.length).toLocaleString()} hint="Since 13:52" />
      <MetricStat label="Malicious" value={String(mal + 31)} hint="Last 15 minutes" />
      <MetricStat label="Below threshold" value={String(low)} hint="Confidence < 0.80" />
      <MetricStat label="Flows / sec" value="1,284" delta="+8%" deltaTone="accent" />
      <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', alignItems: 'flex-end' }}>
        <StatusDot tone="live" pulse mono label="capture live · 00:31:12" />
        <span style={{ font: 'var(--type-data-dense)', fontSize: 'var(--fs-10)', color: 'var(--text-faint)' }}>queue 0 · drop 0.02%</span>
      </div>
    </div>
  );
}

function VerdictRail({ latestMalicious, model, onInspect }) {
  const agreement = window.CaughtData.agreement;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', minHeight: 0 }}>
      <Panel tone="alert" eyebrow="CURRENT" title="Verdict" icon="shield-alert" style={{ flex: '0 0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          <VerdictChip verdict="malicious" size="hero" solid confidence={latestMalicious.confidence} />
          <ConfidenceMeter value={latestMalicious.confidence} verdict="malicious" segments={20} size="lg" width={236} threshold={0.8} />
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px var(--space-10)', font: 'var(--type-data-dense)' }}>
            <span style={{ color: 'var(--text-faint)' }}>pattern</span><span style={{ color: 'var(--text-primary)' }}>{latestMalicious.attack || 'Port scan'}</span>
            <span style={{ color: 'var(--text-faint)' }}>source</span><span style={{ color: 'var(--text-body)' }}>{latestMalicious.src}</span>
            <span style={{ color: 'var(--text-faint)' }}>target</span><span style={{ color: 'var(--text-body)' }}>{latestMalicious.dst}</span>
            <span style={{ color: 'var(--text-faint)' }}>scored by</span><span style={{ color: 'var(--text-body)' }}>{model}</span>
          </div>
          <Button variant="primary" icon="eye" fullWidth onClick={() => onInspect(latestMalicious)}>Inspect flow</Button>
        </div>
      </Panel>

      <Panel eyebrow="AGREEMENT" title="All five models" meta={agreement.filter((a) => a.verdict === 'malicious').length + '/5'} icon="layers" style={{ flex: '0 0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {agreement.map((a) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
              <span style={{ width: 52, font: 'var(--type-data-dense)', color: a.id === model ? 'var(--text-primary)' : 'var(--text-muted)' }}>{a.id}</span>
              <VerdictChip verdict={a.verdict} />
              <span style={{ marginLeft: 'auto' }}>
                <ConfidenceMeter value={a.confidence} verdict={a.verdict} threshold={0.8} width={48} size="sm" />
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <InlineAlert tone="warn" title="svm-v1 disagrees" >
        One of five models scores this flow benign at 0.62. Treat the cluster, not the single flow, as the signal.
      </InlineAlert>
    </div>
  );
}

function LiveFlows({ model, onInspect, selectedId, paused, onPause }) {
  const [flows, setFlows] = React.useState(() => window.CaughtData.seedFlows(26));
  const [tab, setTab] = React.useState('all');
  const [mode, setMode] = React.useState('Live');
  const [showBenign, setShowBenign] = React.useState(true);
  const [follow, setFollow] = React.useState(true);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    if (paused || mode !== 'Live') return undefined;
    const t = setInterval(() => {
      setFlows((prev) => [window.CaughtData.makeFlow(), ...prev].slice(0, 70));
    }, 1100);
    return () => clearInterval(t);
  }, [paused, mode]);

  const visible = flows.filter((f) => {
    if (tab === 'mal' && f.verdict !== 'malicious') return false;
    if (tab === 'low' && f.confidence >= 0.8) return false;
    if (!showBenign && f.verdict === 'benign') return false;
    return true;
  });
  const latestMalicious = flows.find((f) => f.verdict === 'malicious') || flows[0];

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 280px', gridTemplateRows: 'auto auto 1fr',
      gap: 'var(--space-12)', padding: 'var(--space-12)', height: '100%', minHeight: 0,
    }}>
      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
        <Tabs value={tab} onChange={setTab} tabs={[
          { value: 'all', label: 'All flows', count: flows.length },
          { value: 'mal', label: 'Malicious', count: flows.filter((f) => f.verdict === 'malicious').length },
          { value: 'low', label: 'Below threshold', count: flows.filter((f) => f.confidence < 0.8).length },
        ]} />
        <Tabs variant="segmented" size="sm" value={mode} onChange={setMode} tabs={['Live', 'Replay']} />
        <Input icon="search" mono size="sm" placeholder="proto=TCP and dst_port=445" value={query}
          onChange={(e) => setQuery(e.target.value)} wrapperStyle={{ width: 230 }} fullWidth />
        <Tag active icon="list-filter" onRemove={() => {}}>src=10.4.19.22</Tag>
        <Tag mono={false} icon="clock">Last 15 min</Tag>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
          <Checkbox label="Show benign" checked={showBenign} onChange={setShowBenign} />
          <Switch label="Auto-scroll" checked={follow} onChange={setFollow} />
          <IconButton icon={paused ? 'play' : 'pause'} label={paused ? 'Resume capture' : 'Pause capture'} variant="secondary" onClick={onPause} />
          <IconButton icon="download" label="Export flows" />
        </div>
      </div>

      <div style={{ gridColumn: '1 / 2' }}><KpiStrip flows={flows} /></div>
      <div style={{ gridColumn: '2 / 3', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Badge tone="accent" icon="cpu" mono>{model}</Badge>
      </div>

      <Panel eyebrow="STREAM" title={mode === 'Live' ? 'Live flows' : 'Replay — capture-2026-08-12.pcap'} icon="activity"
        meta={visible.length + ' shown'} flush scroll
        style={{ gridColumn: '1 / 2', minHeight: 0 }}
        actions={<>
          <IconButton icon="table-2" label="Columns" size="sm" />
          <IconButton icon="refresh-cw" label="Reset view" size="sm" />
        </>}
        footer={<>
          <span>{visible.length} of {flows.length} flows</span>
          <span style={{ marginLeft: 'auto' }}>{paused ? 'stream paused' : 'appending ~1.1/s'}</span>
        </>}>
        <DataTable dense animateNew rowKey="id" rows={visible} selectedKey={selectedId}
          columns={FLOW_COLUMNS()} onRowClick={onInspect} sortKey="ts" sortDir="desc"
          rowTone={(r) => (r.verdict === 'malicious' ? 'alert' : r.confidence < 0.8 ? 'warn' : undefined)} />
      </Panel>

      <div style={{ gridColumn: '2 / 3', minHeight: 0, overflow: 'auto' }}>
        <VerdictRail latestMalicious={latestMalicious} model={model} onInspect={onInspect} />
      </div>
    </div>
  );
}

Object.assign(window, { LiveFlows, FLOW_COLUMNS });
