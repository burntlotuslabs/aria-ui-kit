import { act } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeModeProvider } from './ThemeModeProvider'
import { ThemeProvider } from './ThemeProvider'
import { ThemeScript } from './ThemeScript'
import { ThemeToggle } from './ThemeToggle'
import { bukuliciousTheme } from './themes'

function mockMatchMedia(dark: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: dark,
    media: '',
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as typeof window.matchMedia
}

/** Pulls the inline script out of the server-rendered markup and runs it, as the browser would while parsing <head>. */
function runScript(element: React.ReactElement) {
  const html = renderToString(element)
  const body = /<script[^>]*>([\s\S]*)<\/script>/.exec(html)?.[1]
  expect(body).toBeTruthy()
  // biome-ignore lint/security/noGlobalEval: executing the generated inline script is the point of the test
  window.eval(body as string)
  return html
}

beforeEach(() => localStorage.clear())
afterEach(() => {
  document.documentElement.className = ''
  document.documentElement.removeAttribute('style')
  document.documentElement.removeAttribute('data-theme')
  vi.restoreAllMocks()
})

describe('ThemeScript', () => {
  it('applies the stored mode and the brand tokens before React runs', () => {
    mockMatchMedia(false)
    localStorage.setItem('ui-theme-mode', 'dark')
    runScript(<ThemeScript theme={bukuliciousTheme} />)
    const root = document.documentElement
    expect(root).toHaveClass('dark')
    expect(root).not.toHaveClass('light')
    expect(root.dataset.theme).toBe(bukuliciousTheme.id)
    expect(root.style.getPropertyValue('--ui-accent')).toBe(bukuliciousTheme.dark.accent)
  })

  it('follows the OS setting when nothing is stored, and honours a custom key and default', () => {
    mockMatchMedia(true)
    runScript(<ThemeScript />)
    expect(document.documentElement).toHaveClass('dark')

    document.documentElement.className = ''
    mockMatchMedia(true)
    localStorage.setItem('custom-key', 'light')
    runScript(<ThemeScript storageKey="custom-key" />)
    expect(document.documentElement).toHaveClass('light')

    document.documentElement.className = ''
    localStorage.clear()
    runScript(<ThemeScript defaultPreference="light" storageKey="custom-key" />)
    expect(document.documentElement).toHaveClass('light')
  })

  it('does not set a brand when no theme is given, and survives unavailable storage', () => {
    mockMatchMedia(false)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    runScript(<ThemeScript />)
    expect(document.documentElement).toHaveClass('light')
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('escapes token values so they cannot close the script tag', () => {
    const html = renderToString(
      <ThemeScript theme={{ ...bukuliciousTheme, light: { accent: '</script><b>' } }} />,
    )
    expect(html.match(/<\/script>/g)).toHaveLength(1)
    expect(html).toContain('\\u003c/script>')
  })
})

describe('server rendering', () => {
  it('hydrates without mismatches when the stored mode differs from the server default', async () => {
    mockMatchMedia(true)
    localStorage.setItem('ui-theme-mode', 'dark')
    const tree = (
      <ThemeModeProvider>
        <ThemeProvider theme={bukuliciousTheme}>
          <ThemeToggle />
        </ThemeProvider>
      </ThemeModeProvider>
    )
    // The server has no storage and no matchMedia: it renders the defaults.
    const serverWindow = window
    const html = renderToString(tree)
    expect(html).toContain('Switch to dark mode')

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.append(container)
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    await act(async () => {
      hydrateRoot(container, tree)
    })
    expect(errors).not.toHaveBeenCalled()
    expect(serverWindow.document.documentElement).toHaveClass('dark')
    expect(container.querySelector('button')).toHaveAccessibleName('Switch to light mode')
    container.remove()
  })
})
