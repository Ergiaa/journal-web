import { Elysia } from 'elysia'

// Health check route
const healthRoutes = new Elysia({ prefix: '/health' })
  .get('/', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'disconnected',
      redis: 'disconnected',
      ml_service: 'disconnected'
    }
  }))

// Main app
const app = new Elysia()
  .use(healthRoutes)
  .get('/', () => 'Journal Web API is running!')
  .listen(3001)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

// Export type for Eden Treaty
export type App = typeof app
