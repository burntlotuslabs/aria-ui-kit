import { FilterDropdown } from '@burntlotuslabs/aria-ui-kit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

const options = ['Planned', 'In progress', 'Blocked', 'Done']

function Demo({ initial = [] as string[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initial))
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="font-semibold">Status</span>
      <FilterDropdown label="status" options={options} selected={selected} onChange={setSelected} />
      <span className="text-fg-muted">
        {selected.size === 0 ? 'No filter' : `Selected: ${[...selected].join(', ')}`}
      </span>
    </div>
  )
}

const meta = {
  title: 'Primitives/FilterDropdown',
  component: Demo,
  parameters: {
    docs: {
      description: {
        component:
          'Multi-select column filter on top of React Aria Popover + Dialog + CheckboxGroup. ' +
          'Focus is trapped while open, Escape / outside click dismiss, and focus returns to the funnel button.',
      },
    },
  },
} satisfies Meta<typeof Demo>

export default meta
type Story = StoryObj<typeof meta>

export const Inactive: Story = {}

export const WithSelection: Story = { args: { initial: ['Blocked', 'Done'] } }
