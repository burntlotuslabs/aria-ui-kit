import {
  Badge,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  DialogTrigger,
  Link,
  Modal,
  SearchField,
  Select,
  SelectItem,
  Switch,
  TextField,
  Tooltip,
  TooltipTrigger,
  toast,
} from '@burntlotuslabs/aria-ui-kit'
import { useState } from 'react'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card title={title} className="flex flex-col gap-3">
      {children}
    </Card>
  )
}

/** Every primitive in one place, so a reviewer can tab through the whole kit in a minute. */
export function Gallery() {
  const [pending, setPending] = useState(false)
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm">Small</Button>
          <Button isDisabled>Disabled</Button>
          <Button
            variant="secondary"
            isPending={pending}
            onPress={() => {
              setPending(true)
              setTimeout(() => setPending(false), 1500)
            }}
          >
            {pending ? 'Saving…' : 'Pending demo'}
          </Button>
        </div>
      </Section>

      <Section title="Links and badges">
        <p className="text-sm text-fg-muted">
          An <Link href="#">inline link</Link> and a{' '}
          <Link href="#" variant="subtle">
            subtle one
          </Link>
          . Both render a real anchor and take the shared focus ring.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </Section>

      <Section title="Text fields">
        <TextField label="Name" placeholder="Jane Doe" description="Shown on the project card." />
        <TextField
          label="Email"
          type="email"
          isRequired
          defaultValue="not-an-email"
          validationBehavior="aria"
          isInvalid
          errorMessage="Enter a valid email address."
        />
        <SearchField label="Search" />
      </Section>

      <Section title="Select">
        <Select label="Region" placeholder="Pick one" defaultSelectedKey="eu">
          <SelectItem id="na">North America</SelectItem>
          <SelectItem id="eu">Europe</SelectItem>
          <SelectItem id="apac">Asia Pacific</SelectItem>
          <SelectItem id="latam" isDisabled>
            Latin America (coming soon)
          </SelectItem>
        </Select>
      </Section>

      <Section title="Checkbox, group, switch">
        <CheckboxGroup label="Notifications" defaultValue={['email']} description="Choose at least one.">
          <Checkbox value="email">Email</Checkbox>
          <Checkbox value="sms">SMS</Checkbox>
          <Checkbox value="push" isDisabled>
            Push (unavailable)
          </Checkbox>
        </CheckboxGroup>
        <Checkbox isIndeterminate>Indeterminate</Checkbox>
        <Switch defaultSelected>Enable weekly digest</Switch>
      </Section>

      <Section title="Overlays">
        <div className="flex flex-wrap items-center gap-2">
          <TooltipTrigger>
            <Button variant="secondary">Hover or focus me</Button>
            <Tooltip>Tooltips open on focus too, and close on Escape.</Tooltip>
          </TooltipTrigger>
          <DialogTrigger>
            <Button variant="secondary">Open modal</Button>
            <Modal title="Confirm archive" size="sm" role="alertdialog">
              {({ close }) => (
                <>
                  <p className="text-sm text-fg">
                    Archived projects are hidden from every list but can be restored later.
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onPress={close}>
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onPress={() => {
                        toast.add({ title: 'Project archived', tone: 'danger' }, { timeout: 4000 })
                        close()
                      }}
                    >
                      Archive
                    </Button>
                  </div>
                </>
              )}
            </Modal>
          </DialogTrigger>
          <Button
            variant="secondary"
            onPress={() =>
              toast.add(
                { title: 'Saved', description: 'Your changes are live.', tone: 'success' },
                { timeout: 4000 },
              )
            }
          >
            Show toast
          </Button>
        </div>
      </Section>
    </div>
  )
}
