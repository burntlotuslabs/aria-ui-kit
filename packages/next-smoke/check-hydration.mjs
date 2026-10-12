// Starts the production build, loads the page in Chromium, and fails on any console error
// (React reports hydration mismatches there) or if the interactive pieces don't work.
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = 3100
const server = spawn('pnpm', ['exec', 'next', 'start', '-p', String(PORT)], { stdio: 'inherit' })
const stop = () => server.kill()
process.on('exit', stop)

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`http://localhost:${PORT}`)).ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('server did not start')
}

let failed = false
try {
  await waitForServer()
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' })

  await page.getByRole('tab', { name: 'Two' }).click() // proves hydration: handlers are attached
  await page.getByText('Second panel').waitFor()
  if (errors.length) throw new Error(`console errors:\n${errors.join('\n')}`)
  await page.close()

  // No flash: with a stored dark preference the server HTML must already paint dark + brand once the
  // inline ThemeScript has run, before any React code is loaded. Block every script file to prove it.
  const ssr = await browser.newPage()
  await ssr.addInitScript(() => localStorage.setItem('ui-theme-mode', 'dark'))
  await ssr.route('**/*.js', (route) => route.abort())
  await ssr.goto(`http://localhost:${PORT}`, { waitUntil: 'load' })
  const painted = await ssr.evaluate(() => ({
    dark: document.documentElement.classList.contains('dark'),
    brand: document.documentElement.dataset.theme,
    canvas: getComputedStyle(document.body).backgroundColor,
  }))
  if (!painted.dark || painted.brand !== 'bukulicious') {
    throw new Error(`theme not applied before hydration: ${JSON.stringify(painted)}`)
  }
  await ssr.close()

  // And hydration with that stored preference must not report a mismatch or flip back to light.
  const hydrated = await browser.newPage()
  const hydratedErrors = []
  hydrated.on('console', (m) => m.type() === 'error' && hydratedErrors.push(m.text()))
  await hydrated.addInitScript(() => localStorage.setItem('ui-theme-mode', 'dark'))
  await hydrated.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' })
  await hydrated.getByRole('button', { name: 'Switch to light mode' }).waitFor()
  if (!(await hydrated.evaluate(() => document.documentElement.classList.contains('dark')))) {
    throw new Error('hydration dropped the dark class')
  }
  if (hydratedErrors.length)
    throw new Error(`console errors with stored dark mode:\n${hydratedErrors.join('\n')}`)
  console.log('next-smoke: SSR + hydration OK')
  await browser.close()
} catch (e) {
  console.error(e)
  failed = true
} finally {
  stop()
}
process.exit(failed ? 1 : 0)
