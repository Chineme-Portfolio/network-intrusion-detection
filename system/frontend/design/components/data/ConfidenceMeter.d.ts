import type { CSSProperties } from 'react';

export interface ConfidenceMeterProps {
  /** 0–1. */
  value: number;
  /** Tints the fill to match the verdict it belongs to. */
  verdict?: 'benign' | 'malicious' | 'unknown';
  /** Below this value the meter and number turn amber — "do not trust this yet". */
  threshold?: number;
  /** Tick count. 10 default, 20 for a detail view. */
  segments?: number;
  showValue?: boolean;
  /** Track width in px. */
  width?: number;
  size?: 'sm' | 'md' | 'lg';
  /** Uppercase micro label before the track. */
  label?: string;
  style?: CSSProperties;
}

export declare function ConfidenceMeter(props: ConfidenceMeterProps): JSX.Element;
