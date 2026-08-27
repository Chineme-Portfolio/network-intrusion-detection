Native select in Caught chrome, with the Lucide chevron as its only affordance.

```jsx
<Select label="Model" mono value={model} onChange={setModel}
  options={['rf-v4', 'xgb-v2', 'mlp-v1', 'knn-v3', 'svm-v1']} />
```

Use for 4+ mutually exclusive options. For 2–3, use `Tabs` in `segmented` mode. Model ids, interface names and file paths get `mono`.
