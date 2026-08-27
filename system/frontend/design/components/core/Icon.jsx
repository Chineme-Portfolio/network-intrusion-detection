import React from 'react';

/* Lucide SVGs ship as files in assets/icons. The component fetches a glyph once,
   caches its inner markup, and renders it as a real <svg> so stroke inherits the
   surrounding colour. The base path is derived from the design-system bundle's own
   URL, so cards, kits and consuming pages resolve it at any depth. */
const ICON_BASE = (() => {
  const s = document.querySelector('script[src*="_ds_bundle.js"]');
  return s ? s.src.replace(/_ds_bundle\.js.*$/, 'assets/icons/') : 'assets/icons/';
})();

const CACHE = new Map();

function load(name) {
  if (CACHE.has(name)) return CACHE.get(name);
  const p = fetch(ICON_BASE + name + '.svg')
    .then((r) => (r.ok ? r.text() : ''))
    .then((t) => t.replace(/<\?xml[\s\S]*?\?>/, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''))
    .catch(() => '');
  CACHE.set(name, p);
  return p;
}

export function Icon({ name, size = 14, color = 'currentColor', strokeWidth = 2, title, style, ...rest }) {
  const [markup, setMarkup] = React.useState('');
  React.useEffect(() => {
    let alive = true;
    load(name).then((m) => { if (alive) setMarkup(m); });
    return () => { alive = false; };
  }, [name]);
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size}
      fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      role={title ? 'img' : 'presentation'} aria-label={title || undefined}
      style={{ display: 'inline-block', flex: '0 0 auto', overflow: 'visible', ...style }}
      dangerouslySetInnerHTML={{ __html: markup }}
      {...rest}
    />
  );
}
