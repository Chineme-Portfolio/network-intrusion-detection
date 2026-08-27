const {
  Panel, Card, DataTable, MetricStat, Badge, Button, IconButton, Tabs, VerdictChip,
  ConfidenceMeter, Icon, InlineAlert, StatusDot,
} = window.CaughtDesignSystem_eb3eb1;

function ModelCard({ m, active, onSelect }) {
  return (
    <Card interactive selected={active} onClick={() => onSelect(m.id)} padding="var(--space-12)">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-10)' }}>
        <span style={{ font: 'var(--type-data-strong)', color: 'var(--text-primary)' }}>{m.id}</span>
        {active ? <Badge tone="accent" icon="check">active</Badge> : null}
        <span style={{ marginLeft: 'auto' }}><Icon name="cpu" size={13} color={active ? 'var(--accent)' : 'var(--text-faint)'} /></span>
      </div>
      <div style={{ font: 'var(--type-ui)', fontWeight: 400, color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{m.name}</div>
      <div style={{ font: 'var(--type-data-dense)', fontSize: 'var(--fs-10)', color: 'var(--text-faint)', marginBottom: 'var(--space-12)' }}>{m.arch}</div>
      <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
        <MetricStat label="F1" value={m.f1.toFixed(3)} size="sm" />
        <MetricStat label="Latency" value={m.latency.toFixed(1)} unit="ms" size="sm" />
      </div>
    </Card>
  );
}

function Models({ model, onRequestSwitch }) {
  const models = window.CaughtData.models;
  const [sel, setSel] = React.useState(model);
  const [view, setView] = React.useState('Scorecards');
  const current = models.find((m) => m.id === sel) || models[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', padding: 'var(--space-12)', height: '100%', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
        <Tabs variant="segmented" size="sm" value={view} onChange={setView} tabs={['Scorecards', 'Comparison']} />
        <span style={{ font: 'var(--type-ui)', fontWeight: 400, fontSize: 'var(--fs-11)', color: 'var(--text-faint)' }}>
          Five models trained on CIC-IDS2017. Switching takes effect from the next flow.
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-8)', alignItems: 'center' }}>
          <StatusDot tone="live" mono label={model + ' scoring'} />
          <Button variant="primary" icon="arrow-left-right" disabled={sel === model} onClick={() => onRequestSwitch(sel)}>
            {sel === model ? 'Already active' : 'Switch to ' + sel}
          </Button>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 'var(--space-12)' }}>
        {models.map((m) => <ModelCard key={m.id} m={m} active={m.id === sel} onSelect={setSel} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-12)', flex: '1 1 auto', minHeight: 0 }}>
        <Panel eyebrow="EVALUATION" title="Held-out test set" meta="284,315 flows" icon="gauge" flush scroll
          actions={<IconButton icon="download" label="Export metrics" size="sm" />}
          footer={<span>Metrics from the 2026-08-02 evaluation run · 20% held-out split</span>}>
          <DataTable rowKey="id" rows={models} selectedKey={sel} onRowClick={(r) => setSel(r.id)}
            columns={[
              { key: 'id', label: 'Model', width: '84px', emphasis: true },
              { key: 'name', label: 'Architecture', width: '170px', mono: false, muted: true, render: (r) => r.name + ' · ' + r.arch },
              { key: 'precision', label: 'Precision', width: '84px', align: 'right', render: (r) => r.precision.toFixed(3) },
              { key: 'recall', label: 'Recall', width: '76px', align: 'right', render: (r) => r.recall.toFixed(3) },
              { key: 'f1', label: 'F1', width: '72px', align: 'right', emphasis: true, render: (r) => r.f1.toFixed(3) },
              { key: 'latency', label: 'Latency', width: '78px', align: 'right', render: (r) => r.latency.toFixed(1) + 'ms' },
              { key: 'size', label: 'Size', width: '78px', align: 'right', muted: true },
              { key: 'trained', label: 'Trained', width: '92px', muted: true },
              { key: 'state', label: '', width: '76px', render: (r) => (r.id === model ? <Badge tone="accent">scoring</Badge> : <Badge tone="quiet">loaded</Badge>) },
            ]} />
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', minHeight: 0, overflow: 'auto' }}>
          <Panel eyebrow="SELECTED" title={current.id} icon="cpu">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)' }}>
                <MetricStat label="Precision" value={current.precision.toFixed(3)} />
                <MetricStat label="Recall" value={current.recall.toFixed(3)} />
                <MetricStat label="F1" value={current.f1.toFixed(3)} />
                <MetricStat label="Latency" value={current.latency.toFixed(1)} unit="ms" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px var(--space-10)', font: 'var(--type-data-dense)' }}>
                <span style={{ color: 'var(--text-faint)' }}>trained</span><span style={{ color: 'var(--text-body)' }}>{current.trained}</span>
                <span style={{ color: 'var(--text-faint)' }}>artifact</span><span style={{ color: 'var(--text-body)' }}>{current.id}.joblib · {current.size}</span>
                <span style={{ color: 'var(--text-faint)' }}>features</span><span style={{ color: 'var(--text-body)' }}>14 flow statistics</span>
              </div>
            </div>
          </Panel>
          <Panel eyebrow="SAMPLE" title="Verdict on the same flow" icon="scan-line">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              {window.CaughtData.agreement.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                  <span style={{ width: 52, font: 'var(--type-data-dense)', color: a.id === sel ? 'var(--text-primary)' : 'var(--text-muted)' }}>{a.id}</span>
                  <VerdictChip verdict={a.verdict} />
                  <span style={{ marginLeft: 'auto' }}><ConfidenceMeter value={a.confidence} verdict={a.verdict} threshold={0.8} width={54} size="sm" /></span>
                </div>
              ))}
            </div>
          </Panel>
          <InlineAlert tone="quiet" title="knn-v3 is 10× slower than rf-v4">
            Latency above 8 ms/flow will not keep up with a 1.2 Gbps link.
          </InlineAlert>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Models });
