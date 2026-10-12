import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components'
import { cx } from '../lib/cx'
import { focusRing } from '../lib/styles'
import { Button } from './Button'

/*
 * Layout primitives (Container, Stack, Cluster, Grid) are plain, static markup: they carry no
 * interaction semantics, so they do not need React Aria. The app shell (skip link, landmarks,
 * mobile drawer) is where the accessibility work is, and the drawer is built from React Aria's
 * overlay pieces so focus trapping, focus restore and Escape come for free.
 */

export type Gap = 0 | 1 | 2 | 3 | 4 | 6 | 8

// Full class names so Tailwind's scanner sees them (no string-built utilities).
const gapClass: Record<Gap, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
}

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
}

/** Centered, width-capped content column with responsive side gutters. */
export function Container({ size = 'lg', className, ...props }: ContainerProps) {
  return <div {...props} className={cx('mx-auto w-full px-4 sm:px-6', containerSizes[size], className)} />
}

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap
}

/** Vertical rhythm: children laid out in a column with a consistent gap. */
export function Stack({ gap = 4, className, ...props }: StackProps) {
  return <div {...props} className={cx('flex flex-col', gapClass[gap], className)} />
}

export interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap
  justify?: 'start' | 'between' | 'end'
}

const justifyClass = { start: 'justify-start', between: 'justify-between', end: 'justify-end' }

/** Horizontal group that wraps: toolbars, button rows, tag lists. */
export function Cluster({ gap = 2, justify = 'start', className, ...props }: ClusterProps) {
  return (
    <div
      {...props}
      className={cx('flex flex-wrap items-center', gapClass[gap], justifyClass[justify], className)}
    />
  )
}

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap
  /** Minimum column width; as many columns as fit, each at least this wide. Any CSS length. */
  min?: string
}

/** Responsive card grid without breakpoints: columns appear as space allows. */
export function Grid({ gap = 4, min = '16rem', className, style, ...props }: GridProps) {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))`,
    ...style,
  }
  return <div {...props} style={gridStyle} className={cx('grid', gapClass[gap], className)} />
}

export interface SkipLinkProps {
  /** id of the element to move focus to. Defaults to the shell's main region. */
  targetId?: string
  children?: ReactNode
}

/**
 * First focusable element on the page, visible only while focused. Moves focus into the main
 * region explicitly (instead of relying on hash navigation) so it also works with routers,
 * `<base>` tags and hash-less setups.
 */
export function SkipLink({ targetId = 'main-content', children = 'Skip to main content' }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        const target = document.getElementById(targetId)
        if (!target) return
        e.preventDefault()
        target.focus()
      }}
      className={cx(
        'sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60]',
        'focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-fg',
        focusRing,
      )}
    >
      {children}
    </a>
  )
}

type SidebarContent = ReactNode | ((opts: { close?: () => void }) => ReactNode)

export interface AppShellProps {
  /** Header content: brand, top-level actions, theme toggle. Rendered inside the page's banner landmark. */
  header?: ReactNode
  /**
   * Navigation column. Pass a `<nav aria-label="...">`. From the `md` breakpoint it is a fixed column;
   * below it, it moves into a drawer opened from a menu button in the header. Use the function form
   * to close the drawer when a link is chosen.
   */
  sidebar?: SidebarContent
  /** Accessible name for the drawer dialog and the menu button's expanded content. */
  sidebarLabel?: string
  footer?: ReactNode
  /** id of the main region, the skip link's target. */
  mainId?: string
  skipLinkLabel?: string
  children: ReactNode
}

function renderSidebar(sidebar: SidebarContent, close?: () => void) {
  return typeof sidebar === 'function' ? sidebar({ close }) : sidebar
}

/**
 * Page chrome with the landmarks screen-reader users navigate by: banner (header), main,
 * contentinfo (footer), plus the consumer's `<nav>`. Includes a skip link and a responsive drawer.
 */
export function AppShell({
  header,
  sidebar,
  sidebarLabel = 'Main navigation',
  footer,
  mainId = 'main-content',
  skipLinkLabel,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-fg">
      <SkipLink targetId={mainId}>{skipLinkLabel}</SkipLink>
      <header className="sticky top-0 z-40 border-b border-edge bg-surface">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          {sidebar && (
            <DialogTrigger>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M2 4h12M2 8h12M2 12h12" />
                </svg>
              </Button>
              <ModalOverlay
                isDismissable
                className={cx(
                  'fixed inset-0 z-50 bg-scrim md:hidden',
                  'data-[entering]:animate-[fade-in_150ms_ease-out] data-[exiting]:animate-[fade-out_100ms_ease-in]',
                )}
              >
                <Modal className="fixed inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-surface shadow-xl outline-none">
                  <Dialog aria-label={sidebarLabel} className="flex flex-col gap-2 p-3 outline-none">
                    {({ close }) => (
                      <>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="icon" aria-label="Close menu" onPress={close}>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 16 16"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path d="M3 3l10 10M13 3L3 13" />
                            </svg>
                          </Button>
                        </div>
                        {renderSidebar(sidebar, close)}
                      </>
                    )}
                  </Dialog>
                </Modal>
              </ModalOverlay>
            </DialogTrigger>
          )}
          <div className="flex min-w-0 flex-1 items-center gap-3">{header}</div>
        </div>
      </header>
      <div className="flex flex-1">
        {sidebar && (
          <div className="hidden w-64 shrink-0 border-r border-edge bg-surface p-3 md:block">
            {renderSidebar(sidebar)}
          </div>
        )}
        <main id={mainId} tabIndex={-1} className="min-w-0 flex-1 outline-none">
          {children}
        </main>
      </div>
      {footer && (
        <footer className="border-t border-edge bg-surface px-4 py-4 text-sm text-fg-muted sm:px-6">
          {footer}
        </footer>
      )}
    </div>
  )
}
