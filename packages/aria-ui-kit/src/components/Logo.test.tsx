import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Logo } from './Logo'

describe('Logo', () => {
  it('is an image with an accessible name by default and passes axe', async () => {
    const { container } = render(<Logo />)
    expect(screen.getByRole('img', { name: 'Logo' })).toBeInTheDocument()
    await expectNoAxeViolations(container)
  })

  it('accepts a custom name', () => {
    render(<Logo title="Acme home" />)
    expect(screen.getByRole('img', { name: 'Acme home' })).toBeInTheDocument()
  })

  it('is hidden from assistive technology when decorative', () => {
    const { container } = render(<Logo decorative />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('title')).toBeNull()
  })

  it('paints from theme tokens by default and from fixed colors in the original palette', () => {
    const { container, rerender } = render(<Logo />)
    expect(container.querySelector('path.fill-fg')).toBeInTheDocument()
    expect(container.querySelector('path.fill-accent')).toBeInTheDocument()
    rerender(<Logo palette="original" />)
    expect(container.querySelector('path.fill-fg')).toBeNull()
    expect(container.querySelector('path[fill="#000000"]')).toBeInTheDocument()
    expect(container.querySelector('path[fill="#fcee21"]')).toBeInTheDocument()
  })

  it('sizes by height', () => {
    const { container } = render(<Logo size={96} />)
    expect(container.querySelector('svg')).toHaveStyle({ height: '96px' })
  })
})
