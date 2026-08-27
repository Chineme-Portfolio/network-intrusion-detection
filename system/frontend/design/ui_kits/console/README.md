# Caught console — UI kit

A click-through recreation of the Caught operator console at 1440×900. Four screens
in one shell, composed entirely from the design system's components.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Mount + app state (screen, active model, selected flow, dialogs, toasts) |
| `AppShell.jsx` | Sidebar nav, top bar with the model switcher, monospace status bar |
| `LiveFlows.jsx` | The centrepiece: filter bar, KPI strip, streaming flow table, verdict rail |
| `FlowDetail.jsx` | 420px right drawer — verdict, confidence, features, model agreement |
| `Models.jsx` | Five model scorecards + held-out evaluation table |
| `Alerts.jsx` | Clustered alerts triage with a selected-cluster rail |
| `Sources.jsx` | Capture source config (live interface / PCAP replay) and scoring settings |
| `data.js` | Deterministic fixtures: flows, models, alerts, feature weights |

## What is interactive

- Sidebar switches screens; the top-bar select and the Models screen both open the
  switch-model dialog, which commits and fires a toast.
- The flow table appends a new scored flow about once a second; pause stops it.
- Clicking any row opens the flow detail drawer.
- Tabs filter the stream (all / malicious / below threshold); the benign checkbox and
  auto-scroll switch are live.
- Alerts rows select the cluster shown in the rail.

## Rules this kit follows

1. Vermilion appears only on malicious verdicts — chips, row edges, the alert glow.
   Every control, warning and error uses cyan or amber.
2. Every value an operator reads as data is monospace; all chrome is Barlow.
3. The verdict and its confidence are always adjacent. A verdict without a confidence
   reading is incomplete.
4. Rows are 26px, hairline-ruled, unstriped. Density is the point.

## Not built (no source material)

Authentication, admin, and any marketing surface. Nothing in the brief described them,
so the kit does not invent them.
