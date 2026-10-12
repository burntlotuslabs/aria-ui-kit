import { describe, expect, it } from 'vitest'
import { compareValues, type SortableColumn, sortRows } from './sort'

interface Row {
  id: number
  name: string
  qty: number | null
  when: string | null
}

const rows: Row[] = [
  { id: 1, name: 'item 10', qty: 5, when: '2026-03-01' },
  { id: 2, name: 'Item 2', qty: null, when: null },
  { id: 3, name: 'item 1', qty: 50, when: '2025-12-31' },
  { id: 4, name: 'apple', qty: 5, when: '2026-01-15' },
]

const columns: SortableColumn<Row>[] = [
  { id: 'name', type: 'string', accessor: (r) => r.name },
  { id: 'qty', type: 'number', accessor: (r) => r.qty },
  { id: 'when', type: 'date', accessor: (r) => r.when },
]

const ids = (r: Row[]) => r.map((x) => x.id)

describe('compareValues', () => {
  it('compares strings case-insensitively and numerically', () => {
    expect(compareValues('item 2', 'item 10', 'string')).toBeLessThan(0)
    expect(compareValues('Apple', 'apple', 'string')).toBe(0)
  })

  it('compares numbers, including numeric strings', () => {
    expect(compareValues(2, 10, 'number')).toBeLessThan(0)
    expect(compareValues('2', 10, 'number')).toBeLessThan(0)
  })

  it('compares dates from ISO strings and Date objects', () => {
    expect(compareValues('2026-01-01', new Date('2025-06-01'), 'date')).toBeGreaterThan(0)
  })

  it('always puts empty values after real ones', () => {
    expect(compareValues(null, 1, 'number')).toBeGreaterThan(0)
    expect(compareValues('', 'a', 'string')).toBeGreaterThan(0)
    expect(compareValues(undefined, null, 'date')).toBe(0)
  })
})

describe('sortRows', () => {
  it('returns a copy in original order when no descriptor is given', () => {
    const out = sortRows(rows, undefined, columns)
    expect(ids(out)).toEqual([1, 2, 3, 4])
    expect(out).not.toBe(rows)
  })

  it('sorts strings ascending with natural ordering', () => {
    expect(ids(sortRows(rows, { column: 'name', direction: 'ascending' }, columns))).toEqual([4, 3, 2, 1])
  })

  it('sorts strings descending', () => {
    expect(ids(sortRows(rows, { column: 'name', direction: 'descending' }, columns))).toEqual([1, 2, 3, 4])
  })

  it('sorts numbers and keeps nulls last in both directions', () => {
    expect(ids(sortRows(rows, { column: 'qty', direction: 'ascending' }, columns))).toEqual([1, 4, 3, 2])
    expect(ids(sortRows(rows, { column: 'qty', direction: 'descending' }, columns))).toEqual([3, 1, 4, 2])
  })

  it('is stable for equal values', () => {
    // rows 1 and 4 both have qty 5; original order is 1 then 4
    expect(ids(sortRows(rows, { column: 'qty', direction: 'ascending' }, columns)).slice(0, 2)).toEqual([
      1, 4,
    ])
  })

  it('sorts dates chronologically with nulls last', () => {
    expect(ids(sortRows(rows, { column: 'when', direction: 'ascending' }, columns))).toEqual([3, 4, 1, 2])
    expect(ids(sortRows(rows, { column: 'when', direction: 'descending' }, columns))).toEqual([1, 4, 3, 2])
  })

  it('ignores unknown columns', () => {
    expect(ids(sortRows(rows, { column: 'nope', direction: 'ascending' }, columns))).toEqual([1, 2, 3, 4])
  })

  it('does not mutate the input', () => {
    const copy = [...rows]
    sortRows(rows, { column: 'name', direction: 'ascending' }, columns)
    expect(rows).toEqual(copy)
  })
})
