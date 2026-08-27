import type { CSSProperties, ReactNode } from 'react';

export interface CardProps {
  title?: string;
  /** Monospace value or timestamp, right-aligned in the title row. */
  meta?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** Enables hover border and pointer cursor. */
  interactive?: boolean;
  /** Cyan border + tint for the chosen item in a set (e.g. active model). */
  selected?: boolean;
  onClick?: () => void;
  /** Override the 16px inset. */
  padding?: string;
  style?: CSSProperties;
}

export declare function Card(props: CardProps): JSX.Element;
