import type { Decorator, Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import '../src/index.css'
import { ThemeModeProvider, ThemeProvider, themes, useThemeMode } from '@burntlotuslabs/aria-ui-kit'

function ModeSync({ mode }: { mode: 'light' | 'dark' }) {
  const { setPreference } = useThemeMode()
  useEffect(() => setPreference(mode), [mode, setPreference])
  return null
}

// Stories that are page chrome (AppShell) set `parameters.bleed` so nothing surrounds them.
const withTheme: Decorator = (Story, ctx) => {
  const theme = themes.find((t) => t.id === ctx.globals.theme) ?? themes[0]
  return (
    <ThemeModeProvider storageKey="sb-theme-mode">
      <ThemeProvider theme={theme}>
        <ModeSync mode={ctx.globals.mode === 'dark' ? 'dark' : 'light'} />
        <div className={`min-h-screen bg-canvas text-fg${ctx.parameters.bleed ? '' : ' p-6'}`}>
          <Story />
        </div>
      </ThemeProvider>
    </ThemeModeProvider>
  )
}

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
  globalTypes: {
    mode: {
      description: 'Light or dark mode',
      toolbar: { title: 'Mode', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
    theme: {
      description: 'Brand theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: themes.map((t) => ({ value: t.id, title: t.name })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { mode: 'light', theme: 'default' },
  decorators: [withTheme],
}

export default preview
