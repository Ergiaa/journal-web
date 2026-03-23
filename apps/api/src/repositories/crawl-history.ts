import { eq, desc, gte } from 'drizzle-orm'
import { db } from '../config/database'
import { crawlHistory, type NewCrawlHistory, type CrawlHistory } from '../db/schema'

export const crawlHistoryRepository = {
  async create(data: NewCrawlHistory): Promise<CrawlHistory> {
    const [result] = await db.insert(crawlHistory).values(data).returning()
    return result
  },

  async update(jobId: string, data: Partial<NewCrawlHistory>): Promise<void> {
    await db.update(crawlHistory).set(data).where(eq(crawlHistory.job_id, jobId))
  },

  async findByJobId(jobId: string): Promise<CrawlHistory | null> {
    const result = await db.query.crawlHistory.findFirst({
      where: eq(crawlHistory.job_id, jobId),
    })
    return result || null
  },

  async findRecent(days: number = 30): Promise<CrawlHistory[]> {
    const since = new Date()
    since.setDate(since.getDate() - days)

    return await db.query.crawlHistory.findMany({
      where: gte(crawlHistory.started_at, since),
      orderBy: desc(crawlHistory.started_at),
    })
  },
}
