import type { CSSProperties, ReactNode } from 'react';

export interface DataTableColumn<Row = any> {
  key: string;
  label: string;
  /** CSS width, e.g. "96px" or "12%". Layout is fixed, so set widths on every column. */
  width?: string;
  align?: 'left' | 'right' | 'center';
  /** Set false for prose columns; everything else stays monospace. */
  mono?: boolean;
  /** Brighter, medium-weight cell — use for the row's identifying value. */
  emphasis?: boolean;
  /** Dimmer cell for secondary data. */
  muted?: boolean;
  sortable?: boolean;
  render?: (row: Row) => ReactNode;
}

/**
 * Dense monospace table — the live flow list and every tabular view.
 * @startingPoint section="Data" subtitle="Dense flow table with verdict rows" viewport="700x260"
 */
export interface DataTableProps<Row = any> {
  columns: Array<DataTableColumn<Row>>;
  rows: Row[];
  /** Field used as React key + selection identity. Default "id". */
  rowKey?: string;
  /** 26px rows instead of 30px — for 40+ visible rows. */
  dense?: boolean;
  selectedKey?: string | number;
  onRowClick?: (row: Row) => void;
  /** Return "alert" for malicious rows, "warn" for low confidence. Drives the 2px left edge. */
  rowTone?: (row: Row) => 'alert' | 'warn' | undefined;
  stickyHeader?: boolean;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyLabel?: string;
  /** Fade newly appended rows in (rows flagged with isNew). */
  animateNew?: boolean;
  style?: CSSProperties;
}

export declare function DataTable<Row = any>(props: DataTableProps<Row>): JSX.Element;
