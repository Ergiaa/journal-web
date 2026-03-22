# AGENTS.md - Coding Guidelines for journal-web

## Build & Development Commands

```bash
# Run both apps concurrently (API on :3001, Web on :3000)
bun run dev

# Run individually
bun run dev:api    # API only
bun run dev:web    # Next.js only

# Build all packages
bun run build

# Lint & Type Check
bun run lint       # ESLint on web app
bun run typecheck  # TypeScript check all packages
```

**Note:** This is a Bun monorepo. Do not use npm/yarn/pnpm. Always use `bun`.

## Project Structure

```
apps/
  api/           # Elysia backend (port 3001)
    src/
      index.ts   # Main server + type exports for Eden Treaty
      routes/    # API routes
      data/      # Mock data layer
      types.ts   # Shared types
  web/           # Next.js 16 frontend (port 3000)
    src/
      app/       # App Router (RSC by default)
      components/
        search/  # Search-related components
        ui/      # shadcn/ui components
        layout/  # Header, Footer, etc.
      lib/
        api/     # Eden Treaty client + API wrappers
        hooks/   # React Query hooks
      types/     # TypeScript types
packages/
  crawler/       # (Empty) Crawlee spiders
  workers/      # (Empty) BullMQ workers
```

## Code Style Guidelines

### Imports

**Order:** React/Next → External libs → Internal (@/ aliases) → Types
```typescript
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { treaty } from '@elysiajs/eden'

import { Button } from '@/components/ui/button'
import type { Journal } from '@/types/journal'
```

**Use `@/` alias** for all internal imports. Never use relative paths like `../../components`.

**Type imports:** Always use `import type { ... }` for type-only imports.

### Naming Conventions

- **Components:** PascalCase (`SearchBar`, `ResultCard`)
- **Functions:** camelCase (`searchJournals`, `getJournal`)
- **Types/Interfaces:** PascalCase (`Journal`, `SearchResult`)
- **Constants:** UPPER_SNAKE_CASE for true constants
- **Files:** kebab-case (`search-results.tsx`, `mock-data.ts`)
- **API routes:** Use `:param` syntax in Elysia routes

### Types & Interfaces

Prefer `interface` over `type` for object shapes:
```typescript
export interface Journal {
  id: string
  title: string
  abstract?: string  // Optional fields marked with ?
  authors: string[]
}
```

**Type exports:** Always export from `types.ts` files, never inline in component files.

### Components

**Server Components (default):**
- Use for data fetching
- Can be async
- No 'use client' directive

**Client Components:**
```typescript
'use client'

import { useState } from 'react'
// ... hooks and browser APIs
```

Use only when needed: event handlers, hooks, browser APIs.

### Error Handling

**API layer:** Throw errors, don't return error objects:
```typescript
export async function getJournal(id: string): Promise<Journal> {
  const journal = getMockJournalById(id)
  if (!journal) {
    throw new Error('Journal not found')
  }
  return journal
}
```

**React Query:** Errors are caught by TanStack Query and surfaced via `error` state.

### API Pattern (Eden Treaty)

Backend exports type:
```typescript
// apps/api/src/index.ts
export type App = typeof app
```

Frontend consumes:
```typescript
// apps/web/src/lib/api/client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from 'journal-web-api/src'

export const api = treaty<App>('http://localhost:3001')
```

### Styling (Tailwind v4)

- Use semantic tokens: `bg-primary`, `text-muted-foreground`
- Never raw colors like `bg-blue-500`
- Use `size-*` for equal width/height: `size-10`
- Use `gap-*` for spacing, never `space-x/y-*`
- Prefer `flex` with `gap` over margin hacks

### Testing (TBD)

No test framework configured yet. When adding tests:
- Use `bun test` (Bun's native test runner)
- Place tests next to source files: `component.test.tsx`
- Run single test: `bun test component.test.tsx`

## Key Dependencies

- **Runtime:** Bun v1.x
- **Frontend:** Next.js 16 + React 19 + TypeScript 5
- **Backend:** Elysia + TypeBox (validation)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State:** TanStack Query (React Query)
- **API Client:** Eden Treaty (end-to-end type safe)

## Important Notes

1. **Never use git commands** - This is a Jujutsu (jj) repo. Use `jj` instead.
2. **Type safety:** Frontend types come from API via workspace import (`journal-web-api/src`).
3. **Mock data:** Currently using in-memory mock data in API. Real DB coming later.
4. **Linting:** Only web app has ESLint. API relies on TypeScript strict mode.
5. **Hot reload:** Both apps support hot reload via `bun run --hot` (API) and Next.js dev server (Web).
6. Any file regarding agents or information for agents like ARCHITECTURE.md, AGENTS.md, skills-lock.json,API.md should be committed in revision vovnkxrn.
