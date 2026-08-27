Transient 320px notice, stacked bottom-right, for events the operator did not trigger: a new alert cluster, a model finishing load, a source dropping.

```jsx
<Toast tone="alert" title="Malicious burst detected" meta="14:22:07"
  message="6 flows from 10.4.19.22 scored above 0.95."
  action={<Button size="sm" icon="eye">Open in stream</Button>} onDismiss={dismiss} />
<Toast tone="live" title="xgb-v2 loaded" meta="0.8s" message="Scoring resumed from the next flow." onDismiss={dismiss} />
```

Confirmations of the operator's own actions belong in the status bar, not a toast.
