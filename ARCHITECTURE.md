# Academic Paper Search - Architecture Documentation

## System Overview

A full-stack academic paper search platform (similar to Google Scholar) with monorepo architecture supporting:
- Web frontend with semantic search capabilities
- REST API with hybrid ranking (keyword + semantic + citation count)
- Background workers for web crawling and ML processing
- Separate ML microservice for embeddings and vector search

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    journal-web (Monorepo)                           │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   Next.js    │    │  Elysia API  │    │   Workers    │          │
│  │  (Frontend)  │◄───│   (Bun)      │───►│ (Crawler/    │          │
│  │   Port 3000  │    │   Port 3001  │    │  BullMQ)     │          │
│  └──────────────┘    └──────┬───────┘    └──────┬───────┘          │
│                             │                   │                  │
│        Eden Treaty          │                   │                  │
│        (Type-Safe)          │                   │                  │
│                             ▼                   ▼                  │
│                       ┌──────────────┐    ┌──────────────┐         │
│                       │    Redis     │    │  PostgreSQL  │         │
│                       │ (Queue/Cache)│    │   (Drizzle)  │         │
│                       └──────┬───────┘    └──────────────┘         │
└───────────────────────────────┼────────────────────────────────────┘
                                │
                    HTTP (REST) │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│              journal-web-ml (Separate Repository)                   │
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐           │
│  │   /embed    │    │   /search   │    │   /rerank    │           │
│  │             │    │             │    │              │           │
│  │  SPECTER2   │    │  Qdrant     │    │ Cross-encoder│           │
│  │  Embeddings │    │  Vector DB  │    │  Reranking   │           │
│  └─────────────┘    └─────────────┘    └─────────────┘           │
│                                                                     │
│  Port 8000 - FastAPI/Python                                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Monorepo (TypeScript/Bun)

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Package Manager** | bun + workspaces | Efficient monorepo management, content-addressable store |
| **Frontend** | Next.js 16 + React 19 | App Router, Server Components, existing project |
| **API Framework** | Elysia | Eden Treaty for end-to-end type safety, built-in validation, Bun-native |
| **API Client** | Eden Treaty | Type-safe HTTP client with automatic inference from Elysia |
| **Runtime** | Bun v1.x | Fast startup, native TypeScript, used for API and workers |
| **Crawler** | Crawlee | TypeScript-native, Playwright/Cheerio support |
| **Task Queue** | BullMQ | Redis-backed, mature job processing |
| **ORM** | Drizzle | Lightweight, TypeScript-first, SQL-like API |
| **Database** | PostgreSQL | Relational data (papers, authors, citations) |
| **Cache/Queue** | Redis | Job queue + query result caching |

### ML Service (Python/FastAPI)

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Web Framework** | FastAPI | Async, automatic OpenAPI docs |
| **Embedding Model** | SPECTER2 (AllenAI) | Domain-specific for scientific papers |
| **Vector Database** | Qdrant | Best performance for filtered ANN search |
| **Re-ranking** | Cross-encoder | Precision boost for top-K results |
| **Language** | Python 3.11+ | Best ML/AI ecosystem |

---

## Monorepo Structure

```
journal-web/
├── apps/
│   ├── web/                    # Next.js frontend (Port 3000)
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── search/
│   │   │   │   └── journal/
│   │   │   ├── components/    # UI components (shadcn/ui + custom)
│   │   │   │   ├── layout/    # Header, Footer, ThemeToggle
│   │   │   │   ├── search/    # SearchBar, ResultCard, FilterPanel
│   │   │   │   └── ui/        # shadcn components
│   │   │   ├── lib/
│   │   │   │   ├── api/
│   │   │   │   │   ├── client.ts    # Eden Treaty client
│   │   │   │   │   └── journals.ts  # API wrapper functions
│   │   │   │   └── hooks/     # React Query hooks
│   │   │   └── types/
│   │   │       └── journal.ts # TypeScript types
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   └── api/                    # Elysia backend (Port 3001)
│       ├── src/
│       │   ├── index.ts        # Elysia app entry (exports App type)
│       │   ├── routes/
│       │   │   └── papers.ts   # Search endpoints with TypeBox
│       │   ├── data/
│       │   │   └── mock-data.ts # Mock data layer (40 papers)
│       │   └── types.ts        # Shared type definitions
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── crawler/                # Crawlee spiders (TBD)
│   │   ├── src/
│   │   │   └── spiders/
│   │   └── package.json
│   │
│   └── workers/                # BullMQ workers (TBD)
│       ├── src/
│       │   └── index.ts
│       └── package.json
│
├── docker-compose.yml          # Local development
├── package.json               # Root workspace config (bun workspaces)
├── bun.lock                   # Bun lockfile
└── README.md                  # Project documentation
```

---

## Service Breakdown

### apps/web (Next.js Frontend)

**Responsibilities:**
- UI for paper search with filters and facets
- Paper detail pages
- Server Components for initial data fetching
- Client Components for interactivity (search bar, filters)

