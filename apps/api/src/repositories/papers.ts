import { eq, and, gte, lte, SQL, sql, asc, desc, inArray, count } from 'drizzle-orm'
import { db } from '../config/database'
import { papers, type Paper as DbPaper, type NewPaper } from '../db/schema'
import type { Paper, SearchParams, SearchResult, Facets, FacetItem } from '../types'

function mapDbPaper(paper: DbPaper): Paper {
  return {
    id: paper.id,
    title: paper.title,
    abstract: paper.abstract ?? undefined,
    authors: paper.authors,
    publishedAt: paper.published_at?.toISOString() ?? '',
    journal: paper.journal ?? undefined,
    doi: paper.doi ?? undefined,
    keywords: paper.keywords ?? undefined,
    sourceUrl: paper.source_url,
    source: paper.source ?? undefined,
    sourceId: paper.source_id ?? undefined,
    citationCount: paper.citation_count,
    embeddingStored: paper.embedding_stored,
    createdAt: paper.created_at.toISOString(),
  }
}

function toFacetItems(map: Map<string, number>): FacetItem[] {
  return Array.from(map.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
}

function computeFacetsFromRows(rows: DbPaper[]): Facets {
  const journalCounts = new Map<string, number>()
  const authorCounts = new Map<string, number>()
  const yearCounts = new Map<string, number>()
  const keywordCounts = new Map<string, number>()

  for (const p of rows) {
    if (p.journal) {
      journalCounts.set(p.journal, (journalCounts.get(p.journal) ?? 0) + 1)
    }
    for (const author of p.authors) {
      authorCounts.set(author, (authorCounts.get(author) ?? 0) + 1)
    }
    if (p.published_at) {
      const year = p.published_at.getFullYear().toString()
      yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1)
    }
    for (const kw of p.keywords ?? []) {
      keywordCounts.set(kw, (keywordCounts.get(kw) ?? 0) + 1)
    }
  }

  return {
    journals: toFacetItems(journalCounts),
    authors: toFacetItems(authorCounts),
    years: toFacetItems(yearCounts),
    keywords: toFacetItems(keywordCounts),
  }
}

