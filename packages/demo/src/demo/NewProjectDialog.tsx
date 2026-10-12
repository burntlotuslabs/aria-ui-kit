import {
  Button,
  DialogTrigger,
  Modal,
  Select,
  SelectItem,
  Switch,
  TextField,
  toast,
} from '@burntlotuslabs/aria-ui-kit'
import { useState } from 'react'
import { Form } from 'react-aria-components'
import type { Priority, Project, Status } from './data'

const statuses: Status[] = ['Planned', 'In progress', 'Blocked', 'Done']
const teams = ['Platform', 'Finance Eng', 'Design Systems', 'Growth', 'Security', 'Operations']

export interface NewProjectDialogProps {
  onCreate: (project: Project) => void
}

/**
 * A realistic form composed from the kit: required-field validation via React Aria's
 * native-constraint support, a Select, a Switch, and a toast on success.
 */
export function NewProjectDialog({ onCreate }: NewProjectDialogProps) {
  const [team, setTeam] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('Planned')
  const [critical, setCritical] = useState(false)

  return (
    <DialogTrigger>
      <Button>New project</Button>
      <Modal title="New project">
        {({ close }) => (
          <Form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              const data = new FormData(e.currentTarget)
              const name = String(data.get('name') ?? '').trim()
              const project: Project = {
                id: `p-${Date.now()}`,
                name,
                owner: String(data.get('owner') ?? '').trim(),
                team: team ?? teams[0],
                status,
                priority: (critical ? 'Critical' : 'Medium') satisfies Priority,
                budget: data.get('budget') ? Number(data.get('budget')) : null,
                dueDate: data.get('dueDate') ? String(data.get('dueDate')) : null,
                description: String(data.get('description') ?? '').trim() || 'No description yet.',
                milestones: [],
              }
              onCreate(project)
              toast.add(
                { title: 'Project created', description: `${name} was added to the list.`, tone: 'success' },
                { timeout: 5000 },
              )
              close()
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/no-autofocus -- first field of a modal dialog; focus must land inside */}
            <TextField
              name="name"
              label="Project name"
              isRequired
              autoFocus
              placeholder="e.g. Atlas migration"
            />
            <TextField name="owner" label="Owner" isRequired placeholder="Full name" />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Team"
                placeholder="Choose a team"
                isRequired
                selectedKey={team}
                onSelectionChange={(k) => setTeam(String(k))}
              >
                {teams.map((t) => (
                  <SelectItem key={t} id={t}>
                    {t}
                  </SelectItem>
                ))}
              </Select>
              <Select label="Status" selectedKey={status} onSelectionChange={(k) => setStatus(k as Status)}>
                {statuses.map((s) => (
                  <SelectItem key={s} id={s}>
                    {s}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField
                name="budget"
                label="Budget (USD)"
                type="number"
                inputMode="numeric"
                description="Leave blank if not set."
              />
              <TextField name="dueDate" label="Due date" type="date" />
            </div>
            <TextField name="description" label="Description" multiline />
            <Switch isSelected={critical} onChange={setCritical}>
              Mark as critical priority
            </Switch>
            <div className="flex justify-end gap-2 border-t border-edge pt-4">
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button type="submit">Create project</Button>
            </div>
          </Form>
        )}
      </Modal>
    </DialogTrigger>
  )
}
