import { XMLParser } from 'fast-xml-parser'
import type {
  CrawlOptions,
  RawPaper,
  ParsedPaper,
  NewPaper,
  SourceAdapter,
} from './base'
import { db } from 'journal-web-api/src/config/database'
import { papers } from 'journal-web-api/src/db/schema'
import { eq, and, sql } from 'drizzle-orm'

interface ArXivEntry {
  id: string
  title: string
  summary: string
  author: ArXivAuthor[] | ArXivAuthor
  published: string
  'arxiv:primary_category': {
    '@_term': string
  }
}

interface ArXivAuthor {
  name: string
}

interface ArXivFeed {
  feed: {
    entry: ArXivEntry[] | ArXivEntry
  }
}

export class ArXivAdapter implements SourceAdapter {
  readonly name = 'arxiv'
  readonly baseUrl = 'http://export.arxiv.org/api/query'
  readonly rateLimitMs = 3000 // 3 seconds between requests (ArXiv limit)

  private parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  })

  async *fetch(options?: CrawlOptions): AsyncGenerator<RawPaper[]> {
    const batchSize = 100
    let start = 0
    let hasMore = true
    let fetchedCount = 0

    while (hasMore) {
      const url = this.buildUrl(start, batchSize, options)
      
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`ArXiv API error: ${response.status} ${response.statusText}`)
        }

        const xml = await response.text()
        const data = this.parser.parse(xml) as ArXivFeed

        if (!data.feed?.entry) {
          hasMore = false
          break
        }

        const entries = Array.isArray(data.feed.entry) 
          ? data.feed.entry 
          : [data.feed.entry]

        if (entries.length === 0) {
          hasMore = false
          break
        }

        // Apply limit if specified
        if (options?.limit && fetchedCount + entries.length >= options.limit) {
          const remaining = options.limit - fetchedCount
          yield entries.slice(0, remaining).map(e => e as unknown as RawPaper)
          hasMore = false
          break
        }

        yield entries.map(e => e as unknown as RawPaper)
        
        fetchedCount += entries.length
        start += batchSize

        // Rate limiting
        if (hasMore) {
          await this.sleep(this.rateLimitMs)
        }

        // Check if we got fewer results than requested (end of results)
        if (entries.length < batchSize) {
          hasMore = false
        }
      } catch (error) {
        console.error(`Error fetching from ArXiv: ${error}`)
        throw error
      }
    }
  }

  parse(raw: RawPaper): ParsedPaper {
    const entry = raw as unknown as ArXivEntry

    // Extract arXiv ID from the full URL
    const arxivId = entry.id.replace('http://arxiv.org/abs/', '').split('v')[0]

    // Parse authors (can be single object or array)
    const authors: string[] = []
    if (entry.author) {
      if (Array.isArray(entry.author)) {
        authors.push(...entry.author.map(a => a.name))
      } else {
        authors.push(entry.author.name)
      }
    }

    // Parse primary category as journal
    const journal = entry['arxiv:primary_category']?.['@_term']

    return {
      sourceId: arxivId,
      title: this.cleanText(entry.title),
      abstract: this.cleanText(entry.summary),
      authors,
      publishedAt: entry.published ? new Date(entry.published) : undefined,
      journal: journal || undefined,
      sourceUrl: entry.id,
      citationCount: 0,
    }
  }

  transform(parsed: ParsedPaper): NewPaper {
    return {
      title: parsed.title,
      abstract: parsed.abstract,
      authors: parsed.authors,
      published_at: parsed.publishedAt,
      journal: parsed.journal,
      doi: parsed.doi,
      keywords: parsed.keywords,
      source_url: parsed.sourceUrl,
      source: this.name,
      source_id: parsed.sourceId,
      citation_count: parsed.citationCount || 0,
    }
  }

  async deduplicate(newPapers: NewPaper[]): Promise<NewPaper[]> {
    if (newPapers.length === 0) return []

    // Get all source_ids for this source
    const sourceIds = newPapers.map(p => p.source_id)
    
    // Query existing papers
    const existing = await db
      .select({ source_id: papers.source_id })
      .from(papers)
      .where(
        and(
          eq(papers.source, this.name),
          sql`${papers.source_id} IN (${sql.join(sourceIds.map(id => sql`${id}`), sql`, `)})`
        )
      )

    const existingIds = new Set(existing.map(row => row.source_id))

    // Filter out existing papers
    return newPapers.filter(p => !existingIds.has(p.source_id))
  }

  private buildUrl(start: number, maxResults: number, options?: CrawlOptions): string {
    const params = new URLSearchParams()
    
    // Build search query
    let searchQuery = ''
    
    if (options?.categories && options.categories.length > 0) {
      const catQuery = options.categories.map(cat => `cat:${cat}`).join('+OR+')
      searchQuery = catQuery
    }
    
    // Add date range if specified
    if (options?.since) {
      const sinceQuery = `submittedDate:[${options.since} TO ${options.until || '9999-12-31'}]`
      searchQuery = searchQuery ? `${searchQuery}+AND+${sinceQuery}` : sinceQuery
    }
    
    params.set('search_query', searchQuery || 'all')
    params.set('start', start.toString())
    params.set('max_results', Math.min(maxResults, 2000).toString())
    params.set('sortBy', 'submittedDate')
    params.set('sortOrder', 'descending')

    return `${this.baseUrl}?${params.toString()}`
  }

  private cleanText(text: string): string {
    // Remove newlines and extra whitespace
    return text
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
