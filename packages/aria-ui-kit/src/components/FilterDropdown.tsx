import { useId, useRef, useState } from 'react'
import { Dialog, DialogTrigger, Heading, Popover } from 'react-aria-components'
import { cx } from '../lib/cx'
import { Button } from './Button'
import { Checkbox, CheckboxGroup } from './Checkbox'
import { SearchField } from './TextField'

export interface FilterDropdownProps {
  /** Human-readable column name, used in the trigger's accessible label. */
  label: string
  /** All possible values for this column (derived from the unfiltered data). */
  options: readonly string[]
  /** Currently selected values. Empty means "no filter". */
  selected: ReadonlySet<string>
  onChange: (next: Set<string>) => void
}

/**
 * Multi-select column filter composed from the kit's own primitives (Button, SearchField,
 * CheckboxGroup) inside React Aria's Popover + Dialog.
 *
 * React Aria handles: focus trapping and restoration, Escape/outside-click dismissal, popover
 * positioning and flipping, and the checkbox group's ARIA. This adds the search box and skin.
 */
export function FilterDropdown({ label, options, selected, onChange }: FilterDropdownProps) {
  const [query, setQuery] = useState('')
  const headingId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const active = selected.size > 0
  const visible = query ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase())) : options

  // React Aria's Table wraps itself in a focus scope. When the popover closes, that scope
  // wins the focus-restore hand-off and re-focuses the header *cell*, whose `focusMode: 'child'`
  // then lands on the cell's first focusable element. If the header also has a sort button,
  // that's where the user ends up instead of on the funnel they just closed. Restoring the
  // trigger explicitly puts them back where they left. See ProjectsTable.test.tsx.
  const restoreTriggerFocus = (isOpen: boolean) => {
    if (isOpen) return
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  return (
    <DialogTrigger onOpenChange={restoreTriggerFocus}>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        aria-label={active ? `Filter ${label}, ${selected.size} selected` : `Filter ${label}`}
        className={cx(
          'ml-1 h-6 w-6',
          active ? 'bg-accent text-accent-fg hover:bg-accent-hover' : 'text-fg-muted',
        )}
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M1.5 2h13l-5 6v5l-3 1.5V8z" />
        </svg>
      </Button>
      <Popover
        placement="bottom start"
        className="w-64 rounded-md border border-edge bg-surface p-3 shadow-lg"
      >
        <Dialog aria-labelledby={headingId} className="flex flex-col gap-2 outline-none">
          <Heading id={headingId} slot="title" className="text-sm font-semibold">
            Filter by {label}
          </Heading>

          <SearchField value={query} onChange={setQuery} aria-label={`Search ${label} options`} />

          <CheckboxGroup
            aria-label={`${label} values`}
            value={[...selected]}
            onChange={(values) => onChange(new Set(values))}
            className="max-h-56 overflow-y-auto"
          >
            {visible.length === 0 && (
              <p className="px-1 py-2 text-sm italic text-fg-muted">No matching options</p>
            )}
            {visible.map((option) => (
              // slot={null}: opt out of the Table's selection-checkbox slot context, which
              // otherwise flows through the portal and throws "A slot prop is required".
              <Checkbox
                key={option}
                slot={null}
                value={option}
                className="rounded px-1 py-0.5 hover:bg-surface-2"
              >
                {option}
              </Checkbox>
            ))}
          </CheckboxGroup>

          <div className="flex justify-between border-t border-edge pt-2">
            <Button variant="ghost" size="sm" isDisabled={!active} onPress={() => onChange(new Set())}>
              Clear
            </Button>
            <Button slot="close" size="sm">
              Done
            </Button>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
