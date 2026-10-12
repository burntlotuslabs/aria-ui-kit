/** Tiny className joiner. Avoids pulling in clsx for three call sites. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
