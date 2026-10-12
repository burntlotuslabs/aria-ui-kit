import type { HTMLAttributes } from 'react'
import { cx } from '../lib/cx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional heading rendered as an <h2>; pass `as` to change the level. */
  title?: string
  as?: 'h2' | 'h3' | 'h4'
  padded?: boolean
}

/** A surface. Static layout, so no React Aria; it exists so every app boxes content the same way. */
export function Card({ title, as: Heading = 'h2', padded = true, className, children, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cx('rounded-lg border border-edge bg-surface text-fg shadow-sm', padded && 'p-4', className)}
    >
      {title && (
        <Heading className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-muted">
          {title}
        </Heading>
      )}
      {children}
    </div>
  )
}
