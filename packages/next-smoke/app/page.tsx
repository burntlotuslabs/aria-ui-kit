import {
  Badge,
  Button,
  bukuliciousTheme,
  Card,
  Cell,
  Column,
  Row,
  Select,
  SelectItem,
  Tab,
  TabList,
  Table,
  TableBody,
  TableHeader,
  TabPanel,
  Tabs,
  TextField,
  ThemeModeProvider,
  ThemeProvider,
  ThemeToggle,
} from '@burntlotuslabs/aria-ui-kit'

// Server component page rendering client components from the built package. A failure here is
// what a consumer would hit: missing 'use client', browser-only code at import time, or a
// hydration mismatch from the theme providers.
export default function Page() {
  return (
    <ThemeModeProvider>
      <ThemeProvider theme={bukuliciousTheme}>
        <main className="mx-auto max-w-2xl space-y-4 p-6">
          <ThemeToggle />
          <Card title="Next smoke test">
            <TextField label="Name" placeholder="Ada" />
            <Select label="Region" placeholder="Pick one">
              <SelectItem id="na">North America</SelectItem>
              <SelectItem id="eu">Europe</SelectItem>
            </Select>
            <Button>Save</Button> <Badge tone="success">Rendered on the server</Badge>
          </Card>
          <Tabs>
            <TabList aria-label="Demo">
              <Tab id="a">One</Tab>
              <Tab id="b">Two</Tab>
            </TabList>
            <TabPanel id="a">First panel</TabPanel>
            <TabPanel id="b">Second panel</TabPanel>
          </Tabs>
          <Table aria-label="Static table">
            <TableHeader>
              <Column id="n" isRowHeader>
                Name
              </Column>
              <Column id="r">Role</Column>
            </TableHeader>
            <TableBody>
              <Row id="1">
                <Cell>Ada</Cell>
                <Cell>Engineer</Cell>
              </Row>
            </TableBody>
          </Table>
        </main>
      </ThemeProvider>
    </ThemeModeProvider>
  )
}
