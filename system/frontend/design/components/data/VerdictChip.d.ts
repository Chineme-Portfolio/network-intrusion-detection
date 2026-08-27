import type { CSSProperties } from 'react';

/**
 * The classification readout — benign, malicious or unscored, with optional confidence.
 */
export interface VerdictChipProps {
  verdict?: 'benign' | 'malicious' | 'unknown';
  /** sm = table rows (16px), md = panels, hero = the single primary readout on a screen. */
  size?: 'sm' | 'md' | 'hero';
  /** 0–1 model confidence, printed to two decimals in mono. */
  confidence?: number;
  /** Filled treatment. Reserve for one hero readout per screen. */
  solid?: boolean;
  /** Override the label text; keep it one uppercase word. */
  label?: string;
  style?: CSSProperties;
}

export declare function VerdictChip(props: VerdictChipProps): JSX.Element;
