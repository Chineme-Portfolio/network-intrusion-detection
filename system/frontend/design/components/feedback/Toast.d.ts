import type { CSSProperties, ReactNode } from 'react';

export interface ToastProps {
  tone?: 'neutral' | 'live' | 'warn' | 'alert';
  /** One clause, sentence case. */
  title: string;
  message?: string;
  /** Monospace timestamp or count, right-aligned in the title row. */
  meta?: string;
  action?: ReactNode;
  onDismiss?: () => void;
  icon?: string;
  style?: CSSProperties;
}

export declare function Toast(props: ToastProps): JSX.Element;
