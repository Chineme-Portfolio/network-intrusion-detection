6px dot for system state — capture health, model load state, source connectivity.

```jsx
<StatusDot tone="live" pulse label="eth0 · 1.24 Gbps" mono />
<StatusDot tone="warn" label="Replay buffer 84%" />
<StatusDot tone="offline" label="No source" />
```

System state only. A flow's classification is never a dot — that is `VerdictChip`.
