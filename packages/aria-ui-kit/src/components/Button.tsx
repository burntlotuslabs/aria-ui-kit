import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from 'react-aria-components'
import { cx } from '../lib/cx'
import { focusRing } from '../lib/styles'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'icon'

export interface ButtonProps extends AriaButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  ref?: React.Ref<HTMLButtonElement>
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-fg hover:bg-accent-hover data-[pressed]:bg-accent-hover',
  secondary: 'border border-edge bg-surface text-fg hover:bg-surface-2 data-[pressed]:bg-surface-3',
  ghost: 'text-fg hover:bg-surface-3 data-[pressed]:bg-edge',
  danger: 'bg-danger text-danger-fg hover:bg-danger-hover data-[pressed]:bg-danger-hover',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-9 px-4 text-sm',
  icon: 'h-7 w-7 p-0',
}

/**
 * React Aria's Button gives us press events that behave the same for mouse, touch,
 * keyboard and screen readers, plus `isPending` (aria-disabled + a live announcement).
 * This adds variants and sizes.
 */
export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md font-medium transition-colors',
          focusRing,
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[pending]:cursor-progress data-[pending]:opacity-70',
          variants[variant],
          sizes[size],
          className,
        ),
      )}
    />
  )
}
