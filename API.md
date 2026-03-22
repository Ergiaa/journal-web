# API Documentation

## Overview

This document describes the REST API for the Academic Paper Search application. The API is designed to support the frontend application with search, filtering, and paper detail retrieval capabilities.

**Architecture:** Monorepo with Elysia (backend) and Next.js (frontend) using Eden Treaty for type-safe API calls.

**Base URLs:**
- API Backend: `http://localhost:3001` (Elysia)
- Frontend: `http://localhost:3000` (Next.js)

---

## Type-Safe Client Integration (Eden Treaty)

The frontend uses **Eden Treaty** from Elysia for end-to-end type safety. Instead of manually defining types, the frontend imports types directly from the backend:

```typescript
// apps/web/src/lib/api/client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from 'journal-web-api/src'

export const api = treaty<App>('http://localhost:3001')

// Usage - fully typed, auto-completed
const { data, error } = await api.papers.index.get({
  query: { q: 'machine learning', page: 1 }
})
// data: SearchResult (automatically inferred)
// error: typed union of possible error responses
```

**Benefits:**
- No manual type definitions needed
- Types update automatically when backend changes
- Compile-time type checking for API contracts
- IDE autocomplete for all endpoints

---

## Endpoints

### 1. Search Papers

```
GET /api/papers
```

Search for academic papers with keyword matching, filtering, and faceted navigation.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | No | - | Search query (searches title, abstract, authors, keywords) |
| `page` | integer | No | 1 | Page number (1-indexed) |
| `pageSize` | integer | No | 10 | Results per page (max: 100) |
| `author` | string | No | - | Filter by author name (partial match) |
| `journal` | string[] | No | - | Filter by journal name (multi-select, exact match) |
| `keyword` | string[] | No | - | Filter by keyword (multi-select, exact match) |
| `yearFrom` | integer | No | 2000 | Filter papers from this year |
| `yearTo` | integer | No | current year | Filter papers up to this year |
| `sortBy` | string | No | `relevance` | Sort order |

**Sort Options:**
- `relevance` - Hybrid ranking score (semantic + keyword + citation + recency)
- `date_desc` - Publication date, newest first
- `date_asc` - Publication date, oldest first
- `title_asc` - Title alphabetically (A-Z)
- `author_asc` - First author alphabetically (A-Z)

#### Example Request

```
GET /api/papers?q=machine+learning&page=1&pageSize=10&journal=Nature+Medicine&keyword=AI&yearFrom=2020&yearTo=2024&sortBy=date_desc
```

#### Response

**Status:** `200 OK`

```json
{
  "journals": [
    {
      "id": "uuid-string",
      "title": "Paper Title",
      "abstract": "Paper abstract text...",
      "authors": ["Author One", "Author Two"],
      "publishedDate": "2024-03-15",
      "journal": "Nature Medicine",
      "doi": "10.1234/nm.2024.001",
      "keywords": ["machine learning", "AI", "healthcare"],
      "sourceUrl": "https://arxiv.org/abs/2403.12345"
    }
  ],
  "total": 150,
  "page": 1,
  "pageSize": 10,
  "facets": {
    "journals": [
      { "value": "Nature Medicine", "count": 45 },
      { "value": "Journal of AI Research", "count": 32 }
    ],
    "authors": [
      { "value": "John Smith", "count": 12 },
      { "value": "Emily Chen", "count": 8 }
    ],
    "years": [
      { "value": "2024", "count": 50 },
      { "value": "2023", "count": 45 }
    ],
    "keywords": [
      { "value": "machine learning", "count": 80 },
      { "value": "AI", "count": 65 }
    ]
  }
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid query parameters |
| 500 Internal Server Error | Server error |

---

### 2. Get Paper Details

```
GET /api/papers/:id
```

Retrieve detailed information about a specific paper.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Paper ID |

#### Example Request

```
GET /api/papers/550e8400-e29b-41d4-a716-446655440000
```

#### Response

**Status:** `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Deep Learning Approaches for Natural Language Processing",
  "abstract": "This paper presents a comprehensive survey...",
  "authors": ["John Smith", "Emily Chen", "Michael Johnson"],
  "publishedDate": "2024-03-15",
  "journal": "Journal of Artificial Intelligence Research",
  "doi": "10.1234/jair.2024.001",
  "keywords": ["deep learning", "NLP", "transformers"],
  "sourceUrl": "https://arxiv.org/abs/2403.12345"
}
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 404 Not Found | Paper not found |
| 500 Internal Server Error | Server error |

