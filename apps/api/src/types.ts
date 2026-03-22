export interface Paper {
  id: string
  title: string
  abstract?: string
  authors: string[]
  publishedAt: string  // ISO 8601 date string
  journal?: string
  doi?: string
  keywords?: string[]
  sourceUrl: string
  source?: string
  sourceId?: string
  citationCount: number
  embeddingStored: boolean
  createdAt: string
}

export type SortBy = 'relevance' | 'date_desc' | 'date_asc' | 'title_asc' | 'author_asc'

export interface SearchParams {
  q?: string
  page?: number
  pageSize?: number
  authorFilter?: string
  journalFilter?: string[]
  keywordFilter?: string[]
  yearFrom?: number
  yearTo?: number
  sortBy?: SortBy
}

export interface FacetItem {
  value: string
  count: number
}

export interface Facets {
  journals: FacetItem[]
  authors: FacetItem[]
  years: FacetItem[]
  keywords: FacetItem[]
}

export interface SearchResult {
  papers: Paper[]
  total: number
  page: number
  pageSize: number
  facets: Facets
}
