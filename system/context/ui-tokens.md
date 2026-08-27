# Caught — UI Tokens

> The design tokens, transcribed from the committed design-system export at `system/frontend/design/` (entry point `styles.css`; source files in `design/tokens/`). **Values are the export's, never assumed.** For *why* the UI is verdict-first, calm, and dark, see `foundation.md` Section 1 (the "integrated, legible system" edge; it "shows the flows and verdicts live in a web UI") and the **Name** line ("Caught, the verdict a NIDS exists to deliver"); this file never restates the why. Anything the export does not define is marked **TBD** — not invented.
>
> **Authority:** `foundation.md` wins on any conflict. Companion files: `ui-rules.md` (how these compose), `ui-registry.md` (the components).

## The layered architecture

Three tiers, narrowest contract in the middle. Code targets the middle tier.

1. **Raw palette (private).** The five hue ramps: `--ink-*` (navy ground), `--steel-*` (ice type/lines), `--cyan-*` (interactive), `--vermilion-*` (malicious only), `--amber-*` (uncertainty). These are the private source values. App code does **not** reach for a ramp step directly; the semantic alias exists for that.
2. **Semantic aliases (the contract components code against).** Role-named tokens that point at palette steps or `rgba()` washes: `--surface-*`, `--border-*`, `--text-*`, `--accent*`, `--verdict-*`, `--status-*`, the composite `--type-*` shorthands, and the spacing / radius / effect / motion tokens. A component references these, so a palette change ripples through one indirection and meaning stays centralized.
3. **Framework binding.** `styles.css` is the single entry point (it is `@import` lines only: the seven `tokens/*.css` files plus `base.css`). Everything is plain CSS custom properties on `:root`; components consume them as `var(--token)` in JSX inline styles. There is **no JavaScript theme object** and no CSS-in-JS runtime — the binding is the cascade. How the frontend app links `styles.css` into the Vite build is **TBD** (wired when the first components are ported; `ui-registry.md`).

