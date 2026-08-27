Single-line text field. Inset (darker than its panel) so entry fields read as holes, not raised chrome.

```jsx
<Input icon="search" placeholder="Filter flows" mono fullWidth />
<Input label="Alert threshold" defaultValue="0.85" suffix="conf" size="sm" />
<Input label="Capture filter" mono invalid hint="Unbalanced parenthesis at char 24" />
```

Always `mono` when the value is machine data. Errors are amber; vermilion never appears in a form.
