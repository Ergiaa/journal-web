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
