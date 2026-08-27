Removable 20px token — active filters, selected features, protocol sets.

```jsx
<Tag active icon="list-filter" onRemove={clearProto}>proto=TCP</Tag>
<Tag onRemove={() => drop('dst_port')}>dst_port=445</Tag>
<Tag mono={false} icon="clock">Last 15 minutes</Tag>
```

Tags are the visible record of a query. A filter that is applied but has no tag is a bug.
