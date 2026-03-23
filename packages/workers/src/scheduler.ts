import cron from 'node-cron'
import { addCrawlJob } from './queues/crawl'

// Schedule configuration
const CRAWL_SCHEDULE = process.env.CRON_CRAWL_DAILY || '0 2 * * *' // 2 AM daily
const CITATION_SCHEDULE = process.env.CRON_CITATIONS_WEEKLY || '0 4 * * 0' // 4 AM Sundays

let crawlTask: cron.ScheduledTask | null = null
let citationTask: cron.ScheduledTask | null = null

export function startScheduler(): void {
  console.log('📅 Starting job scheduler...')

  // Daily arXiv crawl (last 24 hours)
  crawlTask = cron.schedule(CRAWL_SCHEDULE, async () => {
    console.log(`⏰ [Scheduler] Triggering daily arXiv crawl at ${new Date().toISOString()}`)
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const since = yesterday.toISOString().split('T')[0]
    
    try {
      const jobId = await addCrawlJob({
        source: 'arxiv',
        options: {
          since,
          categories: ['cs.AI', 'cs.LG', 'cs.CL', 'cs.CV', 'cs.RO'],
        },
      })
      
      console.log(`✅ [Scheduler] Daily crawl job queued: ${jobId}`)
    } catch (error) {
      console.error(`❌ [Scheduler] Failed to queue daily crawl: ${error}`)
    }
  }, {
    scheduled: true,
    timezone: process.env.TZ || 'UTC',
  })

  // Weekly citation update
  citationTask = cron.schedule(CITATION_SCHEDULE, async () => {
    console.log(`⏰ [Scheduler] Triggering weekly citation update at ${new Date().toISOString()}`)
    
    try {
      // Import dynamically to avoid circular dependencies
      const { addCitationJob } = await import('./queues/citations')
      const jobId = await addCitationJob()
      
      console.log(`✅ [Scheduler] Weekly citation update job queued: ${jobId}`)
    } catch (error) {
      console.error(`❌ [Scheduler] Failed to queue citation update: ${error}`)
    }
  }, {
    scheduled: true,
    timezone: process.env.TZ || 'UTC',
  })

  console.log('✅ Scheduler started')
  console.log(`   - Daily crawl: ${CRAWL_SCHEDULE}`)
  console.log(`   - Weekly citations: ${CITATION_SCHEDULE}`)
}

export function stopScheduler(): void {
  console.log('🛑 Stopping job scheduler...')
  
  if (crawlTask) {
    crawlTask.stop()
    crawlTask = null
  }
  
  if (citationTask) {
    citationTask.stop()
    citationTask = null
  }
  
  console.log('✅ Scheduler stopped')
}

export function getSchedulerStatus(): { running: boolean; schedules: string[] } {
  return {
    running: !!(crawlTask || citationTask),
    schedules: [
      `Daily crawl: ${CRAWL_SCHEDULE}`,
      `Weekly citations: ${CITATION_SCHEDULE}`,
    ],
  }
}
