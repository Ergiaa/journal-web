import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { sql } from 'drizzle-orm'
import { db, checkRedisConnection } from './config'
import { papersRoutes, journalsRoutes } from './routes/papers'

async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`)
    return true
  } catch {
    return false
  }
}

// Health check route
const healthRoutes = new Elysia({ prefix: '/health' })
  .get('/', async () => {
    const [dbHealthy, redisHealthy] = await Promise.all([
      checkDatabaseConnection(),
      checkRedisConnection(),
    ])
    const allHealthy = dbHealthy && redisHealthy
    return {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'connected' : 'disconnected',
        redis: redisHealthy ? 'connected' : 'disconnected',
        ml_service: 'disconnected',
      },
    }
  })

// Main app
const app = new Elysia()
  .use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
  }))
  .use(healthRoutes)
  .use(papersRoutes)
  .use(journalsRoutes)
  .get('/', () => 'Journal Web API is running!')
  .listen(3001)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

// Export type for Eden Treaty
export type App = typeof app
