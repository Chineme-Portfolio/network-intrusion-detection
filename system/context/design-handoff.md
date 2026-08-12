# Caught — Design-system handoff

Two outputs. The first feeds Claude Design's "Set up your design system" step. The second runs in this repo *after* the export exists, to generate the UI trio (`ui-tokens.md`, `ui-rules.md`, `ui-registry.md`) from it. For *why* anything is the way it is, see `foundation.md`.

---

## 1) Design-system intake (paste into Claude Design)

**Company name and blurb**
> **Caught** — a live network intrusion detection system that classifies network flows as benign or malicious in real time, and lets an operator switch between five trained models at runtime. Built for security engineers and as a portfolio demo. It runs as a web dashboard over live or replayed network traffic.

**Examples of your design system and products** (all optional, attach if you have them)
- The `system/frontend/` code, once it exists (a React + Vite dashboard).
- A logo or wordmark, if you make one.
- No `.fig` export yet.

**Any other notes?** (aesthetic direction + brand voice)
> **Direction (builder to confirm, not locked):** a security operations console. Dark-first, calm, technical, data-forward. A dense live flow table is the centerpiece, so legibility at small sizes and high row counts matters more than decoration. Monospace for flow data (ports, addresses, ids); a clean sans for UI chrome. Small corner radius (technical, not playful).
>
> **The one sharp color decision, driven by verdict semantics:** benign reads calm and neutral; malicious reads as a clear but non-panic alert (a confident signal, not a flashing siren). Reserve the alert color *exclusively* for malicious verdicts so it never loses meaning.
>
> **Brand voice:** precise, calm, trustworthy. It catches things; it does not shout.
>
> **Prime directive (the one sentence every screen must serve):** make the current verdict, and whether to trust it, obvious at a glance.
>
> **Decide these on purpose (do not let the tool guess):** the exact palette hex values, the accent/alert hues, and the typeface pair. These are real decisions, mark them TBD until you choose them deliberately.

---

## 2) In-repo prompt (run after the design export is committed)

Give this to your coding agent once the Claude Design export is committed (proposed path `system/frontend/design/`):

> Read the design-system export in this repo (at `system/frontend/design/`) and the context system in `system/context/`. Generate three files in `system/context/`, each referencing `foundation.md` for the *why* and never restating it:
>
> - `ui-tokens.md` — the raw tokens from the export: color, type scale, spacing, radius, and any others present. Values come from the export, not assumption. Document the layered architecture: raw palette (private) → semantic aliases (the contract components code against) → framework binding. State the theming switches (e.g. `data-theme` for dark mode) and the invariant: **tokens only, no raw hex or off-palette values in components.**
> - `ui-rules.md` — how those tokens compose into UI. Open with a Section 0 prime directive derived from the brand voice in `foundation.md` ("make the current verdict, and whether to trust it, obvious at a glance"), then usage rules, layout/density for the live flow table, hierarchy, color discipline (alert color = malicious only), do/don't, and required interaction states.
> - `ui-registry.md` — the component registry with a status legend (⬜ planned · 🟡 in progress · ✅ built) and per-component rows: name, status, built path (`—` until ported), variants, purpose. Include the rule: check this registry before building any component, reuse if built, port from the export if planned; if it is not in the export it has not been designed.
>
> Anything the export does not cover, mark TBD, do not invent it. When done, update `system/README.md` to drop the PENDING markers on these three files, and check that every cross-reference across the system still resolves.
