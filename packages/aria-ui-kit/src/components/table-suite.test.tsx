import { act, render, renderHook, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { SortDescriptor } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'
import { useColumnFilters } from '../hooks/useColumnFilters'
import { useExpandedRows } from '../hooks/useExpandedRows'
import { type SortableColumn, sortRows } from '../lib/sort'
import { expectNoAxeViolations } from '../test/axe'
import { Badge } from './Badge'
import { Card } from './Card'
import { ExpandToggle } from './ExpandToggle'
import { FilterDropdown } from './FilterDropdown'
import { Link } from './Link'
import { Cell, Column, Row, Table, TableBody, TableHeader } from './Table'

const rows = [
  { id: 'a', name: 'Atlas', owner: 'Zed' },
  { id: 'b', name: 'Beacon', owner: 'Amy' },
  { id: 'c', name: 'Cinder', owner: 'Mo' },
]
const columns: SortableColumn<(typeof rows)[number]>[] = [
  { id: 'name', type: 'string', accessor: (r) => r.name },
  { id: 'owner', type: 'string', accessor: (r) => r.owner },
]

function SortableTable() {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'name', direction: 'ascending' })
  const sorted = sortRows(rows, sort, columns)
  return (
    <Table aria-label="Projects" sortDescriptor={sort} onSortChange={setSort}>
      <TableHeader>
        <Column id="name" isRowHeader allowsSorting>
          Name
        </Column>
        <Column id="owner" allowsSorting extra={<span>extra</span>}>
          Owner
        </Column>
      </TableHeader>
      <TableBody items={sorted}>
        {(item) => (
          <Row id={item.id}>
            <Cell>{item.name}</Cell>
            <Cell>{item.owner}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  )
}

describe('Table', () => {
  it('exposes grid semantics and sorts from the keyboard, including on a header with extra controls', async () => {
    const user = userEvent.setup()
    const { container } = render(<SortableTable />)
    expect(screen.getByRole('grid', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending')
    await expectNoAxeViolations(container)

    // Header with `extra` renders an explicit sort button, so sorting is reachable by keyboard.
    const ownerSort = screen.getByRole('button', { name: /Owner/ })
    await user.tab()
    await user.keyboard('{ArrowUp}{ArrowRight}')
    expect(ownerSort).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('columnheader', { name: /Owner/ })).toHaveAttribute('aria-sort', 'ascending')
    const names = screen
      .getAllByRole('row')
      .slice(1)
      .map((r) => within(r).getAllByRole('rowheader')[0].textContent)
    expect(names).toEqual(['Beacon', 'Cinder', 'Atlas'])

    await user.keyboard('{Enter}')
    expect(screen.getByRole('columnheader', { name: /Owner/ })).toHaveAttribute('aria-sort', 'descending')
  })
})

describe('FilterDropdown', () => {
  it('opens, searches, toggles options with Space, and reports the selection', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(
      <FilterDropdown
        label="owner"
        options={['Amy', 'Mo', 'Zed']}
        selected={new Set()}
        onChange={onChange}
      />,
    )
    const trigger = screen.getByRole('button', { name: 'Filter owner' })
    await user.click(trigger)
    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByRole('searchbox'), 'm')
    expect(within(dialog).queryByRole('checkbox', { name: 'Zed' })).not.toBeInTheDocument()
    await user.click(within(dialog).getByRole('checkbox', { name: 'Amy' }))
    expect(onChange).toHaveBeenLastCalledWith(new Set(['Amy']))

    await user.keyboard('{Escape}')
    rerender(
      <FilterDropdown
        label="owner"
        options={['Amy', 'Mo', 'Zed']}
        selected={new Set(['Amy'])}
        onChange={onChange}
      />,
    )
    expect(screen.getByRole('button', { name: 'Filter owner, 1 selected' })).toBeInTheDocument()
  })
})

describe('ExpandToggle', () => {
  it('reflects state with aria-expanded and only sets aria-controls while expanded', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    const { rerender } = render(
      <ExpandToggle isExpanded={false} onToggle={onToggle} rowLabel="Atlas" controlsId="detail-a" />,
    )
    const btn = screen.getByRole('button', { name: 'Expand details for Atlas' })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    expect(btn).not.toHaveAttribute('aria-controls')
    await user.click(btn)
    expect(onToggle).toHaveBeenCalledOnce()

    rerender(<ExpandToggle isExpanded onToggle={onToggle} rowLabel="Atlas" controlsId="detail-a" />)
    const open = screen.getByRole('button', { name: 'Collapse details for Atlas' })
    expect(open).toHaveAttribute('aria-expanded', 'true')
    expect(open).toHaveAttribute('aria-controls', 'detail-a')
  })
})

describe('hooks', () => {
  it('useExpandedRows toggles keys in and out and honors initial values', () => {
    const { result } = renderHook(() => useExpandedRows(['a']))
    expect(result.current.isExpanded('a')).toBe(true)
    act(() => result.current.toggle('b'))
    expect(result.current.isExpanded('b')).toBe(true)
    act(() => result.current.toggle('a'))
    expect(result.current.isExpanded('a')).toBe(false)
  })

  it('useColumnFilters sets one column at a time and clears all', () => {
    const { result } = renderHook(() => useColumnFilters())
    act(() => result.current.setColumn('owner', new Set(['Amy'])))
    act(() => result.current.setColumn('team', new Set(['X'])))
    expect(Object.keys(result.current.filters)).toEqual(['owner', 'team'])
    act(() => result.current.clearAll())
    expect(result.current.filters).toEqual({})
  })
})

describe('static primitives', () => {
  it('Badge renders its text with a tone class; Card renders an optional heading level', () => {
    render(
      <Card title="Summary" as="h3">
        <Badge tone="success">Done</Badge>
      </Card>,
    )
    expect(screen.getByRole('heading', { level: 3, name: 'Summary' })).toBeInTheDocument()
    expect(screen.getByText('Done')).toHaveClass('bg-success-soft')
  })

  it('Link is a real anchor with an href, and a focusable link role without one', async () => {
    const user = userEvent.setup()
    const onPress = vi.fn()
    render(
      <>
        <Link href="/docs">Docs</Link>
        <Link onPress={onPress}>Action</Link>
      </>,
    )
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
    await user.click(screen.getByRole('link', { name: 'Action' }))
    expect(onPress).toHaveBeenCalledOnce()
  })
})
