import type { CSSProperties, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Uppercase micro label above the field. */
  label?: string;
  /** Helper or error text below. Turns amber when invalid. */
  hint?: string;
  /** Lucide icon stem rendered inside, leading. */
  icon?: string;
  /** Set for any field holding data: filter expressions, CIDRs, ports, ids. */
  mono?: boolean;
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Trailing unit or count, e.g. "ms" or "3 matches". */
  suffix?: string;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
}

export declare function Input(props: InputProps): JSX.Element;