---

### 3. Get Related Papers

```
GET /api/papers/:id/related
```

Retrieve papers related to a specific paper based on shared keywords and authors.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Paper ID |

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 5 | Maximum number of related papers to return |

#### Example Request

```
GET /api/papers/550e8400-e29b-41d4-a716-446655440000/related?limit=5
```

#### Response

**Status:** `200 OK`

```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Transformer Architectures for Multi-Modal Learning",
    "abstract": "We propose a novel transformer architecture...",
    "authors": ["Sarah Williams", "David Lee"],
    "publishedDate": "2024-05-20",
    "journal": "Journal of Artificial Intelligence Research",
    "doi": "10.1234/jair.2024.045",
    "keywords": ["transformers", "multi-modal", "NLP"],
    "sourceUrl": "https://arxiv.org/abs/2405.12345"
  }
]
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 404 Not Found | Paper not found |
| 500 Internal Server Error | Server error |

---

### 4. Get Available Journals

```
GET /api/journals
```

Retrieve a list of all unique journal names in the database. Used for filter dropdown population.

#### Example Request

```
GET /api/journals
```

#### Response

**Status:** `200 OK`

```json
[
  "Drug Discovery Today",
  "Environmental Science & Technology",
  "Global Change Biology",
  "IEEE Transactions on Intelligent Transportation Systems",
  "International Journal of Logistics",
  "Journal of Artificial Intelligence Research",
  "Journal of Social Psychology",
  "Machine Learning Journal",
  "Nature Machine Intelligence",
  "Nature Medicine",
  "Nature Quantum Information",
  "Nature Reviews Neuroscience",
  "Physical Review Letters"
]
```

#### Error Responses

| Status | Description |
|--------|-------------|
| 500 Internal Server Error | Server error |

---

### 5. Health Check

```
GET /health
```

Check the health status of the API and its dependencies.

#### Example Request

```
GET /health
```

#### Response

**Status:** `200 OK`

```json
{
  "status": "healthy",
  "timestamp": "2024-03-15T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "ml_service": "connected"
  }
}
```

**Status:** `503 Service Unavailable` (when unhealthy)

```json
{
  "status": "unhealthy",
  "timestamp": "2024-03-15T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "disconnected",
    "ml_service": "connected"
  }
}
```

---

## Data Models

### Paper (Response Format)

The API returns papers in a format optimized for the frontend. Below is the mapping between the backend database schema and the API response.

| API Field | Type | Backend DB Field | Description |
|-----------|------|------------------|-------------|
| `id` | string (UUID) | `papers.id` | Unique identifier |
| `title` | string | `papers.title` | Paper title |
| `abstract` | string (nullable) | `papers.abstract` | Paper abstract |
| `authors` | string[] | `papers.authors` (JSONB) | List of author names |
| `publishedDate` | string | `papers.published_at` | Publication date (YYYY-MM-DD) |
| `journal` | string | `papers.journal` | Journal/conference name |
| `doi` | string (nullable) | `papers.doi` | Digital Object Identifier |
| `keywords` | string[] (nullable) | `papers.keywords` | List of keywords/tags |
| `sourceUrl` | string | `papers.source_url` | URL to original source |

### Facet Item

```typescript
interface FacetItem {
  value: string    // The facet value (e.g., journal name, author name)
  count: number    // Number of papers matching this facet
}
```

### Facets

```typescript
interface Facets {
  journals: FacetItem[]   // Journal names with counts
  authors: FacetItem[]    // Author names with counts
  years: FacetItem[]      // Publication years with counts
  keywords: FacetItem[]   // Keywords with counts
}
```

### Search Result

```typescript
interface SearchResult {
  journals: Paper[]    // Array of papers for current page
  total: number        // Total matching papers (before pagination)
  page: number         // Current page number
  pageSize: number     // Results per page
  facets: Facets       // Faceted navigation data
}
```

---

## Search Algorithm

The search endpoint uses a hybrid ranking algorithm combining multiple signals:

### Relevance Score Calculation

```
score = 0.40 * semantic_score 
      + 0.30 * bm25_score 
      + 0.15 * citation_boost 
      + 0.10 * recency_score 
      + 0.05 * authority_score
