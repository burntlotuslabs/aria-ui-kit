import {
  Cell,
  Column,
  Row,
  type SortableColumn,
  sortRows,
  Table,
  TableBody,
  TableHeader,
} from '@burntlotuslabs/aria-ui-kit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { SortDescriptor } from 'react-aria-components'

interface Item {
  id: number
  sku: string
  qty: number
  restocked: string
}

const items: Item[] = [
  { id: 1, sku: 'BRK-100', qty: 12, restocked: '2026-09-01' },
  { id: 2, sku: 'BRK-2', qty: 140, restocked: '2026-08-14' },
  { id: 3, sku: 'BRK-30', qty: 3, restocked: '2026-09-20' },
]

const columns: SortableColumn<Item>[] = [
  { id: 'sku', type: 'string', accessor: (i) => i.sku },
  { id: 'qty', type: 'number', accessor: (i) => i.qty },
  { id: 'restocked', type: 'date', accessor: (i) => i.restocked },
]

function BasicTable({ selectionMode }: { selectionMode?: 'none' | 'single' | 'multiple' }) {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'sku', direction: 'ascending' })
  const rows = sortRows(items, sort, columns)
  return (
    <div className="max-w-xl overflow-hidden rounded-lg border border-edge bg-surface">
      <Table
        aria-label="Inventory"
        sortDescriptor={sort}
        onSortChange={setSort}
        selectionMode={selectionMode}
      >
        <TableHeader>
          <Column id="sku" isRowHeader allowsSorting>
            SKU
          </Column>
          <Column id="qty" allowsSorting className="text-right">
            Quantity
          </Column>
          <Column id="restocked" allowsSorting>
            Restocked
          </Column>
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <Row>
              <Cell>{item.sku}</Cell>
              <Cell className="text-right tabular-nums">{item.qty}</Cell>
              <Cell>{item.restocked}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const meta = {
  title: 'Primitives/Table',
  component: BasicTable,
  parameters: {
    docs: {
      description: {
        component:
          'The styled primitives on their own. Everything interactive here (roving focus, aria-sort, ' +
          'Enter/Space to sort, typeahead) comes from react-aria-components; the wrappers only add Tailwind.',
      },
    },
  },
} satisfies Meta<typeof BasicTable>

export default meta
type Story = StoryObj<typeof meta>

export const Sortable: Story = {}

export const SingleSelection: Story = { args: { selectionMode: 'single' } }

export const MultipleSelection: Story = { args: { selectionMode: 'multiple' } }
