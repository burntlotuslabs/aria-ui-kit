/**
 * A theme is a set of overrides for the semantic variables in tokens.css, one set per mode.
 * Every key is optional: a brand theme usually only overrides accent + surfaces and inherits
 * the rest. Keys are the variable names without the `--ui-` prefix.
 */
export type ThemeMode = 'light' | 'dark'
export type ThemePreference = ThemeMode | 'system'

export type TokenName =
  | 'canvas'
  | 'surface'
  | 'surface-2'
  | 'surface-3'
  | 'edge'
  | 'edge-strong'
  | 'fg'
  | 'fg-muted'
  | 'fg-subtle'
  | 'accent'
  | 'accent-hover'
  | 'accent-fg'
  | 'accent-soft'
  | 'accent-soft-fg'
  | 'danger'
  | 'danger-hover'
  | 'danger-fg'
  | 'danger-text'
  | 'danger-soft'
  | 'danger-soft-fg'
  | 'success-soft'
  | 'success-soft-fg'
  | 'warning-soft'
  | 'warning-soft-fg'
  | 'info-soft'
  | 'info-soft-fg'
  | 'focus'
  | 'scrim'
  | 'tooltip'
  | 'tooltip-fg'

export type TokenOverrides = Partial<Record<TokenName, string>>

export interface ThemeConfig {
  /** Stable id, also written to `data-theme` on the root element. */
  id: string
  /** Human-readable name for pickers. */
  name: string
  light: TokenOverrides
  dark: TokenOverrides
}
