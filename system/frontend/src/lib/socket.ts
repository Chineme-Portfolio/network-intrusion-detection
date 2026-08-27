import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import type { FlowVerdictRow } from '../types';

// The socket layer is ONE module (code-standards.md Section 4): components render state,
// they never hold socket logic. The browser talks only to the backend (architecture.md).
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001';
const FLOW_VERDICT_EVENT = 'flow_verdict';
const MAX_ROWS = 500; // keep the newest N; the stream can be long, so the table stays light

export type StreamRow = FlowVerdictRow & { isNew?: boolean };

export interface StreamState {
  rows: StreamRow[];
  connected: boolean;
  total: number;
  malicious: number;
  modelId: string | null;
}

export function useFlowStream(): StreamState {
  const [rows, setRows] = useState<StreamRow[]>([]);
  const [connected, setConnected] = useState(false);
  const [counts, setCounts] = useState({ total: 0, malicious: 0 });
  const [modelId, setModelId] = useState<string | null>(null);
  const tally = useRef({ total: 0, malicious: 0 });

  useEffect(() => {
    const socket: Socket = io(BACKEND_URL, { transports: ['websocket', 'polling'] });
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on(FLOW_VERDICT_EVENT, (row: FlowVerdictRow) => {
      tally.current.total += 1;
      if (row.verdict === 'malicious') tally.current.malicious += 1;
      setCounts({ ...tally.current });
      setModelId(row.model_id);
      // Prepend the new row (it animates once, keyed by flow_id); cap the list length.
      setRows((prev) => {
        const next = [{ ...row, isNew: true }, ...prev];
        return next.length > MAX_ROWS ? next.slice(0, MAX_ROWS) : next;
      });
    });
    return () => {
      socket.close();
    };
  }, []);

  return { rows, connected, total: counts.total, malicious: counts.malicious, modelId };
}
