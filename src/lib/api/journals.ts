import { searchMockJournals, getMockJournalById, getMockRelatedJournals } from './mock-data'
import type { Journal, SearchResult, SearchParams } from '@/types/journal'

export async function searchJournals(
  params: SearchParams
): Promise<SearchResult> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return searchMockJournals(params.q || '', params.page || 1, params.pageSize || 10)
}

export async function getJournal(id: string): Promise<Journal> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const journal = getMockJournalById(id)
  if (!journal) {
    throw new Error('Journal not found')
  }
  return journal
}

export async function getRelatedJournals(id: string): Promise<Journal[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return getMockRelatedJournals(id)
}
