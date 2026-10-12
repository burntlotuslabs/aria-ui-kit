import type { ThemeConfig, ThemePreference } from './types'

export interface ThemeScriptProps {
  /** Brand theme to apply before first paint. Match the `theme` you pass to ThemeProvider. */
  theme?: ThemeConfig
  /** Match ThemeModeProvider's `defaultPreference`. Defaults to 'system'. */
  defaultPreference?: ThemePreference
  /** Match ThemeModeProvider's `storageKey`. Defaults to 'ui-theme-mode'. */
  storageKey?: string
  /** CSP nonce for the inline script. */
  nonce?: string
}

// Runs synchronously while the document is parsed, so the first paint already has the right mode and brand.
// Keep in step with ThemeModeProvider / ThemeProvider: same storage values, same classes, same --ui- variables.
const source = `(function(c){try{var p;try{p=localStorage.getItem(c.k)}catch(e){}
if(p!=='light'&&p!=='dark'&&p!=='system')p=c.d;
var m=p==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;
var r=document.documentElement;r.classList.toggle('dark',m==='dark');r.classList.toggle('light',m==='light');
if(c.t){var o=c.t[m]||{};for(var n in o){if(o[n])r.style.setProperty('--ui-'+n,o[n])}r.dataset.theme=c.i}}catch(e){}})(`

/** Serialized so a stray `</script>` or a line separator in a token value cannot break out of the tag. */
function serialize(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/**
 * Prevents the flash of light mode / default brand on server-rendered pages. Render it once in `<head>`
 * (Next: in the root layout; plain SSR: in your document). Without it the providers still work, but they can
 * only apply the stored mode after hydration, so a dark-mode user briefly sees light.
 *
 * It edits `<html>` before React hydrates, so put `suppressHydrationWarning` on the `<html>` element.
 */
export function ThemeScript({
  theme,
  defaultPreference = 'system',
  storageKey = 'ui-theme-mode',
  nonce,
}: ThemeScriptProps) {
  const config = serialize({
    k: storageKey,
    d: defaultPreference,
    i: theme?.id,
    t: theme ? { light: theme.light, dark: theme.dark } : undefined,
  })
  // biome-ignore lint/security/noDangerouslySetInnerHtml: the config is JSON-escaped above and the source is a constant
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: `${source}${config})` }} />
}
