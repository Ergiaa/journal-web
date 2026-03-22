import { treaty } from '@elysiajs/eden'
import type { App } from 'journal-web-api/src'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = treaty<App>(API_URL)

export default api
