# Caught — Design System

Caught is a live network intrusion detection system. It assembles network flows from a
live interface or a replayed PCAP, classifies each flow as **benign** or **malicious**
in real time, and lets an operator switch between five trained models at runtime. It
runs as a web dashboard and serves two audiences at once: security engineers doing
triage, and reviewers looking at it as a portfolio demo.

**Prime directive — the one sentence every screen must serve:**
make the current verdict, and whether to trust it, obvious at a glance.

## Sources

This system was authored from a written brief only. No codebase, Figma file, screenshot,
deck, or brand asset was supplied, so there is nothing to cross-reference and nothing was
imported. Everything here is an original decision made against that brief. Three items
were named in the brief as deliberate choices and are recorded below: the palette, the
alert hue, and the typeface pair.

If a repository, Figma file, or existing screens exist, attach them — the visual
foundations below should be re-checked against them before this system is trusted.

**Known substitutions and gaps**

- **Fonts load from Google Fonts.** No font binaries were provided. Barlow and Azeret
  Mono are both licensed under the OFL and load from `fonts.googleapis.com` in
  `tokens/fonts.css`. Swap in local `@font-face` rules if you want them self-hosted.
- **No logo exists.** Nothing was supplied, and none was invented. The brand appears as
  the name set in type (see `guidelines/brand-wordmark.html`). A real mark should
  replace it in `assets/`.
- **Icons are Lucide**, not a bespoke set — flagged as a substitution, chosen for its 2px
  stroke and technical, unrounded drawing. 50 glyphs are vendored in `assets/icons/`.

## Index

| Path | What it holds |
| --- | --- |
| `styles.css` | The global entry point. Consumers link this one file; it is `@import` lines only. |
| `tokens/` | `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `motion.css`, `fonts.css`, `base.css` |
| `components/core/` | Icon, Button, IconButton, Input, Select, Checkbox, Radio, Switch |
| `components/surfaces/` | Panel, Card, Dialog, Tooltip |
| `components/data/` | VerdictChip, ConfidenceMeter, StatusDot, Badge, Tag, Tabs, DataTable, MetricStat |
| `components/feedback/` | InlineAlert, Toast |
| `ui_kits/console/` | The operator console: four screens, one shell (`README.md` inside) |
| `guidelines/` | Foundation specimen cards — colours, type, spacing, brand |
| `assets/icons/` | 50 Lucide SVGs, referenced by file stem |
| `thumbnail.html` | The system's tile |
| `SKILL.md` | Agent-skill front matter for use outside this project |

## Content fundamentals

The voice is precise, calm and trustworthy. Caught catches things; it does not shout.
Copy is written for someone mid-shift who is scanning, not reading.

**Numbers before adjectives.** Name the host, the count and the window. The system never
describes severity in words it can express in data.

- Yes: "4 malicious flows from 10.4.19.22 in 30 seconds."
- No: "Suspicious activity detected on your network!"

**Sentence case everywhere** except micro labels, which are uppercase with `.09em`
tracking, and verdict labels, which are single uppercase words (`BENIGN`, `MALICIOUS`,
`UNSCORED`). Titles are sentence case: "Live flows", "Switch active model", "Verdict
handling".

**Second person for the operator's own settings** — "below your 0.80 threshold". **No
first person for the system**: it does not say "I found" or "we recommend". It reports.

**No exclamation marks, no emoji, ever.** Not in UI, not in docs, not in commit-style
strings. The one place a glyph carries emotion is the vermilion shield on a malicious
verdict, and it is doing semantic work.

**State facts, then the consequence, then the action.** Toasts and alerts follow one
pattern: what happened (with numbers), what it means, what to do.

- "xgb-v2 loaded." / "Scoring resumed from the next flow."
- "Replay buffer at 84%." / "Capture is being read faster than the model scores it."
- "Confidence 0.61 — below your 0.80 threshold." / "Review before acting."

**Never claim certainty the model does not have.** Low confidence is stated plainly and
coloured amber. "One of five models scores this flow benign at 0.62. Treat the cluster,
not the single flow, as the signal." Errors say what failed and what to do next; there is
no "Something went wrong."

**Data is never prettified.** Addresses keep their ports (`10.4.19.22:51204`), timestamps
keep milliseconds (`14:22:07.412`), confidences always show two decimals (`0.97`, not
`97%`), and counts use thousands separators (`12,481`). Units are lowercase and follow
the number with no space in dense contexts (`605ms`, `1.24 Gbps`).

**Vocabulary.** flow, verdict, confidence, threshold, cluster, capture, replay, source,
model, score (verb). Not: threat level, risk score, incident, AI, intelligent. Attack
names come from the training data and are written as they appear there ("Port scan",
"SMB brute force", "DoS Hulk", "Botnet C2").

## Visual foundations

### Palette

Dark-first, one theme. The ground is a **cool navy ink** (`--ink-950 #070b13` canvas,
`--ink-850 #0d1420` panels), never a neutral grey and never black. Type and lines are
**ice steel** (`--steel-100 #eaf0f7` primary text down to `--steel-500 #65758c` faint).

