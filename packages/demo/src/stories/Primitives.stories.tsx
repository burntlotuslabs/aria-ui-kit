import {
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  DialogTrigger,
  Modal,
  SearchField,
  Select,
  SelectItem,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  Toaster,
  Tooltip,
  TooltipTrigger,
  toast,
} from '@burntlotuslabs/aria-ui-kit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Gallery } from '../demo/Gallery'

const meta = {
  title: 'Primitives/Overview',
  component: Gallery,
  parameters: {
    docs: { description: { component: 'Every primitive on one page, in the same order as the README.' } },
  },
} satisfies Meta<typeof Gallery>

export default meta
type Story = StoryObj<typeof meta>

export const AllPrimitives: Story = {
  render: () => (
    <>
      <Gallery />
      <Toaster />
    </>
  ),
}

export const Buttons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button size="sm">Small</Button>
      <Button isDisabled>Disabled</Button>
      <Button isPending>Pending</Button>
    </div>
  ),
}

export const Badges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>Neutral</Badge>
      <Badge tone="info">Info</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="danger">Danger</Badge>
    </div>
  ),
}

export const Fields: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <TextField label="Name" description="Shown publicly." />
      <TextField label="Email" isInvalid errorMessage="Enter a valid address." validationBehavior="aria" />
      <TextField label="Notes" multiline />
      <SearchField label="Search" />
      <Select label="Region" placeholder="Pick one">
        <SelectItem id="na">North America</SelectItem>
        <SelectItem id="eu">Europe</SelectItem>
      </Select>
      <CheckboxGroup label="Channels" defaultValue={['email']}>
        <Checkbox value="email">Email</Checkbox>
        <Checkbox value="sms">SMS</Checkbox>
      </CheckboxGroup>
      <Switch defaultSelected>Weekly digest</Switch>
    </div>
  ),
}

export const Overlays: Story = {
  render: () => (
    <div className="flex gap-2">
      <TooltipTrigger>
        <Button variant="secondary">Tooltip</Button>
        <Tooltip>Opens on hover and focus.</Tooltip>
      </TooltipTrigger>
      <DialogTrigger>
        <Button variant="secondary">Modal</Button>
        <Modal title="Example" size="sm">
          {({ close }) => (
            <>
              <p className="text-sm">Focus is trapped here. Escape closes.</p>
              <Button onPress={close}>Done</Button>
            </>
          )}
        </Modal>
      </DialogTrigger>
      <Button
        variant="secondary"
        onPress={() => toast.add({ title: 'Hello', tone: 'info' }, { timeout: 4000 })}
      >
        Toast
      </Button>
      <Toaster />
    </div>
  ),
}

export const TabsExample: Story = {
  name: 'Tabs',
  render: () => (
    <Tabs>
      <TabList aria-label="Example">
        <Tab id="one">One</Tab>
        <Tab id="two">Two</Tab>
        <Tab id="three" isDisabled>
          Three
        </Tab>
      </TabList>
      <TabPanel id="one">Panel one</TabPanel>
      <TabPanel id="two">Panel two</TabPanel>
      <TabPanel id="three">Panel three</TabPanel>
    </Tabs>
  ),
}
