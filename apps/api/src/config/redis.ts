import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  reconnectOnError: (err) => {
    // Only reconnect on connection errors, not command errors
    return err.message.includes('ECONNREFUSED') || err.message.includes('ECONNRESET')
  },
})

redis.on('connect', () => {
  console.log('🔌 Redis connected')
})

redis.on('ready', () => {
  console.log('✅ Redis ready')
})

redis.on('error', (err) => {
  console.error('❌ Redis error:', err.message)
})

redis.on('close', () => {
  console.log('🔒 Redis connection closed')
})

export async function checkRedisConnection(): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch {
    return false
  }
}

process.on('SIGINT', async () => {
  await redis.quit()
  process.exit(0)
})
