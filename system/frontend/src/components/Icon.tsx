import { useEffect, useState, type CSSProperties } from 'react';

// Ported from the design export (ui-registry.md: the only icon primitive). Inline Lucide
// SVG, colored via currentColor. Icons are served from /assets/icons/<name>.svg (public/).
const cache = new Map<string, string>();

export function Icon({
  name,
  size = 14,
  color,
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  const [svg, setSvg] = useState<string>(() => cache.get(name) ?? '');

  useEffect(() => {
    if (cache.has(name)) {
      setSvg(cache.get(name) as string);
      return;
    }
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}assets/icons/${name}.svg`)
      .then((res) => (res.ok ? res.text() : ''))
      .then((text) => {
        if (alive) {
          cache.set(name, text);
          setSvg(text);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [name]);

  return (
    <span
      className="caught-icon"
      aria-hidden
      style={{ display: 'inline-flex', width: size, height: size, color: color ?? 'currentColor', ...style }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
