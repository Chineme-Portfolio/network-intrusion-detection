import type { CSSProperties, ReactNode } from 'react';

export interface BadgeProps {
  children?: ReactNode;
  /** No "alert" tone exists — malicious states use VerdictChip so the colour keeps its meaning. */
  tone?: 'neutral' | 'accent' | 'warn' | 'quiet';
  icon?: string;
  /** Monospace, sentence case — for ids and versions. */
  mono?: boolean;
  /** Trailing monospace count. */
  count?: number | string;
  style?: CSSProperties;
}

export declare function Badge(props: BadgeProps): JSX.Element;
