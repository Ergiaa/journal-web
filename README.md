# Journal Web

A full-stack academic paper search platform with Next.js frontend and Elysia backend.

## Architecture

```
journal-web/
├── apps/
│   ├── web/                 # Next.js 16 frontend (Port 3000)
│   └── api/                 # Elysia backend (Port 3001)
├── packages/
│   ├── crawler/             # (Future: Crawlee spiders)
│   └── workers/             # (Future: BullMQ workers)
└── package.json             # Bun workspaces root
```

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Backend**: Elysia + Bun runtime
- **API Client**: Eden Treaty (type-safe)
- **Package Manager**: Bun workspaces

## Quick Start

```bash
# Install dependencies
bun install

# Start both apps
bun run dev
```

Apps will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:3001

## Scripts

- `bun run dev` - Start both apps concurrently
- `bun run dev:api` - API only
- `bun run dev:web` - Frontend only