Exactly three chromatic families exist, and each has one job:

| Family | Hex anchor | Job |
| --- | --- | --- |
| Cyan | `#4fafbc` | Interactive: primary buttons, focus rings, selection, live indicators, links |
| Vermilion | `#e4572e` | **Malicious verdicts only** |
| Amber | `#e0b23f` | Uncertainty: low confidence, degraded capture, warnings, errors, destructive controls |

**The sharp decision:** benign is achromatic. A clean flow is a colourless flow — steel
text on a 7% steel fill. Malicious spends the only saturated warm colour in the system,
so vermilion never appears on a button, a chart series, a form error, or a destructive
action. That is why amber carries every warning: the alert colour is reserved, and a
reserved colour keeps its meaning. There is no green anywhere; "safe" is not a colour
here, it is the absence of one.

### Type

**Barlow** for all chrome (400/500/600/700) and **Azeret Mono** for every value an
operator reads as data — addresses, ports, ids, counts, timestamps, hashes, confidences,
model ids, file paths, filter expressions. The split is absolute; a monospace label or a
sans-serif IP address is a bug.

Sizes are deliberately few: 10 (uppercase micro labels), 11 (dense data and secondary
text), 12 (default chrome and data), 13 (body), 14 (panel/dialog titles), 20 (screen
titles), 26/34 (metrics), 48 (display, marketing only). Nothing in the console is below
10px, and dense table data sits at 11px with `+.005em` tracking to open the mono
counters. Composite `--type-*` tokens exist so consumers can set `font: var(--type-data)`
in one declaration.

### Spacing, radii, density

2px base unit; layouts run on 4s and 8s (`--space-*`). Panel padding is 12, gaps between
panels 12–16, and 24+ appears only in empty states. Control heights are 22/28/34; table
rows are 26 (dense), 30 (default), 36 (comfortable).

Radii are small and technical: 2px chips, 3px controls, 4px cards and panels, 6px
dialogs. `--radius-pill` exists only for status dots and pills. Nothing in this system is
soft.

### Backgrounds, texture, imagery

No photography, no illustration, no gradient backgrounds. Depth is built from surface
value plus a 1px border: canvas → panel → raised → inset, each one step apart. Two
textures exist, both 1px lines at 2–3% opacity — `--pattern-grid` (24px) and
`--pattern-scanline` (3px) — and they appear only behind empty space or brand surfaces,
never behind data. Fade tokens (`--fade-bottom`, `--fade-right`) handle scroll edges
instead of hard cuts.

### Borders and shadows

Borders do most of the work: `--border-hairline` for row rules, `--border-subtle` for
panels, `--border-strong` for overlays and dialogs, cyan for focus. Shadows are rare —
`--shadow-panel` (barely there), `--shadow-overlay` for dialogs and drawers,
`--shadow-popover` for tooltips. Cards carry no shadow at all. One glow exists,
`--glow-alert`, and it means malicious.

### Interaction states

- **Hover** raises the surface one step (`--surface-control`, or a 4.5% cyan wash on
  table rows) and brightens text from secondary to primary. Never a colour change on the
  border alone, never opacity fading.
- **Press** is a 1px downward nudge on buttons. No scale, no ripple.
- **Active/held** (a pinned filter, an open panel, the current nav item) is cyan: a 2px
  inset left edge on rows and nav items, cyan text and border on toggles.
- **Focus** is always `--ring-focus` (2px cyan at 45%), never removed.
- **Selected** is a 10% cyan fill plus a 2px cyan left edge. A malicious row keeps its
  vermilion edge until selected, then cyan wins — selection is about where you are, the
  verdict is still visible in the chip.
