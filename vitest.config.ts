import { defineConfig } from 'vitest/config';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
  ],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // Tests live under `tests/`, mirroring the `src/` structure.
    include: ['tests/**/*.test.{ts,tsx}'],
    // 15s test timeout (default 5s is too tight when many parallel workers
    // load heavy module trees — userEvent + jsdom + Supabase deps).
    testTimeout: 15000,
    environmentMatchGlobs: [
      // All component / hook / route tests need jsdom for DOM APIs.
      ['tests/**/*.test.tsx', 'jsdom'],
      ['tests/**/*.test.ts', 'jsdom'],
    ],
  },
});
