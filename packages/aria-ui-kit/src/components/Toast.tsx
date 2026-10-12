import {
  UNSTABLE_Toast as AriaToast,
  Text,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
} from 'react-aria-components'
import { cx } from '../lib/cx'
import { Button } from './Button'

export type ToastTone = 'info' | 'success' | 'danger'

export interface ToastData {
  title: string
  description?: string
  tone?: ToastTone
}

/**
 * A single app-wide queue. Call `toast.add({...})` from anywhere; render `<Toaster />` once.
 *
 * React Aria's Toast primitives are still exported under an UNSTABLE_ prefix in the installed
 * version, so this wrapper is the only file that imports them. If their API shifts, this is
 * the single place to update. What they provide: a landmark region, aria-live announcements,
 * F6 to jump to the region, focus handling when a toast is removed, and timers that pause on hover/focus.
 */
export const toast = new ToastQueue<ToastData>({ maxVisibleToasts: 4 })

const tones: Record<ToastTone, string> = {
  info: 'border-accent',
  success: 'border-success-soft-fg',
  danger: 'border-danger',
}

export function Toaster() {
  return (
    <ToastRegion queue={toast} className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2 outline-none">
      {({ toast: t }) => (
        <AriaToast
          toast={t}
          className={cx(
            'flex items-start gap-3 rounded-md border-l-4 bg-surface p-3 text-sm shadow-lg outline-none',
            'focus-visible:ring-2 focus-visible:ring-focus',
            tones[t.content.tone ?? 'info'],
          )}
        >
          <ToastContent className="flex flex-1 flex-col gap-0.5">
            <Text slot="title" className="font-semibold text-fg">
              {t.content.title}
            </Text>
            {t.content.description && (
              <Text slot="description" className="text-fg-muted">
                {t.content.description}
              </Text>
            )}
          </ToastContent>
          <Button slot="close" variant="ghost" size="icon" aria-label="Dismiss notification">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </Button>
        </AriaToast>
      )}
    </ToastRegion>
  )
}
