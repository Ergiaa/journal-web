import { Queue } from 'bullmq'
import type { CrawlOptions } from 'journal-web-crawler/src/adapters/base'

// Crawl job data structure
export interface CrawlJobData {
  source: string
  options?: CrawlOptions
}

// Citation update job data
export interface CitationJobData {
  paperIds?: string[] // If empty, update all papers
  batchSize?: number
}

// Redis connection config
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
}

// Crawl queue
export const crawlQueue = new Queue<CrawlJobData>('crawl', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5 seconds
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 100,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
})

// Citation update queue
export const citationQueue = new Queue<CitationJobData>('citations', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 10000, // 10 seconds
    },
    removeOnComplete: {
      age: 24 * 3600,
      count: 50,
    },
    removeOnFail: {
      age: 7 * 24 * 3600,
    },
  },
})

export async function addCrawlJob(data: CrawlJobData): Promise<string> {
  const job = await crawlQueue.add(`crawl-${data.source}`, data)
  return job.id || ''
}

export async function addCitationJob(data?: CitationJobData): Promise<string> {
  const job = await citationQueue.add('update-citations', data || {})
  return job.id || ''
}

export async function getQueueStatus() {
  const [crawlWaiting, crawlActive, crawlCompleted, crawlFailed] = await Promise.all([
    crawlQueue.getWaitingCount(),
    crawlQueue.getActiveCount(),
    crawlQueue.getCompletedCount(),
    crawlQueue.getFailedCount(),
  ])

  const [citationWaiting, citationActive, citationCompleted, citationFailed] = await Promise.all([
    citationQueue.getWaitingCount(),
    citationQueue.getActiveCount(),
    citationQueue.getCompletedCount(),
    citationQueue.getFailedCount(),
  ])

  return {
    crawl: {
      waiting: crawlWaiting,
      active: crawlActive,
      completed: crawlCompleted,
      failed: crawlFailed,
    },
    citations: {
      waiting: citationWaiting,
      active: citationActive,
      completed: citationCompleted,
      failed: citationFailed,
    },
  }
}
