import { Logo } from '@burntlotuslabs/aria-ui-kit'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Brand/Logo',
  component: Logo,
  parameters: {
    docs: {
      description: {
        component:
          'A generic circles mark as inline SVG, meant to be swapped for your own. By default it is painted from ' +
          'the semantic tokens (rings = fg, edge = accent), so it follows light/dark and the active brand theme. ' +
          'Use `palette="original"` for the artwork colors. Set `decorative` when visible text already names the product.',
      },
    },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Themed: Story = { args: { size: 160 } }
export const OriginalColors: Story = { args: { size: 160, palette: 'original' } }
export const Decorative: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Logo {...args} decorative size={40} />
      <span className="text-lg font-semibold">Acme</span>
    </div>
  ),
}
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <Logo size={24} />
      <Logo size={48} />
      <Logo size={96} />
    </div>
  ),
}
