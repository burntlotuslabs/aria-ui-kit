import { useCallback, useState } from 'react'
import type { ColumnFilters } from '../lib/filter'

export function useColumnFilters(initial: ColumnFilters = {}) {
  const [filters, setFilters] = useState<ColumnFilters>(initial)

  const setColumn = useCallback((columnId: string, values: Set<string>) => {
    setFilters((prev) => ({ ...prev, [columnId]: values }))
  }, [])

  const clearAll = useCallback(() => setFilters({}), [])

  return { filters, setColumn, clearAll }
}
