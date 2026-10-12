import type { CSSProperties, SVGProps } from 'react'
import { useId } from 'react'
import { logoOutlineA, logoOutlineB, logoRings, logoViewBox } from '../brand/logo'
import { cx } from '../lib/cx'

export interface LogoProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox' | 'title'> {
  /** Accessible name. Ignored when `decorative` is set. */
  title?: string
  /** Hide the mark from assistive technology, for use next to visible text that already names the product. */
  decorative?: boolean
  /**
   * `theme` paints the mark from the semantic tokens, so it follows light/dark and the active brand theme
   * (rings = fg, edge = accent). `original` uses the artwork's fixed colors.
   */
  palette?: 'theme' | 'original'
  /** Rendered height; width follows the artwork's aspect ratio. Numbers are pixels. */
  size?: number | string
}

/** A generic circles mark as inline SVG: crisp at any size, no network request, themeable. Swap it for your own. */
export function Logo({
  title = 'Logo',
  decorative = false,
  palette = 'theme',
  size = 48,
  className,
  style,
  ...props
}: LogoProps) {
  const titleId = `${useId().replace(/:/g, '')}-title`
  const themed = palette === 'theme'
  const sizeStyle: CSSProperties = { height: size, width: 'auto', ...style }

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: the <title> is rendered unless `decorative`, where the svg is aria-hidden instead
    <svg
      {...props}
      viewBox={logoViewBox}
      className={cx('shrink-0', className)}
      style={sizeStyle}
      // `role="img"` + a name for the standalone mark; fully hidden when it is decorative.
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-labelledby={decorative ? undefined : titleId}
      focusable="false"
    >
      {!decorative && <title id={titleId}>{title}</title>}
      {/* The yellow edge is dropped when themed: it only reads as a fringe against a themed background. */}
      {!themed && <path d={logoOutlineA} fill="#fcee21" />}
      <path
        d={logoOutlineB}
        className={themed ? 'fill-accent' : undefined}
        fill={themed ? undefined : '#0066ff'}
      />
      <path d={logoRings} className={themed ? 'fill-fg' : undefined} fill={themed ? undefined : '#000000'} />
    </svg>
  )
}