```

#### Components

1. **Semantic Similarity (40%)**
   - Cosine similarity between query embedding (SPECTER2) and paper embedding
   - Retrieved via Qdrant ANN search

2. **BM25 Keyword Score (30%)**
   - Traditional keyword matching using Qdrant sparse index
   - Matches against title, abstract, authors, keywords

3. **Citation Boost (15%)**
   - Log-scaled citation count: `log(1 + citation_count)`
   - Higher citation count = higher boost

4. **Recency Score (10%)**
   - Exponential decay based on publication date
   - More recent papers score higher

5. **Authority Score (5%)**
   - Source-based authority weighting
   - Higher weight for prestigious sources (Nature, Science, etc.)

### Re-ranking (Optional)

For improved precision, the top 50 results may be re-ranked using a cross-encoder model that scores query + paper title/abstract pairs.

---

## Faceted Navigation

### Facet Computation Logic

Facets are computed to support independent multi-select filtering:

1. **Single-select facets** (author, year range):
   - Computed from the fully-filtered result set
   - Shows counts after all filters are applied

2. **Multi-select facets** (journal, keyword):
   - Computed independently (excluding the same facet filter)
   - Allows users to see other available options when one is selected

### Example

When `journal=Nature Medicine` is selected:
- `journals` facet shows counts for all journals (as if journal filter wasn't applied)
- `keywords` facet shows counts for papers in Nature Medicine
- `authors` facet shows counts for papers in Nature Medicine
- `years` facet shows counts for papers in Nature Medicine

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid page parameter: must be a positive integer",
    "details": {
      "field": "page",
      "value": "-1"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `NOT_FOUND` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Dependency service unavailable |

---

## Rate Limiting

Currently not implemented. Future implementation will include:

- **Anonymous users:** 100 requests/minute
- **Authenticated users:** 1000 requests/minute

Rate limit headers will be included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1710504600
```

---

## Pagination

### Request

- `page`: 1-indexed page number
- `pageSize`: Number of results per page (default: 10, max: 100)

### Response

- `total`: Total number of matching papers
- `page`: Current page number
- `pageSize`: Results per page

### Example

For 150 total results with `pageSize=10`:
- Page 1: results 1-10
- Page 2: results 11-20
- ...
- Page 15: results 141-150

---

## CORS

The API supports CORS for frontend integration:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Implementation Notes

### Monorepo Context

This API is implemented in the `apps/api` package of the monorepo:
- **Framework:** Elysia (not Hono - migrated for better type safety)
- **Type Safety:** Eden Treaty provides end-to-end types
- **Frontend Integration:** Next.js in `apps/web` imports types via workspace dependency

### Backend-to-Frontend Field Mapping

The backend PostgreSQL schema uses snake_case, while the API returns camelCase for frontend compatibility:

| Backend (PostgreSQL) | API Response |
|---------------------|--------------|
| `published_at` | `publishedDate` |
| `source_url` | `sourceUrl` |
| `citation_count` | (not exposed) |
| `source` | (not exposed) |
| `source_id` | (not exposed) |
| `embedding_stored` | (internal) |

### Authors Field Transformation

Backend stores authors as JSONB:
```json
[
  {"name": "John Smith", "affiliation": "MIT", "orcid": "0000-0001-2345-6789"},
  {"name": "Emily Chen", "affiliation": "Stanford", "orcid": null}
]
```

API returns simplified array:
```json
["John Smith", "Emily Chen"]
```

### Date Format

- Backend: PostgreSQL `DATE` type
- API: ISO 8601 date string (`YYYY-MM-DD`)

---

## Future Endpoints (Not Yet Implemented)

### Crawl Management

```
POST /api/crawl/start     - Trigger crawl job (admin only)
GET  /api/crawl/jobs       - List crawl jobs
GET  /api/crawl/jobs/:id   - Get crawl job status
```

### User Features

```
POST /api/users/register   - User registration
POST /api/users/login      - User authentication
GET  /api/users/me         - Get current user
POST /api/users/bookmarks  - Save paper to bookmarks
GET  /api/users/bookmarks  - List user bookmarks
```

### Advanced Search

```
GET /api/papers/:id/citations        - Get papers citing this paper
GET /api/papers/:id/references       - Get papers cited by this paper
GET /api/papers/similar/:id          - Get semantically similar papers
POST /api/search/advanced            - Advanced search with complex queries
```

---

## Changelog

**v2.0** (Current)
- Migrated from Hono to Elysia framework
- Added Eden Treaty integration for type-safe API client
- Updated base URLs to reflect monorepo structure (API on :3001)
- Added monorepo context section

**v1.0** (Previous)
- Hono-based API on port 3000
- Manual type definitions
