import {
  AppShell,
  Badge,
  Card,
  Cluster,
  Container,
  Grid,
  Link,
  Logo,
  Stack,
  ThemeToggle,
} from '@burntlotuslabs/aria-ui-kit'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Layout/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    bleed: true,
    docs: {
      description: {
        component:
          'Page chrome with the landmarks screen-reader users navigate by (banner, main, contentinfo, your nav), a skip link, ' +
          'and a sidebar that becomes a drawer below the md breakpoint. The drawer is React Aria overlay: focus trap, Escape, focus restore.',
      },
    },
  },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

const items = ['Overview', 'Projects', 'Reports', 'Settings']

const nav = ({ close }: { close?: () => void }) => (
  <nav aria-label="Primary">
    <ul className="flex flex-col gap-1">
      {items.map((label, i) => (
        <li key={label}>
          <Link
            href={`#${label.toLowerCase()}`}
            variant="subtle"
            onPress={close}
            className="block rounded-md px-3 py-2 text-sm hover:bg-surface-2 data-[current]:bg-surface-2 data-[current]:font-medium data-[current]:text-fg"
            data-current={i === 0 ? true : undefined}
            aria-current={i === 0 ? 'page' : undefined}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)

const header = (
  <>
    <div className="flex items-center gap-2">
      <Logo decorative size={32} />
      <span className="font-semibold">Acme</span>
    </div>
    <div className="ml-auto">
      <ThemeToggle />
    </div>
  </>
)

export const WithSidebar: Story = {
  args: {
    header,
    sidebar: nav,
    footer: <p>Footer content</p>,
    children: (
      <Container className="py-6">
        <Stack gap={6}>
          <h1 className="text-2xl font-bold">Overview</h1>
          <Cluster gap={2}>
            <Badge tone="success">Healthy</Badge>
            <Badge tone="info">3 updates</Badge>
          </Cluster>
          <Grid min="14rem" gap={4}>
            {['Revenue', 'Orders', 'Visitors', 'Refunds'].map((t) => (
              <Card key={t} title={t} as="h2">
                <p className="text-sm text-fg-muted">Sample figure for {t.toLowerCase()}.</p>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>
    ),
  },
}

export const HeaderOnly: Story = {
  args: {
    header,
    children: (
      <Container size="sm" className="py-6">
        <Stack>
          <h1 className="text-2xl font-bold">No sidebar</h1>
          <p className="text-fg-muted">Without a sidebar there is no menu button and no drawer.</p>
        </Stack>
      </Container>
    ),
  },
}
