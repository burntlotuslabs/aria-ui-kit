import {
  AppShell,
  Card,
  Container,
  Link,
  Logo,
  Select,
  SelectItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  type ThemeConfig,
  ThemeModeProvider,
  ThemeProvider,
  ThemeToggle,
  Toaster,
  themes,
} from '@burntlotuslabs/aria-ui-kit'
import { useState } from 'react'
import { type Project, projects as seed } from './demo/data'
import { Gallery } from './demo/Gallery'
import { NewProjectDialog } from './demo/NewProjectDialog'
import { ProjectsTable } from './demo/ProjectsTable'

export function App() {
  const [theme, setTheme] = useState<ThemeConfig>(themes[0])
  return (
    <ThemeModeProvider>
      <ThemeProvider theme={theme}>
        <Shell theme={theme} onThemeChange={setTheme} />
      </ThemeProvider>
    </ThemeModeProvider>
  )
}

function Shell({ theme, onThemeChange }: { theme: ThemeConfig; onThemeChange: (t: ThemeConfig) => void }) {
  const [projects, setProjects] = useState<Project[]>(seed)

  return (
    <AppShell
      header={
        <>
          <div className="flex items-center gap-2">
            <Logo decorative size={32} />
            <span className="text-base font-semibold">Aria UI Kit</span>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Select
              aria-label="Brand theme"
              selectedKey={theme.id}
              onSelectionChange={(k) => onThemeChange(themes.find((t) => t.id === k) ?? themes[0])}
              className="w-40"
            >
              {themes.map((t) => (
                <SelectItem key={t.id} id={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </Select>
            <ThemeToggle />
          </div>
        </>
      }
      footer={<p>Aria UI Kit: a design system on react-aria-components.</p>}
    >
      <Container className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Aria UI Kit</h1>
          <p className="mt-1 max-w-3xl text-sm text-fg-muted">
            A small component system built on{' '}
            <code className="rounded bg-surface-3 px-1">react-aria-components</code>: form fields, overlays,
            tabs, toasts, a layout shell, and a filterable, sortable, expandable data table that share one
            skin and one theme contract. Everything here works with the keyboard alone.{' '}
            <Link href="#theming" variant="subtle">
              About theming
            </Link>
          </p>
        </div>

        <Tabs>
          <TabList aria-label="Demo sections">
            <Tab id="projects">Projects table</Tab>
            <Tab id="gallery">Component gallery</Tab>
          </TabList>
          <TabPanel id="projects" className="flex flex-col gap-3">
            <div className="flex justify-end">
              <NewProjectDialog onCreate={(p) => setProjects((prev) => [p, ...prev])} />
            </div>
            <ProjectsTable data={projects} />
          </TabPanel>
          <TabPanel id="gallery">
            <Gallery />
          </TabPanel>
        </Tabs>

        <Card id="theming" title="How theming works" className="mt-8 text-sm">
          <p className="text-fg-muted">
            Components only ever use semantic utilities like <code>bg-surface</code>, <code>text-fg</code> and{' '}
            <code>bg-accent</code>. Those read CSS variables. Light and dark are a class on the root element
            that swaps the variable values; a brand theme is a plain object of overrides that{' '}
            <code>ThemeProvider</code> writes onto the root at runtime. A consuming app owns one theme file
            and never touches component code. The picker above is switching between three such objects.
          </p>
        </Card>

        <Toaster />
      </Container>
    </AppShell>
  )
}
