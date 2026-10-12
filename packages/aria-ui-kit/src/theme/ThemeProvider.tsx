import { createContext, useContext } from 'react'
import { useThemeMode } from './ThemeModeProvider'
import { defaultTheme } from './themes'
import type { ThemeConfig, TokenOverrides } from './types'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

const ThemeContext = createContext<ThemeConfig>(defaultTheme)

export interface ThemeProviderProps {
  theme?: ThemeConfig
  children: React.ReactNode
}

/**
 * Applies a brand theme at runtime by writing its token overrides for the current mode onto
 * <html> as inline custom properties. Inline beats the stylesheet defaults in tokens.css, so
 * the override wins without any build step, and swapping `theme` swaps the whole UI.
 *
 * Must sit inside ThemeModeProvider (it needs the resolved mode to pick light vs dark values).
 */
export function ThemeProvider({ theme = defaultTheme, children }: ThemeProviderProps) {
  const { mode } = useThemeMode()

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement
    const overrides: TokenOverrides = theme[mode]
    // Clear anything a previous theme wrote, then apply this one.
    for (const name of Array.from(root.style)) {
      if (name.startsWith('--ui-')) root.style.removeProperty(name)
    }
    for (const [name, value] of Object.entries(overrides)) {
      if (value) root.style.setProperty(`--ui-${name}`, value)
    }
    root.dataset.theme = theme.id
  }, [theme, mode])

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeConfig {
  return useContext(ThemeContext)
}
