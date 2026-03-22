export interface Journal {
  id: string
  title: string
  abstract?: string
  authors: string[]
  publishedDate: string
  journal: string
  doi?: string
  keywords?: string[]
  sourceUrl: string
}

export type SortBy = 'relevance' | 'date_desc' | 'date_asc' | 'title_asc' | 'author_asc'

export interface SearchParams {
  q?: string
  page?: number
  pageSize?: number
  // Filters
  authorFilter?: string
  journalFilter?: string[]
  keywordFilter?: string[]
  yearFrom?: number
  yearTo?: number
  // Sorting
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
  journals: Journal[]
  total: number
  page: number
  pageSize: number
  facets: Facets
}
