# Handoff: Caught operator console

## Overview

Caught is a live network intrusion detection system. It assembles network flows from a live
interface or a replayed PCAP, classifies each flow as **benign** or **malicious** in real time,
and lets an operator switch between five trained models at runtime.

This bundle covers the web console: four screens in one shell (live flow stream, alert triage,
model comparison, capture sources), plus a flow-detail drawer, a model-switch dialog and toasts.
It also contains the full design system those screens are built from — 22 primitives, 169 CSS
custom properties, and 50 vendored Lucide icons.

**The one sentence every screen must serve:** make the current verdict, and whether to trust it,
obvious at a glance.

## About the design files

Everything outside this folder is a **design reference written in HTML** — prototypes that show intended
look and behaviour. It is not production code to lift wholesale. The task is to **recreate these
designs in the target codebase's environment** (React, Vue, Svelte, whatever is already there),
using its established patterns, router, state management and component conventions. If no
environment exists yet, pick the framework that fits the project and implement the designs there.

Two things *are* meant to be taken more or less literally:

1. **`styles.css` and `tokens/*.css`** — port these custom properties verbatim.
   The values are the design. Keep the token names; consuming code should reference
   `var(--verdict-malicious-solid)`, never a raw hex.
2. **`assets/icons/*.svg`** — 50 unmodified Lucide SVGs. Use the real ones; do not
   substitute hand-drawn paths.

The `.jsx` files are plain browser-Babel React with inline styles, deliberately dependency-free.
Treat them as spec, not as an npm package: read the exact numbers out of them, then rebuild each
component the way the codebase builds components (CSS modules, Tailwind, styled-components, etc.).
Each component ships a `.d.ts` (props contract) and a `.prompt.md` (what it is, when to use it) —
read both before reimplementing.

## Fidelity

**High-fidelity.** Colours, typography, spacing, radii, row heights, motion durations and
interaction states are all final and specified below. Recreate pixel-for-pixel. Where a number
appears in this document, it is the number — do not snap it to a 4/8px grid or a framework default.

Two honest caveats:

- **Fonts load from Google Fonts** (Barlow, Azeret Mono — both OFL). No binaries were supplied.
  Self-host them if the product needs offline capability.
- **Data is invented.** Model ids, F1 scores, attack names and flow fixtures in `data.js` are
  plausible placeholders in the CIC-IDS2017 style. Wire real telemetry; do not ship the fixtures.
- **No logo exists.** The brand appears as the name set in type. A real mark should replace it.

---

## Screens / views

All screens live inside one fixed frame that never scrolls as a whole. Design width **1440×900**.

### Shell (`AppShell.jsx`)

**Layout** — CSS grid, `grid-template-columns: 196px 1fr`, full viewport height, `overflow: hidden`.
The right column is itself a grid: `grid-template-rows: 44px 1fr 26px` (top bar, content, status bar).

**Sidebar** (196px, `--sidebar-w`)
- Background `--surface-app` `#0a0f1a`, `border-right: 1px solid var(--border-subtle)` `#1d2838`.
- Padding `12px 10px`, children stacked with `gap: 16px`.
- Wordmark row: "Caught" in Barlow 600 / 18px / letter-spacing `-.03em`, colour `--steel-100`
  `#eaf0f7`, followed by a 4×4px `--cyan-500` `#4fafbc` square baseline-aligned with 3px gap.
  A `Badge tone="quiet" mono` reading `v1.4` is pushed right.
- Nav: 4 items, each a 28px-high button, `padding: 0 8px`, `border-radius: 3px`, `gap: 8px`,
  12px Barlow 500. Icon 13px. Idle text `--text-secondary` `#a6b4c6`, idle icon `--text-muted`
  `#8494a9`. Hover fill `--surface-control` `#121a28`. Active: fill `--surface-row-selected`
  `rgba(79,175,188,.10)`, `box-shadow: inset 2px 0 0 var(--accent)`, text `--text-primary`,
  icon `--accent`. Items: Live flows (`activity`), Alerts (`shield-alert`, warn badge with an
  open-cluster count), Models (`cpu`), Sources (`route`).
- Footer block (pushed down with `margin-top: auto`, `border-top: 1px solid var(--border-hairline)`,
  `padding-top: 8px`): `StatusDot tone="live" pulse` reading `eth0 · 1.24 Gbps` (or
  `tone="idle"` + `capture paused`), a 5px dot reading `<model> loaded`, then
  `soc-ops · shift 2` in 10px mono `--text-faint`.

