import axe from 'axe-core'

/** Run axe against a container. Contrast is skipped: jsdom has no layout engine or stylesheet. */
export async function expectNoAxeViolations(container: Element) {
  const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })
  expect(
    results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
  ).toEqual([])
}
