/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Library build: ESM + CJS bundles, one index.d.ts, one extracted styles.css.
// Peer deps are external so consumers share a single React / react-aria-components.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.*', 'src/test'],
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      cssFileName: 'styles',
    },
    sourcemap: true,
    rollupOptions: {
      // Next app-router hosts need the directive on the bundle entry; other hosts ignore it.
      output: { banner: "'use client'" },
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^react-aria-components($|\/)/, 'react/jsx-runtime'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.*', 'src/test/**', 'src/index.ts'],
      thresholds: { lines: 80, statements: 80 },
    },
  },
})
