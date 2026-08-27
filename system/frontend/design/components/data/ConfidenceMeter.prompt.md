Segmented confidence track — the "should I trust this" half of a verdict. Ticks, not a smooth bar, because operators read magnitude in steps.

```jsx
<ConfidenceMeter value={0.97} verdict="malicious" />
<ConfidenceMeter value={0.61} verdict="benign" threshold={0.8} label="conf" />
<ConfidenceMeter value={0.88} segments={20} size="lg" width={220} />
```

Set `threshold` wherever a low score should change operator behaviour; the amber state is the system admitting doubt.