- **Disabled** drops text to `--text-disabled` and flattens the fill. No pointer.

### Motion

Motion reports; it does not perform. Durations: 90ms (instant), 140ms (hover/press),
220ms (panels, drawers, dialogs), 400ms (a new row settling in). Easing is
`--ease-out cubic-bezier(.2,.7,.3,1)` for nearly everything. Nothing bounces, nothing
scales up, nothing spins except a live pulse at 2s on a single 6px dot. New flow rows
fade from a faint cyan wash to transparent in place; they never slide. A verdict never
animates — it is either known or it is not. `prefers-reduced-motion` zeroes every
duration.

### Transparency and blur

Tinted fills over the ground rather than opaque swatches: verdict chips, badges, row
selection and hover are all rgba washes at 7–20%, so the surface beneath stays visible.
Blur is used twice: `--blur-scrim` (2px) behind dialogs and `--blur-glass` (10px) if a
floating bar ever overlaps content. No frosted panels as decoration.

### Layout rules

The console is a fixed frame that never scrolls as a whole: 196px sidebar, 44px top bar,
26px monospace status bar, and one scrolling region per panel. The flow detail drawer is
420px, pinned right, and overlays rather than pushes. Right rails are 280–320px. Tables
are `table-layout: fixed` with a sticky 26px header. When space runs out, data columns
are dropped from the right — the verdict and confidence columns are the last to go.

## Iconography

**Lucide**, 2px stroke, no fill, rendered through the `Icon` component at 12px (dense
rows), 14px (default chrome) or 16px (panel headers and nav). Nothing above 20px —
scale meaning with type, not glyphs. 50 SVGs are vendored in `assets/icons/` and
referenced by file stem: `<Icon name="shield-alert" />`. The component fetches the file,
caches it, and renders it as an inline `<svg>` with `stroke="currentColor"`, so a glyph
always inherits the colour of the thing it sits in.

Icons are functional, never decorative: they mark verdicts (`shield-check`,
`shield-alert`, `circle-dot`), system state (`activity`, `radar`, `gauge`, `network`,
`route`, `server`, `cpu`, `database`), and actions (`pause`, `play`, `download`,
`list-filter`, `search`, `eye`, `ban`, `flag`, `x`). Empty states and headings get no
icon at all.

**No emoji. No unicode symbols standing in for icons.** The only non-alphanumeric
characters in copy are the middot separator (`·`) in monospace status strings, the arrow
(`→`) in flow direction, and the multiplication sign (`×`) in counts. If a glyph is
missing, add the Lucide SVG to `assets/icons/` — never inline a hand-drawn path.

## Components

22 primitives, grouped by concern. Each has a `.jsx`, a `.d.ts` props contract, and a
`.prompt.md` with usage.

**Core** — `Icon`, `Button`, `IconButton`, `Input`, `Select`, `Checkbox`, `Radio`,
`Switch`
**Surfaces** — `Panel`, `Card`, `Dialog`, `Tooltip`
**Data** — `VerdictChip`, `ConfidenceMeter`, `StatusDot`, `Badge`, `Tag`, `Tabs`,
`DataTable`, `MetricStat`
**Feedback** — `InlineAlert`, `Toast`

### Intentional additions

No source defined a component inventory, so this is a standard set sized to the product,
plus four domain primitives the prime directive requires:

- **`VerdictChip`** — the classification readout. The one component the product turns on.
- **`ConfidenceMeter`** — segmented 0–1 track; the "should I trust it" half of a verdict,
  with an amber state below threshold.
- **`StatusDot`** — 6px system-state dot (live, warn, idle, offline). Never a verdict.
- **`MetricStat`** — label-over-value readout for KPI strips and model scorecards.

Two deliberate omissions: there is no vermilion `Button` variant (destructive actions are
`variant="caution"`, amber) and no `alert` tone on `Badge`. Both exist to protect the
alert colour.

## UI kit

`ui_kits/console/` recreates the operator console at 1440×900 — live flows, alert triage,
model comparison, capture sources, plus the flow detail drawer, the model-switch dialog
and toasts. See its `README.md` for what is interactive. Authentication, admin and
marketing surfaces are not built; nothing in the brief described them.