**Top bar** (44px, `--topbar-h`) — `background: --surface-app`, `border-bottom: 1px solid
var(--border-subtle)`, `padding: 0 12px`, `gap: 12px`. Left: uppercase 10px eyebrow
(`--tracking-label .09em`, `--text-faint`) then the screen title in Barlow 600 / 14px
`--text-primary`. Eyebrow/title pairs: `STREAM / Live flows`, `TRIAGE / Alerts`,
`CLASSIFIERS / Models`, `CAPTURE / Sources`. Right, in order: a secondary `Button size="sm"
icon="arrow-left-right"` reading "Compare models"; a 1×18px `--border-subtle` divider; the
uppercase micro label `MODEL`; a `Select size="sm" mono` of the five model ids; `IconButton`
`bell`; `IconButton` `settings`.

**Status bar** (26px, `--statusbar-h`) — `border-top: 1px solid var(--border-subtle)`,
10px Azeret Mono `--text-faint`, `gap: 16px`, `padding: 0 12px`. Segments:
`eth0 · 1.24 Gbps · drop 0.02%`, `model rf-v4 · 1.2 ms/flow`, `threshold 0.80`, and right-aligned
`live · 14:22:07 UTC`.

---

### 1. Live flows (`LiveFlows.jsx`) — the centrepiece

**Purpose** — watch classified flows arrive, spot malicious ones, open one for judgement.

**Layout** — grid `grid-template-columns: 1fr 280px`, `grid-template-rows: auto auto 1fr`,
`gap: 12px`, `padding: 12px`.

**Row 1 — filter bar** (spans both columns, `flex-wrap`, `gap: 12px`)
- `Tabs variant="underline"`: All flows / Malicious / Below threshold, each with a mono count.
  Active tab: `--text-primary` + 2px `--accent` bottom border; counts turn `--accent` when active.
- `Tabs variant="segmented" size="sm"`: Live / Replay. Track `--surface-inset` `#04070d`,
  1px `--border-control` `#243044`, 2px inner padding, selected pill `--surface-control`.
- `Input icon="search" mono size="sm"` (width 230px), placeholder `proto=TCP and dst_port=445`.
- Applied filters as `Tag` chips: `src=10.4.19.22` (`active`, cyan, removable) and
  `Last 15 min` (`mono={false}`, `clock` icon).
- Right cluster: `Checkbox` "Show benign", `Switch` "Auto-scroll" (on), `IconButton
  variant="secondary"` toggling `pause`/`play`, `IconButton` `download`.

**Row 2 — KPI strip** (left column) — `--surface-panel` `#0d1420`, 1px `--border-subtle`,
`border-radius: 4px`, `padding: 10px 16px`, `gap: 32px`. Four `MetricStat`s: Flows scored
(`12,481`, hint "Since 13:52"), Malicious (hint "Last 15 minutes"), Below threshold (hint
"Confidence < 0.80"), Flows / sec (`1,284`, delta `+8%` in cyan). Right-aligned: `StatusDot
tone="live" pulse` reading `capture live · 00:31:12` over 10px mono `queue 0 · drop 0.02%`.
The right column of this row holds a `Badge tone="accent" icon="cpu" mono` with the active model id.

**Row 3 left — the flow table**, inside `Panel eyebrow="STREAM" title="Live flows" icon="activity"
flush scroll`, header actions `IconButton table-2` (Columns) and `refresh-cw` (Reset view),
footer `<n> of <m> flows` … `appending ~1.1/s`.

`DataTable dense animateNew`, `table-layout: fixed`, sticky 26px header, columns in order:

| Column | Width | Align | Treatment |
| --- | --- | --- | --- |
| Time | 96px | left | mono 11px, `--text-muted`, sortable (desc default) |
| Source | 162px | left | mono 11px, 500 weight, `--text-primary` |
| Destination | 170px | left | mono 11px, `--text-body` |
| Proto | 52px | left | mono, `--text-muted` |
| Service | 68px | left | mono, `--text-muted` |
| Pkts | 54px | right | mono |
| Bytes | 72px | right | mono, thousands separators |
| Dur | 62px | right | mono, `605ms` |
| Verdict | 142px | left | `VerdictChip` + confidence |
| Confidence | 112px | left | `ConfidenceMeter` width 56, `size="sm"`, no number |
| — | 30px | right | 12px `chevron-right`, `--text-faint` |

