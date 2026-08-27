import type { CSSProperties, ReactNode } from 'react';

export interface MetricStatProps {
  /** Uppercase micro label. Keep to 1–3 words. */
  label: string;
  /** Monospace value — pre-format it (e.g. "12,481", "0.981"). */
  value: ReactNode;
  /** Small trailing unit: "flows/s", "ms", "%". */
  unit?: string;
  /** Change indicator, e.g. "+8%". */
  delta?: string;
  deltaTone?: 'neutral' | 'accent' | 'warn';
  /** Sentence-case line under the value. */
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
  style?: CSSProperties;
}

export declare function MetricStat(props: MetricStatProps): JSX.Element;
