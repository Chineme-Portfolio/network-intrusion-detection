import type { CSSProperties, ReactNode } from 'react';

export interface InlineAlertProps {
  /** alert = a malicious verdict needs attention. warn = degraded / uncertain. info = neutral notice. */
  tone?: 'info' | 'warn' | 'alert' | 'quiet';
  /** One clause, sentence case, no period. */
  title?: string;
  children?: ReactNode;
  /** Trailing Button or IconButton. */
  action?: ReactNode;
  /** Override the tone's default Lucide glyph. */
  icon?: string;
  style?: CSSProperties;
}

export declare function InlineAlert(props: InlineAlertProps): JSX.Element;
