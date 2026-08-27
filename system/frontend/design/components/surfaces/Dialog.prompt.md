Modal for decisions that need confirming or a short form — model switch, source change, block-host confirmation.

```jsx
<Dialog title="Switch active model" icon="cpu" description="Classification restarts from the next flow. In-flight flows keep their current verdict."
  onClose={close}
  footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button variant="primary">Switch to xgb-v2</Button></>}>
  <Select label="Model" mono options={models} value={next} onChange={setNext} />
</Dialog>
```

Positions itself over the nearest positioned ancestor, so wrap kit screens in `position: relative`.
