import { useCallback, useState } from 'react'
import type { Key } from 'react-aria-components'

export function useExpandedRows(initial: Iterable<Key> = []) {
  const [expanded, setExpanded] = useState<Set<Key>>(() => new Set(initial))

  const toggle = useCallback((key: Key) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const isExpanded = useCallback((key: Key) => expanded.has(key), [expanded])

  return { expanded, toggle, isExpanded }
}
