import {
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  Button,
  composeRenderProps,
  FieldError,
  Input,
  Label,
  Text,
  TextArea,
  type ValidationResult,
} from 'react-aria-components'
import { cx } from '../lib/cx'
import { fieldDescription, fieldError, fieldInput, fieldLabel } from '../lib/styles'

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string
  description?: string
  placeholder?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  /** Render a multi-line textarea instead of an input. */
  multiline?: boolean
}

/**
 * Label, input, description and error are associated by React Aria (`aria-labelledby`,
 * `aria-describedby`, `aria-invalid`), so a screen reader hears all of it on focus.
 */
export function TextField({
  label,
  description,
  errorMessage,
  placeholder,
  multiline,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField
      {...props}
      className={composeRenderProps(props.className, (className) => cx('flex flex-col gap-1', className))}
    >
      {label && <Label className={fieldLabel}>{label}</Label>}
      {multiline ? (
        <TextArea placeholder={placeholder} rows={3} className={fieldInput} />
      ) : (
        <Input placeholder={placeholder} className={fieldInput} />
      )}
      {description && (
        <Text slot="description" className={fieldDescription}>
          {description}
        </Text>
      )}
      <FieldError className={fieldError}>{errorMessage}</FieldError>
    </AriaTextField>
  )
}

export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string
  placeholder?: string
}

/** Search input with a clear button; Escape clears, and the clear button is hidden when empty. */
export function SearchField({ label, placeholder = 'Search…', ...props }: SearchFieldProps) {
  return (
    <AriaSearchField
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx('group flex flex-col gap-1', className),
      )}
    >
      {label && <Label className={fieldLabel}>{label}</Label>}
      <div className="relative">
        <Input
          placeholder={placeholder}
          className={cx(fieldInput, 'pr-8 [&::-webkit-search-cancel-button]:hidden')}
        />
        <Button
          aria-label="Clear search"
          className={cx(
            'absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-fg-muted hover:bg-surface-2',
            'outline-none focus-visible:ring-2 focus-visible:ring-focus',
            'group-data-[empty]:hidden',
          )}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </Button>
      </div>
    </AriaSearchField>
  )
}
