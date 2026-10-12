/**
 * Column filters are a plain map of column id -> set of allowed values.
 * An empty set (or a missing key) means "no filter on this column".
 * Filters across columns are AND-ed; values within a column are OR-ed.
 */
export type ColumnFilters = Record<string, Set<string>>

export interface FilterableColumn<T> {
  id: string
  /** The string a row contributes to this column's filter options. */
  accessor: (row: T) => string
}

export function applyColumnFilters<T>(
  rows: readonly T[],
  filters: ColumnFilters,
  columns: readonly FilterableColumn<T>[],
): T[] {
  const active = columns.filter((c) => filters[c.id] && filters[c.id].size > 0)
  if (active.length === 0) return [...rows]
  return rows.filter((row) => active.every((c) => filters[c.id].has(c.accessor(row))))
}

/** Distinct, sorted option list for a column, derived from the unfiltered data. */
export function distinctValues<T>(rows: readonly T[], accessor: (row: T) => string): string[] {
  const seen = new Set<string>()
  for (const row of rows) seen.add(accessor(row))
  return [...seen].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

export function countActiveFilters(filters: ColumnFilters): number {
  return Object.values(filters).filter((s) => s.size > 0).length
}
