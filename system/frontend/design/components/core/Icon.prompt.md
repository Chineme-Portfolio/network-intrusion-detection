Renders one Lucide glyph, tinted with currentColor — the only sanctioned way to draw an icon in Caught.

```jsx
<Icon name="shield-alert" size={14} />
<Icon name="radar" size={16} color="var(--accent)" title="Live capture" />
```

Sizes: 12 (dense table rows), 14 (default chrome), 16 (panel headers / nav). Never scale a glyph above 20px — use type instead. Icon names are file stems in `assets/icons/`; if a glyph is missing, add the Lucide SVG to that folder rather than inlining a path.
