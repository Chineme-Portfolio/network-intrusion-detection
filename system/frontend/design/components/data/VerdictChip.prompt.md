Renders a model's classification. This is the component the prime directive hangs on: the verdict, and whether to trust it, must be obvious at a glance.

```jsx
<VerdictChip verdict="malicious" confidence={0.97} />           {/* in a flow row */}
<VerdictChip verdict="malicious" size="hero" solid confidence={0.97} />
<VerdictChip verdict="benign" size="md" />
<VerdictChip verdict="unknown" label="QUEUED" />
```

Rules: benign stays achromatic, malicious owns vermilion, and `solid` appears at most once per screen — and only on a malicious verdict; a benign hero keeps the outline treatment so a clean flow never shouts. Always pair the chip with `ConfidenceMeter` where the operator is expected to judge trust, not just read the label.
