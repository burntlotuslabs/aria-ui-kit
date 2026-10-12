import {
  Cell as AriaCell,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  Button,
  type CellProps,
  type ColumnProps,
  composeRenderProps,
  type RowProps,
  type TableBodyProps,
  type TableHeaderProps,
  type TableProps,
} from 'react-aria-components'
import { cx } from '../lib/cx'

/**
 * Thin, styled wrappers around react-aria-components.
 *
 * React Aria owns: roles, aria-sort, aria-selected, aria-colindex, roving
 * tabindex, arrow/Home/End/PageUp/PageDown navigation, typeahead, and
 * Enter/Space activation. These wrappers only add a Tailwind skin and a few
 * ergonomic defaults. If a prop isn't documented here, it's React Aria's.
 */

export function Table(props: TableProps) {
  return (
    <AriaTable
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          'w-full border-separate border-spacing-0 text-sm text-fg',
          'outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
          className,
        ),
      )}
    />
  )
}

export function TableHeader<T extends object>(props: TableHeaderProps<T>) {
  return (
    <AriaTableHeader
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx('sticky top-0 z-10 bg-surface-2', className),
      )}
    />
  )
}

export function TableBody<T extends object>(props: TableBodyProps<T>) {
  return (
    <AriaTableBody
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx('data-[empty]:text-center data-[empty]:italic', className),
      )}
    />
  )
}

export interface StyledColumnProps extends Omit<ColumnProps, 'children'> {
  /** Header label. Rendered next to the sort indicator when `allowsSorting` is set. */
  children: React.ReactNode
  /**
   * Optional extra control (e.g. a FilterDropdown) placed at the end of the header cell.
   *
   * Gotcha this exists to solve: React Aria column headers use `focusMode: 'child'`,
   * so a header that contains any focusable child can never receive keyboard focus
   * itself, and the built-in "press the header to sort" interaction becomes
   * mouse-only. When `extra` is present *and* the column is sortable, the label is
   * therefore rendered as an explicit sort button wired to the table's sort state.
   */
  extra?: React.ReactNode
}

export function Column({ children, extra, ...props }: StyledColumnProps) {
  const needsSortButton = Boolean(extra) && Boolean(props.allowsSorting) && props.id !== undefined

  return (
    <AriaColumn
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          'border-b border-edge px-3 py-2 text-left font-semibold text-fg',
          'cursor-default select-none outline-none',
          'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
          'data-[allows-sorting]:cursor-pointer data-[allows-sorting]:hover:bg-surface-3',
          className,
        ),
      )}
    >
      {({ allowsSorting, sortDirection, sort }) => {
        const indicator = allowsSorting && (
          <span
            aria-hidden="true"
            className={cx('w-4 text-xs', sortDirection ? 'text-accent' : 'text-fg-subtle')}
          >
            {sortDirection === 'ascending' ? '▲' : sortDirection === 'descending' ? '▼' : '↕'}
          </span>
        )
        return (
          <span className="flex items-center gap-1">
            {needsSortButton ? (
              <Button
                onPress={() => sort(sortDirection === 'ascending' ? 'descending' : 'ascending')}
                className={cx(
                  'flex flex-1 items-center gap-1 rounded text-left outline-none',
                  'focus-visible:ring-2 focus-visible:ring-focus',
                )}
              >
                <span className="sr-only">Sort by </span>
                <span className="flex-1 truncate">{children}</span>
                {indicator}
              </Button>
            ) : (
              <>
                <span className="flex-1 truncate">{children}</span>
                {indicator}
              </>
            )}
            {extra}
          </span>
        )
      }}
    </AriaColumn>
  )
}

export function Row<T extends object>(props: RowProps<T>) {
  return (
    <AriaRow
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          'group relative outline-none',
          'even:bg-surface odd:bg-surface-2',
          'hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
          'data-[selected]:bg-accent-soft',
          'data-[href]:cursor-pointer',
          className,
        ),
      )}
    />
  )
}

export function Cell(props: CellProps) {
  return (
    <AriaCell
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          'border-b border-edge px-3 py-2 align-top outline-none',
          'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
          className,
        ),
      )}
    />
  )
}
