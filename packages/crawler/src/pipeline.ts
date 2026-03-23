import { getAdapter, type SourceAdapter, type CrawlOptions, type CrawlResult } from './adapters/index'
import { db } from 'journal-web-api/src/config/database'
import { papers } from 'journal-web-api/src/db/schema'
import * as cache from 'journal-web-api/src/lib/cache'
import type { NewPaper } from './adapters/base'

export class CrawlPipeline {
  async crawl(
    sourceName: string,
    options?: CrawlOptions
  ): Promise<CrawlResult> {
    const adapter = getAdapter(sourceName)
    if (!adapter) {
      throw new Error(`Unknown source adapter: ${sourceName}`)
    }

    const startTime = Date.now()
    const result: CrawlResult = {
      source: sourceName,
      papersFound: 0,
      papersInserted: 0,
      papersSkipped: 0,
      errors: [],
      durationMs: 0,
    }

    try {
      console.log(`🚀 Starting crawl for source: ${sourceName}`)
      
      for await (const batch of adapter.fetch(options)) {
        console.log(`📦 Processing batch of ${batch.length} papers...`)

        // Parse batch
        const parsed = batch.map(raw => adapter.parse(raw))
        
        // Transform to DB format
        const transformed = parsed.map(p => adapter.transform(p))
        
        // Deduplicate against existing papers
        const newPapers = await adapter.deduplicate(transformed)
        
        result.papersFound += batch.length
        result.papersSkipped += transformed.length - newPapers.length

        if (newPapers.length > 0) {
          // Bulk insert
          try {
            await this.insertBatch(newPapers)
            result.papersInserted += newPapers.length
            console.log(`✅ Inserted ${newPapers.length} papers`)
            
            // Invalidate search cache so new papers appear immediately
            await cache.invalidateSearchCache()
            console.log('🔄 Search cache invalidated')
          } catch (error) {
            const errorMsg = `Failed to insert batch: ${error}`
            console.error(`❌ ${errorMsg}`)
            result.errors.push(errorMsg)
          }
        }
      }

      result.durationMs = Date.now() - startTime
      console.log(`\n🏁 Crawl completed for ${sourceName}`)
      console.log(`   Found: ${result.papersFound}`)
      console.log(`   Inserted: ${result.papersInserted}`)
      console.log(`   Skipped (duplicates): ${result.papersSkipped}`)
      console.log(`   Errors: ${result.errors.length}`)
      console.log(`   Duration: ${(result.durationMs / 1000).toFixed(1)}s`)

    } catch (error) {
      result.durationMs = Date.now() - startTime
      const errorMsg = `Crawl failed: ${error}`
      console.error(`❌ ${errorMsg}`)
      result.errors.push(errorMsg)
    }

    return result
  }

  private async insertBatch(papersToInsert: NewPaper[]): Promise<void> {
    if (papersToInsert.length === 0) return

    await db.insert(papers).values(papersToInsert as any)
  }
}

export { getAdapter, type CrawlOptions, type CrawlResult }
