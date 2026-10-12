import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxProps as AriaCheckboxProps,
  composeRenderProps,
  FieldError,
  Label,
  Text,
  type ValidationResult,
} from 'react-aria-components'
import { cx } from '../lib/cx'
import { fieldDescription, fieldError, fieldLabel } from '../lib/styles'

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'children'> {
  children?: React.ReactNode
}

export function Checkbox({ children, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          'group flex cursor-pointer items-center gap-2 text-sm text-fg',
          'disabled:cursor-not-allowed disabled:text-fg-subtle',
          className,
        ),
      )}
    >
      {({ isSelected, isIndeterminate }) => (
        <>
          <span
            aria-hidden="true"
            className={cx(
              'flex h-4 w-4 shrink-0 items-center justify-center rounded border border-edge-strong bg-surface transition-colors',
              'group-data-[selected]:border-accent group-data-[selected]:bg-accent group-data-[selected]:text-accent-fg',
              'group-data-[indeterminate]:border-accent group-data-[indeterminate]:bg-accent group-data-[indeterminate]:text-accent-fg',
              'group-data-[invalid]:border-danger',
              'group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-focus group-data-[focus-visible]:ring-offset-1',
              'group-disabled:border-edge group-disabled:bg-surface-2',
            )}
          >
            {isIndeterminate ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 6h8" />
              </svg>
            ) : isSelected ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 6l3 3 5-6" />
              </svg>
            ) : null}
          </span>
          {children && <span>{children}</span>}
        </>
      )}
    </AriaCheckbox>
  )
}

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, 'children'> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  children: React.ReactNode
}

export function CheckboxGroup({ label, description, errorMessage, children, ...props }: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup
      {...props}
      className={composeRenderProps(props.className, (className) => cx('flex flex-col gap-1.5', className))}
    >
      {label && <Label className={fieldLabel}>{label}</Label>}
      {children}
      {description && (
        <Text slot="description" className={fieldDescription}>
          {description}
        </Text>
      )}
      <FieldError className={fieldError}>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  )
}
