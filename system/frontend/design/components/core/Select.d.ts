import type { CSSProperties } from 'react';

export interface SelectOption { value: string; label: string }

export interface SelectProps {
  label?: string;
  /** Plain strings or {value,label} pairs. */
  options: Array<string | SelectOption>;
  value?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  /** Monospace the value — use for model ids, interfaces, capture files. */
  mono?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

export declare function Select(props: SelectProps): JSX.Element;
