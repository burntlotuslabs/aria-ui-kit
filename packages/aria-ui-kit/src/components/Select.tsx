import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  Button,
  composeRenderProps,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  Popover,
  SelectValue,
  Text,
  type ValidationResult,
} from 'react-aria-components'
import { cx } from '../lib/cx'
import { fieldDescription, fieldError, fieldInput, fieldLabel } from '../lib/styles'

export interface SelectProps<T extends object> extends Omit<AriaSelectProps<T>, 'children'> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  items?: Iterable<T>
  children: React.ReactNode | ((item: T) => React.ReactNode)
}

/**
 * React Aria's Select: a button that opens a listbox popover. Arrow keys, typeahead,
 * Home/End, Escape, and form integration (a hidden native select for `name`) all come with it.
 */
export function Select<T extends object>({
  label,
  description,
  errorMessage,
  items,
  children,
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx('group flex flex-col gap-1', className),
      )}
    >
      {label && <Label className={fieldLabel}>{label}</Label>}
      <Button
        className={cx(
          fieldInput,
          'flex items-center justify-between gap-2 text-left',
          'group-data-[open]:border-focus',
        )}
      >
        <SelectValue className="truncate data-[placeholder]:text-fg-subtle" />
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-4 w-4 shrink-0 text-fg-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </Button>
      {description && (
        <Text slot="description" className={fieldDescription}>
          {description}
        </Text>
      )}
      <FieldError className={fieldError}>{errorMessage}</FieldError>
      <Popover className="w-[--trigger-width] rounded-md border border-edge bg-surface p-1 shadow-lg">
        <ListBox items={items} className="max-h-64 overflow-auto outline-none">
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  )
}

export function SelectItem(props: ListBoxItemProps) {
  return (
    <ListBoxItem
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          'cursor-default select-none rounded px-2 py-1.5 text-sm text-fg outline-none',
          'data-[focused]:bg-accent-soft data-[focused]:text-accent-soft-fg data-[selected]:font-semibold data-[selected]:text-accent',
          'data-[disabled]:text-fg-subtle',
          className,
        ),
      )}
    />
  )
}
