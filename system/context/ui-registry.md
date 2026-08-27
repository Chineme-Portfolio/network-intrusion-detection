# Caught — UI Registry

> The component inventory: what the design export defines, its status, and where it lives once built. Transcribed from the committed export at `system/frontend/design/` (each component ships a `.jsx`, a `.d.ts` props contract, and a `.prompt.md`). For *why* the set is shaped this way, see `foundation.md`; for how they compose, see `ui-rules.md`; for the tokens they consume, see `ui-tokens.md`.
>
> **Authority:** `foundation.md` wins on any conflict.

## The rule (read before building any component)

1. **Check this registry first.** If a component is **✅ built**, reuse it at its path — never re-implement.
2. If it is **⬜ planned** (designed in the export, not yet ported), **port it from the export** at `system/frontend/design/components/<group>/<Name>.jsx` into `system/frontend/`, then update its row to ✅ with the built path.
3. **If it is not in the export, it has not been designed.** Do not invent a component; that is a design decision — take it to the design system (`design-handoff.md`) first, do not free-style it in code.

**Status legend:** ⬜ planned · 🟡 in progress · ✅ built.
**Built path** is `—` until a component is ported. **Port source** for every planned component is its file under `system/frontend/design/`.

Everything below is **⬜ planned**: designed in the export, none ported yet (the frontend is the Layer 0 placeholder). Variants are the export's prop contract (`.d.ts`).

## Core — `design/components/core/`

| Component | Status | Built path | Variants (props) | Purpose |
|---|---|---|---|---|
| Icon | ⬜ | — | `size` 12/14/16px; `name` (Lucide stem), `title` | Inline Lucide SVG rendered as `currentColor`; the only icon primitive. |
| Button | ⬜ | — | `variant` primary/secondary/ghost/caution; `size` sm/md/lg; `active`, `icon`/`iconEnd`, `fullWidth` | Text action. `caution` = destructive (amber). **No vermilion variant** (protects the alert colour). |
| IconButton | ⬜ | — | `variant` ghost/secondary/solid; `size` sm/md/lg; `active` | Icon-only action; `label` required (tooltip + a11y). Cyan `active` for held toggles. |
| Input | ⬜ | — | `size` sm/md/lg; `mono`, `invalid`, `fullWidth`, `icon`, `suffix` | Text field; `mono` for data (CIDRs, ports, ids). Hint turns amber when `invalid`. |
| Select | ⬜ | — | `size` sm/md/lg; `mono`, `fullWidth` | Dropdown; `mono` for model ids, interfaces, capture files. |
| Checkbox | ⬜ | — | `checked`, `indeterminate`, `hint` | Checkbox; `indeterminate` for "some rows selected" headers. |
| Radio | ⬜ | — | `checked`, `name` (group) | Single choice within a named group. |
| Switch | ⬜ | — | `size` sm/md; `checked` | On/off toggle (auto-scroll, benign filter). |

## Surfaces — `design/components/surfaces/`

| Component | Status | Built path | Variants (props) | Purpose |
|---|---|---|---|---|
| Panel | ⬜ | — | `tone` default/alert; `flush`, `scroll`, `eyebrow`, `meta`, `actions`, `footer` | Framed region with a header bar — the console's primary container. `alert` adds vermilion border + glow (confirmed malicious only). `flush` when the body is a DataTable. |
| Card | ⬜ | — | `interactive`, `selected`, `title`, `meta`, `footer`, `padding` | Content card. `selected` = cyan border + tint for the chosen item (e.g. active model). |
| Dialog | ⬜ | — | `tone` default/alert; `width` 420/560; `open`, `title`, `description`, `footer` | Modal. `alert` for confirmations about a malicious flow. |
| Tooltip | ⬜ | — | `side` top/bottom/left/right; `mono` | Short hover text; `mono` + preserved whitespace for raw values and feature vectors. |

## Data — `design/components/data/`

