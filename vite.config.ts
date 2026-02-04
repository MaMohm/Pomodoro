/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative base for GitHub Pages compatibility
  // @ts-expect-error - Vitest types are not automatically picked up by Vite's defineConfig in all envs
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'], // We will create this next
  },
});
