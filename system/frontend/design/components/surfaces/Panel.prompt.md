The console's workhorse container: a bordered region with a 34px header bar, optional monospace footer strip.

```jsx
<Panel eyebrow="STREAM" title="Live flows" meta="12,481 / 15m" icon="activity" flush scroll
  actions={<><IconButton icon="pause" label="Pause" /><IconButton icon="list-filter" label="Filters" /></>}>
  <DataTable columns={cols} rows={rows} />
</Panel>
```

`flush` whenever the body is a table or list. `tone="alert"` only when the panel's subject is a malicious verdict — it borrows the reserved vermilion.
