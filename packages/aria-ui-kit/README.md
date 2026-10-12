# @burntlotuslabs/aria-ui-kit

Accessible React components built on [`react-aria-components`](https://react-spectrum.adobe.com/react-aria/):
form fields, overlays, tabs, toasts, a sortable/filterable/expandable table, and runtime-swappable
themes driven by CSS variables.

```
pnpm add @burntlotuslabs/aria-ui-kit react react-dom react-aria-components
```

```tsx
import '@burntlotuslabs/aria-ui-kit/styles.css'
import { ThemeModeProvider, ThemeProvider, themes, Button } from '@burntlotuslabs/aria-ui-kit'

;<ThemeModeProvider>
  <ThemeProvider theme={themes[0]}>
    <Button>Save</Button>
  </ThemeProvider>
</ThemeModeProvider>
```

Tailwind v4 apps can import `@burntlotuslabs/aria-ui-kit/tokens.css` after `@import "tailwindcss"` to
use the kit's semantic utilities (`bg-surface`, `text-fg`, …) in their own markup.

## Server rendering (Next.js, Remix, …)

The components render on the server and hydrate cleanly. To avoid a flash of light mode (and of the default
brand) for users who chose dark, render `ThemeScript` once in `<head>`, with the same `theme`, `storageKey`
and `defaultPreference` you give the providers, and mark `<html>` with `suppressHydrationWarning`, because the
script edits its class and style before React hydrates:

```tsx
// app/layout.tsx
import { ThemeScript } from '@burntlotuslabs/aria-ui-kit'
import { myBrand } from './theme'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript theme={myBrand} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

Without it everything still works; the stored mode is just applied right after hydration instead of before
first paint. `ThemeScript` accepts a CSP `nonce`.

Full documentation, theming guide, screenshots and design notes: see the repository README.

MIT
