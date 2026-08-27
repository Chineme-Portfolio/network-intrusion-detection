Content block one step lighter than a Panel — used in grids of comparable things (model cards, metric groups, alert summaries).

```jsx
<Card title="rf-v4" meta="F1 0.981" interactive selected={active === 'rf-v4'} onClick={() => setActive('rf-v4')}>
  <MetricStat label="Precision" value="0.984" />
</Card>
```

Cards never carry shadows here; depth is border + surface value. No card ever gets a coloured left border.
