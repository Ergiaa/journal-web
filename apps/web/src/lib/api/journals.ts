import { api } from './client'
import type { Paper, SearchParams, SearchResult } from 'journal-web-api/src/types'

export type { Paper, SearchParams, SearchResult }

export async function searchJournals(
  params: SearchParams
): Promise<SearchResult> {
  const { data, error } = await api.api.papers.get({
    query: {
      q: params.q,
      page: params.page,
      pageSize: params.pageSize,
      author: params.authorFilter,
      journal: params.journalFilter,
      keyword: params.keywordFilter,
      yearFrom: params.yearFrom,
      yearTo: params.yearTo,
      sortBy: params.sortBy,
    },
  })

  if (error) {
    throw new Error(`Failed to search papers: ${JSON.stringify(error.value)}`)
  }

  return data
}

export async function getPaper(id: string): Promise<Paper> {
  const { data, error } = await api.api.papers({ id }).get()

  if (error) {
    const msg = 'value' in error && error.value && typeof error.value === 'object' && 'error' in error.value
      ? String((error.value as { error: unknown }).error)
      : JSON.stringify(error.value)
    throw new Error(`Failed to get paper: ${msg}`)
  }

  if (data && typeof data === 'object' && 'error' in data) {
    throw new Error(String(data.error))
  }

  return data as Paper
}

export async function getRelatedPapers(id: string): Promise<Paper[]> {
  const { data, error } = await api.api.papers({ id }).related.get()

  if (error) {
    const msg = 'value' in error && error.value && typeof error.value === 'object' && 'error' in error.value
      ? String((error.value as { error: unknown }).error)
      : JSON.stringify(error.value)
    throw new Error(`Failed to get related papers: ${msg}`)
  }

  if (data && typeof data === 'object' && 'error' in data) {
    throw new Error(String(data.error))
  }

  return data as Paper[]
}

export async function getAvailableJournals(): Promise<string[]> {
  const { data, error } = await api.api.journals.get()

  if (error) {
    throw new Error(`Failed to get available journals: ${JSON.stringify(error.value)}`)
  }

  return data as string[]
}

// Keep backwards-compatible aliases
export const getJournal = getPaper
export const getRelatedJournals = getRelatedPapers
