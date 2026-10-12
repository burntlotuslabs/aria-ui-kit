import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeModeProvider, useThemeMode } from './ThemeModeProvider'
import { ThemeProvider } from './ThemeProvider'
import { ThemeToggle } from './ThemeToggle'
import { bukuliciousTheme, defaultTheme } from './themes'

function mockMatchMedia(dark: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>()
  const mql = {
    matches: dark,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => listeners.delete(fn),
  }
  window.matchMedia = vi.fn().mockReturnValue(mql) as unknown as typeof window.matchMedia
  return {
    fire: (matches: boolean) => {
      for (const fn of listeners) fn({ matches } as MediaQueryListEvent)
    },
  }
}

function ModeProbe() {
  const { mode, preference } = useThemeMode()
  return <output>{`${mode}/${preference}`}</output>
}

beforeEach(() => localStorage.clear())
afterEach(() => {
  document.documentElement.className = ''
  document.documentElement.removeAttribute('style')
})

describe('ThemeModeProvider', () => {
  it('follows the OS preference by default and reacts to changes', () => {
    const media = mockMatchMedia(true)
    render(
      <ThemeModeProvider>
        <ModeProbe />
      </ThemeModeProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('dark/system')
    expect(document.documentElement).toHaveClass('dark')
    act(() => media.fire(false))
    expect(screen.getByRole('status')).toHaveTextContent('light/system')
    expect(document.documentElement).toHaveClass('light')
  })

  it('restores a stored preference over the OS setting', () => {
    mockMatchMedia(true)
    localStorage.setItem('ui-theme-mode', 'light')
    render(
      <ThemeModeProvider>
        <ModeProbe />
      </ThemeModeProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('light/light')
  })

  it('ThemeToggle flips the mode, persists it, and describes the action', async () => {
    mockMatchMedia(false)
    const user = userEvent.setup()
    render(
      <ThemeModeProvider>
        <ThemeToggle />
        <ModeProbe />
      </ThemeModeProvider>,
    )
    const btn = screen.getByRole('button', { name: 'Switch to dark mode' })
    await user.click(btn)
    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('ui-theme-mode')).toBe('dark')
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
  })
})

describe('ThemeProvider', () => {
  it('writes the active theme tokens for the current mode onto the root and clears old ones', () => {
    mockMatchMedia(false)
    const { rerender } = render(
      <ThemeModeProvider>
        <ThemeProvider theme={bukuliciousTheme}>
          <span>x</span>
        </ThemeProvider>
      </ThemeModeProvider>,
    )
    const root = document.documentElement
    expect(root.dataset.theme).toBe('bukulicious')
    expect(root.style.getPropertyValue('--ui-accent')).toBe(bukuliciousTheme.light.accent)

    rerender(
      <ThemeModeProvider>
        <ThemeProvider theme={defaultTheme}>
          <span>x</span>
        </ThemeProvider>
      </ThemeModeProvider>,
    )
    expect(root.dataset.theme).toBe('default')
    expect(root.style.getPropertyValue('--ui-accent')).toBe('')
  })
})
