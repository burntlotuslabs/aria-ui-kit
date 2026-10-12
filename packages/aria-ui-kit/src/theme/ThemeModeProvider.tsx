import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ThemeMode, ThemePreference } from './types'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

export interface ThemeModeContextValue {
  /** Resolved mode: what is actually applied right now. */
  mode: ThemeMode
  /** The user's stored preference, which may be 'system'. */
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
  /** Flip between light and dark (leaves 'system' behind). */
  toggleMode: () => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

export interface ThemeModeProviderProps {
  children: React.ReactNode
  /** Used when nothing is stored. Defaults to 'system'. */
  defaultPreference?: ThemePreference
  /** localStorage key. Defaults to 'ui-theme-mode'. */
  storageKey?: string
}

const MEDIA = '(prefers-color-scheme: dark)'

function readStored(key: string): ThemePreference | null {
  try {
    const v = localStorage.getItem(key)
    return v === 'light' || v === 'dark' || v === 'system' ? v : null
  } catch {
    return null
  }
}

function systemMode(): ThemeMode {
  return typeof window !== 'undefined' && window.matchMedia?.(MEDIA).matches ? 'dark' : 'light'
}

/**
 * Owns light/dark state. Applies `.dark` / `.light` to <html> (tokens.css keys off `.dark`),
 * persists the preference, and follows the OS setting while preference is 'system'.
 * On server-rendered pages also render <ThemeScript /> in <head> so the first paint is already correct.
 */
export function ThemeModeProvider({
  children,
  defaultPreference = 'system',
  storageKey = 'ui-theme-mode',
}: ThemeModeProviderProps) {
  // Both start from values the server can also produce, so hydration matches; the layout effect below
  // swaps in the stored preference and the OS setting before the browser paints.
  const [preference, setPreferenceState] = useState<ThemePreference>(defaultPreference)
  const [system, setSystem] = useState<ThemeMode>('light')

  useIsomorphicLayoutEffect(() => {
    setPreferenceState(readStored(storageKey) ?? defaultPreference)
    setSystem(systemMode())
  }, [storageKey, defaultPreference])

  useEffect(() => {
    const mq = window.matchMedia?.(MEDIA)
    if (!mq) return
    const onChange = (e: MediaQueryListEvent) => setSystem(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const mode: ThemeMode = preference === 'system' ? system : preference

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    root.classList.toggle('light', mode === 'light')
  }, [mode])

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next)
      try {
        localStorage.setItem(storageKey, next)
      } catch {
        /* storage unavailable (private mode, SSR); in-memory state still works */
      }
    },
    [storageKey],
  )

  const toggleMode = useCallback(
    () => setPreference(mode === 'dark' ? 'light' : 'dark'),
    [mode, setPreference],
  )

  const value = useMemo(
    () => ({ mode, preference, setPreference, toggleMode }),
    [mode, preference, setPreference, toggleMode],
  )
  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) throw new Error('useThemeMode must be used inside <ThemeModeProvider>')
  return ctx
}
