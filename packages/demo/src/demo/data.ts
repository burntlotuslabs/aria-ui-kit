/**
 * Fully fictional sample data: a generic project tracker.
 * Names, people, and numbers are invented and resemble no real dataset.
 */
export type Status = 'Planned' | 'In progress' | 'Blocked' | 'Done'
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface Milestone {
  title: string
  done: boolean
}

export interface Project {
  id: string
  name: string
  owner: string
  team: string
  status: Status
  priority: Priority
  budget: number | null
  dueDate: string | null // ISO date
  description: string
  milestones: Milestone[]
}

export const projects: Project[] = [
  {
    id: 'p-01',
    name: 'Atlas migration',
    owner: 'Priya Raman',
    team: 'Platform',
    status: 'In progress',
    priority: 'High',
    budget: 120000,
    dueDate: '2026-11-15',
    description: 'Move the legacy job scheduler onto the new queue service with zero downtime.',
    milestones: [
      { title: 'Shadow traffic enabled', done: true },
      { title: 'Cutover rehearsal', done: false },
      { title: 'Production cutover', done: false },
    ],
  },
  {
    id: 'p-02',
    name: 'Billing reconciliation',
    owner: 'Marcus Oyelaran',
    team: 'Finance Eng',
    status: 'Blocked',
    priority: 'Critical',
    budget: 45000,
    dueDate: '2026-10-01',
    description: 'Nightly job that diffs ledger entries against the payment processor export.',
    milestones: [
      { title: 'Export parser', done: true },
      { title: 'Diff engine', done: true },
      { title: 'Alerting on mismatches', done: false },
    ],
  },
  {
    id: 'p-03',
    name: 'Design tokens v2',
    owner: 'Sofia Lindqvist',
    team: 'Design Systems',
    status: 'Planned',
    priority: 'Medium',
    budget: 18000,
    dueDate: '2027-01-20',
    description: 'Consolidate color, spacing and typography tokens into a single published package.',
    milestones: [
      { title: 'Token audit', done: false },
      { title: 'Codegen pipeline', done: false },
    ],
  },
  {
    id: 'p-04',
    name: 'Mobile onboarding',
    owner: 'Priya Raman',
    team: 'Growth',
    status: 'Done',
    priority: 'High',
    budget: 62000,
    dueDate: '2026-08-30',
    description: 'Three-step signup flow with progressive profiling and passkey support.',
    milestones: [
      { title: 'Passkey enrollment', done: true },
      { title: 'A/B rollout', done: true },
    ],
  },
  {
    id: 'p-05',
    name: 'Search relevance tuning',
    owner: 'Dmitri Volkov',
    team: 'Platform',
    status: 'In progress',
    priority: 'Medium',
    budget: 30000,
    dueDate: '2026-12-05',
    description: 'Replace TF-IDF ranking with a learned reranker for the internal knowledge base.',
    milestones: [
      { title: 'Offline eval harness', done: true },
      { title: 'Reranker training', done: false },
      { title: 'Shadow deployment', done: false },
    ],
  },
  {
    id: 'p-06',
    name: 'Audit log retention',
    owner: 'Marcus Oyelaran',
    team: 'Security',
    status: 'Planned',
    priority: 'Low',
    budget: null,
    dueDate: null,
    description:
      'Define and enforce a 400-day retention policy for audit events. Budget and date not yet set.',
    milestones: [{ title: 'Policy draft', done: false }],
  },
  {
    id: 'p-07',
    name: 'Warehouse picker app',
    owner: 'Aiko Tanaka',
    team: 'Operations',
    status: 'In progress',
    priority: 'Critical',
    budget: 95000,
    dueDate: '2026-10-20',
    description: 'Handheld scanner UI for pick-and-pack, offline first with background sync.',
    milestones: [
      { title: 'Offline queue', done: true },
      { title: 'Barcode scanner integration', done: true },
      { title: 'Pilot in one warehouse', done: false },
    ],
  },
  {
    id: 'p-08',
    name: 'Accessibility remediation',
    owner: 'Sofia Lindqvist',
    team: 'Design Systems',
    status: 'Done',
    priority: 'High',
    budget: 22000,
    dueDate: '2026-07-10',
    description: 'Fix every WCAG 2.2 AA finding from the external audit across the admin console.',
    milestones: [
      { title: 'Focus order fixes', done: true },
      { title: 'Contrast fixes', done: true },
      { title: 'Re-audit', done: true },
    ],
  },
  {
    id: 'p-09',
    name: 'Cost dashboard',
    owner: 'Dmitri Volkov',
    team: 'Finance Eng',
    status: 'Blocked',
    priority: 'Medium',
    budget: 15000,
    dueDate: '2026-11-30',
    description: 'Per-team cloud spend dashboard. Blocked on billing export API access.',
    milestones: [
      { title: 'Data model', done: true },
      { title: 'Export API access', done: false },
    ],
  },
  {
    id: 'p-10',
    name: 'Incident runbooks',
    owner: 'Aiko Tanaka',
    team: 'Security',
    status: 'Planned',
    priority: 'Low',
    budget: 8000,
    dueDate: '2027-02-14',
    description: 'Write and rehearse runbooks for the top ten incident classes from last year.',
    milestones: [{ title: 'Incident class taxonomy', done: false }],
  },
]
