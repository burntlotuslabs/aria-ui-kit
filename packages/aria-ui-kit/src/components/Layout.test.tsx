import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { AppShell, Cluster, Container, Grid, Stack } from './Layout'

function Shell(props: Partial<React.ComponentProps<typeof AppShell>> = {}) {
  return (
    <AppShell
      header={<span>Brand</span>}
      sidebar={
        <nav aria-label="Primary">
          <a href="/one">One</a>
        </nav>
      }
      footer={<p>Footer text</p>}
      {...props}
    >
      <h1>Page title</h1>
    </AppShell>
  )
}

describe('AppShell', () => {
  it('exposes banner, main and contentinfo landmarks and passes axe', async () => {
    const { container } = render(<Shell />)
    expect(screen.getByRole('banner')).toHaveTextContent('Brand')
    expect(screen.getByRole('main')).toHaveTextContent('Page title')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Footer text')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    await expectNoAxeViolations(container)
  })

  it('makes the skip link the first tab stop and moves focus into main when activated', async () => {
    const user = userEvent.setup()
    render(<Shell />)
    await user.tab()
    const skip = screen.getByRole('link', { name: 'Skip to main content' })
    expect(skip).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('honors a custom main id and skip link label', async () => {
    const user = userEvent.setup()
    render(<Shell mainId="content" skipLinkLabel="Jump to content" />)
    await user.tab()
    expect(screen.getByRole('link', { name: 'Jump to content' })).toHaveAttribute('href', '#content')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'content')
  })

  it('opens the menu drawer, traps it as a named dialog, closes on Escape and restores focus', async () => {
    const user = userEvent.setup()
    render(<Shell sidebarLabel="Site menu" />)
    const menuButton = screen.getByRole('button', { name: 'Open menu' })
    await user.click(menuButton)
    const dialog = await screen.findByRole('dialog', { name: 'Site menu' })
    expect(within(dialog).getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(dialog).not.toBeInTheDocument())
    await waitFor(() => expect(menuButton).toHaveFocus())
  })

  it('closes the drawer from the sidebar render function (e.g. after choosing a link)', async () => {
    const user = userEvent.setup()
    render(
      <Shell
        sidebar={({ close }) => (
          <nav aria-label="Primary">
            <button type="button" onClick={close}>
              Go
            </button>
          </nav>
        )}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Go' }))
    await waitFor(() => expect(dialog).not.toBeInTheDocument())
  })

  it('renders no menu button, sidebar or footer when they are not provided', () => {
    render(
      <AppShell header="Brand">
        <p>Body</p>
      </AppShell>,
    )
    expect(screen.queryByRole('button', { name: 'Open menu' })).not.toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })
})

describe('layout primitives', () => {
  it('Container, Stack, Cluster and Grid render children with their layout classes', () => {
    const { container } = render(
      <Container size="sm">
        <Stack gap={6}>
          <Cluster justify="between" gap={3}>
            <span>a</span>
          </Cluster>
          <Grid min="12rem" gap={2}>
            <span>b</span>
          </Grid>
        </Stack>
      </Container>,
    )
    expect(container.querySelector('.max-w-2xl')).toBeInTheDocument()
    expect(container.querySelector('.flex-col.gap-6')).toBeInTheDocument()
    expect(container.querySelector('.justify-between.gap-3')).toBeInTheDocument()
    const grid = container.querySelector('.grid') as HTMLElement
    expect(grid.style.gridTemplateColumns).toContain('minmax(min(12rem, 100%), 1fr)')
  })
})
