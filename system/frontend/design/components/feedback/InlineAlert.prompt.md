In-place notice attached to the thing it describes — inside a panel, above a table, under a field.

```jsx
<InlineAlert tone="alert" title="4 malicious flows from 10.4.19.22 in 30 seconds"
  action={<Button size="sm" icon="eye">Inspect</Button>}>
  Same destination port, escalating packet rate. Consistent with a port-scan pattern.
</InlineAlert>
<InlineAlert tone="warn" title="Replay buffer at 84%">Capture is being read faster than the model scores it.</InlineAlert>
```

`tone="alert"` requires a real malicious verdict behind it. Anything else that went wrong is `warn`.
