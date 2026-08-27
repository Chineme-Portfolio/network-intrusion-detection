import type { ReactNode } from 'react';

export interface DialogProps {
  open?: boolean;
  title: string;
  icon?: string;
  /** Lead paragraph above the body. */
  description?: string;
  children?: ReactNode;
  /** Action row, right-aligned. Primary button last. */
  footer?: ReactNode;
  /** px width. 420 default, 560 for forms with two columns. */
  width?: number;
  onClose?: () => void;
  /** "alert" for confirmations about a malicious flow. */
  tone?: 'default' | 'alert';
}

export declare function Dialog(props: DialogProps): JSX.Element;
