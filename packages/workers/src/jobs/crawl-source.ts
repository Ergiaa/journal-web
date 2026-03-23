import { Job, Worker } from 'bullmq'
import { CrawlPipeline } from 'journal-web-crawler/src/pipeline'
import { crawlHistoryRepository } from 'journal-web-api/src/repositories/crawl-history'
import type { CrawlJobData } from '../queues/crawl'

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
}

// Process crawl jobs
export const crawlWorker = new Worker<CrawlJobData>(
  'crawl',
  async (job: Job<CrawlJobData>) => {
    const { source, options } = job.data
    const jobId = job.id || 'unknown'
    
    console.log(`🔄 [Worker] Processing crawl job ${jobId} for source: ${source}`)
    
    // Record job start in history
    await crawlHistoryRepository.create({
      job_id: jobId,
      source,
      status: 'running',
      papers_found: 0,
      papers_inserted: 0,
      papers_skipped: 0,
      options: options || null,
    })
    
    const pipeline = new CrawlPipeline()
    const startTime = Date.now()
    
    try {
      const result = await pipeline.crawl(source, options)
      const durationMs = Date.now() - startTime
      
      console.log(`✅ [Worker] Crawl job ${jobId} completed`)
      console.log(`   Found: ${result.papersFound}, Inserted: ${result.papersInserted}, Skipped: ${result.papersSkipped}`)
      
      if (result.errors.length > 0) {
        console.warn(`⚠️ [Worker] Crawl job ${jobId} had ${result.errors.length} errors`)
      }
      
      // Update history with results
      await crawlHistoryRepository.update(jobId, {
        status: result.errors.length > 0 ? 'completed_with_errors' : 'completed',
        completed_at: new Date(),
        papers_found: result.papersFound,
        papers_inserted: result.papersInserted,
        papers_skipped: result.papersSkipped,
        errors: result.errors.length > 0 ? result.errors : null,
        duration_ms: durationMs,
      })
      
      return result
    } catch (error) {
      const durationMs = Date.now() - startTime
      const errorMsg = error instanceof Error ? error.message : String(error)
      
      console.error(`❌ [Worker] Crawl job ${jobId} failed: ${errorMsg}`)
      
      // Update history with failure
      await crawlHistoryRepository.update(jobId, {
        status: 'failed',
        completed_at: new Date(),
        errors: [errorMsg],
        duration_ms: durationMs,
      })
      
      throw error
    }
  },
  {
    connection: redisConnection,
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5', 10),
  }
)

// Event handlers for monitoring
crawlWorker.on('completed', (job) => {
  console.log(`✅ Crawl job ${job.id} completed successfully`)
})

crawlWorker.on('failed', async (job, err) => {
  console.error(`❌ Crawl job ${job?.id} failed permanently: ${err.message}`)
  
  // Record final failure if job exists
  if (job?.id) {
    try {
      const existing = await crawlHistoryRepository.findByJobId(job.id)
      if (existing && existing.status === 'running') {
        await crawlHistoryRepository.update(job.id, {
          status: 'failed',
          completed_at: new Date(),
          errors: [err.message],
        })
      }
    } catch (e) {
      console.error(`Failed to update crawl history for failed job ${job.id}:`, e)
    }
  }
})

crawlWorker.on('error', (err) => {
  console.error(`❌ Crawl worker error: ${err.message}`)
})

console.log('🚀 Crawl worker started')
