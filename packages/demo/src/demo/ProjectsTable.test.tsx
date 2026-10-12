import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'
import { projects } from './data'
import { ProjectsTable } from './ProjectsTable'

/**
 * These tests drive the composed table the way a keyboard / screen-reader user
 * would: through focus, key presses and the accessibility tree. They avoid
 * class names and DOM structure on purpose.
 */

function setup() {
  const user = userEvent.setup()
  const utils = render(<ProjectsTable data={projects} />)
  const grid = screen.getByRole('grid', { name: 'Projects' })
  return { user, grid, ...utils }
}

function rowHeaders(grid: HTMLElement) {
  return within(grid)
    .getAllByRole('rowheader')
    .map((el) => el.textContent)
}

function header(grid: HTMLElement, name: RegExp | string) {
  return within(grid).getByRole('columnheader', { name })
}

describe('ProjectsTable — structure', () => {
  it('renders one body row per project with an accessible name per row', () => {
    const { grid } = setup()
    expect(rowHeaders(grid)).toHaveLength(projects.length)
    // Rows are named by their row header cell, so screen readers announce the project name.
    expect(within(grid).getByRole('row', { name: /Atlas migration/ })).toBeInTheDocument()
  })

  it('starts sorted by project name, ascending', () => {
    const { grid } = setup()
    expect(header(grid, /^Project/)).toHaveAttribute('aria-sort', 'ascending')
    const names = rowHeaders(grid)
    expect(names).toEqual([...names].sort((a, b) => a!.localeCompare(b!)))
  })
})

describe('ProjectsTable — keyboard navigation', () => {
  it('Tab lands on the first row; arrows move between cells, rows and the header', async () => {
    const { user, grid } = setup()
    await user.tab()
    const firstRow = within(grid).getAllByRole('row')[1]
    expect(firstRow).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toHaveAccessibleName(/^Expand details for/)

    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toHaveAttribute('role', 'rowheader')

    await user.keyboard('{ArrowUp}')
    expect(document.activeElement).toHaveAttribute('role', 'columnheader')
  })
})

describe('ProjectsTable — sorting', () => {
  it('toggles sort with Enter on a plain sortable header', async () => {
    const { user, grid } = setup()
    const projectHeader = header(grid, /^Project/)
    await user.tab()
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowUp}') // onto the Project header
    expect(projectHeader).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(projectHeader).toHaveAttribute('aria-sort', 'descending')
    const names = rowHeaders(grid)
    expect(names).toEqual([...names].sort((a, b) => b!.localeCompare(a!)))
  })

  it('exposes a keyboard-reachable sort button on headers that also carry a filter', async () => {
    const { user, grid } = setup()
    const ownerHeader = header(grid, /Owner/)
    const sortButton = within(ownerHeader).getByRole('button', { name: 'Sort by Owner' })

    await user.tab()
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowUp}{ArrowRight}')
    expect(sortButton).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(ownerHeader).toHaveAttribute('aria-sort', 'ascending')
    await user.keyboard('{Enter}')
    expect(ownerHeader).toHaveAttribute('aria-sort', 'descending')
  })

  it('sorts by clicking a header with the mouse', async () => {
    const { user, grid } = setup()
    const budget = header(grid, /Budget/)
    await user.click(budget)
    expect(budget).toHaveAttribute('aria-sort', 'ascending')
    const names = rowHeaders(grid)
    // Cheapest first; the project with no budget must be last.
    expect(names[0]).toBe('Incident runbooks')
    expect(names.at(-1)).toBe('Audit log retention')

    await user.click(budget)
    expect(budget).toHaveAttribute('aria-sort', 'descending')
    // Descending still keeps the unset budget last.
    expect(rowHeaders(grid).at(-1)).toBe('Audit log retention')
  })
})

