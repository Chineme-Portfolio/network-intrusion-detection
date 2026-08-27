const {
  Panel, Radio, Select, Input, Switch, Checkbox, Button, Badge, StatusDot, MetricStat,
  InlineAlert, Tag, IconButton, DataTable,
} = window.CaughtDesignSystem_eb3eb1;

function Sources() {
  const [src, setSrc] = React.useState('live');
  const [iface, setIface] = React.useState('eth0');
  const [rate, setRate] = React.useState('1x');
  const [toasts, setToasts] = React.useState(true);
  const [sound, setSound] = React.useState(false);
  const [dropBenign, setDropBenign] = React.useState(false);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-12)', padding: 'var(--space-12)', height: '100%', minHeight: 0, overflow: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        <Panel eyebrow="CAPTURE" title="Source" icon="route"
          actions={<Badge tone="accent" mono>{src === 'live' ? iface : 'replay'}</Badge>}
          footer={<span>Changing the source restarts the flow assembler · in-flight flows are discarded</span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
              <Radio name="src" label="Live interface" hint="Capture from a network interface on this host" checked={src === 'live'} onChange={() => setSrc('live')} />
              <Radio name="src" label="Replay a capture file" hint="Score a PCAP at a chosen rate — used for demos and regression runs" checked={src === 'pcap'} onChange={() => setSrc('pcap')} />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              {src === 'live' ? (
                <>
                  <Select label="Interface" mono value={iface} onChange={setIface} options={['eth0', 'eth1', 'wlan0', 'any']} />
                  <Input label="BPF filter" mono defaultValue="ip and not port 22" wrapperStyle={{ width: 240 }} fullWidth />
                  <Input label="Flow timeout" defaultValue="120" suffix="s" size="md" wrapperStyle={{ width: 110 }} fullWidth />
                </>
              ) : (
                <>
                  <Input label="Capture file" mono defaultValue="capture-2026-08-12.pcap" wrapperStyle={{ width: 260 }} fullWidth />
                  <Select label="Replay rate" mono value={rate} onChange={setRate} options={['0.5x', '1x', '2x', '5x', 'as fast as possible']} />
                  <Input label="Start offset" mono defaultValue="00:00:00" wrapperStyle={{ width: 120 }} fullWidth />
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
              <Button variant="primary" icon="play">Apply and start</Button>
              <Button variant="ghost">Discard changes</Button>
              <span style={{ marginLeft: 'auto' }}><Button variant="caution" icon="ban">Stop capture</Button></span>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="SCORING" title="Verdict handling" icon="sliders-horizontal">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
              <Input label="Alert threshold" defaultValue="0.80" suffix="conf" wrapperStyle={{ width: 150 }} fullWidth
                hint="Below this, verdicts are shown in amber and excluded from alert clusters" />
              <Input label="Cluster window" defaultValue="5" suffix="min" wrapperStyle={{ width: 150 }} fullWidth />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
              <Switch label="Toast on new alert cluster" checked={toasts} onChange={setToasts} />
              <Switch label="Audible alert" checked={sound} onChange={setSound} />
              <Checkbox label="Drop benign flows from the store" hint="Keeps the flow table light on long shifts" checked={dropBenign} onChange={setDropBenign} />
              <Checkbox label="Log every verdict to disk" checked hint="JSONL, rotated hourly" />
            </div>
          </div>
        </Panel>

        <Panel eyebrow="HISTORY" title="Recent sources" icon="clock" flush>
          <DataTable dense rowKey="id" rows={[
            { id: 's1', when: '14:21:04', kind: 'live', detail: 'eth0 · ip and not port 22', flows: '12,481', state: 'active' },
            { id: 's2', when: '13:02:55', kind: 'replay', detail: 'capture-2026-08-12.pcap · 2x', flows: '84,220', state: 'finished' },
            { id: 's3', when: '11:47:10', kind: 'live', detail: 'wlan0 · ip', flows: '6,004', state: 'stopped' },
          ]} columns={[
            { key: 'when', label: 'Started', width: '90px', muted: true },
            { key: 'kind', label: 'Kind', width: '72px' },
            { key: 'detail', label: 'Detail', width: 'auto' },
            { key: 'flows', label: 'Flows', width: '84px', align: 'right' },
            { key: 'state', label: 'State', width: '90px', render: (r) => <Badge tone={r.state === 'active' ? 'accent' : 'quiet'}>{r.state}</Badge> },
          ]} />
        </Panel>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        <Panel eyebrow="HEALTH" title="Capture" icon="gauge"
          actions={<IconButton icon="refresh-cw" label="Refresh" size="sm" />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            <StatusDot tone="live" pulse mono label="eth0 · 1.24 Gbps" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)' }}>
              <MetricStat label="Packets / sec" value="184k" />
              <MetricStat label="Flows / sec" value="1,284" />
              <MetricStat label="Dropped" value="0.02" unit="%" />
              <MetricStat label="Assembler queue" value="0" />
            </div>
          </div>
        </Panel>
        <InlineAlert tone="warn" title="Replay buffer reached 84% at 13:41">
          The capture was read faster than knn-v3 could score it. Lower the replay rate or pick a faster model.
        </InlineAlert>
        <Panel eyebrow="INTERFACES" title="Detected" icon="network" flush>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[['eth0', '1.24 Gbps', 'live'], ['eth1', 'idle', 'idle'], ['wlan0', 'idle', 'idle'], ['lo', 'ignored', 'offline']].map(([n, r, t]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', height: 28, padding: '0 var(--space-12)', borderBottom: '1px solid var(--border-hairline)' }}>
                <StatusDot tone={t} size={5} />
                <span style={{ font: 'var(--type-data-strong)', color: 'var(--text-body)' }}>{n}</span>
                <span style={{ marginLeft: 'auto', font: 'var(--type-data-dense)', color: 'var(--text-faint)' }}>{r}</span>
              </div>
            ))}
          </div>
        </Panel>
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <Tag icon="lock">tls decrypt off</Tag><Tag icon="database">store 14 d</Tag><Tag icon="terminal">api :8080</Tag>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sources });
