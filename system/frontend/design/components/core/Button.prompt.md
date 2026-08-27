Standard action button; one `primary` per view, everything else secondary or ghost.

```jsx
<Button variant="primary" icon="play">Resume capture</Button>
<Button icon="download">Export flows</Button>
<Button variant="ghost" size="sm" iconEnd="chevron-down">Last 15m</Button>
<Button variant="caution" icon="ban">Drop source</Button>
```

Destructive actions use `caution` (amber). Vermilion is reserved for malicious verdicts and must never appear on a control. `active` gives toggle buttons their held state.
