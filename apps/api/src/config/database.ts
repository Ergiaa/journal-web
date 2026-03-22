import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://journal:journal@localhost:5432/journal_db',
  max: 20,
})

export const db = drizzle(pool, { schema })

export type Database = typeof db
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

process.on('SIGINT', async () => {
  await pool.end()
  process.exit(0)
})
