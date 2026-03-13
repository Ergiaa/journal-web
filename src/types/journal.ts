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

export interface SearchResult {
  journals: Journal[]
  total: number
  page: number
  pageSize: number
}

export interface SearchParams {
  q?: string
  page?: number
  pageSize?: number
}
