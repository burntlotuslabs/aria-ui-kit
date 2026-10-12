import { bukuliciousTheme, ThemeScript } from '@burntlotuslabs/aria-ui-kit'
import '@burntlotuslabs/aria-ui-kit/styles.css'
import type { ReactNode } from 'react'

export const metadata = { title: 'aria-ui-kit Next smoke test' }

// Server component: the kit's providers are client components ('use client' banner on the bundle),
// so they can be imported from here and rendered below without a wrapper file.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: ThemeScript edits <html> (class, style, data-theme) before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript theme={bukuliciousTheme} />
      </head>
      <body className="bg-canvas text-fg">{children}</body>
    </html>
  )
}
