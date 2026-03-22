import { api } from './client'
import type { Journal, SearchResult, SearchParams } from '@/types/journal'

export async function searchJournals(
  params: SearchParams
): Promise<SearchResult> {
  const { data, error } = await api.api.papers.get({
    query: {
      q: params.q,
      page: params.page?.toString(),
      pageSize: params.pageSize?.toString(),
      author: params.authorFilter,
      journal: params.journalFilter,
      keyword: params.keywordFilter,
      yearFrom: params.yearFrom?.toString(),
      yearTo: params.yearTo?.toString(),
      sortBy: params.sortBy,
    },
  })
  
  if (error) {
    throw new Error('Failed to search journals')
  }
  
  return data as SearchResult
}

export async function getJournal(id: string): Promise<Journal> {
  const { data, error } = await api.api.papers({ id }).get()
  
  if (error) {
    throw new Error('Journal not found')
  }
  
  if (data && typeof data === 'object' && 'error' in data) {
    throw new Error(String(data.error))
  }
  
  return data as Journal
}

export async function getRelatedJournals(id: string): Promise<Journal[]> {
  const { data, error } = await api.api.papers({ id }).related.get()
  
  if (error) {
    throw new Error('Failed to get related journals')
  }
  
  if (data && typeof data === 'object' && 'error' in data) {
    throw new Error(String(data.error))
  }
  
  return data as Journal[]
}

export async function getAvailableJournals(): Promise<string[]> {
  const { data, error } = await api.api.journals.get()
  
  if (error) {
    throw new Error('Failed to get available journals')
  }
  
  return data as string[]
}
