import { Elysia, t } from 'elysia'
import { addCrawlJob, getQueueStatus } from 'journal-web-workers/src/queues/crawl'
import { addCitationJob } from 'journal-web-workers/src/queues/citations'
import { getSchedulerStatus } from 'journal-web-workers/src/scheduler'
import { listAdapters } from 'journal-web-crawler/src/adapters/index'
import { crawlHistoryRepository } from '../repositories/crawl-history'

// Admin routes for managing crawls and jobs
export const adminRoutes = new Elysia({ prefix: '/admin' })
  // POST /admin/crawl - Trigger a crawl job
  .post(
    '/crawl',
    async ({ body }) => {
      const { source, since, until, limit, categories } = body

      // Validate source
      const availableSources = listAdapters()
      if (!availableSources.includes(source)) {
        return {
          error: `Unknown source: ${source}. Available: ${availableSources.join(', ')}`,
        }
      }

      // Validate dates if provided
      if (since) {
        const date = new Date(since)
        if (isNaN(date.getTime())) {
          return { error: `Invalid date format for 'since': ${since}. Expected YYYY-MM-DD` }
        }
      }

      if (until) {
        const date = new Date(until)
        if (isNaN(date.getTime())) {
          return { error: `Invalid date format for 'until': ${until}. Expected YYYY-MM-DD` }
        }
      }

      // Queue the crawl job
      const jobId = await addCrawlJob({
        source,
        options: {
          since,
          until,
          limit,
          categories,
        },
      })

      return {
        jobId,
        status: 'queued',
        source,
        message: `Crawl job queued successfully`,
      }
    },
    {
      body: t.Object({
        source: t.String(),
        since: t.Optional(t.String()),
        until: t.Optional(t.String()),
        limit: t.Optional(t.Number()),
        categories: t.Optional(t.Array(t.String())),
      }),
    }
  )

  // GET /admin/crawl/status - Check job queue status
  .get('/crawl/status', async () => {
    const status = await getQueueStatus()

    return {
      timestamp: new Date().toISOString(),
      queues: status,
    }
  })

  // GET /admin/crawl/sources - List available sources
  .get('/crawl/sources', () => {
    return {
      sources: listAdapters(),
    }
  })

  // POST /admin/citations - Trigger citation update
  .post(
    '/citations',
    async ({ body }) => {
      const { paperIds, batchSize } = body || {}

      const jobId = await addCitationJob({
        paperIds,
        batchSize,
      })

      return {
        jobId,
        status: 'queued',
        message: 'Citation update job queued successfully',
      }
    },
    {
      body: t.Optional(
        t.Object({
          paperIds: t.Optional(t.Array(t.String())),
          batchSize: t.Optional(t.Number()),
        })
      ),
    }
  )

  // GET /admin/scheduler - Get scheduler status
  .get('/scheduler', () => {
    const status = getSchedulerStatus()

    return {
      running: status.running,
      schedules: status.schedules,
    }
  })

  // GET /admin/crawl/history - Get crawl history (last 30 days)
  .get('/crawl/history', async () => {
    const history = await crawlHistoryRepository.findRecent(30)

    return {
      history: history.map(h => ({
        id: h.id,
        jobId: h.job_id,
        source: h.source,
        status: h.status,
        startedAt: h.started_at.toISOString(),
        completedAt: h.completed_at?.toISOString(),
        papersFound: h.papers_found,
        papersInserted: h.papers_inserted,
        papersSkipped: h.papers_skipped,
        errors: h.errors,
        durationMs: h.duration_ms,
        options: h.options,
      })),
      count: history.length,
    }
  })
