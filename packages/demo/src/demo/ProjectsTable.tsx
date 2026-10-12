import {
  applyColumnFilters,
  Badge,
  type BadgeTone,
  Button,
  Cell,
  Column,
  countActiveFilters,
  cx,
  distinctValues,
  ExpandToggle,
  type FilterableColumn,
  FilterDropdown,
  Row,
  type SortableColumn,
  sortRows,
  Table,
  TableBody,
  TableHeader,
  useColumnFilters,
  useExpandedRows,
} from '@burntlotuslabs/aria-ui-kit'
import { useMemo, useState } from 'react'
import type { SortDescriptor } from 'react-aria-components'
import type { Project } from './data'

const sortableColumns: SortableColumn<Project>[] = [
  { id: 'name', type: 'string', accessor: (p) => p.name },
  { id: 'owner', type: 'string', accessor: (p) => p.owner },
  { id: 'team', type: 'string', accessor: (p) => p.team },
  { id: 'status', type: 'string', accessor: (p) => p.status },
  { id: 'priority', type: 'string', accessor: (p) => p.priority },
  { id: 'budget', type: 'number', accessor: (p) => p.budget },
  { id: 'dueDate', type: 'date', accessor: (p) => p.dueDate },
]

const filterableColumns: FilterableColumn<Project>[] = [
  { id: 'owner', accessor: (p) => p.owner },
  { id: 'team', accessor: (p) => p.team },
  { id: 'status', accessor: (p) => p.status },
  { id: 'priority', accessor: (p) => p.priority },
]

const COLUMN_COUNT = 8

/** Body rows are a flat list: each project, optionally followed by its detail row. */
type BodyItem =
  | { kind: 'project'; id: string; project: Project }
  | { kind: 'detail'; id: string; project: Project }

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const dateFmt = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' })

export interface ProjectsTableProps {
  data: Project[]
}

export function ProjectsTable({ data }: ProjectsTableProps) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  })
  const { filters, setColumn, clearAll } = useColumnFilters()
  const { isExpanded, toggle } = useExpandedRows()

  const options = useMemo(
    () => Object.fromEntries(filterableColumns.map((c) => [c.id, distinctValues(data, c.accessor)])),
    [data],
  )

  const rows = useMemo(() => {
    const filtered = applyColumnFilters(data, filters, filterableColumns)
    return sortRows(filtered, sortDescriptor, sortableColumns)
  }, [data, filters, sortDescriptor])

  const bodyItems = useMemo<BodyItem[]>(
    () =>
      rows.flatMap((project) =>
        isExpanded(project.id)
          ? [
              { kind: 'project', id: project.id, project },
              { kind: 'detail', id: detailId(project.id), project },
            ]
          : [{ kind: 'project', id: project.id, project }],
      ),
    [rows, isExpanded],
  )

  const activeCount = countActiveFilters(filters)

  const filterFor = (id: string, label: string) => (
    <FilterDropdown
      label={label}
      options={options[id]}
      selected={filters[id] ?? new Set()}
      onChange={(next) => setColumn(id, next)}
    />
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-fg-muted" aria-live="polite">
        <span>
          Showing {rows.length} of {data.length} projects
          {activeCount > 0 && ` (${activeCount} column ${activeCount === 1 ? 'filter' : 'filters'} active)`}
        </span>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onPress={clearAll}>
            Clear all filters
          </Button>
        )}
      </div>

      <div className="overflow-auto rounded-lg border border-edge bg-surface">
        <Table aria-label="Projects" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
          <TableHeader>
            <Column id="expand" className="w-10">
              <span className="sr-only">Details</span>
            </Column>
            <Column id="name" isRowHeader allowsSorting>
              Project
            </Column>
            <Column id="owner" allowsSorting extra={filterFor('owner', 'owner')}>
              Owner
            </Column>
            <Column id="team" allowsSorting extra={filterFor('team', 'team')}>
              Team
            </Column>
            <Column id="status" allowsSorting extra={filterFor('status', 'status')}>
              Status
            </Column>
            <Column id="priority" allowsSorting extra={filterFor('priority', 'priority')}>
              Priority
            </Column>
            <Column id="budget" allowsSorting className="text-right">
              Budget
            </Column>
            <Column id="dueDate" allowsSorting>
              Due
            </Column>
          </TableHeader>
          <TableBody
            items={bodyItems}
            renderEmptyState={() => <div className="p-6">No projects match the current filters.</div>}
          >
            {(item) =>
              item.kind === 'project' ? (
                <Row id={item.id} className={cx(isExpanded(item.id) && 'bg-accent-soft/60')}>
                  <Cell>
                    <ExpandToggle
                      isExpanded={isExpanded(item.id)}
                      onToggle={() => toggle(item.id)}
                      rowLabel={item.project.name}
                      controlsId={detailId(item.id)}
                    />
                  </Cell>
                  <Cell className="font-medium text-fg">{item.project.name}</Cell>
                  <Cell>{item.project.owner}</Cell>
                  <Cell>{item.project.team}</Cell>
                  <Cell>
                    <StatusBadge status={item.project.status} />
                  </Cell>
                  <Cell>{item.project.priority}</Cell>
                  <Cell className="text-right tabular-nums">
                    {item.project.budget === null ? <Unset /> : currency.format(item.project.budget)}
                  </Cell>
                  <Cell>
                    {item.project.dueDate ? dateFmt.format(new Date(item.project.dueDate)) : <Unset />}
                  </Cell>
                </Row>
              ) : (
                <Row id={item.id} className="bg-accent-soft/40">
                  <Cell colSpan={COLUMN_COUNT} className="px-6 py-3">
                    <ProjectDetail id={item.id} project={item.project} />
                  </Cell>
                </Row>
              )
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function detailId(projectId: string) {
  return `${projectId}__detail`
}

function ProjectDetail({ id, project }: { id: string; project: Project }) {
  const done = project.milestones.filter((m) => m.done).length
  return (
    <div id={id} className="flex flex-col gap-2 text-sm">
      <p className="text-fg">{project.description}</p>
      <div>
        <p className="font-semibold text-fg">
          Milestones ({done}/{project.milestones.length} complete)
        </p>
        <ul className="mt-1 list-disc pl-5 text-fg">
          {project.milestones.map((m) => (
            <li key={m.title} className={cx(m.done && 'line-through text-fg-muted')}>
              {m.title}
              <span className="sr-only">{m.done ? ' (complete)' : ' (incomplete)'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Project['status'] }) {
  const tone: Record<Project['status'], BadgeTone> = {
    Planned: 'neutral',
    'In progress': 'info',
    Blocked: 'danger',
    Done: 'success',
  }
  return <Badge tone={tone[status]}>{status}</Badge>
}

function Unset() {
  return (
    <span className="text-fg-subtle">
      —<span className="sr-only">not set</span>
    </span>
  )
}
