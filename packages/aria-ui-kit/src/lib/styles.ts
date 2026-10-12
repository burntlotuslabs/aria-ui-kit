/** Shared class fragments so every primitive draws the same focus ring and field chrome. */
export const focusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas'

export const focusRingInset =
  'outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus'

export const fieldInput =
  'w-full rounded-md border border-edge bg-surface px-3 py-1.5 text-sm text-fg placeholder:text-fg-subtle ' +
  'outline-none focus:border-focus focus:ring-2 focus:ring-focus/40 ' +
  'data-[invalid]:border-danger data-[invalid]:focus:ring-danger/40 ' +
  'disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-fg-muted'

export const fieldLabel = 'text-sm font-medium text-fg'
export const fieldDescription = 'text-xs text-fg-muted'
export const fieldError = 'text-xs text-danger-text'
