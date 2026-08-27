import type { CSSProperties, ReactNode } from 'react';

/**
 * Framed region with a header bar — the console's primary container.
 */
export interface PanelProps {
  title?: string;
  /** Uppercase micro label before the title, e.g. "STREAM". */
  eyebrow?: string;
  /** Monospace counter or timestamp beside the title, e.g. "12,481 flows". */
  meta?: string;
  icon?: string;
  /** Right-aligned header controls — IconButtons, Buttons, Select. */
  actions?: ReactNode;
  children?: ReactNode;
  /** Monospace status strip along the bottom. */
  footer?: ReactNode;
  /** Remove body padding — required when the body is a DataTable. */
  flush?: boolean;
  /** Make the body the scroll container. */
  scroll?: boolean;
  /** "alert" adds the vermilion border + glow. Only for a confirmed malicious context. */
  tone?: 'default' | 'alert';
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}

export declare function Panel(props: PanelProps): JSX.Element;
