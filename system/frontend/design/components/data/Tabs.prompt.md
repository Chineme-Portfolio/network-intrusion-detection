Two jobs, one component. `underline` moves between views; `segmented` switches the mode of the view you are in.

```jsx
<Tabs tabs={[{value:'all',label:'All flows',count:12481},{value:'mal',label:'Malicious',count:37}]} value={tab} onChange={setTab} />
<Tabs variant="segmented" size="sm" tabs={['Live','Replay']} value={mode} onChange={setMode} />
```

Counts render in mono and turn cyan when their tab is active.
