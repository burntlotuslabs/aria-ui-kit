/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Alias the package to the library source so the demo, Storybook and tests run without a prior
// `build:library` and get HMR on library edits. `pnpm build` still builds the library first.
const alias = {
  '@burntlotuslabs/aria-ui-kit/tokens.css': fileURLToPath(
    new URL('../aria-ui-kit/src/theme/tokens.css', import.meta.url),
  ),
  '@burntlotuslabs/aria-ui-kit': fileURLToPath(new URL('../aria-ui-kit/src/index.ts', import.meta.url)),
}

// The library's entry imports its own index.css so the library build can emit styles.css. The demo
// compiles Tailwind itself (scanning the library sources via @source), so importing that CSS a second
// time would add a duplicate utilities layer and break responsive variants (a later `.hidden` beats
// `md:block`). Swallow that one import.
const skipLibraryCss = {
  name: 'skip-library-css',
  enforce: 'pre' as const,
  resolveId(id: string, importer?: string) {
    if (id === './index.css' && importer?.includes('/aria-ui-kit/src/index.ts')) return '\0skip-library-css'
  },
  load(id: string) {
    if (id === '\0skip-library-css') return ''
  },
}

export default defineConfig({
  plugins: [skipLibraryCss, react(), tailwindcss()],
  resolve: { alias },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          css: false,
        },
      },
      {
        // Every story runs as a test in real Chromium: play functions plus the a11y addon's
        // axe checks (including color contrast, which jsdom cannot compute).
        extends: true,
        plugins: [storybookTest({ configDir: fileURLToPath(new URL('./.storybook', import.meta.url)) })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
