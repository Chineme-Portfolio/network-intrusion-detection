import type { CSSProperties } from 'react';

export interface StatusDotProps {
  /** live = capturing, warn = degraded, idle = paused, offline = no source, alert = malicious context only. */
  tone?: 'live' | 'warn' | 'idle' | 'offline' | 'alert';
  /** Slow opacity pulse. Only ever on "live". */
  pulse?: boolean;
  label?: string;
  /** px diameter. 6 default, 8 in headers. */
  size?: number;
  /** Monospace the label (interface names, rates). */
  mono?: boolean;
  style?: CSSProperties;
}

export declare function StatusDot(props: StatusDotProps): JSX.Element;
