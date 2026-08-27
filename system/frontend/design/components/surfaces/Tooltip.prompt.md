Hover explanation for truncated data and unlabelled controls. No arrow, no delay animation — it appears and it goes.

```jsx
<Tooltip content="Flow duration in ms, from first SYN to last packet">
  <span style={{ font: 'var(--type-data-dense)' }}>dur</span>
</Tooltip>
<Tooltip mono side="right" content={"fwd_pkts  42\nbwd_pkts  17"}>…</Tooltip>
```

Never put an action inside a tooltip; it is read-only.
