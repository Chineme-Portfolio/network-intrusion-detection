16px status label for metadata that is not a verdict: model version, ruleset, capture mode, counts.

```jsx
<Badge tone="accent" icon="cpu" mono>rf-v4</Badge>
<Badge tone="warn">degraded</Badge>
<Badge tone="quiet" count={14}>rules</Badge>
```

Deliberately has no vermilion tone. If you reach for one, the thing you are labelling is a verdict — use `VerdictChip`.
