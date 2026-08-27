import { defineConfig } from 'vitest/config';

// Vitest for the backend unit suite. reflect-metadata is loaded first (as NestJS expects
// at runtime); the transformer handles the provider decorators natively.
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['reflect-metadata'],
    include: ['src/**/*.test.ts'],
  },
});
