import type { CSSProperties } from 'react';

export interface SwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  style?: CSSProperties;
}

export declare function Switch(props: SwitchProps): JSX.Element;