**API Integration:**
```typescript
// lib/api/client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from 'journal-web-api/src'  // Direct workspace import

export const api = treaty<App>('http://localhost:3001')

// Usage in component
const { data, error } = await api.papers.index.get({ query: { q: 'AI' } })
// data is fully typed as SearchResult
```

### apps/api (Elysia Backend)

**Responsibilities:**
- REST API for frontend (search, paper details)
- Database access via Drizzle
- Redis cache integration
- HTTP client to ML service
- Type exports for frontend consumption

**Key Endpoints:**
```
GET  /api/papers                - Search papers
GET  /api/papers/:id            - Get paper details
GET  /api/papers/:id/related    - Get related papers
GET  /api/journals              - List available journals
GET  /health                    - Health check
```

**Type Export Pattern:**
```typescript
// apps/api/src/index.ts
const app = new Elysia()
  .use(papersRoutes)
  .use(healthRoutes)

export type App = typeof app  // Frontend imports this
```

### packages/crawler (Crawlee)

**Responsibilities:**
- Spider implementations for academic sources
- arXiv, Semantic Scholar, PubMed scraping
- Queue discovery jobs to Redis

**Deployment:** Separate process/container
```bash
bun run packages/crawler/src/index.ts
```

### packages/workers (BullMQ)

**Responsibilities:**
- Process embed jobs (call ML service `/embed`)
- Process index jobs (call ML service `/index`)
- Recrawl scheduling

**Deployment:** Separate process/container
```bash
bun run packages/workers/src/index.ts
```

### journal-web-ml (Python/FastAPI - Separate Repo)

**Responsibilities:**
- Generate paper embeddings (SPECTER2)
- Upsert vectors into Qdrant
- Semantic search (query encoding + ANN)
- Re-ranking top results

**Key Endpoints:**
```
POST /embed   - Generate embedding
POST /index   - Upsert to Qdrant
POST /search  - Semantic search
POST /rerank  - Re-rank results
GET  /health  - Health check
```

---

## Data Flow

### Current: Mock Data Flow

```
User Search
      │
      ▼
Next.js (Client Component)
      │
      ▼
Elysia API (Port 3001)
      │
      ├─► Mock data layer (in-memory)
      │   - Full-text search
      │   - Filter application
      │   - Facet computation
      │   - Result sorting
      │
      ▼
Response to Frontend (via Eden Treaty)
      │
      ▼
React renders results with TanStack Query
```

### Planned: Full Production Flow

#### 1. Search Flow (Frontend → ML Service)

```
User Search
      │
      ▼
Next.js (Server Component)
      │
      ▼
Elysia API (Port 3001)
      │
      ├─► Check Redis cache (optional)
      │
      ▼
ML Service /search (Port 8000)
      │
      ├─► Encode query (SPECTER2)
      ├─► Qdrant ANN search (semantic + BM25 hybrid)
      └─► Return paper IDs + scores
      │
      ▼
Elysia fetches metadata from PostgreSQL
      │
      ├─► Apply additional filters
      ├─► Compute facets
      └─► Sort and paginate
      │
      ▼
Response to Frontend (via Eden Treaty)
      │
      ▼
Next.js renders results
```

#### 2. Paper Ingestion Pipeline (Crawler → ML Service)

```
Crawlee Spider (packages/crawler)
      │
      ▼
Raw Paper Data
      │
      ▼
Redis Queue (BullMQ job)
      │
      ▼
Worker Process (packages/workers)
      │
      ├─► Save metadata to PostgreSQL
      │
      ▼
ML Service /embed (Port 8000)
      │
      ├─► Generate embedding (SPECTER2)
      │
      ▼
ML Service /index
      │
      ├─► Upsert to Qdrant (vector DB)
      │
      ▼
Worker updates PostgreSQL
      └─► SET embedding_stored = true
```

---

## Type Safety with Eden Treaty

### Frontend-to-Backend Type Flow

```
┌─────────────────┐         ┌─────────────────┐
│   apps/web      │  Import │   apps/api      │
│                 │◄────────┤                 │
│  Eden Client    │  Types  │  Elysia Routes  │
│  (treaty<App>)  │         │  (export type)  │
└─────────────────┘         └─────────────────┘
```

### Example Usage

**Backend Route Definition:**
```typescript
// apps/api/src/routes/papers.ts
export const papersRoutes = new Elysia()
  .get('/api/papers', async ({ query }) => {
    return await searchJournals(query)
  }, {
    query: t.Object({
      q: t.Optional(t.String()),
      page: t.Number({ default: 1 }),
      pageSize: t.Number({ default: 10 })
    })
  })
```

**Frontend Type-Safe Call:**
```typescript
// apps/web/src/lib/api/client.ts
const { data, error } = await api.papers.index.get({
  query: { q: 'machine learning', page: 1 }
})
//    ^? data is typed as SearchResult
//    ^? error is typed union of possible errors
```

**Benefits:**
- Change backend route → Frontend types auto-update
- No manual type definitions needed
- Compile-time error detection for API mismatches

---

## Current Implementation Status

### ✅ Completed

