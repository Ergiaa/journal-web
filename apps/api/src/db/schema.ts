import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, boolean, index } from 'drizzle-orm/pg-core'

export const papers = pgTable('papers', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  abstract: text('abstract'),
  authors: jsonb('authors').$type<string[]>().notNull().default([]),
  published_at: timestamp('published_at', { withTimezone: true }),
  journal: varchar('journal', { length: 255 }),
  doi: varchar('doi', { length: 255 }).unique(),
  keywords: jsonb('keywords').$type<string[]>(),
  source_url: text('source_url').notNull(),
  source: varchar('source', { length: 100 }),
  source_id: varchar('source_id', { length: 255 }),
  citation_count: integer('citation_count').default(0).notNull(),
  embedding_stored: boolean('embedding_stored').default(false).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  journalIdx: index('journal_idx').on(table.journal),
  publishedAtIdx: index('published_at_idx').on(table.published_at),
  sourceIdx: index('source_idx').on(table.source),
  embeddingStoredIdx: index('embedding_stored_idx').on(table.embedding_stored),
}))

export type Paper = typeof papers.$inferSelect
export type NewPaper = typeof papers.$inferInsert

// Crawl history table for tracking crawl jobs
export const crawlHistory = pgTable('crawl_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  job_id: varchar('job_id', { length: 255 }).notNull(),
  source: varchar('source', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'completed', 'failed', 'running'
  started_at: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  completed_at: timestamp('completed_at', { withTimezone: true }),
  papers_found: integer('papers_found').default(0).notNull(),
  papers_inserted: integer('papers_inserted').default(0).notNull(),
  papers_skipped: integer('papers_skipped').default(0).notNull(),
  errors: jsonb('errors').$type<string[]>(),
  duration_ms: integer('duration_ms'),
  options: jsonb('options'), // Store crawl options (since, until, categories, etc.)
}, (table) => ({
  sourceIdx: index('crawl_history_source_idx').on(table.source),
  startedAtIdx: index('crawl_history_started_at_idx').on(table.started_at),
  statusIdx: index('crawl_history_status_idx').on(table.status),
}))

export type CrawlHistory = typeof crawlHistory.$inferSelect
export type NewCrawlHistory = typeof crawlHistory.$inferInsert
