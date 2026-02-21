# AI Agent Instructions

Welcome to the Noted repository! This document contains essential guidelines, conventions, and workflows that all AI agents should strictly adhere to when contributing to this codebase.

## 1. File Naming Conventions

To maintain a consistent and unified file structure, **kebab-case** is the strict standard for all files and directories across the project. 

### Rules:
- All source files (`.ts`, `.tsx`, `.js`, `.jsx`, `.css`) must use lowercase letters, with words separated by hyphens.
  - ✅ **Correct:** `coworker-message.tsx`, `settings-modal.tsx`, `auth-provider.tsx`
  - ❌ **Incorrect:** `CoworkerMessage.tsx`, `settingsModal.tsx`, `auth.provider.tsx`
- React components must still be exported using **PascalCase** inside the files.
- Static application routes in the `app/` directory naturally follow Next.js folder-based naming (e.g. `[documentId]`, `(routes)`), but any internal components (`_components/`) or utility files must also use kebab-case.

## 2. Testing Constraints and Workflows

This repository maintains a **>50% test coverage** standard for frontend applications. Ensure your code does not drop the coverage metric below this threshold. 

### Rules:
- **Colocation:** All unit tests must be colocated next to their target files. Do not use a root `__tests__` folder. 
  - ✅ **Correct:** `components/ui/button.tsx` alongside `components/ui/button.test.tsx`
- **Framework:** The project uses Jest alongside testing-library for React DOM manipulation. 
- **Execution:** Always test your components by running:
  ```bash
  npm run test:coverage 
  ```
  or, isolated testing: 
  ```bash
  npx jest [filename]
  ```
- **Mocking Strategy:** 
  - Mock third-party providers (Clerk context, Convex data queries) at the top of your test files.
  - When writing complex UI unit tests, favor asserting DOM events (`fireEvent.click`) instead of checking isolated class states. 

## 3. General Development Guidelines

- The application uses **Next.js App Router (v14/v15)**. Use Server Components by default. Add `'use client';` only when React hooks (state/effects) or browser APIs are required to function.
- We utilize **Tailwind CSS** and **shadcn/ui** for component styling. Favor reusing existing primitive components from `components/ui/` before building bespoke ones. 
- Avoid excessive inline styles unless for dynamic property assignments.
