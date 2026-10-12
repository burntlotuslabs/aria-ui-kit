import { Link as AriaLink, type LinkProps as AriaLinkProps, composeRenderProps } from 'react-aria-components'
import { cx } from '../lib/cx'
import { focusRing } from '../lib/styles'

export interface LinkProps extends AriaLinkProps {
  variant?: 'inline' | 'subtle'
}

/**
 * React Aria's Link renders a real <a> when `href` is set and a focusable `role="link"`
 * otherwise (for router-driven navigation), and integrates with a RouterProvider if present.
 */
export function Link({ variant = 'inline', ...props }: LinkProps) {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          'rounded-sm underline-offset-2',
          variant === 'inline'
            ? 'text-accent underline hover:text-accent-hover'
            : 'text-fg-muted hover:text-fg hover:underline',
          'data-[disabled]:cursor-not-allowed data-[disabled]:text-fg-subtle data-[disabled]:no-underline',
          focusRing,
          className,
        ),
      )}
    />
  )
}
