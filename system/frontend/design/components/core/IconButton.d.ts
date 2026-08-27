import type { CSSProperties } from 'react';

export interface IconButtonProps {
  /** Lucide icon stem. */
  icon: string;
  /** Required accessible label; also the tooltip text. */
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'secondary' | 'solid';
  /** Cyan held state for toggles (panel open, filter pinned). */
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export declare function IconButton(props: IconButtonProps): JSX.Element;