export const papersRepository = {
  async findById(id: string): Promise<Paper | null> {
    const result = await db.query.papers.findFirst({
      where: eq(papers.id, id),
    })
    return result ? mapDbPaper(result) : null
  },

  async findMany(params: SearchParams): Promise<SearchResult> {
    const {
      q,
      page = 1,
      pageSize = 10,
      authorFilter,
      journalFilter,
      keywordFilter,
      yearFrom,
      yearTo,
      sortBy = 'relevance',
    } = params

    // Build base WHERE conditions (text search + year range)
    const baseConditions: SQL[] = []

    if (q) {
      const pattern = `%${q}%`
      baseConditions.push(sql`(
        ${papers.title} ILIKE ${pattern} OR
        ${papers.abstract} ILIKE ${pattern} OR
        EXISTS (SELECT 1 FROM jsonb_array_elements_text(${papers.authors}) a WHERE a ILIKE ${pattern}) OR
        EXISTS (SELECT 1 FROM jsonb_array_elements_text(${papers.keywords}) k WHERE k ILIKE ${pattern}) OR
        ${papers.journal} ILIKE ${pattern}
      )`)
    }

    if (yearFrom !== undefined) {
      baseConditions.push(gte(papers.published_at, new Date(`${yearFrom}-01-01`)))
    }
    if (yearTo !== undefined) {
      baseConditions.push(lte(papers.published_at, new Date(`${yearTo}-12-31`)))
    }
    if (authorFilter) {
      baseConditions.push(
        sql`EXISTS (SELECT 1 FROM jsonb_array_elements_text(${papers.authors}) a WHERE a ILIKE ${`%${authorFilter}%`})`
      )
    }

    const baseWhere = baseConditions.length > 0 ? and(...baseConditions) : undefined

    // For independent multi-select facets we need three sets:
    // 1. base + journalFilter (for keywords facet)
    // 2. base + keywordFilter (for journals facet)
    // 3. base + journalFilter + keywordFilter (for results + author/year facets)

    const journalCondition = journalFilter && journalFilter.length > 0
      ? inArray(papers.journal, journalFilter)
      : undefined

    const keywordCondition = keywordFilter && keywordFilter.length > 0
      ? sql`${papers.keywords} ?| ${sql`ARRAY[${sql.join(keywordFilter.map(k => sql`${k}`), sql`, `)}]::text[]`}`
      : undefined

    const finalWhere = and(baseWhere, journalCondition, keywordCondition)

    const orderBy = sortBy === 'date_desc' ? desc(papers.published_at)
                  : sortBy === 'date_asc'  ? asc(papers.published_at)
                  : sortBy === 'title_asc' ? asc(papers.title)
                  : sortBy === 'author_asc' ? sql`${papers.authors}->0 ASC`
                  : asc(papers.created_at)

    const [keywordFacetRows, journalFacetRows, finalFacetRows, [{ total }], paginatedRows] = await Promise.all([
      // keywords facet: base + journal filter (no keyword filter)
      db.query.papers.findMany({
        where: journalCondition ? and(baseWhere, journalCondition) : baseWhere,
      }),
      // journals facet: base + keyword filter (no journal filter)
      db.query.papers.findMany({
        where: keywordCondition ? and(baseWhere, keywordCondition) : baseWhere,
      }),
      // author/year facets: base + both filters (no LIMIT)
      db.query.papers.findMany({
        where: finalWhere,
        columns: { authors: true, published_at: true },
      }),
      // total count with SQL
      db.select({ total: count() }).from(papers).where(finalWhere),
      // paginated results with SQL LIMIT/OFFSET
      db.query.papers.findMany({
        where: finalWhere,
        orderBy,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
    ])

    const journalFacets = computeFacetsFromRows(journalFacetRows)
    const keywordFacets = computeFacetsFromRows(keywordFacetRows)
    const finalFacets = computeFacetsFromRows(finalFacetRows as DbPaper[])

    const facets: Facets = {
      journals: journalFacets.journals,
      keywords: keywordFacets.keywords,
      authors: finalFacets.authors,
      years: finalFacets.years,
    }

    return {
      papers: paginatedRows.map(mapDbPaper),
      total,
      page,
      pageSize,
      facets,
    }
  },

  async findRelated(id: string, limit: number = 5): Promise<Paper[]> {
    const target = await papersRepository.findById(id)
    if (!target) return []

    const conditions: SQL[] = [
      sql`${papers.id} != ${id}`,
    ]

    const orParts: SQL[] = []

    if (target.keywords && target.keywords.length > 0) {
      orParts.push(
        sql`${papers.keywords} ?| ${sql`ARRAY[${sql.join(target.keywords.map(k => sql`${k}`), sql`, `)}]::text[]`}`
      )
    }

    if (target.authors.length > 0) {
      orParts.push(
        sql`${papers.authors} ?| ${sql`ARRAY[${sql.join(target.authors.map(a => sql`${a}`), sql`, `)}]::text[]`}`
      )
    }

    if (orParts.length === 0) return []

    conditions.push(sql`(${sql.join(orParts, sql` OR `)})`)

    const results = await db.query.papers.findMany({
      where: and(...conditions),
      limit,
    })

    return results.map(mapDbPaper)
  },

  async getAvailableJournals(): Promise<string[]> {
    const rows = await db
      .selectDistinct({ journal: papers.journal })
      .from(papers)
      .where(sql`${papers.journal} IS NOT NULL`)
      .orderBy(asc(papers.journal))

    return rows.map(r => r.journal).filter(Boolean) as string[]
  },

  async create(data: Omit<NewPaper, 'id' | 'created_at'>): Promise<Paper> {
    const [result] = await db
      .insert(papers)
      .values(data)
      .returning()

    return mapDbPaper(result)
  },

  async createMany(dataArray: Array<Omit<NewPaper, 'id' | 'created_at'>>): Promise<Paper[]> {
    const results = await db
      .insert(papers)
      .values(dataArray)
      .returning()

    return results.map(mapDbPaper)
  },
}
