import { describe, expect, it } from 'vitest'
import { applyColumnFilters, countActiveFilters, distinctValues, type FilterableColumn } from './filter'

interface Row {
  id: number
  owner: string
  status: string
}

const rows: Row[] = [
  { id: 1, owner: 'Ana', status: 'Open' },
  { id: 2, owner: 'Ben', status: 'Open' },
  { id: 3, owner: 'Ana', status: 'Closed' },
  { id: 4, owner: 'Cy', status: 'Closed' },
]

const columns: FilterableColumn<Row>[] = [
  { id: 'owner', accessor: (r) => r.owner },
  { id: 'status', accessor: (r) => r.status },
]

const ids = (r: Row[]) => r.map((x) => x.id)

describe('applyColumnFilters', () => {
  it('returns everything when no filters are set', () => {
    expect(ids(applyColumnFilters(rows, {}, columns))).toEqual([1, 2, 3, 4])
  })

  it('treats an empty set as no filter', () => {
    expect(ids(applyColumnFilters(rows, { owner: new Set() }, columns))).toEqual([1, 2, 3, 4])
  })

  it('ORs values within a column', () => {
    expect(ids(applyColumnFilters(rows, { owner: new Set(['Ana', 'Cy']) }, columns))).toEqual([1, 3, 4])
  })

  it('ANDs filters across columns', () => {
    const filters = { owner: new Set(['Ana']), status: new Set(['Closed']) }
    expect(ids(applyColumnFilters(rows, filters, columns))).toEqual([3])
  })

  it('ignores filters for unknown columns', () => {
    expect(ids(applyColumnFilters(rows, { nope: new Set(['x']) }, columns))).toEqual([1, 2, 3, 4])
  })
})

describe('distinctValues', () => {
  it('dedupes and sorts', () => {
    expect(distinctValues(rows, (r) => r.owner)).toEqual(['Ana', 'Ben', 'Cy'])
  })
})

describe('countActiveFilters', () => {
  it('counts only non-empty sets', () => {
    expect(countActiveFilters({ a: new Set(['x']), b: new Set(), c: new Set(['y', 'z']) })).toBe(2)
  })
})
