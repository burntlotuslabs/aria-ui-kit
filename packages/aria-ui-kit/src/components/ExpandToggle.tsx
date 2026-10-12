import { cx } from '../lib/cx'
import { Button } from './Button'

export interface ExpandToggleProps {
  isExpanded: boolean
  onToggle: () => void
  /** Accessible name suffix, e.g. the row's title: "Expand details for Atlas". */
  rowLabel: string
  /** id of the detail region this button controls. */
  controlsId: string
}

/**
 * A row-level disclosure button. React Aria's Table has no built-in "expanded row"
 * concept for flat grids (that's the Tree component), so expansion is modeled as
 * a sibling detail row plus this toggle, wired with aria-expanded / aria-controls.
 */
export function ExpandToggle({ isExpanded, onToggle, rowLabel, controlsId }: ExpandToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 text-fg-muted"
      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${rowLabel}`}
      aria-expanded={isExpanded}
      aria-controls={isExpanded ? controlsId : undefined}
      onPress={onToggle}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className={cx('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-90')}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3l5 5-5 5" />
      </svg>
    </Button>
  )
}
