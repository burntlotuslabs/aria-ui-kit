# Changelog

## 0.1.0 - Unreleased

### Added
- `ThemeScript`: inline script for `<head>` that applies the stored mode and brand before first paint, so server-rendered pages do not flash light mode. Theme providers now start from SSR-safe state and sync before paint, so hydration with a stored preference no longer mismatches.
- Primitives: Button, Badge, Card, Link, Checkbox, Switch, TextField, SearchField, Select, Tooltip, Modal, Tabs, Toast.
- Table suite: Table, FilterDropdown, ExpandToggle, `useExpandedRows`, `useColumnFilters`, sort/filter helpers.
- `Logo`: a generic circles mark as inline SVG, themeable (`palette="theme"`) or the artwork colors (`palette="original"`), with `title`/`decorative` accessibility handling.
- Layout: `AppShell` (landmarks, skip link, responsive menu drawer), `SkipLink`, `Container`, `Stack`, `Cluster`, `Grid`.
- Theming: ThemeModeProvider, ThemeProvider, ThemeToggle, `default` / `bukulicious` / `fire` themes.
- `@burntlotuslabs/aria-ui-kit/styles.css` (compiled) and `/tokens.css` (Tailwind v4 `@theme` source).

### Fixed
- Light and dark `fg-subtle` (placeholder text) failed WCAG AA in every theme; darkened and now covered by `contrast.test.ts`.

### Notes
- Requires `react-aria-components` >= 1.22 (1.21.1 breaks Select focus restore under React 19.3).
- Entry bundles carry a `'use client'` directive for Next app-router hosts.

### Breaking

- None (first release).
