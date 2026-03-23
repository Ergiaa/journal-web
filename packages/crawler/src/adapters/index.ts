import { ArXivAdapter } from './arxiv'
import type { SourceAdapter } from './base'

export const adapters: Map<string, SourceAdapter> = new Map([
  ['arxiv', new ArXivAdapter()],
])

export function getAdapter(name: string): SourceAdapter | undefined {
  return adapters.get(name)
}

export function listAdapters(): string[] {
  return Array.from(adapters.keys())
}

export { ArXivAdapter } from './arxiv'
export type { SourceAdapter, CrawlOptions, CrawlResult, NewPaper } from './base'
