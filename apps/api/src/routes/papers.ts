import { Elysia, t } from 'elysia'
import {
  searchMockJournals,
  getMockJournalById,
  getMockRelatedJournals,
  getMockAvailableJournals,
} from '../data/mock-data'

// TypeBox schemas for validation
const SortBy = t.Union([
  t.Literal('relevance'),
  t.Literal('date_desc'),
  t.Literal('date_asc'),
  t.Literal('title_asc'),
  t.Literal('author_asc'),
])

const FacetItem = t.Object({
  value: t.String(),
  count: t.Number(),
})

const Facets = t.Object({
  journals: t.Array(FacetItem),
  authors: t.Array(FacetItem),
  years: t.Array(FacetItem),
  keywords: t.Array(FacetItem),
})

const Journal = t.Object({
  id: t.String(),
  title: t.String(),
  abstract: t.Optional(t.String()),
  authors: t.Array(t.String()),
  publishedDate: t.String(),
  journal: t.String(),
  doi: t.Optional(t.String()),
  keywords: t.Optional(t.Array(t.String())),
  sourceUrl: t.String(),
})

const SearchResult = t.Object({
  journals: t.Array(Journal),
  total: t.Number(),
  page: t.Number(),
  pageSize: t.Number(),
  facets: Facets,
})

// Routes
export const papersRoutes = new Elysia({ prefix: '/api' })
  .get('/papers', ({ query }) => {
    const params = {
      q: query.q,
      page: query.page ? parseInt(query.page) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize) : 10,
      authorFilter: query.author,
      journalFilter: query.journal,
      keywordFilter: query.keyword,
      yearFrom: query.yearFrom ? parseInt(query.yearFrom) : undefined,
      yearTo: query.yearTo ? parseInt(query.yearTo) : undefined,
      sortBy: query.sortBy || 'relevance',
    }
    
    return searchMockJournals(params)
  }, {
    query: t.Object({
      q: t.Optional(t.String()),
      page: t.Optional(t.String()),
      pageSize: t.Optional(t.String()),
      author: t.Optional(t.String()),
      journal: t.Optional(t.Array(t.String())),
      keyword: t.Optional(t.Array(t.String())),
      yearFrom: t.Optional(t.String()),
      yearTo: t.Optional(t.String()),
      sortBy: t.Optional(SortBy),
    }),
    response: {
      200: SearchResult,
    },
  })
  .get('/papers/:id', ({ params, set }) => {
    const journal = getMockJournalById(params.id)
    if (!journal) {
      set.status = 404
      return { error: 'Journal not found' }
    }
    return journal
  }, {
    params: t.Object({
      id: t.String(),
    }),
    response: {
      200: Journal,
      404: t.Object({
        error: t.String(),
      }),
    },
  })
  .get('/papers/:id/related', ({ params, query, set }) => {
    const journal = getMockJournalById(params.id)
    if (!journal) {
      set.status = 404
      return { error: 'Journal not found' }
    }
    
    const limit = query.limit ? parseInt(query.limit) : 5
    return getMockRelatedJournals(params.id).slice(0, limit)
  }, {
    params: t.Object({
      id: t.String(),
    }),
    query: t.Object({
      limit: t.Optional(t.String()),
    }),
    response: {
      200: t.Array(Journal),
      404: t.Object({
        error: t.String(),
      }),
    },
  })

export const journalsRoutes = new Elysia({ prefix: '/api' })
  .get('/journals', () => {
    return getMockAvailableJournals()
  }, {
    response: {
      200: t.Array(t.String()),
    },
  })
