import type { ThemeConfig } from './types'

/**
 * Built-in themes. "default" is the neutral kit look and overrides nothing: tokens.css *is*
 * that theme. The other two are brand themes expressed purely as token overrides, which is
 * the whole point: a consuming app writes one object like these and ships it.
 */

export const defaultTheme: ThemeConfig = {
  id: 'default',
  name: 'Default',
  light: {},
  dark: {},
}

/**
 * Personal brand: cyan primary, pink/purple secondary, deep blue-black surfaces.
 * The brand cyan (#3BA5D5) and pink (#E4198D) both fail WCAG AA when white text sits on
 * them, so: dark mode keeps the true cyan as the accent with *dark* text on it, light mode
 * uses a deeper cyan, and the pink is nudged darker wherever it carries white text. The
 * contrast test in contrast.test.ts is what caught each of these.
 */
export const bukuliciousTheme: ThemeConfig = {
  id: 'bukulicious',
  name: 'Bukulicious',
  light: {
    canvas: '#f3f7fb',
    surface: '#ffffff',
    'surface-2': '#e9f1f8',
    'surface-3': '#d5e4f0',
    edge: '#c3d3e2',
    'edge-strong': '#5f7a94',
    fg: '#0f1419',
    'fg-muted': '#46596b',
    'fg-subtle': '#516e89',
    accent: '#1b73a1',
    'accent-hover': '#2f60ab',
    'accent-fg': '#ffffff',
    'accent-soft': '#d9eef8',
    'accent-soft-fg': '#134f6f',
    danger: '#c8127a',
    'danger-hover': '#a93097',
    'danger-fg': '#ffffff',
    'danger-text': '#b0106b',
    'danger-soft': '#fbe0ef',
    'danger-soft-fg': '#7a0f4b',
    focus: '#1b73a1',
    tooltip: '#0f1419',
    'tooltip-fg': '#ffffff',
  },
  dark: {
    canvas: '#0f1419',
    surface: '#1a1f2e',
    'surface-2': '#252b3b',
    'surface-3': '#2d3548',
    edge: '#3a4556',
    'edge-strong': '#7585a0',
    fg: '#eef2f7',
    'fg-muted': '#aab6c8',
    'fg-subtle': '#8894aa',
    accent: '#3ba5d5',
    'accent-hover': '#5fbde5',
    'accent-fg': '#0f1419',
    'accent-soft': '#173a4f',
    'accent-soft-fg': '#8fd3f2',
    danger: '#d0157f',
    'danger-hover': '#e4198d',
    'danger-fg': '#ffffff',
    'danger-text': '#f57ec0',
    'danger-soft': '#4a1236',
    'danger-soft-fg': '#f9b3d9',
    focus: '#3ba5d5',
    scrim: 'rgb(0 0 0 / 0.7)',
    tooltip: '#eef2f7',
    'tooltip-fg': '#0f1419',
  },
}

/** Event-suite "Fire" variant: orange/red on near-black. */
export const fireTheme: ThemeConfig = {
  id: 'fire',
  name: 'Fire',
  light: {
    canvas: '#fbf6f1',
    surface: '#ffffff',
    'surface-2': '#f7ebe1',
    'surface-3': '#efd9c6',
    edge: '#e2c9b4',
    'edge-strong': '#8f6d52',
    fg: '#231f20',
    'fg-muted': '#5e4d44',
    'fg-subtle': '#7b6656',
    accent: '#c41a20',
    'accent-hover': '#b52300',
    'accent-fg': '#ffffff',
    'accent-soft': '#fde3d4',
    'accent-soft-fg': '#8a1a00',
    danger: '#b52300',
    'danger-hover': '#8a1a00',
    'danger-fg': '#ffffff',
    'danger-text': '#a82000',
    focus: '#ed1c24',
    tooltip: '#231f20',
    'tooltip-fg': '#ffffff',
  },
  dark: {
    canvas: '#000000',
    surface: '#1a1716',
    'surface-2': '#242120',
    'surface-3': '#2d2927',
    edge: '#3d3634',
    'edge-strong': '#8a7a6e',
    fg: '#f5efe9',
    'fg-muted': '#c2b3a9',
    'fg-subtle': '#988679',
    accent: '#ffb200',
    'accent-hover': '#ffc53d',
    'accent-fg': '#231f20',
    'accent-soft': '#4a3300',
    'accent-soft-fg': '#ffd27a',
    danger: '#d9161d',
    'danger-hover': '#ed1c24',
    'danger-fg': '#ffffff',
    'danger-text': '#ff8a8e',
    'danger-soft': '#4b1113',
    'danger-soft-fg': '#ffb3b6',
    focus: '#ffb200',
    scrim: 'rgb(0 0 0 / 0.75)',
    tooltip: '#f5efe9',
    'tooltip-fg': '#231f20',
  },
}

export const themes: ThemeConfig[] = [defaultTheme, bukuliciousTheme, fireTheme]
