import type { CSSProperties, ReactNode } from 'react';

export interface TagProps {
  children?: ReactNode;
  /** Renders the × affordance and fires on click. */
  onRemove?: () => void;
  /** Cyan state for an applied filter. */
  active?: boolean;
  /** Monospace by default — tags usually hold data. */
  mono?: boolean;
  icon?: string;
  /** Native tooltip for the full value when truncated. */
  title?: string;
  style?: CSSProperties;
}

export declare function Tag(props: TagProps): JSX.Element;
