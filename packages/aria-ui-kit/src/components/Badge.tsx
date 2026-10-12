import type { HTMLAttributes } from 'react'
import { cx } from '../lib/cx'

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-surface-3 text-fg',
  info: 'bg-info-soft text-info-soft-fg',
  success: 'bg-success-soft text-success-soft-fg',
  warning: 'bg-warning-soft text-warning-soft-fg',
  danger: 'bg-danger-soft text-danger-soft-fg',
}

/** Static status pill. No React Aria needed: it's text, so it needs no interaction semantics. */
export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cx(
        'inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    />
  )
}
