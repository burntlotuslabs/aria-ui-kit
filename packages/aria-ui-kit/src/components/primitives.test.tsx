import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Button } from './Button'
import { Checkbox, CheckboxGroup } from './Checkbox'
import { DialogTrigger, Modal } from './Modal'
import { Select, SelectItem } from './Select'
import { Switch } from './Switch'
import { Tab, TabList, TabPanel, Tabs } from './Tabs'
import { SearchField, TextField } from './TextField'
import { Toaster, toast } from './Toast'
import { Tooltip, TooltipTrigger } from './Tooltip'

describe('Button', () => {
  it('fires onPress from keyboard and mouse, and not while pending', async () => {
    const user = userEvent.setup()
    const onPress = vi.fn()
    const { rerender } = render(<Button onPress={onPress}>Save</Button>)
    const btn = screen.getByRole('button', { name: 'Save' })
    await user.click(btn)
    btn.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onPress).toHaveBeenCalledTimes(3)

    rerender(
      <Button onPress={onPress} isPending>
        Save
      </Button>,
    )
    await user.click(btn)
    expect(onPress).toHaveBeenCalledTimes(3)
    expect(btn).toHaveAttribute('aria-disabled', 'true')
  })
})

describe('TextField', () => {
  it('associates label, description and error with the input', async () => {
    const { container } = render(
      <TextField
        label="Email"
        description="Work address"
        isInvalid
        errorMessage="Required"
        validationBehavior="aria"
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(input).toHaveAccessibleDescription(expect.stringContaining('Work address'))
    expect(input).toHaveAccessibleDescription(expect.stringContaining('Required'))
    expect(input).toHaveAttribute('aria-invalid', 'true')
    await expectNoAxeViolations(container)
  })

  it('SearchField clears with Escape and with the clear button', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchField label="Search" onChange={onChange} />)
    const input = screen.getByRole('searchbox', { name: 'Search' })
    await user.type(input, 'abc')
    expect(input).toHaveValue('abc')
    await user.keyboard('{Escape}')
    expect(input).toHaveValue('')
    await user.type(input, 'xy')
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(input).toHaveValue('')
  })
})

describe('Select', () => {
  it('opens with the keyboard, navigates options, and announces the selection', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <Select label="Region" placeholder="Pick one" onSelectionChange={onChange}>
        <SelectItem id="na">North America</SelectItem>
        <SelectItem id="eu">Europe</SelectItem>
      </Select>,
    )
    const trigger = screen.getByRole('button', { name: /Region/ })
    await expectNoAxeViolations(container)
    trigger.focus()
    await user.keyboard('{ArrowDown}')
    const listbox = await screen.findByRole('listbox')
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('eu')
    await waitFor(() => expect(listbox).not.toBeInTheDocument())
    expect(trigger).toHaveTextContent('Europe')
    expect(trigger).toHaveFocus()
  })
})

describe('Checkbox and Switch', () => {
  it('CheckboxGroup exposes a labelled group and toggles with Space', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <CheckboxGroup label="Channels" onChange={onChange}>
        <Checkbox value="email">Email</Checkbox>
        <Checkbox value="sms">SMS</Checkbox>
      </CheckboxGroup>,
    )
    expect(screen.getByRole('group', { name: 'Channels' })).toBeInTheDocument()
    await user.tab()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenLastCalledWith(['email'])
    expect(screen.getByRole('checkbox', { name: 'Email' })).toBeChecked()
    await expectNoAxeViolations(container)
  })

  it('Switch has role="switch" and toggles', async () => {
    const user = userEvent.setup()
    render(<Switch>Digest</Switch>)
    const sw = screen.getByRole('switch', { name: 'Digest' })
    expect(sw).not.toBeChecked()
    await user.click(sw)
    expect(sw).toBeChecked()
  })
})

describe('Modal', () => {
  it('traps focus, closes on Escape, and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    render(
      <DialogTrigger>
        <Button>Open</Button>
        <Modal title="Confirm">
          {({ close }) => (
            <>
              <p>Body</p>
              <Button onPress={close}>Cancel</Button>
            </>
          )}
        </Modal>
      </DialogTrigger>,
    )
    const trigger = screen.getByRole('button', { name: 'Open' })
    await user.click(trigger)
    const dialog = await screen.findByRole('dialog', { name: 'Confirm' })
    // React Aria hides everything outside the modal from assistive tech (aria-hidden),
    // so the trigger is no longer in the accessibility tree while the dialog is open.
    expect(screen.queryByRole('button', { name: 'Open' })).toBeNull()

    // Tab cycles within the dialog.
    await user.tab()
    await user.tab()
    await user.tab()
    expect(dialog.contains(document.activeElement)).toBe(true)
    await expectNoAxeViolations(dialog)

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('the Close button and the render-prop close both dismiss', async () => {
    const user = userEvent.setup()
    render(
      <DialogTrigger>
        <Button>Open</Button>
        <Modal title="Confirm">{({ close }) => <Button onPress={close}>Cancel</Button>}</Modal>
      </DialogTrigger>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.click(await screen.findByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.click(await screen.findByRole('button', { name: 'Close dialog' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})

describe('Tabs', () => {
  it('arrow keys move between tabs and the panel follows', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Tabs>
        <TabList aria-label="Sections">
          <Tab id="a">Alpha</Tab>
          <Tab id="b">Beta</Tab>
        </TabList>
        <TabPanel id="a">Alpha panel</TabPanel>
        <TabPanel id="b">Beta panel</TabPanel>
      </Tabs>,
    )
    await user.tab()
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Beta panel')
    await expectNoAxeViolations(container)
  })
})

describe('Tooltip', () => {
  it('opens on keyboard focus and is linked via aria-describedby', async () => {
    const user = userEvent.setup()
    render(
      <TooltipTrigger delay={0}>
        <Button>Info</Button>
        <Tooltip>More detail</Tooltip>
      </TooltipTrigger>,
    )
    await user.tab()
    const tip = await screen.findByRole('tooltip')
    expect(tip).toHaveTextContent('More detail')
    expect(screen.getByRole('button', { name: 'Info' })).toHaveAccessibleDescription('More detail')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })
})

describe('Toast', () => {
  it('renders queued toasts in a live region and can be dismissed', async () => {
    const user = userEvent.setup()
    render(<Toaster />)
    toast.add({ title: 'Saved', description: 'All good', tone: 'success' })
    const region = await screen.findByRole('region', { name: /notification/i })
    const item = within(region).getByRole('alertdialog', { name: 'Saved' })
    expect(item).toHaveAccessibleDescription('All good')
    await user.click(within(item).getByRole('button', { name: 'Dismiss notification' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })
})
