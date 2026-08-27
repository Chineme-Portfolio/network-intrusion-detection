Immediate on/off for a running behaviour — something that takes effect the moment it flips.

```jsx
<Switch label="Auto-scroll" checked={follow} onChange={setFollow} />
<Switch label="Mute alert sound" size="sm" checked={muted} onChange={setMuted} />
```

Use `Checkbox` for settings that only apply on save; `Switch` means live.
