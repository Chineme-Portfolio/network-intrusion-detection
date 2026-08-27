const {
  VerdictChip, ConfidenceMeter, Panel, Button, IconButton, Badge, Tooltip, Icon, InlineAlert, Tag,
} = window.CaughtDesignSystem_eb3eb1;

function KV({ k, v, mono = true }) {
  return (
    <>
      <span style={{ font: 'var(--type-data-dense)', color: 'var(--text-faint)' }}>{k}</span>
      <span style={{ font: mono ? 'var(--type-data)' : 'var(--type-ui)', color: 'var(--text-body)', letterSpacing: mono ? 'var(--tracking-data)' : undefined }}>{v}</span>
    </>
  );
}

function FeatureBar({ f, tone }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
      <Tooltip mono side="right" content={f.key}>
        <span style={{ width: 118, font: 'var(--type-ui)', fontWeight: 400, fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', borderBottom: '1px dotted var(--border-strong)' }}>{f.label}</span>
      </Tooltip>
      <span style={{ width: 54, font: 'var(--type-data-dense)', color: 'var(--text-body)', textAlign: 'right' }}>{f.value}</span>
      <span style={{ flex: 1, height: 5, background: 'var(--ink-750)', borderRadius: 1, overflow: 'hidden' }}>
        <span style={{ display: 'block', width: (f.weight * 260) + '%', maxWidth: '100%', height: '100%', background: tone === 'alert' ? 'var(--verdict-malicious-solid)' : 'var(--steel-400)' }} />
      </span>
      <span style={{ width: 30, font: 'var(--type-data-dense)', fontSize: 'var(--fs-10)', color: 'var(--text-faint)', textAlign: 'right' }}>{f.weight.toFixed(2)}</span>
    </div>
  );
}

function FlowDetail({ flow, model, onClose }) {
  if (!flow) return null;
  const alert = flow.verdict === 'malicious';
  const agreement = window.CaughtData.agreement;
  return (
    <aside style={{
      position: 'absolute', top: 0, right: 0, bottom: 0, width: 'var(--detail-w)', zIndex: 20,
      display: 'flex', flexDirection: 'column', minHeight: 0,
      background: 'var(--surface-panel)', borderLeft: '1px solid var(--border-strong)',
      boxShadow: 'var(--shadow-overlay)',
    }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-8)', flex: '0 0 auto', minHeight: 38,
        padding: '0 var(--space-8) 0 var(--space-16)', borderBottom: '1px solid var(--border-hairline)',
        background: 'var(--surface-raised)',
      }}>
        <Icon name="scan-line" size={14} color="var(--text-muted)" />
        <span style={{ font: 'var(--type-panel-title)', color: 'var(--text-primary)' }}>Flow</span>
        <span style={{ font: 'var(--type-data-dense)', color: 'var(--text-faint)' }}>{flow.id} · {flow.ts}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
          <IconButton icon="copy" label="Copy flow id" size="sm" />
          <IconButton icon="external-link" label="Open in new tab" size="sm" />
          <IconButton icon="x" label="Close" size="sm" onClick={onClose} />
        </span>
      </header>

      <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'auto', padding: 'var(--space-16)', display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 'var(--space-12)',
          padding: 'var(--space-12)', borderRadius: 'var(--radius-md)',
          background: alert ? 'var(--verdict-malicious-bg)' : 'var(--surface-raised)',
          border: '1px solid ' + (alert ? 'var(--verdict-malicious-border)' : 'var(--border-hairline)'),
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
            <VerdictChip verdict={flow.verdict} size="hero" solid={alert} confidence={flow.confidence} />
            {flow.attack ? <Badge tone="warn" icon="target">{flow.attack}</Badge> : null}
          </div>
          <ConfidenceMeter value={flow.confidence} verdict={flow.verdict} segments={20} size="lg" width={340} threshold={0.8} label="conf" />
          <span style={{ font: 'var(--type-ui)', fontWeight: 400, fontSize: 'var(--fs-11)', color: 'var(--text-secondary)' }}>
            Scored by <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{model}</span> in 1.2 ms, 14 features · threshold 0.80
          </span>
        </div>

        {flow.confidence < 0.8 ? (
          <InlineAlert tone="warn" title="Confidence below your threshold">
            Verify against the flow's neighbours before acting on this verdict alone.
          </InlineAlert>
        ) : null}

        <section>
          <div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-10)' }}>Flow</div>
          <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: '6px var(--space-12)' }}>
            <KV k="source" v={flow.src} />
            <KV k="destination" v={flow.dst} />
            <KV k="protocol" v={flow.proto + ' · ' + flow.service} />
            <KV k="packets" v={flow.pkts + ' fwd / ' + Math.max(0, Math.round(flow.pkts * 0.42)) + ' bwd'} />
            <KV k="bytes" v={flow.bytes.toLocaleString()} />
            <KV k="duration" v={flow.dur + ' ms'} />
            <KV k="flags" v="SYN ACK RST" />
          </div>
        </section>

        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-8)', marginBottom: 'var(--space-10)' }}>
            <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Feature contribution</span>
            <span style={{ font: 'var(--type-data-dense)', fontSize: 'var(--fs-10)', color: 'var(--text-faint)' }}>top 6 of 14</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {window.CaughtData.features.map((f) => <FeatureBar key={f.key} f={f} tone={alert ? 'alert' : undefined} />)}
          </div>
        </section>

        <section>
          <div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-10)' }}>Model agreement</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {agreement.map((a) => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-8)', height: 24,
                padding: '0 var(--space-8)', borderRadius: 'var(--radius-xs)',
                background: a.id === model ? 'var(--surface-row-selected)' : 'transparent',
              }}>
                <span style={{ width: 54, font: 'var(--type-data-dense)', color: a.id === model ? 'var(--text-primary)' : 'var(--text-muted)' }}>{a.id}</span>
                <VerdictChip verdict={a.verdict} />
                <span style={{ marginLeft: 'auto' }}>
                  <ConfidenceMeter value={a.confidence} verdict={a.verdict} threshold={0.8} width={72} size="sm" />
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-10)' }}>Neighbours from this host</div>
          <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <Tag>:445 ×18</Tag><Tag>:139 ×9</Tag><Tag>:3389 ×7</Tag><Tag>:22 ×5</Tag><Tag>:80 ×3</Tag>
          </div>
        </section>
      </div>

      <footer style={{
        flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 'var(--space-8)',
        padding: 'var(--space-12) var(--space-16)', borderTop: '1px solid var(--border-hairline)',
        background: 'var(--surface-raised)',
      }}>
        <Button icon="flag">Acknowledge</Button>
        <Button icon="download">Export PCAP</Button>
        <span style={{ marginLeft: 'auto' }}><Button variant="caution" icon="ban">Block source</Button></span>
      </footer>
    </aside>
  );
}

Object.assign(window, { FlowDetail });