Rows: 26px (`--row-h-dense`), `border-bottom: 1px solid var(--border-hairline)` `#121a28`, no
zebra striping, no vertical rules. `box-shadow: inset 2px 0 0 <edge>` carries state — `--accent`
when selected, `--verdict-malicious-solid` `#e4572e` when malicious, `--amber-400` `#e0b23f` when
confidence < 0.80, otherwise transparent. Malicious rows also take `--verdict-malicious-bg`
`rgba(228,87,46,.13)`; hover deepens that to `rgba(228,87,46,.19)`, and benign hover is
`rgba(108,197,208,.045)`. New rows animate `caught-row-in` (400ms, fade from a faint cyan wash to
transparent — they never slide).

**Row 3 right — the verdict rail** (280px, `gap: 12px`, scrolls independently)
1. `Panel tone="alert" eyebrow="CURRENT" title="Verdict" icon="shield-alert"` — vermilion border
   + `--glow-alert`. Inside: `VerdictChip size="hero" solid` (34px, filled `#e4572e`, ink text),
   `ConfidenceMeter segments={20} size="lg" width={236} threshold={0.8}`, a mono key/value block
   (pattern, source, target, scored by), then `Button variant="primary" icon="eye" fullWidth`
   "Inspect flow".
2. `Panel eyebrow="AGREEMENT" title="All five models" meta="4/5" icon="layers"` — one row per
   model: id in 11px mono, `VerdictChip` (sm), right-aligned `ConfidenceMeter width={48} size="sm"`.
   The active model's id is `--text-primary`, others `--text-muted`.
3. `InlineAlert tone="warn" title="svm-v1 disagrees"` with the body copy verbatim:
   "One of five models scores this flow benign at 0.62. Treat the cluster, not the single flow,
   as the signal."

---

### 2. Flow detail (`FlowDetail.jsx`) — drawer

**Purpose** — decide whether to trust one verdict.

**Layout** — `position: absolute`, pinned top/right/bottom of the content area, width 420px
(`--detail-w`), `z-index: 20`. It **overlays, never pushes**. `--surface-panel` background,
`border-left: 1px solid var(--border-strong)` `#2c3a50`, `--shadow-overlay`.

- **Header** 38px, `--surface-raised` `#121a28`, `border-bottom` hairline: `scan-line` icon,
  "Flow" in 13px Barlow 600, then `f4881 · 14:09:09.216` in 11px mono `--text-faint`;
  right-aligned `IconButton size="sm"` × 3 (`copy`, `external-link`, `x`).
- **Body** scrolls, `padding: 16px`, sections `gap: 16px`:
  1. **Verdict block** — `padding: 12px`, `border-radius: 4px`. Malicious: `--verdict-malicious-bg`
     fill + `--verdict-malicious-border`; otherwise `--surface-raised` + hairline. Contains the
     hero `VerdictChip` (`solid` **only when malicious** — a benign hero keeps the outline
     treatment so a clean flow never shouts), an optional `Badge tone="warn" icon="target"` naming
     the attack pattern, `ConfidenceMeter segments={20} size="lg" width={340} threshold={0.8}
     label="conf"`, and the line "Scored by `rf-v4` in 1.2 ms, 14 features · threshold 0.80".
  2. `InlineAlert tone="warn" title="Confidence below your threshold"` — rendered only when
     confidence < 0.80. Body: "Verify against the flow's neighbours before acting on this verdict
     alone."
  3. **Flow** — uppercase micro heading, then a `92px 1fr` grid of mono pairs: source, destination,
     protocol (`TCP · SSH`), packets (`75 fwd / 32 bwd`), bytes, duration, flags.
  4. **Feature contribution** — heading plus `top 6 of 14`. Each row: label 118px 11px Barlow with
     a dotted `--border-strong` underline and a `Tooltip mono` revealing the raw feature key;
     value 54px mono right-aligned; a 5px track (`--ink-750` `#172130`) whose fill is
     `--verdict-malicious-solid` on a malicious flow and `--steel-400` otherwise; weight to two
     decimals, 10px mono `--text-faint`.
  5. **Model agreement** — five 24px rows; the active model's row is filled
     `--surface-row-selected`.
  6. **Neighbours from this host** — `Tag` chips: `:445 ×18`, `:139 ×9`, `:3389 ×7`, `:22 ×5`, `:80 ×3`.
