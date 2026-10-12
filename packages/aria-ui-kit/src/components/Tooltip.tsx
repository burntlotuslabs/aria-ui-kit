import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  composeRenderProps,
  OverlayArrow,
} from 'react-aria-components'
import { cx } from '../lib/cx'

export { TooltipTrigger } from 'react-aria-components'

export interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
  children: React.ReactNode
}

/**
 * React Aria tooltips open on hover *and* keyboard focus, honor a global warm-up delay,
 * close on Escape, and are announced via aria-describedby. Wrap any focusable trigger.
 */
export function Tooltip({ children, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      {...props}
      offset={props.offset ?? 8}
      className={composeRenderProps(props.className, (className) =>
        cx('max-w-xs rounded-md bg-tooltip px-2.5 py-1.5 text-xs text-tooltip-fg shadow-lg', className),
      )}
    >
      <OverlayArrow>
        <svg
          aria-hidden="true"
          width={8}
          height={8}
          viewBox="0 0 8 8"
          className="fill-tooltip data-[placement=bottom]:rotate-180"
        >
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  )
}
