import { redis } from '../config/redis'

const DEFAULT_TTL_SECONDS = {
  paper: 60 * 60 * 24,        // 24 hours for individual papers
  search: 60 * 30,            // 30 minutes for search results
  related: 60 * 60 * 6,       // 6 hours for related papers
  journals: 60 * 60 * 12,     // 12 hours for journal list
} as const

export type CacheKey =
  | { type: 'paper'; id: string }
  | { type: 'search'; hash: string }
  | { type: 'related'; id: string; limit: number }
  | { type: 'journals' }

function buildKey(cacheKey: CacheKey): string {
  switch (cacheKey.type) {
    case 'paper':
      return `paper:${cacheKey.id}`
    case 'search':
      return `search:${cacheKey.hash}`
    case 'related':
      return `related:${cacheKey.id}:${cacheKey.limit}`
    case 'journals':
      return 'journals:list'
  }
}

function getTTL(cacheKey: CacheKey): number {
  switch (cacheKey.type) {
    case 'paper':
      return DEFAULT_TTL_SECONDS.paper
    case 'search':
      return DEFAULT_TTL_SECONDS.search
    case 'related':
      return DEFAULT_TTL_SECONDS.related
    case 'journals':
      return DEFAULT_TTL_SECONDS.journals
  }
}

export async function get<T>(key: CacheKey): Promise<T | null> {
  try {
    const data = await redis.get(buildKey(key))
    if (!data) return null
    return JSON.parse(data) as T
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export async function set<T>(key: CacheKey, value: T): Promise<void> {
  try {
    const ttl = getTTL(key)
    await redis.setex(buildKey(key), ttl, JSON.stringify(value))
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export async function del(key: CacheKey): Promise<void> {
  try {
    await redis.del(buildKey(key))
  } catch (error) {
    console.error('Cache del error:', error)
  }
}

export async function delPattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Cache delPattern error:', error)
  }
}

export async function invalidateSearchCache(): Promise<void> {
  await delPattern('search:*')
  await delPattern('journals:list')
}

export async function invalidatePaperCache(id: string): Promise<void> {
  await del({ type: 'paper', id })
  await delPattern(`related:${id}:*`)
}
