Exclusive choice where the options need explaining — capture source, replay mode, alert routing.

```jsx
<Radio name="src" label="Live interface" hint="eth0 · 1.2 Gbps" checked={src === 'live'} onChange={() => setSrc('live')} />
<Radio name="src" label="Replay PCAP" hint="From an uploaded capture file" checked={src === 'pcap'} onChange={() => setSrc('pcap')} />
```

If the options need no explanation, prefer `Tabs` segmented or `Select`.
