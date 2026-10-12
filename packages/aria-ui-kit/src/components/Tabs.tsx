import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  composeRenderProps,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
} from 'react-aria-components'
import { cx } from '../lib/cx'
import { focusRing } from '../lib/styles'

/** Tabs: automatic activation, arrow-key navigation, and tab/panel association from React Aria. */
export function Tabs(props: TabsProps) {
  return (
    <AriaTabs
      {...props}
      className={composeRenderProps(props.className, (className) => cx('flex flex-col gap-4', className))}
    />
  )
}

export function TabList<T extends object>(props: TabListProps<T>) {
  return (
    <AriaTabList
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx('flex gap-1 border-b border-edge', className),
      )}
    />
  )
}

export function Tab(props: TabProps) {
  return (
    <AriaTab
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cx(
          '-mb-px cursor-pointer rounded-t-md border-b-2 border-transparent px-3 py-2 text-sm font-medium text-fg-muted',
          'hover:text-fg data-[selected]:border-accent data-[selected]:text-accent',
          'data-[disabled]:cursor-not-allowed data-[disabled]:text-fg-subtle',
          focusRing,
          className,
        ),
      )}
    />
  )
}

export function TabPanel(props: TabPanelProps) {
  return (
    <AriaTabPanel
      {...props}
      className={composeRenderProps(props.className, (className) => cx('outline-none', focusRing, className))}
    />
  )
}
