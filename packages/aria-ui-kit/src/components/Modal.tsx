import {
  Modal as AriaModal,
  Dialog,
  type DialogProps,
  Heading,
  ModalOverlay,
  type ModalOverlayProps,
} from 'react-aria-components'
import { cx } from '../lib/cx'
import { Button } from './Button'

export { DialogTrigger } from 'react-aria-components'

export interface ModalProps extends Omit<ModalOverlayProps, 'children'> {
  title: string
  size?: 'sm' | 'md' | 'lg'
  role?: DialogProps['role']
  /** Content. Receives `close` so forms and footers can dismiss the dialog. */
  children: React.ReactNode | ((opts: { close: () => void }) => React.ReactNode)
}

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

/**
 * Modal dialog. React Aria handles focus trapping, focus restore, Escape, scroll locking,
 * aria-modal, and hides the rest of the app from assistive tech while open. Use inside a
 * `DialogTrigger`, or control it with `isOpen` / `onOpenChange`.
 */
export function Modal({ title, size = 'md', role, children, ...props }: ModalProps) {
  return (
    <ModalOverlay
      {...props}
      className={cx(
        'fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4',
        'data-[entering]:animate-[fade-in_150ms_ease-out] data-[exiting]:animate-[fade-out_100ms_ease-in]',
      )}
    >
      <AriaModal className={cx('w-full rounded-lg bg-surface shadow-xl outline-none', sizes[size])}>
        <Dialog role={role} className="flex flex-col gap-4 p-5 outline-none">
          {({ close }) => (
            <>
              <div className="flex items-start justify-between gap-4">
                <Heading slot="title" className="text-lg font-semibold text-fg">
                  {title}
                </Heading>
                <Button variant="ghost" size="icon" aria-label="Close dialog" onPress={close}>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </Button>
              </div>
              {typeof children === 'function' ? children({ close }) : children}
            </>
          )}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  )
}
