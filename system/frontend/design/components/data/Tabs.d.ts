import type { CSSProperties } from 'react';

export interface TabItem { value: string; label: string; icon?: string; count?: number | string }

export interface TabsProps {
  tabs: Array<string | TabItem>;
  value?: string;
  onChange?: (value: string) => void;
  /** underline = navigating between views. segmented = switching one view's mode. */
  variant?: 'underline' | 'segmented';
  size?: 'sm' | 'md';
  style?: CSSProperties;
}

export declare function Tabs(props: TabsProps): JSX.Element;