**Observed adherence.** Component code references tokens only (zero raw hex literals across the export's `.jsx`). Most references are to semantic aliases; a few reach a palette step directly where no alias fit (`--amber-400` for in-component warnings, `--cyan-400`, `--steel-300`, `--ink-600`, and similar). The rule going forward is tier 2 first; a palette step in a component is a smell, a missing semantic alias.

## Theming and switches

- **Dark-first, one theme.** Every token is defined once, on bare `:root`. There is **no** light palette, **no** `data-theme` attribute, and **no** `prefers-color-scheme` block anywhere in the export; the manifest lists **zero** themes. "Safe" is the absence of colour, not a light mode.
- **A runtime theme switch (e.g. `data-theme`) is TBD** — not designed. If a second theme is ever needed, it redefines the tier-2 aliases under a selector; the palette and components do not change.
- **Reduced motion is handled** (not TBD): `tokens/motion.css` zeroes every duration under `@media (prefers-reduced-motion: reduce)`.

**The invariant (load-bearing).** *Tokens only. No raw hex and no off-palette values in components.* A colour, size, radius, duration, or shadow in a component is always a `var(--token)`; introducing a value means adding a token here, never a literal in a component. This is what keeps the system coherent and a future re-theme mechanical.

---

## Colour (`tokens/colors.css`)

### Tier 1 — raw palette (private)

| Ramp | Steps (name: value) |
|---|---|
| **Ink** (navy ground) | `1000:#04070d` `950:#070b13` `900:#0a0f1a` `850:#0d1420` `800:#121a28` `750:#172130` `700:#1d2838` `650:#243044` `600:#2c3a50` `500:#3c4c64` |
| **Steel** (type & lines) | `100:#eaf0f7` `200:#cbd6e3` `300:#a6b4c6` `400:#8494a9` `500:#65758c` `600:#4c5b70` |
| **Cyan** (interactive) | `300:#8fd6de` `400:#6cc5d0` `500:#4fafbc` `700:#24616b` `900:#12333a` |
| **Vermilion** (malicious only) | `300:#f79475` `400:#f26b41` `500:#e4572e` `700:#8e3018` `900:#3d170d` |
| **Amber** (uncertainty) | `300:#f0d485` `400:#e0b23f` `700:#7a5c16` `900:#2e240b` |

Three chromatic families only, one job each (`ui-rules.md` colour discipline). Benign is deliberately achromatic; there is no green.

### Tier 2 — semantic aliases

| Group | Token → source |
|---|---|
| **Surfaces** | `--canvas`→ink-950 · `--surface-app`→ink-900 · `--surface-panel`→ink-850 · `--surface-raised`→ink-800 · `--surface-inset`→ink-1000 · `--surface-control`→ink-800 · `--surface-control-hover`→ink-750 · `--surface-row-hover`→`rgba(108,197,208,.045)` · `--surface-row-selected`→`rgba(79,175,188,.10)` · `--surface-overlay`→ink-850 · `--surface-tooltip`→ink-700 |
| **Lines** | `--border-hairline`→ink-800 · `--border-subtle`→ink-700 · `--border-strong`→ink-600 · `--border-control`→ink-650 · `--border-focus`→cyan-500 |
| **Text** | `--text-primary`→steel-100 · `--text-body`→steel-200 · `--text-secondary`→steel-300 · `--text-muted`→steel-400 · `--text-faint`→steel-500 · `--text-disabled`→steel-600 · `--text-inverse`→ink-1000 · `--text-link`→cyan-400 · `--text-link-hover`→cyan-300 |
| **Interactive** | `--accent`→cyan-500 · `--accent-hover`→cyan-400 · `--accent-press`→cyan-700 · `--accent-quiet`→`rgba(79,175,188,.12)` · `--accent-quiet-hover`→`rgba(79,175,188,.20)` · `--on-accent`→ink-1000 |
| **Verdicts** | `--verdict-benign-fg`→steel-300 · `--verdict-benign-bg`→`rgba(166,180,198,.07)` · `--verdict-benign-border`→`rgba(166,180,198,.22)` · `--verdict-malicious-fg`→vermilion-300 · `--verdict-malicious-bg`→`rgba(228,87,46,.13)` · `--verdict-malicious-border`→`rgba(228,87,46,.42)` · `--verdict-malicious-solid`→vermilion-500 · `--verdict-unknown-fg`→steel-500 · `--verdict-unknown-bg`→`rgba(101,117,140,.08)` · `--verdict-unknown-border`→`rgba(101,117,140,.24)` |
| **System status** | `--status-live`→cyan-400 · `--status-warn`→amber-400 · `--status-warn-bg`→`rgba(224,178,63,.12)` · `--status-warn-border`→`rgba(224,178,63,.38)` · `--status-idle`→steel-500 · `--status-offline`→ink-500 |

Verdict fills are `rgba` washes (7–20% opacity) over the ground, so the surface beneath stays visible.

## Type (`tokens/typography.css`)

**Two families, strict split** — Barlow for all chrome, Azeret Mono for every value read as data (`ui-rules.md`).

- `--font-sans`: `"Barlow","Helvetica Neue",system-ui,sans-serif`
- `--font-mono`: `"Azeret Mono",ui-monospace,SFMono-Regular,Menlo,monospace`

| Axis | Tokens |
|---|---|
| **Size ramp** (px) | `--fs-10` `--fs-11` `--fs-12` `--fs-13` `--fs-14` `--fs-16` `--fs-20` `--fs-26` `--fs-34` `--fs-48` |
| **Line height** | `--lh-flat:1` `--lh-tight:1.15` `--lh-snug:1.3` `--lh-normal:1.5` `--lh-loose:1.65` |
| **Weight** | `--fw-regular:400` `--fw-medium:500` `--fw-semibold:600` `--fw-bold:700` |
| **Tracking** | `--tracking-label:.09em` `--tracking-tight:-.012em` `--tracking-normal:0` `--tracking-data:.005em` |

**Composite shorthands** (set with `font: var(--type-*)`):

| Token | Resolves to (weight size/line family) |
|---|---|
| `--type-display` | 600 48/1.15 sans (marketing only) |
| `--type-title` | 600 20/1.15 sans (screen titles) |
| `--type-panel-title` | 600 13/1.3 sans (panel & dialog titles) |
| `--type-body` | 400 13/1.5 sans |
| `--type-ui` | 500 12/1.3 sans (default chrome) |
| `--type-label` | 600 10/1 sans (uppercase micro labels) |
| `--type-data` | 400 12/1 mono |
| `--type-data-dense` | 400 11/1 mono (dense table data) |
| `--type-data-strong` | 500 12/1 mono |
| `--type-metric` | 500 26/1 mono |
| `--type-metric-lg` | 500 34/1 mono |

## Spacing, radius, and layout metrics (`tokens/spacing.css`)

- **Space scale** (2px base, layouts run on 4s and 8s): `--space-2 4 6 8 10 12 16 20 24 32 40 48 64` (px).
- **Radius** (small, technical): `--radius-xs:2px` (chips) · `--radius-sm:3px` (controls) · `--radius-md:4px` (cards, panels) · `--radius-lg:6px` (dialogs) · `--radius-pill:999px` (status dots and pills only).
- **Border width**: `--border-width:1px` · `--border-width-emphasis:2px`.
- **Control heights**: `--control-h-sm:22px` · `--control-h-md:28px` · `--control-h-lg:34px`.
- **Row heights**: `--row-h-dense:26px` · `--row-h:30px` · `--row-h-comfy:36px`.
- **Layout frame**: `--sidebar-w:196px` · `--sidebar-w-collapsed:48px` · `--topbar-h:44px` · `--statusbar-h:26px` · `--detail-w:420px` · `--gutter:16px`.

## Effects (`tokens/effects.css`)

Depth comes from surface value and hairlines first; shadow only for things that truly float.

- **Shadows**: `--shadow-none` · `--shadow-raised` (1px inset highlight) · `--shadow-panel` (barely there) · `--shadow-overlay` (dialogs, drawers) · `--shadow-popover` (tooltips). Cards carry no shadow.
- **Focus rings**: `--ring-focus` (`0 0 0 2px rgba(79,175,188,.45)`) · `--ring-focus-inset`.
- **Alert glow**: `--glow-alert` — the one glow in the system; it means malicious.
- **Scrim / blur**: `--scrim` (`rgba(4,7,13,.72)`) · `--blur-scrim` (2px) · `--blur-glass` (10px).
- **Textures / fades** (1px lines, never over data): `--pattern-grid` (24px) · `--pattern-scanline` (3px) · `--fade-bottom` · `--fade-right`.

## Motion (`tokens/motion.css`)

Motion reports, it does not perform. Verdicts never animate.

- **Durations**: `--dur-instant:90ms` · `--dur-fast:140ms` (hover/press) · `--dur-base:220ms` (panels, drawers, dialogs) · `--dur-slow:400ms` (a new row settling) · `--dur-pulse:2000ms` (the live dot).
- **Easings**: `--ease-out:cubic-bezier(.2,.7,.3,1)` (nearly everything) · `--ease-in-out` · `--ease-snap`.
- **Bundled transition**: `--transition-control` (background, border, colour at `--dur-fast`).
- **Keyframes**: `caught-row-in` (fade a new row in place), `caught-live-pulse` (the 2s live dot), `caught-sweep`.
- `@media (prefers-reduced-motion: reduce)` zeroes all durations.

## Fonts (`tokens/fonts.css`)

Barlow and Azeret Mono load from Google Fonts via two `@import` lines (both OFL-licensed). **Self-hosting is a substitution point** (swap the imports for local `@font-face`); no font binaries shipped with the export. Whether to self-host for the deploy is **TBD** (`devops.md` if it becomes a supply-chain concern).

---

## Notes, gaps, and TBDs

- **Theme switch** (`data-theme` or similar) — **TBD**; the export is single dark theme.
- **Icons** are Lucide (a substitution, not a bespoke set): 50 SVGs in `design/assets/icons/`, referenced by file stem through the `Icon` component (`ui-registry.md`).
- **No logo / wordmark asset** — the brand is the name set in type (`design/guidelines/brand-wordmark.html`); a real mark is a gap.
- **Frontend binding** of `styles.css` into Vite — **TBD** until the first port.
