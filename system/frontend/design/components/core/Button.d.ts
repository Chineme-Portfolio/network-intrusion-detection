import type { CSSProperties, ReactNode, ButtonHTMLAttributes } from 'react';

/**
 * Text action button.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  /** primary = the one committing action on screen. caution = destructive (amber, never vermilion). */
  variant?: 'primary' | 'secondary' | 'ghost' | 'caution';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon stem shown before the label. */
  icon?: string;
  /** Lucide icon stem shown after the label. */
  iconEnd?: string;
  /** Held-on appearance for toggles (e.g. a filter that is applied). */
  active?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

export declare function Button(props: ButtonProps): JSX.Element;