| Component | Status | Built path | Variants (props) | Purpose |
|---|---|---|---|---|
| **VerdictChip** | ⬜ | — | `verdict` benign/malicious/unknown; `size` sm/md/hero; `solid`, `confidence`, `label` | **The classification readout — the component the product turns on.** `solid`/`hero` reserved for the one hero readout per screen. |
| **ConfidenceMeter** | ⬜ | — | `verdict` benign/malicious/unknown; `size` sm/md/lg; `threshold`, `segments` 10/20, `showValue`, `width`, `label` | Segmented 0–1 track — the "should I trust it" half of a verdict. Turns amber below `threshold`. |
| StatusDot | ⬜ | — | `tone` live/warn/idle/offline/alert; `pulse` (live only), `size` 6/8, `mono` | 6px system-state dot. **Never a verdict**; `alert` only in a malicious context. |
| Badge | ⬜ | — | `tone` neutral/accent/warn/quiet; `mono`, `icon`, `count` | Small count/label. **No `alert` tone** by design (malicious states use VerdictChip). |
| Tag | ⬜ | — | `active`, `mono`, `onRemove`, `icon`, `title` | Filter / data tag; `×` to remove; cyan when applied. Mono by default. |
| Tabs | ⬜ | — | `variant` underline/segmented; `size` sm/md; `tabs` (icon, count) | `underline` = navigate between views; `segmented` = switch one view's mode. |
| **DataTable** | ⬜ | — | `dense` 26/30px; `rowTone` alert/warn (2px left edge); `stickyHeader`, `sortKey`/`sortDir`, `selectedKey`, `animateNew`; columns: `align`, `mono`, `emphasis`, `muted`, `width` | Dense monospace table — **the live flow list** and every tabular view. Fixed layout; set every column width. |
| MetricStat | ⬜ | — | `size` sm/md/lg; `align` left/right; `deltaTone` neutral/accent/warn; `label`, `value`, `unit`, `delta`, `hint` | Label-over-value KPI readout for stat strips and model scorecards. |

## Feedback — `design/components/feedback/`

| Component | Status | Built path | Variants (props) | Purpose |
|---|---|---|---|---|
| InlineAlert | ⬜ | — | `tone` info/warn/alert/quiet; `title`, `action`, `icon` | In-context banner. `alert` = a malicious verdict needs attention; `warn` = degraded / uncertain. |
| Toast | ⬜ | — | `tone` neutral/live/warn/alert; `title`, `message`, `meta`, `action`, `onDismiss` | Transient notice; facts → consequence → action. `meta` is a mono timestamp/count. |

## Console views (composed) — `design/ui_kits/console/`

Full screens the export composes from the primitives above, at 1440×900. Not primitives; they are the reference assembly each build slice ports toward. All **⬜ planned**.

| View | Status | Built path | Composes | Maps to |
|---|---|---|---|---|
| AppShell | ⬜ | — | sidebar nav, top bar (model switcher), mono status bar | the console frame |
| LiveFlows | ⬜ | — | filter bar, KPI strip (MetricStat), streaming DataTable, verdict rail | keystone **K1**, metrics **F3** |
| FlowDetail | ⬜ | — | 420px right drawer: VerdictChip, ConfidenceMeter, features, model agreement | K1 / detail views |
| Models | ⬜ | — | five model scorecards (Card + MetricStat) + held-out evaluation table | model switch **F1/F2** |
| Alerts | ⬜ | — | clustered alert triage + selected-cluster rail | metrics / triage **F3** |
| Sources | ⬜ | — | capture source config (live interface / PCAP replay) + scoring settings | replay/live **F4–F6** |

## Notes

- **Inventory size:** 22 primitives (8 core, 4 surfaces, 8 data, 2 feedback). Four are domain primitives the prime directive required and no generic kit would supply: `VerdictChip`, `ConfidenceMeter`, `StatusDot`, `MetricStat`.
- **Two deliberate omissions**, both to protect the alert colour: there is **no vermilion `Button` variant** (destructive = `caution`, amber) and **no `alert` tone on `Badge`** (malicious states use `VerdictChip`). Do not add them.
- **Icons:** 50 Lucide SVGs in `design/assets/icons/`, referenced by file stem through `Icon` (not a component row each; see `ui-rules.md` Section 7). A missing glyph is added as an SVG, never a hand-drawn path.
- **Not designed (not in the export):** authentication, admin, and any marketing surface — the brief described none, so they are undesigned, not merely unbuilt.
