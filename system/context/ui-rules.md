# Caught — UI Rules

> How the tokens in `ui-tokens.md` compose into interface. The tokens are the vocabulary; this file is the grammar. Rules are transcribed from the committed export (`system/frontend/design/readme.md` and the components' own docs), not invented. For *why*, see `foundation.md` Section 1 (the "integrated, legible system"; it "shows the flows and verdicts live in a web UI") and the **Name** line; this file never restates the why.
>
> **Authority:** `foundation.md` wins on any conflict. Companions: `ui-tokens.md` (the tokens), `ui-registry.md` (the components). Anything the export does not settle is **TBD**.

## Section 0 — Prime directive

**Make the current verdict, and whether to trust it, obvious at a glance.**

This is the one sentence every screen must serve (recorded in `design-handoff.md`; rooted in `foundation.md`: Caught *is* the verdict a NIDS delivers, and the product's edge is a legible system, not a bare model). It resolves every layout and colour tie below. Two corollaries the whole system enforces:

- **A verdict and its confidence are always adjacent.** A verdict shown without a confidence reading is incomplete.
- **Never claim certainty the model does not have.** Low confidence is stated plainly and coloured amber, never hidden or rounded away.

## Section 1 — Usage rules (voice, type, data)

**Voice** (`foundation.md` calm/trustworthy spirit): precise, calm, it reports and does not shout.

- **Numbers before adjectives.** Name the host, the count, the window. Yes: "4 malicious flows from 10.4.19.22 in 30 seconds." No: "Suspicious activity detected."
- **Sentence case everywhere**, except uppercase micro labels (`--type-label`, `.09em` tracking) and verdict labels, which are single uppercase words: `BENIGN`, `MALICIOUS`, `UNSCORED`.
- **Second person** for the operator's own settings ("below your 0.80 threshold"). **No first person** for the system; it never says "I found" or "we recommend".
- **State facts, then the consequence, then the action** (toasts, alerts): what happened with numbers, what it means, what to do.
- **Data is never prettified.** Addresses keep ports (`10.4.19.22:51204`), timestamps keep milliseconds (`14:22:07.412`), confidence always shows two decimals (`0.97`, not `97%`), counts use thousands separators (`12,481`), units are lowercase and hug the number in dense contexts (`605ms`).
- **Vocabulary:** flow, verdict, confidence, threshold, cluster, capture, replay, source, model, score (verb). **Not:** threat level, risk score, incident, AI, intelligent. Attack names come from the training data verbatim ("Port scan", "DoS Hulk", "Botnet C2").
- **No exclamation marks, no emoji, ever.** The only glyph carrying emotion is the vermilion shield on a malicious verdict, and it is doing semantic work.

**Type — the strict split.** Barlow (`--font-sans`) for all chrome; Azeret Mono (`--font-mono`) for **every value an operator reads as data** (addresses, ports, ids, counts, timestamps, hashes, confidences, model ids, paths, filter expressions). The split is absolute: a monospace label or a sans-serif IP address is a bug. Size usage: 10 micro labels, 11 dense table data (`+.005em` tracking), 12 default chrome and data, 13 body, 14 panel/dialog titles, 20 screen titles, 26/34 metrics, 48 marketing only. Nothing in the console is below 10px.

## Section 2 — Colour discipline (the sharp decision)

Exactly three chromatic families, **one job each**, and the discipline is the point:

| Family | Token | Job — and only this |
|---|---|---|
| Cyan | `--accent`, `--status-live`, focus | Interactive, focus, selection, live indicators, links |
| Vermilion | `--verdict-malicious-*`, `--glow-alert` | **Malicious verdicts only** |
| Amber | `--status-warn`, `--amber-*` | Uncertainty: low confidence, degraded capture, warnings, errors, destructive controls |

- **Benign is achromatic** — steel text on a 7% steel fill (`--verdict-benign-*`). A clean flow is a colourless flow. **There is no green**; "safe" is the absence of colour, not a colour.
- **Vermilion is reserved.** It never appears on a button, a chart series, a form error, or a destructive action. A reserved colour keeps its meaning, so when it appears the operator knows without reading.
- **Amber carries every warning**, including destructive controls: destructive buttons are `variant="caution"` (amber), never vermilion. There is deliberately no vermilion `Button` variant and no `alert` tone on `Badge` (`ui-registry.md`).
- **The one glow** (`--glow-alert`) means malicious and nothing else.

## Section 3 — Layout and density (the live flow table is the centrepiece)

The console is a **fixed frame that never scrolls as a whole**; each panel owns its one scroll region.

- **Frame** (`ui-tokens.md` layout metrics): `--sidebar-w` 196px, `--topbar-h` 44px, a `--statusbar-h` 26px monospace status bar. The flow detail drawer is `--detail-w` 420px, pinned right, and **overlays rather than pushes**. Right rails are 280–320px.
- **Tables** are `table-layout: fixed` with a **sticky 26px header**. Rows are `--row-h-dense` 26px for 40+ visible rows, `--row-h` 30px default, `--row-h-comfy` 36px. Rows are **hairline-ruled and unstriped** — density is the point. Set an explicit width on every column (fixed layout).
- **Graceful column drop.** When width runs out, data columns are dropped from the **right**; the **verdict and confidence columns are the last to go** (Section 0).
- **Spacing rhythm:** panel padding 12, gaps between panels 12–16, and 24+ only in empty states.
- **New rows fade in place** (`caught-row-in`: a faint cyan wash to transparent); they never slide. A **verdict never animates** — it is either known or it is not.

## Section 4 — Hierarchy and surfaces

- **Depth is built from surface value plus a 1px border**, one step apart: `--canvas` → `--surface-panel` → `--surface-raised` → `--surface-inset`. Borders do most of the work (`--border-hairline` row rules, `--border-subtle` panels, `--border-strong` overlays). Shadows are rare; **cards carry none**.
- **The verdict is the loudest element on any screen**; everything else recedes to steel. Reserve the filled `VerdictChip` (`solid`) and the `hero` size for the **single primary readout per screen**.
- **Textures** (`--pattern-grid`, `--pattern-scanline`) appear only behind empty space or brand surfaces, **never behind data**. No photography, illustration, or gradient backgrounds.

## Section 5 — Required interaction states

Every interactive element must define **all** of these (missing one is incomplete):

| State | Rule |
|---|---|
| **Hover** | Raise the surface one step (`--surface-control`, or a 4.5% cyan wash on rows), brighten text secondary → primary. Never a border-only colour change, never an opacity fade. |
| **Press** | A 1px downward nudge on buttons. No scale, no ripple. |
| **Active / held** | Cyan: a 2px inset left edge on rows and nav items; cyan text and border on toggles. |
| **Focus** | Always `--ring-focus` (2px cyan at 45%). **Never removed.** |
| **Selected** | 10% cyan fill (`--surface-row-selected`) plus a 2px cyan left edge. A malicious row keeps its **vermilion** edge until selected, then cyan wins — selection is *where you are*; the verdict is still visible in its chip. |
| **Disabled** | Drop text to `--text-disabled`, flatten the fill, no pointer. |

## Section 6 — Do / Don't

| Do | Don't |
|---|---|
| Put the verdict and confidence side by side | Show a verdict with no confidence reading |
| Use monospace for every datum (ports, ids, times) | Set an IP or a count in Barlow |
| Reserve vermilion for malicious verdicts | Use vermilion on a button, error, or chart |
| Colour a low-confidence reading amber | Round a 0.61 up to "high" or hide it |
| Reference a `var(--token)` for every value | Inline a raw hex or an off-scale px value |
| Drop columns from the right under pressure | Let verdict/confidence be the first to go |
| Fade a new row in place | Slide, bounce, or animate a verdict |
| Use Lucide via `Icon` at 12/14/16px | Add an emoji or a unicode symbol as an icon |

## Section 7 — Motion and iconography (brief)

- **Motion reports, it does not perform.** Durations map by weight of change: 90ms instant, 140ms hover/press, 220ms panels/drawers/dialogs, 400ms a new row settling; `--ease-out` for nearly everything. Nothing bounces or scales up; the only loop is the 2s live pulse on a single 6px dot. `prefers-reduced-motion` zeroes it all.
- **Icons are Lucide**, 2px stroke, no fill, through the `Icon` component at 12px (dense rows) / 14px (default) / 16px (headers), nothing above 20px. Functional, never decorative; they inherit `currentColor`. The only non-alphanumeric glyphs allowed in copy are the middot `·`, the arrow `→`, and the times sign `×`.
