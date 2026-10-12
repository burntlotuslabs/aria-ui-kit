import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { themes } from './themes'
import type { TokenName, TokenOverrides } from './types'

/**
 * WCAG 2.x contrast for every theme × mode. This is the guardrail that lets a brand theme be
 * "just an object": if someone picks a cyan that can't carry white text, this fails.
 */

function parseCssBlock(css: string, selector: string): TokenOverrides {
  const block = css.split(`${selector} {`)[1].split('}')[0]
  const out: Record<string, string> = {}
  for (const m of block.matchAll(/--ui-([a-z0-9-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim()
  return out as TokenOverrides
}

const css = readFileSync(resolve(process.cwd(), 'src/theme/tokens.css'), 'utf8')
const base = { light: parseCssBlock(css, ':root'), dark: parseCssBlock(css, '.dark') }

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h,
    16,
  )
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function contrast(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

/** [foreground, background, minimum ratio]. 4.5 = AA normal text, 3 = AA large text / UI components. */
const pairs: Array<[TokenName, TokenName, number]> = [
  ['fg', 'canvas', 4.5],
  ['fg', 'surface', 4.5],
  ['fg', 'surface-2', 4.5],
  ['fg', 'surface-3', 4.5],
  ['fg-muted', 'surface', 4.5],
  ['fg-muted', 'surface-2', 4.5],
  ['fg-muted', 'canvas', 4.5],
  // fg-subtle is placeholder text, so it needs full AA, not the 3:1 allowed for decoration.
  ['fg-subtle', 'surface', 4.5],
  ['fg-subtle', 'surface-2', 4.5],
  ['fg-subtle', 'canvas', 4.5],
  ['accent-fg', 'accent', 4.5],
  ['accent-fg', 'accent-hover', 4.5],
  ['accent', 'surface', 4.5], // used as text: links, selected tab
  ['accent', 'canvas', 4.5],
  ['accent-soft-fg', 'accent-soft', 4.5],
  ['danger-fg', 'danger', 4.5],
  ['danger', 'surface', 3], // fill / border only
  ['danger-text', 'surface', 4.5],
  ['danger-text', 'canvas', 4.5],
  ['danger-soft-fg', 'danger-soft', 4.5],
  ['success-soft-fg', 'success-soft', 4.5],
  ['warning-soft-fg', 'warning-soft', 4.5],
  ['info-soft-fg', 'info-soft', 4.5],
  ['tooltip-fg', 'tooltip', 4.5],
  ['edge-strong', 'surface', 3],
  ['focus', 'surface', 3],
]

describe.each(themes)('theme "$id"', (theme) => {
  for (const mode of ['light', 'dark'] as const) {
    const tokens = { ...base[mode], ...theme[mode] }
    it(`${mode} mode meets WCAG AA on every text/background pair`, () => {
      const failures = pairs
        .map(([fg, bg, min]) => ({ fg, bg, min, ratio: contrast(tokens[fg]!, tokens[bg]!) }))
        .filter((p) => p.ratio < p.min)
        .map((p) => `${p.fg} on ${p.bg}: ${p.ratio.toFixed(2)} < ${p.min}`)
      expect(failures).toEqual([])
    })
  }
})
