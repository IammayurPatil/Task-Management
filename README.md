# Task Management

A task management app built with Next.js, Tailwind CSS, MUI, and Redux Toolkit.

## Setup

1. Install dependencies:
   `pnpm install`
2. Start the dev server:
   `pnpm dev`
3. Open the app:
   `http://localhost:3000`

## Commands

- `pnpm dev` — start the development server
- `pnpm build` — build for production
- `pnpm start` — run the production build
- `pnpm lint` — run lint checks (if configured)

## Folder Structure

- `components/` — UI components (dashboard, project, shared UI)
- `pages/` — Next.js routes and API endpoints
- `pages/api/` — API routes (auth, projects, tasks, stats, activity)
- `store/` — Redux store, thunks, slices
- `lib/` — shared utilities (API client, auth helpers, theme)
- `styles/` — global styles (Tailwind base, app styles)
- `types.ts` — shared TypeScript types
