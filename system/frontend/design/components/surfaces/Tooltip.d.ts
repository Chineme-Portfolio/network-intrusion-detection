import type { CSSProperties, ReactNode } from 'react';

export interface TooltipProps {
  /** Short text. One line preferred; two maximum. */
  content: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Monospace + preserved whitespace, for raw values and feature vectors. */
  mono?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

export declare function Tooltip(props: TooltipProps): JSX.Element;
