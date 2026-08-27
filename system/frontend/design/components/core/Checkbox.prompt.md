14px square checkbox for multi-select: column pickers, row selection, feature toggles.

```jsx
<Checkbox label="Show benign flows" checked={showBenign} onChange={setShowBenign} />
<Checkbox indeterminate onChange={selectAll} />
<Checkbox label="Replay at capture speed" hint="Ignores the rate limiter" checked />
```