- **Footer** — `padding: 12px 16px`, `--surface-raised`, hairline top: `Button icon="flag"`
  Acknowledge, `Button icon="download"` Export PCAP, and right-aligned `Button variant="caution"
  icon="ban"` Block source.

---

### 3. Models (`Models.jsx`)

**Purpose** — compare the five classifiers and switch the one that is scoring.

**Layout** — column, `gap: 12px`, `padding: 12px`.
- **Header row**: `Tabs variant="segmented" size="sm"` (Scorecards / Comparison), the sentence
  "Five models trained on CIC-IDS2017. Switching takes effect from the next flow." in 11px
  `--text-faint`, then right-aligned `StatusDot tone="live"` `<model> scoring` and
  `Button variant="primary" icon="arrow-left-right"` reading "Switch to `<id>`" — disabled and
  labelled "Already active" when the selection is already live.
- **Scorecards**: `grid-template-columns: repeat(5, 1fr)`, `gap: 12px`. Each `Card interactive
  padding="12px"`, selected when it is the chosen model (cyan border + `--surface-row-selected`).
  Contents: model id in 12px mono 500, `Badge tone="accent" icon="check"` "active" on the running
  model, `cpu` icon right-aligned (cyan when selected), the architecture name in 12px Barlow
  `--text-secondary`, the config line in 10px mono `--text-faint`, then two small `MetricStat`s
  (F1, Latency).
- **Evaluation table**: `Panel eyebrow="EVALUATION" title="Held-out test set" meta="284,315 flows"
  icon="gauge" flush scroll`, footer "Metrics from the 2026-08-02 evaluation run · 20% held-out
  split". Columns: Model 84px (mono, emphasis) · Architecture 170px (`mono={false}`, muted,
  `name · arch`) · Precision 84px right · Recall 76px right · F1 72px right emphasis ·
  Latency 78px right (`1.2ms`) · Size 78px right muted · Trained 92px muted · state 76px
  (`Badge tone="accent"` "scoring" for the live model, `Badge tone="quiet"` "loaded" otherwise).
  Rows are 30px (not dense). Clicking a row selects that model.
- **Right rail** (300px): `Panel eyebrow="SELECTED"` with a 2×2 `MetricStat` grid (precision,
  recall, F1, latency) and a mono key/value block (trained, artifact `rf-v4.joblib · 14.2 MB`,
  features "14 flow statistics"); `Panel eyebrow="SAMPLE" title="Verdict on the same flow"` with
  the five-model agreement list; `InlineAlert tone="quiet" title="knn-v3 is 10× slower than rf-v4"`
  — "Latency above 8 ms/flow will not keep up with a 1.2 Gbps link."

Reference metrics (replace with real ones): rf-v4 Random forest / 120 trees, depth 18 /
P .984 R .978 F1 .981 / 1.2ms / 14.2 MB · xgb-v2 Gradient boosting / 400 rounds, lr 0.08 /
.991 / .969 / .980 / 2.4ms / 8.9 MB · mlp-v1 Neural net / 3 × 128 dense / .962 / .981 / .971 /
3.8ms / 4.1 MB · knn-v3 k-nearest / k = 9, ball tree / .948 / .933 / .940 / 11.6ms / 96.4 MB ·
svm-v1 Linear SVM / hinge, C = 1.0 / .937 / .902 / .919 / 0.7ms / 1.8 MB.

---

### 4. Alerts (`Alerts.jsx`)

**Purpose** — triage clusters rather than individual flows.

**Layout** — grid `1fr 300px` / `auto 1fr`, `gap: 12px`, `padding: 12px`.
- **Banner** (spans both columns): `InlineAlert tone="alert"` titled "42 malicious flows from
  10.4.19.22 in the last 31 seconds", body "Sequential destination ports on 10.4.2.9, escalating
  packet rate, no completed handshakes. Peak confidence 0.97 from rf-v4.", action
  `Button size="sm" icon="eye"` "Open in stream" (navigates to Live flows).
- **Cluster table**: `Panel eyebrow="CLUSTERS" title="Alerts" icon="shield-alert" flush scroll`,
  header actions = `Tabs variant="segmented" size="sm"` (Open / Handled / All) + `IconButton
  download`; footer "Clustered by source host and pattern · 5 minute window". Columns: First seen
  90px muted · Source host 124px emphasis · Target 110px · Pattern 146px (`mono={false}`) ·
  Flows 64px right · Window 74px right muted · Peak 128px (`ConfidenceMeter width={60} size="sm"`)
  · State 108px (`Badge`: warn "open", accent "acknowledged", quiet "closed"). Open clusters get
  the vermilion row edge and tint.
