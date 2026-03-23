export interface CrawlOptions {
  since?: string // ISO date (YYYY-MM-DD)
  until?: string // ISO date (YYYY-MM-DD)
  limit?: number // Max papers to fetch
  categories?: string[] // e.g., ['cs.AI', 'cs.LG']
}

export interface RawPaper {
  // Raw data from source (source-specific format)
  [key: string]: unknown
}

export interface ParsedPaper {
  sourceId: string
  title: string
  abstract?: string
  authors: string[]
  publishedAt?: Date
  journal?: string
  doi?: string
  keywords?: string[]
  sourceUrl: string
  citationCount?: number
}

export interface NewPaper {
  title: string
  abstract?: string
  authors: string[]
  published_at?: Date
  journal?: string
  doi?: string
  keywords?: string[]
  source_url: string
  source: string
  source_id: string
  citation_count: number
}

export interface SourceAdapter {
  readonly name: string
  readonly baseUrl: string
  readonly rateLimitMs: number

  fetch(options?: CrawlOptions): AsyncGenerator<RawPaper[]>
  parse(raw: RawPaper): ParsedPaper
  transform(parsed: ParsedPaper): NewPaper
  deduplicate(papers: NewPaper[]): Promise<NewPaper[]>
}

export interface CrawlResult {
  source: string
  papersFound: number
  papersInserted: number
  papersSkipped: number
  errors: string[]
  durationMs: number
}
