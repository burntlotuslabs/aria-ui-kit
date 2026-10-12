import { Toaster } from '@burntlotuslabs/aria-ui-kit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NewProjectDialog } from './NewProjectDialog'

describe('NewProjectDialog', () => {
  it('blocks submit until required fields are filled, then creates and toasts', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(
      <>
        <NewProjectDialog onCreate={onCreate} />
        <Toaster />
      </>,
    )
    await user.click(screen.getByRole('button', { name: 'New project' }))
    const dialog = await screen.findByRole('dialog', { name: 'New project' })

    await user.click(screen.getByRole('button', { name: 'Create project' }))
    expect(onCreate).not.toHaveBeenCalled()
    expect(screen.getByRole('textbox', { name: 'Project name' })).toHaveAttribute('aria-invalid', 'true')

    await user.type(screen.getByRole('textbox', { name: 'Project name' }), 'Nightly backups')
    await user.type(screen.getByRole('textbox', { name: 'Owner' }), 'Rae Kim')
    await user.click(screen.getByRole('button', { name: /Team/ }))
    await user.click(await screen.findByRole('option', { name: 'Security' }))
    await user.click(screen.getByRole('switch', { name: 'Mark as critical priority' }))
    await user.click(screen.getByRole('button', { name: 'Create project' }))

    expect(onCreate).toHaveBeenCalledTimes(1)
    expect(onCreate.mock.calls[0][0]).toMatchObject({
      name: 'Nightly backups',
      owner: 'Rae Kim',
      team: 'Security',
      priority: 'Critical',
    })
    await waitFor(() => expect(dialog).not.toBeInTheDocument())
    expect(await screen.findByRole('alertdialog', { name: 'Project created' })).toBeInTheDocument()
  })
})
