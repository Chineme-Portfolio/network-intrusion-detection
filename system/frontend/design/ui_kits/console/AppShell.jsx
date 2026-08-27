const { Icon, IconButton, Badge, StatusDot, Select, Button } = window.CaughtDesignSystem_eb3eb1;

const NAV = [
  { id: 'live', label: 'Live flows', icon: 'activity' },
  { id: 'alerts', label: 'Alerts', icon: 'shield-alert', count: 3 },
  { id: 'models', label: 'Models', icon: 'cpu' },
  { id: 'sources', label: 'Sources', icon: 'route' },
];

function Wordmark() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 3, font: 'var(--font-sans)', fontSize: 18, fontWeight: 600, letterSpacing: '-.03em', color: 'var(--steel-100)' }}>
      Caught
      <i style={{ width: 4, height: 4, background: 'var(--cyan-500)', display: 'inline-block' }} />
    </span>
  );
}

function NavItem({ item, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-8)', width: '100%', height: 28,
        padding: '0 var(--space-8)', border: 'none', borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--surface-row-selected)' : hover ? 'var(--surface-control)' : 'transparent',
        boxShadow: active ? 'inset 2px 0 0 var(--accent)' : 'none',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        font: 'var(--type-ui)', cursor: 'pointer', textAlign: 'left',
        transition: 'var(--transition-control)',
      }}>
      <Icon name={item.icon} size={13} color={active ? 'var(--accent)' : 'var(--text-muted)'} />
      {item.label}
      {item.count ? <span style={{ marginLeft: 'auto' }}><Badge tone="warn" mono>{item.count}</Badge></span> : null}
    </button>
  );
}

function AppShell({ screen, onScreen, model, models, onSwitchModel, title, eyebrow, actions, children, statusRight, paused }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'var(--sidebar-w) 1fr', gridTemplateRows: '1fr',
      height: '100%', background: 'var(--canvas)', color: 'var(--text-body)',
      font: 'var(--type-body)', overflow: 'hidden',
    }}>
      <aside style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-16)',
        padding: 'var(--space-12) var(--space-10)', borderRight: '1px solid var(--border-subtle)',
        background: 'var(--surface-app)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', padding: '2px var(--space-4) 0' }}>
          <Wordmark />
          <span style={{ marginLeft: 'auto' }}><Badge tone="quiet" mono>v1.4</Badge></span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map((n) => <NavItem key={n.id} item={n} active={screen === n.id} onClick={() => onScreen(n.id)} />)}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', padding: 'var(--space-8) var(--space-4) 0', borderTop: '1px solid var(--border-hairline)' }}>
          <StatusDot tone={paused ? 'idle' : 'live'} pulse={!paused} mono label={paused ? 'capture paused' : 'eth0 · 1.24 Gbps'} />
          <StatusDot tone="live" mono label={model + ' loaded'} size={5} />
          <span style={{ font: 'var(--type-data-dense)', fontSize: 'var(--fs-10)', color: 'var(--text-faint)' }}>soc-ops · shift 2</span>
        </div>
      </aside>

      <main style={{ display: 'grid', gridTemplateRows: 'var(--topbar-h) 1fr var(--statusbar-h)', minWidth: 0, minHeight: 0 }}>
        <header style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-12)',
          padding: '0 var(--space-12)', borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-app)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-8)' }}>
            {eyebrow ? (
              <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{eyebrow}</span>
            ) : null}
            <h1 style={{ font: 'var(--type-panel-title)', fontSize: 'var(--fs-14)', color: 'var(--text-primary)' }}>{title}</h1>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
            {actions}
            <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
            <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Model</span>
            <Select mono size="sm" value={model} onChange={onSwitchModel} options={models.map((m) => ({ value: m.id, label: m.id }))} />
            <IconButton icon="bell" label="Alerts" />
            <IconButton icon="settings" label="Settings" />
          </div>
        </header>

        <div style={{ minHeight: 0, minWidth: 0, position: 'relative', background: 'var(--canvas)' }}>{children}</div>

        <footer style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-16)',
          padding: '0 var(--space-12)', borderTop: '1px solid var(--border-subtle)',
          background: 'var(--surface-app)', font: 'var(--type-data-dense)', fontSize: 'var(--fs-10)',
          color: 'var(--text-faint)', letterSpacing: 'var(--tracking-data)',
        }}>
          <span>eth0 · 1.24 Gbps · drop 0.02%</span>
          <span>model {model} · 1.2 ms/flow</span>
          <span>threshold 0.80</span>
          <span style={{ marginLeft: 'auto' }}>{statusRight}</span>
        </footer>
      </main>
    </div>
  );
}

Object.assign(window, { AppShell, Wordmark, CONSOLE_NAV: NAV });
