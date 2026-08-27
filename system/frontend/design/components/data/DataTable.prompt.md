The flow table. Fixed layout, monospace cells, hairline rules, sticky 26px header, and a 2px left edge for selection or verdict.

```jsx
<DataTable dense animateNew rowKey="id" selectedKey={sel} onRowClick={open}
  rowTone={(r) => r.verdict === 'malicious' ? 'alert' : r.confidence < 0.8 ? 'warn' : undefined}
  columns={[
    { key: 'ts', label: 'Time', width: '84px' },
    { key: 'src', label: 'Source', width: '150px', emphasis: true },
    { key: 'dst', label: 'Destination', width: '150px' },
    { key: 'proto', label: 'Proto', width: '58px', muted: true },
    { key: 'verdict', label: 'Verdict', width: '132px', render: (r) => <VerdictChip verdict={r.verdict} confidence={r.confidence} /> },
  ]}
  rows={flows} />
```

Always inside `<Panel flush scroll>`. No zebra striping, no vertical grid lines, no row shadows. Give every column a width — the table is `table-layout: fixed`.