**Monorepo Foundation:**
- Bun workspace configured with `apps/*` and `packages/*`
- Type sharing via workspace dependency (`journal-web-api`)
- Concurrent dev script (`bun run dev` starts both apps)

**API (apps/api):**
- Elysia server with hot reload on port 3001
- Full paper search with TypeBox validation
- CORS configured for frontend communication
- Mock data layer with 40 papers across 11 journals
- End-to-end type exports for Eden Treaty

**Frontend (apps/web):**
- Next.js 16 with App Router on port 3000
- Eden Treaty integration for type-safe API calls
- Search UI with filters, facets, sorting, pagination
- Paper detail pages with related papers
- TanStack Query for server state management

### 🚧 In Progress / Planned

**Data Layer:**
- Currently using mock data in API (40 papers)
- PostgreSQL + Drizzle ORM migration pending
- Redis cache integration pending

**Search Enhancement:**
- Currently using keyword-based search with faceted filtering
- Semantic search via ML service integration pending
- Vector database (Qdrant) integration pending

**Background Processing:**
- Crawler package (Crawlee) - empty, needs spiders
- Workers package (BullMQ) - empty, needs job processors

**Infrastructure:**
- Docker Compose for local development
- ML service (Python/FastAPI) in separate repository

---

## Database Schema (Planned)

**Note:** Currently using mock data. Schema will be implemented when migrating to PostgreSQL.

```sql
-- Core tables
papers (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  abstract TEXT,
  authors JSONB NOT NULL,
  published_at DATE,
  journal TEXT,
  doi TEXT,
  keywords TEXT[],
  source_url TEXT NOT NULL,
  source TEXT,
  source_id TEXT,
  citation_count INTEGER DEFAULT 0,
  embedding_stored BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
)

citations (
  id UUID PRIMARY KEY,
  paper_id UUID REFERENCES papers(id),
  cited_paper_id UUID REFERENCES papers(id),
  citation_count INTEGER
)

crawl_jobs (
  id UUID PRIMARY KEY,
  source TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  papers_found INTEGER DEFAULT 0,
  papers_inserted INTEGER DEFAULT 0
)
```

---

## Deployment

### Current: Development Mode

Both apps run locally with live reload:
```bash
bun run dev        # Starts API (:3001) + Web (:3000)
```

### Planned: Docker Compose (Full Stack)

```yaml
services:
  web:
    build: ./apps/web
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://api:3001
  
  api:
    build: ./apps/api
    ports: ["3001:3001"]
    environment:
      - PORT=3001
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/journal
      - REDIS_URL=redis://redis:6379
      - ML_SERVICE_URL=http://ml-service:8000
  
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=journal
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
  
  redis:
    image: redis:7-alpine
  
  ml-service:
    # External repository: journal-web-ml
    image: journal-web-ml:latest
    ports: ["8000:8000"]
```

---

## Key Design Decisions

### Why Elysia over Hono?

1. **Eden Treaty**: End-to-end type safety without manual type definitions
2. **Built-in Validation**: TypeBox validation inline with routes
3. **Lifecycle Hooks**: Clean before/after handlers for caching/logging
4. **State/Derive Pattern**: Dependency injection for db/redis clients
5. **Better Type Inference**: More precise TypeScript types out of the box

### Why Monorepo?

1. **Type Sharing**: Eden Treaty needs direct workspace imports
2. **Atomic Changes**: Single PR can update API + Frontend together
3. **Dependency Management**: Shared tools, single lockfile
4. **CI/CD**: Unified pipeline for all components

### Why Separate ML Repo?

1. **Language Mismatch**: Python vs TypeScript ecosystems
2. **Deployment Target**: ML needs GPU/CPU optimization separate from web
3. **Model Artifacts**: Large files don't belong in web repo
4. **Team Boundaries**: ML expertise separate from web development

---

## Environment Variables

### apps/web (Current)
```bash
# API Backend URL (server-side)
API_URL=http://localhost:3001

# API Backend URL (client-side, for browser requests)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### apps/api (Current)
```bash
# Server port
PORT=3001
```

### apps/api (Planned)
```bash
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/journal

# Cache/Queue
REDIS_URL=redis://localhost:6379

# External Services
ML_SERVICE_URL=http://localhost:8000
```

---

## References

- [Elysia Documentation](https://elysiajs.com/)
- [Eden Treaty Documentation](https://elysiajs.com/eden/overview.html)
- [bun Workspaces](https://bun.com/docs/pm/workspaces)
- [Turborepo](https://turbo.build/repo)
- [Next.js 16](https://nextjs.org/)
- [Bun Runtime](https://bun.sh/)

---

## Changelog

**Current** (Working Implementation)
- Monorepo with working search and API integration
- Elysia API with TypeBox validation and mock data (40 papers)
- Next.js frontend with Eden Treaty type-safe client
- Search UI with filters, facets, sorting, and pagination
- Paper detail pages with related papers
- TanStack Query for server state management

**Previous Versions**
- v2.0: Migrated from Hono to Elysia, restructured to monorepo
- v1.0: Hono-based architecture, separate repositories
