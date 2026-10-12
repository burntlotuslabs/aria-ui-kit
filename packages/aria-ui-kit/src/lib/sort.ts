import type { SortDescriptor } from 'react-aria-components'

/**
 * React Aria's Table owns the *state* of sorting (which column, which direction)
 * and the ARIA wiring (aria-sort, keyboard activation). It does not sort your data.
 * This module is the comparator layer you have to write yourself.
 */

export type ColumnType = 'string' | 'number' | 'date'

export interface SortableColumn<T> {
  id: string
  type: ColumnType
  /** Pull the raw value for this column off a row. */
  accessor: (row: T) => unknown
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') return Number(value)
  return Number.NaN
}

function toTime(value: unknown): number {
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'string' || typeof value === 'number') return new Date(value).getTime()
  return Number.NaN
}

/**
 * Compare two raw cell values according to a column type.
 * Null/undefined/unparseable values always sort last, regardless of direction,
 * so "empty" cells don't jump to the top when a user flips the sort.
 */
export function compareValues(a: unknown, b: unknown, type: ColumnType): number {
  const aEmpty = a === null || a === undefined || a === ''
  const bEmpty = b === null || b === undefined || b === ''
  if (aEmpty && bEmpty) return 0
  if (aEmpty) return 1
  if (bEmpty) return -1

  switch (type) {
    case 'number': {
      const an = toNumber(a)
      const bn = toNumber(b)
      if (Number.isNaN(an) && Number.isNaN(bn)) return 0
      if (Number.isNaN(an)) return 1
      if (Number.isNaN(bn)) return -1
      return an - bn
    }
    case 'date': {
      const at = toTime(a)
      const bt = toTime(b)
      if (Number.isNaN(at) && Number.isNaN(bt)) return 0
      if (Number.isNaN(at)) return 1
      if (Number.isNaN(bt)) return -1
      return at - bt
    }
    default:
      return collator.compare(String(a), String(b))
  }
}

/**
 * Sort rows by a React Aria SortDescriptor. Returns a new array; never mutates.
 * Stable: rows that compare equal keep their original relative order.
 */
export function sortRows<T>(
  rows: readonly T[],
  descriptor: SortDescriptor | undefined,
  columns: readonly SortableColumn<T>[],
): T[] {
  if (!descriptor?.column) return [...rows]
  const column = columns.find((c) => c.id === descriptor.column)
  if (!column) return [...rows]

  const dir = descriptor.direction === 'descending' ? -1 : 1
  return rows
    .map((row, index) => ({ row, index, value: column.accessor(row) }))
    .sort((x, y) => {
      const cmp = compareValues(x.value, y.value, column.type)
      // Empty values stay last in both directions; only comparisons between real values flip.
      const flips = !isEmpty(x.value) && !isEmpty(y.value)
      const signed = flips ? cmp * dir : cmp
      return signed !== 0 ? signed : x.index - y.index
    })
    .map((x) => x.row)
}

function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}
