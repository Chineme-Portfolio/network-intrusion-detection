import type { CSSProperties } from 'react';

export interface RadioProps {
  label?: string;
  hint?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Shared group name. */
  name?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export declare function Radio(props: RadioProps): JSX.Element;
