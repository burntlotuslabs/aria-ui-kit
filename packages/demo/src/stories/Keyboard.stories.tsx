import {
  Cell,
  Column,
  Row,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableHeader,
} from '@burntlotuslabs/aria-ui-kit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

// These stories exist for their `play` functions: they pin down the keyboard behavior the README promises,
// in real Chromium where focus, scrolling and layout are real (jsdom cannot do PageUp/PageDown).
const meta = {
  title: 'Behavior/Keyboard',
  parameters: { docs: { description: { component: 'Keyboard behavior, asserted by play functions.' } } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const fruit = ['Apple', 'Apricot', 'Banana', 'Cherry', 'Mango', 'Orange', 'Peach', 'Pear']

export const SelectKeys: Story = {
  render: () => (
    <div className="max-w-xs">
      <Select label="Fruit" placeholder="Pick one">
        {fruit.map((f) => (
          <SelectItem key={f} id={f}>
            {f}
          </SelectItem>
        ))}
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /Fruit/ })

    // ArrowDown opens the list on the first option; End and Home jump to the last and first.
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}')
    const listbox = await within(document.body).findByRole('listbox')
    await waitFor(() => expect(listbox).toBeVisible())
    const active = () => document.activeElement?.textContent
    await waitFor(() => expect(active()).toBe('Apple'))
    await userEvent.keyboard('{ArrowDown}')
    expect(active()).toBe('Apricot')
    await userEvent.keyboard('{End}')
    expect(active()).toBe('Pear')
    await userEvent.keyboard('{Home}')
    expect(active()).toBe('Apple')

    // Typeahead: typing a prefix moves to the matching option, and more letters narrow it.
    await userEvent.keyboard('m')
    expect(active()).toBe('Mango')
    // The typeahead buffer is cleared after a second without typing.
    await new Promise((r) => setTimeout(r, 1100))
    await userEvent.keyboard('{Home}')
    await userEvent.keyboard('pe')
    expect(active()).toBe('Peach')

    // Enter commits and closes, returning focus to the trigger with the value shown.
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(within(document.body).queryByRole('listbox')).toBeNull())
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveTextContent('Peach')
  },
}

const rows = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  name: `Item ${String(i + 1).padStart(2, '0')}`,
}))

export const TableKeys: Story = {
  render: () => (
    <div className="max-h-72 max-w-md overflow-auto rounded-lg border border-edge bg-surface">
      <Table aria-label="Long table">
        <TableHeader>
          <Column id="name" isRowHeader>
            Name
          </Column>
          <Column id="n">Number</Column>
        </TableHeader>
        <TableBody items={rows}>
          {(r) => (
            <Row id={r.id} textValue={r.name}>
              <Cell>{r.name}</Cell>
              <Cell>{r.id}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const current = () => document.activeElement as HTMLElement
    const rowName = () => current().closest('[role="row"]')?.querySelector('[role="rowheader"]')?.textContent
    canvas.getAllByRole('rowheader')[0].focus()
    expect(rowName()).toBe('Item 01')

    // Arrows move between rows.
    await userEvent.keyboard('{ArrowDown}')
    expect(rowName()).toBe('Item 02')
    await userEvent.keyboard('{ArrowUp}')
    expect(rowName()).toBe('Item 01')

    // Home / End move across the cells of the current row.
    await userEvent.keyboard('{End}')
    expect(current()).toHaveAttribute('role', 'gridcell')
    await userEvent.keyboard('{Home}')
    expect(current()).toHaveAttribute('role', 'rowheader')

    // Ctrl+End / Ctrl+Home jump to the last and first row, scrolling it into view.
    await userEvent.keyboard('{Control>}{End}{/Control}')
    expect(rowName()).toBe('Item 60')
    await waitFor(() => expect(current()).toBeVisible())
    await userEvent.keyboard('{Control>}{Home}{/Control}')
    expect(rowName()).toBe('Item 01')

    // Typeahead matches the row's text value.
    await userEvent.keyboard('Item 4')
    expect(rowName()).toBe('Item 40')
  },
}