- **Right rail**: `Panel tone="alert"` (when the cluster is open) titled with the pattern name,
  containing the hero `VerdictChip solid`, a mono key/value block (source, target, flows, window,
  first seen), port `Tag`s, and two buttons — `Button icon="flag"` Acknowledge and
  `Button variant="caution" icon="ban"` Block host, both `fullWidth` side by side.
  Below: `Panel eyebrow="LAST HOUR" title="Alert volume"` with three small `MetricStat`s
  (Clusters 7, Flows 377, Hosts 3) and a 12-bar histogram, 46px tall, 3px gaps, bars
  `--ink-650` `#243044` turning `--verdict-malicious-solid` for the most recent third,
  axis labels `13:22` / `14:22` in 10px mono.

---

### 5. Sources (`Sources.jsx`)

**Purpose** — choose what Caught is listening to, and how verdicts are handled.

**Layout** — grid `1fr 320px`, `gap: 12px`, `padding: 12px`, page scrolls.
- `Panel eyebrow="CAPTURE" title="Source" icon="route"`, header `Badge tone="accent" mono` showing
  the active interface or `replay`, footer "Changing the source restarts the flow assembler ·
  in-flight flows are discarded". Two `Radio`s with hints — "Live interface" / "Capture from a
  network interface on this host" and "Replay a capture file" / "Score a PCAP at a chosen rate —
  used for demos and regression runs". The field row swaps with the choice: live → `Select`
  Interface (`eth0/eth1/wlan0/any`, mono), `Input mono` BPF filter (240px, `ip and not port 22`),
  `Input` Flow timeout (110px, suffix `s`); replay → `Input mono` Capture file (260px),
  `Select mono` Replay rate (`0.5x/1x/2x/5x/as fast as possible`), `Input mono` Start offset.
  Actions: `Button variant="primary" icon="play"` "Apply and start", `Button variant="ghost"`
  "Discard changes", right-aligned `Button variant="caution" icon="ban"` "Stop capture".
