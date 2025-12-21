# Copilot Instructions for sigestei

## Project Overview
- This is a Next.js (App Router) monorepo using TypeScript, PNPM, and custom component architecture.
- Main app code is under `app/`, with feature folders for each route (e.g., `app/reports/`, `app/admin/users/`).
- UI and layout components are in `components/`, grouped by domain (e.g., `components/layout/`, `components/navigation/`, `components/ui/`).
- Sidebar navigation data is in `data/` (e.g., `sidebarAnalystData.ts`).
- Layouts are composed using `layouts/` (e.g., `LayoutSideBar.tsx`).

## Key Patterns & Conventions
- **Route Grouping:** For code organization, feature logic (e.g., admin pages) may be grouped in folders like `app/admin/`, but public URLs are controlled by where the `page.tsx` lives. To expose `/dashboard`, place `page.tsx` in `app/dashboard/` and import logic from `app/admin/Dashboard.tsx`.
- **Navigation:** Sidebar and navigation components expect navigation data objects (see `data/sidebarAnalystData.ts`). To change navigation, update these data files.
- **Absolute URLs:** Always use absolute URLs (e.g., `/dashboard`, `/reports`) in navigation to avoid route context issues with Next.js App Router.
- **Layout Usage:** Use `LayoutSideBar` for pages that require the sidebar. Wrap page content in this layout (see `app/reports/page.tsx`).
- **Component Importing:** Prefer importing shared logic/components from `components/` or feature folders, not duplicating code in each route.

- **Name of functions and variables:** Use descriptive names that reflect their purpose. For example, use `DashboardPage` for the page component that renders the dashboard, and `UserPage` for the user management page, it would be named in english.

- **Conventional Commits:** Follow conventional commit messages for clarity (e.g., `feat: add user profile page`, `fix: correct sidebar link`).

## Developer Workflows
- **Start Dev Server:** `pnpm dev` (or `npm run dev`, `yarn dev`)
- **Build:** `pnpm build`
- **Lint:** `pnpm lint`
- **Dependencies:** Managed with PNPM (`pnpm install`).

## External Integrations
- Uses Lucide icons (`lucide-react`), Radix UI, and custom UI primitives.
- No backend API code in this repo; all logic is client-side or static.

## Examples
- To add a new admin page at `/admin/settings` (URL `/settings`):
  1. Place logic in `app/admin/Settings.tsx`.
  2. Create `app/settings/page.tsx` that imports and renders `Settings`.
- To update sidebar navigation, edit `data/sidebarAnalystData.ts` and ensure URLs are absolute.

## References
- See `README.md` for Next.js basics and dev commands.
- See `components/navigation/navigation.tsx` for navigation rendering logic.
- See `layouts/LayoutSideBar.tsx` for sidebar layout usage.

---
If any conventions or workflows are unclear, please ask for clarification or examples from the codebase.