describe('ProjectsTable — column filtering', () => {
  it('filters with keyboard only, announces the count, and restores focus on close', async () => {
    const { user, grid } = setup()
    const trigger = within(header(grid, /Status/)).getByRole('button', { name: /^Filter status/ })

    await user.tab()
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowUp}') // Project header
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}') // to Filter status
    expect(trigger).toHaveFocus()

    await user.keyboard('{Enter}')
    const dialog = await screen.findByRole('dialog', { name: 'Filter by status' })
    expect(dialog).toBeInTheDocument()

    // Focus moves into the dialog and is trapped there: search box first, then the options.
    expect(dialog).toHaveFocus()
    await user.tab()
    expect(within(dialog).getByRole('searchbox')).toHaveFocus()
    await user.tab()
    const blocked = within(dialog).getByRole('checkbox', { name: 'Blocked' })
    expect(blocked).toHaveFocus()
    await user.keyboard(' ')
    expect(blocked).toBeChecked()
    // The live status line updates immediately.
    expect(screen.getByText(/Showing 2 of 10 projects \(1 column filter active\)/)).toBeInTheDocument()

    // While the popover is open, React Aria hides the rest of the page from assistive tech
    // (aria-hidden), so the grid is only queryable again once it closes.
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(trigger).toHaveAccessibleName('Filter status, 1 selected')
    expect(rowHeaders(grid)).toEqual(['Billing reconciliation', 'Cost dashboard'])
  })

  it('ANDs filters across columns and shows an empty state when nothing matches', async () => {
    const { user, grid } = setup()
    await user.click(screen.getByRole('button', { name: /^Filter owner/ }))
    await user.click(await screen.findByRole('checkbox', { name: 'Priya Raman' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(rowHeaders(grid)).toEqual(['Atlas migration', 'Mobile onboarding'])

    await user.click(screen.getByRole('button', { name: /^Filter team/ }))
    await user.click(await screen.findByRole('checkbox', { name: 'Security' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    expect(within(grid).queryByRole('row', { name: /Atlas migration/ })).toBeNull()
    expect(screen.getByText('No projects match the current filters.')).toBeInTheDocument()
    expect(screen.getByText(/Showing 0 of 10 projects \(2 column filters active\)/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear all filters' }))
    expect(rowHeaders(grid)).toHaveLength(projects.length)
  })

  it('narrows options with the search box inside the popover', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: /^Filter owner/ }))
    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByRole('searchbox'), 'tan')
    expect(within(dialog).getAllByRole('checkbox')).toHaveLength(1)
    expect(within(dialog).getByRole('checkbox', { name: 'Aiko Tanaka' })).toBeInTheDocument()
  })
})

describe('ProjectsTable — expandable rows', () => {
  it('expands and collapses a detail row from the keyboard with correct ARIA wiring', async () => {
    const { user, grid } = setup()
    await user.tab()
    await user.keyboard('{ArrowRight}')
    const toggle = document.activeElement as HTMLElement
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).not.toHaveAttribute('aria-controls')

    await user.keyboard('{Enter}')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const controlsId = toggle.getAttribute('aria-controls')!
    const detail = document.getElementById(controlsId)!
    expect(detail).toBeInTheDocument()
    expect(within(detail).getByText(/Milestones \(3\/3 complete\)/)).toBeInTheDocument()
    expect(within(grid).getAllByRole('row')).toHaveLength(1 + projects.length + 1)

    // Focus stays on the toggle after the row list re-renders.
    expect(toggle).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById(controlsId)).toBeNull()
  })

  it('keeps expansion state across re-sorts', async () => {
    const { user, grid } = setup()
    await user.click(screen.getByRole('button', { name: 'Expand details for Atlas migration' }))
    await user.click(header(grid, /^Project/)) // flip to descending
    expect(screen.getByRole('button', { name: 'Collapse details for Atlas migration' })).toBeInTheDocument()
    expect(within(grid).getAllByRole('row')).toHaveLength(1 + projects.length + 1)
  })
})

describe('ProjectsTable — automated accessibility audit', () => {
  it('has no axe violations in the default and expanded/filtered states', async () => {
    const { user, container } = setup()
    const run = () =>
      axe.run(container, {
        // jsdom has no layout engine and no stylesheet, so contrast can't be computed here.
        rules: { 'color-contrast': { enabled: false } },
      })

    expect((await run()).violations).toEqual([])

    await user.click(screen.getByRole('button', { name: 'Expand details for Atlas migration' }))
    await user.click(screen.getByRole('button', { name: /^Filter status/ }))
    await screen.findByRole('dialog')
    expect((await run()).violations).toEqual([])
  })
})
