import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Layer 0: serve a placeholder page proving the container is up. The live flow
// table, verdict stream, model switcher, and metrics (socket.io-client to the
// backend) arrive in K1/F2/F3; see architecture.md and design-handoff.md.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // reachable from outside the container
    port: 5173,
  },
});