- `Panel eyebrow="SCORING" title="Verdict handling" icon="sliders-horizontal"` — two columns.
  Left: `Input` Alert threshold (`0.80`, suffix `conf`, hint "Below this, verdicts are shown in
  amber and excluded from alert clusters") and `Input` Cluster window (`5`, suffix `min`).
  Right: `Switch` "Toast on new alert cluster" (on), `Switch` "Audible alert" (off), `Checkbox`
  "Drop benign flows from the store" (hint "Keeps the flow table light on long shifts"),
  `Checkbox` "Log every verdict to disk" (checked, hint "JSONL, rotated hourly").
- `Panel eyebrow="HISTORY" title="Recent sources" icon="clock" flush` — dense table: Started 90px
  muted · Kind 72px · Detail (auto) · Flows 84px right · State 90px (`Badge`).
- **Right rail**: `Panel eyebrow="HEALTH" title="Capture" icon="gauge"` with a `StatusDot
  tone="live" pulse` and a 2×2 `MetricStat` grid (Packets / sec `184k`, Flows / sec `1,284`,
  Dropped `0.02%`, Assembler queue `0`); `InlineAlert tone="warn" title="Replay buffer reached 84%
  at 13:41"`; `Panel eyebrow="INTERFACES" title="Detected" flush` listing 28px rows of
  `StatusDot` + interface name (12px mono 500) + right-aligned rate in 11px mono `--text-faint`;
  finally three `Tag`s — `tls decrypt off`, `store 14 d`, `api :8080`.

---

## Interactions & behaviour

- **Navigation** — sidebar switches screens and clears the selected flow. The "Open in stream"
  action on the alerts banner navigates to Live flows. Screens do not remount their own scroll
  position; each panel owns its scroll container.
- **Streaming** — while Live mode is on and the stream is not paused, a new scored flow is
  prepended roughly every 1.1s and the buffer is capped at 70 rows (`slice(0, 70)`). Pausing stops
  the interval; the pause `IconButton` swaps its glyph `pause` ⇄ `play` and the sidebar dot goes
  from `live` (pulsing cyan) to `idle` (steel).
- **Row selection** — clicking a row opens the flow-detail drawer and marks the row selected
  (cyan edge + 10% cyan fill). Selection wins over the vermilion edge; the verdict stays legible
  in the chip. Closing the drawer clears selection.
- **Model switching** — either the top-bar `Select` or the Models screen button opens the
  switch-model `Dialog` (440px). Committing sets the active model and fires a
  `Toast tone="live"` reading "`xgb-v2` loaded" / "Scoring resumed from the next flow." with meta
  `0.8s`. Dialog copy: "Classification restarts from the next flow. Flows already scored keep
  their current verdict."
- **Toasts** — 320px, stacked bottom-right at `16px` inset, `z-index: 30`. `tone="alert"` for
  events the operator did not trigger (a malicious burst), `tone="live"` for completions. The
  alert toast carries a `Button size="sm" icon="eye"` "Open alerts". Confirmations of the
  operator's own actions belong in the status bar, not a toast.
- **Dialog** — scrim `rgba(4,7,13,.72)` with `backdrop-filter: blur(2px)`; positions itself over
  the nearest positioned ancestor, so the content region is `position: relative`.
- **Filtering** — tabs (all / malicious / below threshold), the "Show benign" checkbox and the
  filter tags all narrow the same list; the panel's `meta` and footer counts always reflect what
  is shown versus what is buffered. Every applied filter must be represented by a visible `Tag` —
  an invisible active filter is a bug.
- **Motion** — 90ms instant, 140ms hover/press, 220ms panels and drawers, 400ms a new row
  settling; easing `cubic-bezier(.2,.7,.3,1)` almost everywhere. Nothing bounces, nothing scales,
  nothing spins except the 2s live pulse on a single 6px dot. **A verdict never animates.**
  `prefers-reduced-motion: reduce` zeroes all four durations.
- **States** — hover raises the surface one step and brightens text; press nudges buttons 1px
  down; active/held is cyan (2px inset left edge on rows and nav, cyan text/border on toggles);
  focus is always `0 0 0 2px rgba(79,175,188,.45)` and is never removed; disabled drops text to
  `--text-disabled` and flattens the fill.
- **Empty state** — the table renders a single centred row: "No flows match the current filter",
  12px Barlow 400 `--text-faint`, `padding: 32px 12px`.
- **Responsive** — the console is a fixed 1440-wide frame. When space runs out, drop data columns
  from the right; **Verdict and Confidence are the last two to go.** No mobile layout is specified.

## State management

Owned by the shell (`index.html`):

| State | Type | Set by |
| --- | --- | --- |
| `screen` | `'live' \| 'alerts' \| 'models' \| 'sources'` | sidebar nav, alerts banner |
| `model` | model id string | committing the switch dialog |
| `pending` | model id or `null` | top-bar select, Models button; `null` cancels |
| `flow` | selected flow object or `null` | row click, drawer close, screen change |
| `paused` | boolean | pause/resume `IconButton` |
| `toast` | `{tone,title,message,meta}` or `null` | model commit, incoming alert cluster |

Owned by Live flows: `flows[]` (the ring buffer), `tab`, `mode` (Live/Replay), `showBenign`,
`follow` (auto-scroll), `query`. Owned by Models: `sel` (highlighted model), `view`. Owned by
Alerts: `sel` (cluster), `tab`. Owned by Sources: the form fields.

**Real data requirements** — a stream (WebSocket or SSE) emitting scored flows
`{id, ts, src, dst, proto, service, pkts, bytes, dur, verdict, confidence, attack}`; a models
endpoint with metrics and load state; a mutation to set the active model; a clusters endpoint;
per-flow feature attributions and per-model agreement for the drawer; capture health telemetry.

## Design tokens

Ported verbatim from `tokens/`. Names matter — reference the semantic aliases, not the raw
ramps, in product code.

**Ink (surfaces)** `--ink-1000 #04070d` · `--ink-950 #070b13` · `--ink-900 #0a0f1a` ·
`--ink-850 #0d1420` · `--ink-800 #121a28` · `--ink-750 #172130` · `--ink-700 #1d2838` ·
`--ink-650 #243044` · `--ink-600 #2c3a50` · `--ink-500 #3c4c64`

**Steel (type & lines)** `--steel-100 #eaf0f7` · `--steel-200 #cbd6e3` · `--steel-300 #a6b4c6` ·
`--steel-400 #8494a9` · `--steel-500 #65758c` · `--steel-600 #4c5b70`

**Cyan (interactive, live)** `--cyan-300 #8fd6de` · `--cyan-400 #6cc5d0` · `--cyan-500 #4fafbc` ·
`--cyan-700 #24616b` · `--cyan-900 #12333a`

**Vermilion (malicious verdicts only)** `--vermilion-300 #f79475` · `--vermilion-400 #f26b41` ·
`--vermilion-500 #e4572e` · `--vermilion-700 #8e3018` · `--vermilion-900 #3d170d`

**Amber (uncertainty, warnings, destructive)** `--amber-300 #f0d485` · `--amber-400 #e0b23f` ·
`--amber-700 #7a5c16` · `--amber-900 #2e240b`

**Semantic** `--canvas` = ink-950 · `--surface-app` = ink-900 · `--surface-panel` = ink-850 ·
`--surface-raised` = ink-800 · `--surface-inset` = ink-1000 · `--surface-control` = ink-800 ·
`--surface-control-hover` = ink-750 · `--surface-row-hover rgba(108,197,208,.045)` ·
`--surface-row-selected rgba(79,175,188,.10)` · `--border-hairline` = ink-800 ·
`--border-subtle` = ink-700 · `--border-control` = ink-650 · `--border-strong` = ink-600 ·
`--border-focus` = cyan-500 · `--text-primary` = steel-100 · `--text-body` = steel-200 ·
`--text-secondary` = steel-300 · `--text-muted` = steel-400 · `--text-faint` = steel-500 ·
`--text-disabled` = steel-600 · `--accent` = cyan-500 · `--accent-hover` = cyan-400 ·
`--accent-quiet rgba(79,175,188,.12)` · `--on-accent` = ink-1000

**Verdicts** `--verdict-benign-fg #a6b4c6` / `-bg rgba(166,180,198,.07)` /
`-border rgba(166,180,198,.22)` · `--verdict-malicious-fg #f79475` / `-bg rgba(228,87,46,.13)` /
`-border rgba(228,87,46,.42)` / `-solid #e4572e` · `--verdict-unknown-fg #65758c` /
`-bg rgba(101,117,140,.08)` / `-border rgba(101,117,140,.24)`

**The rule that must survive the port:** vermilion appears on malicious verdicts and nowhere else
— not on buttons, not on form errors, not on chart series, not on system failures. Warnings,
errors and destructive controls are amber. Benign is achromatic. There is no green in the system.

**Type** `--font-sans: "Barlow", "Helvetica Neue", system-ui, sans-serif` ·
`--font-mono: "Azeret Mono", ui-monospace, SFMono-Regular, Menlo, monospace`.
Sizes 10 / 11 / 12 / 13 / 14 / 16 / 20 / 26 / 34 / 48. Line heights 1 / 1.15 / 1.3 / 1.5 / 1.65.
Weights 400 / 500 / 600 / 700. Tracking: `--tracking-label .09em` (uppercase micro),
`--tracking-tight -.012em` (display), `--tracking-data .005em` (mono).
Composites: `--type-display 600 48px/1.15 sans` · `--type-title 600 20px/1.15` ·
`--type-panel-title 600 13px/1.3` · `--type-body 400 13px/1.5` · `--type-ui 500 12px/1.3` ·
`--type-label 600 10px/1` · `--type-data 400 12px/1 mono` · `--type-data-dense 400 11px/1 mono` ·
`--type-data-strong 500 12px/1 mono` · `--type-metric 500 26px/1 mono` ·
`--type-metric-lg 500 34px/1 mono`.
**Every value read as data is mono; all chrome is Barlow. No exceptions.**

**Spacing** 2 / 4 / 6 / 8 / 10 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64px.
**Radii** `--radius-xs 2px` (chips) · `sm 3px` (controls) · `md 4px` (cards, panels) ·
`lg 6px` (dialogs) · `pill 999px` (status dots only).
**Controls** 22 / 28 / 34px. **Rows** 26 / 30 / 36px.
**Frame** sidebar 196px · collapsed 48px · top bar 44px · status bar 26px · detail drawer 420px.

**Shadows** `--shadow-panel 0 1px 2px rgba(0,0,0,.4), 0 8px 24px -16px rgba(0,0,0,.8)` ·
`--shadow-overlay 0 24px 64px -24px rgba(0,0,0,.9), 0 2px 8px rgba(0,0,0,.5)` ·
`--shadow-popover 0 12px 32px -12px rgba(0,0,0,.85)` ·
`--ring-focus 0 0 0 2px rgba(79,175,188,.45)` ·
`--glow-alert 0 0 0 1px rgba(228,87,46,.35), 0 0 20px -8px rgba(228,87,46,.55)` — the glow means
malicious. Cards carry no shadow at all.

**Textures** `--pattern-grid` (24px 1px lines at 2.8%) and `--pattern-scanline` (3px) — brand
surfaces and empty space only, never behind data.

**Motion** `--dur-instant 90ms` · `--dur-fast 140ms` · `--dur-base 220ms` · `--dur-slow 400ms` ·
`--dur-pulse 2000ms` · `--ease-out cubic-bezier(.2,.7,.3,1)` ·
`--ease-in-out cubic-bezier(.5,0,.3,1)` · `--ease-snap cubic-bezier(.16,1,.3,1)`.
Keyframes: `caught-row-in`, `caught-live-pulse`, `caught-sweep`.

## Assets

- **`assets/icons/*.svg`** — 50 unmodified Lucide icons (ISC licence), vendored from
  `github.com/lucide-icons/lucide`. Referenced by file stem. If the codebase already has
  `lucide-react` or an equivalent, use that instead of these files — the glyph names match.
  Render at 12px (dense rows), 14px (default chrome), 16px (headers, nav); never above 20px.
- **Fonts** — Barlow and Azeret Mono, both OFL, currently loaded from Google Fonts in
  `tokens/fonts.css`. Self-host for production.
- **No logo.** None was supplied and none was invented; the brand renders as "Caught" in Barlow
  600 with a 0.13em cyan square period. Replace with a real mark when one exists.
- **No photography or illustration** anywhere in the system, by design.
- **No emoji, ever** — in UI, docs or strings.

## Copy rules (worth carrying into the implementation)

Numbers before adjectives; name the host, count and window. Sentence case everywhere except
uppercase micro labels and single-word verdicts (`BENIGN`, `MALICIOUS`, `UNSCORED`). Second person
for the operator's settings ("your 0.80 threshold"); no first person for the system. State facts,
then the consequence, then the action. Never claim certainty the model does not have. Addresses
keep ports, timestamps keep milliseconds, confidences always show two decimals (`0.97`, not
`97%`), counts use thousands separators. Vocabulary: flow, verdict, confidence, threshold,
cluster, capture, replay, source, model, score. Not: threat level, risk score, incident, AI.
Full detail in `DESIGN_SYSTEM.md`.

## Files

Open `ui_kits/console/index.html` in a browser to see the working prototype (needs network
access for React, Babel and the two webfonts).

| Path | What it is |
| --- | --- |
| `ui_kits/console/index.html` | Mount + shell state; the click-through prototype |
| `ui_kits/console/AppShell.jsx` | Sidebar, top bar, status bar |
| `ui_kits/console/LiveFlows.jsx` | Filter bar, KPI strip, flow table, verdict rail |
| `ui_kits/console/FlowDetail.jsx` | 420px drawer |
| `ui_kits/console/Models.jsx` | Scorecards + evaluation table |
| `ui_kits/console/Alerts.jsx` | Cluster triage |
| `ui_kits/console/Sources.jsx` | Capture + scoring settings |
| `ui_kits/console/data.js` | Deterministic fixtures (replace with real telemetry) |
| `ui_kits/console/README.md` | What is interactive, and what was deliberately not built |
| `styles.css` | Global entry — `@import` lines only |
| `tokens/*.css` | colors, typography, spacing, effects, motion, fonts, base reset |
| `components/core/` | Icon, Button, IconButton, Input, Select, Checkbox, Radio, Switch |
| `components/surfaces/` | Panel, Card, Dialog, Tooltip |
| `components/data/` | VerdictChip, ConfidenceMeter, StatusDot, Badge, Tag, Tabs, DataTable, MetricStat |
| `components/feedback/` | InlineAlert, Toast |
| `components/**/*.d.ts` | Props contracts — read these first |
| `components/**/*.prompt.md` | What each component is for and when to use it |
| `guidelines/*.html` | Foundation specimens (colour ramps, type ladder, spacing, brand) |
| `DESIGN_SYSTEM.md` | Full brand guide: voice, visual foundations, iconography |
| `_ds_bundle.js` | Prebuilt bundle so the prototype runs without tooling |

All paths above are relative to the project root, one level up from this folder.

Every component is also documented as a rendered specimen: open any `guidelines/*.html`
or the `*.card.html` files inside the component folders.
