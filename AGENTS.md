# AGENTS.md

## Setup commands
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Run tests: `npm run test:coverage`

## Code style
- **File Naming**: Strict **kebab-case** for all files and directories (e.g., `coworker-message.tsx`).
- **Component Exports**: React components must be exported using **PascalCase**.
- **Framework**: Next.js App Router (v14/v15). Default to Server Components; use `'use client'` strictly for client hooks and browser APIs.
- **Styling**: Tailwind CSS and shadcn/ui. Reuse components from `components/ui/` before building custom ones. Avoid inline styles.

## Testing instructions
- **Coverage standard**: Maintain **>50% test coverage** for the frontend.
- **Colocation**: Unit tests must be colocated next to their target files (e.g., `button.tsx` alongside `button.test.tsx`). No root `__tests__` folder.
- **Frameworks**: Jest and React Testing Library.
- **Mocking Strategy**: Mock Clerk and Convex at the top of tests. Favor DOM event assertions (`fireEvent.click`) over isolated state checks.
