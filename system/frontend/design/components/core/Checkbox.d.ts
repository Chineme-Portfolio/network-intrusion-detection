import type { CSSProperties } from 'react';

export interface CheckboxProps {
  label?: string;
  /** Secondary line under the label. */
  hint?: string;
  checked?: boolean;
  /** Mixed state for "some rows selected" headers. */
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: CSSProperties;
}

export declare function Checkbox(props: CheckboxProps): JSX.Element;
