import type { CSSProperties } from 'react';

export interface IconProps {
  /** File stem of a Lucide SVG in assets/icons, e.g. "shield-alert". */
  name: string;
  /** Square px size. 12 in dense rows, 14 default chrome, 16 headers. */
  size?: number;
  /** Any CSS colour. Defaults to currentColor. */
  color?: string;
  /** Accessible label. Omit for decorative glyphs. */
  title?: string;
  style?: CSSProperties;
}

export declare function Icon(props: IconProps): JSX.Element;
