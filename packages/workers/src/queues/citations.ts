import { Queue } from 'bullmq'

// Placeholder for citation update job data
export interface CitationJobData {
  paperIds?: string[]
  batchSize?: number
}

// Redis connection config
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
}

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

export async function addCitationJob(data?: CitationJobData): Promise<string> {
  const job = await citationQueue.add('update-citations', data || {})
  return job.id || ''
}
