# Copilot Instructions for HealthConnect Nabha Frontend

## Project Overview
- This is a Next.js 13+ app, built and deployed via [v0.app](https://v0.app) and Vercel.
- The app provides telemedicine services for rural healthcare, with dashboards for different user roles (admin, doctor, patient, ASHA worker).
- Code is auto-synced from v0.app deployments; manual changes may be overwritten by future syncs.

## Architecture & Structure
- All main pages are in `app/`, using the Next.js App Router (`page.tsx` per route).
- Role-based dashboards: `app/dashboard/{admin,doctor,patient,asha}/page.tsx`.
- Shared UI components are in `components/ui/` (e.g., `button.tsx`, `card.tsx`).
- Global layout and metadata: `app/layout.tsx`.
- Utility functions: `lib/utils.ts`.
- Styles: Tailwind CSS, configured in `styles/globals.css` and referenced in `app/globals.css`.
- Aliases for imports are defined in `components.json` (e.g., `@/components`, `@/lib`).

## Developer Workflows
- **Start dev server:** `npm run dev` (or `pnpm dev`)
- **Build for production:** `npm run build`
- **Lint:** `npm run lint`
- **Start production server:** `npm run start`
- **Deploy:** Push to main branch; Vercel auto-deploys.
- **v0.app sync:** Changes made in v0.app are auto-pushed here.

## Patterns & Conventions
- Use React Server Components by default; add `"use client"` for client-side interactivity.
- UI components follow shadcn/ui conventions (see `components.json`).
- Use import aliases for cleaner imports (e.g., `import { Button } from "@/components/ui/button"`).
- Metadata for pages is set via exported `metadata` objects in page/layout files.
- Data visualization uses `recharts` and icons from `lucide-react`.

## External Dependencies
- Major UI: `@radix-ui/*`, `shadcn/ui`, `lucide-react`, `recharts`.
- Form handling: `@hookform/resolvers`.
- Analytics: `@vercel/analytics/next`.
- Font: `geist/font/sans`, `geist/font/mono`.

## Integration Points
- No direct database in frontend; data is expected from backend APIs (not present in this repo).
- Images and static assets are in `public/`.

## Examples
- To add a new dashboard role, create `app/dashboard/{role}/page.tsx` and use shared UI components.
- For a new UI element, add to `components/ui/` and update import aliases in `components.json` if needed.

---
For questions about v0.app sync, see the README. For backend/API integration, coordinate with the backend team.
