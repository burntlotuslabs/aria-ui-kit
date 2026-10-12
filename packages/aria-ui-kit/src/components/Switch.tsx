import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps,
  composeRenderProps,
} from 'react-aria-components'
import { cx } from '../lib/cx'

export interface SwitchProps extends Omit<AriaSwitchProps, 'children'> {
  children?: React.ReactNode
}

/** Toggle. React Aria renders a real `role="switch"` input, so Space toggles and the state is announced. */
export function Switch({ children, ...props }: SwitchProps) {
  return (
    <AriaSwitch
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          'group flex cursor-pointer items-center gap-2 text-sm text-fg disabled:cursor-not-allowed disabled:text-fg-subtle',
          className,
        ),
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          'relative h-5 w-9 shrink-0 rounded-full bg-edge-strong transition-colors',
          'group-data-[selected]:bg-accent',
          'group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-focus group-data-[focus-visible]:ring-offset-2',
          'group-disabled:opacity-50',
        )}
      >
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform group-data-[selected]:translate-x-4" />
      </span>
      {children && <span>{children}</span>}
    </AriaSwitch>
  )
}
