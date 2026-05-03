import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import netlify from '@netlify/vite-plugin-tanstack-start';
import { fileURLToPath, URL } from 'url';

import tailwindcss from '@tailwindcss/vite';

const config = defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    devtools(),
    netlify(),
    tanstackStart({
      // Tests live next to their target route file. Ignore them when
      // generating the route tree.
      router: {
        routeFileIgnorePattern: '\\.test\\.[tj]sx?$',
      },
    }),
    react(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
  ],
});

export default config;
