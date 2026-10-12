import type { Meta, StoryObj } from '@storybook/react-vite'
import { projects } from '../demo/data'
import { ProjectsTable } from '../demo/ProjectsTable'

const meta = {
  title: 'Composed/ProjectsTable',
  component: ProjectsTable,
  parameters: {
    docs: {
      description: {
        component:
          'The full composition: styled React Aria table + column filters + expandable detail rows + typed sorting. ' +
          'Tab into the grid, arrow around, Enter on a header to sort, Enter on a funnel to filter, Enter on ▶ to expand.',
      },
    },
  },
} satisfies Meta<typeof ProjectsTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { data: projects },
}

export const FewRows: Story = {
  args: { data: projects.slice(0, 3) },
}

export const Empty: Story = {
  args: { data: [] },
}
