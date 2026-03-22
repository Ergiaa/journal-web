'use client'

import { useQuery } from '@tanstack/react-query'
import { searchJournals, getPaper, getRelatedPapers, getAvailableJournals } from '@/lib/api/journals'
import type { SearchParams } from 'journal-web-api/src/types'

export function useSearchJournals(params: SearchParams) {
  return useQuery({
    queryKey: ['papers', 'search', params],
    queryFn: () => searchJournals(params),
    enabled: !!params.q,
  })
}

export function useJournal(id: string) {
  return useQuery({
    queryKey: ['paper', id],
    queryFn: () => getPaper(id),
    enabled: !!id,
  })
}

export function useRelatedJournals(id: string) {
  return useQuery({
    queryKey: ['papers', 'related', id],
    queryFn: () => getRelatedPapers(id),
    enabled: !!id,
  })
}

export function useAvailableJournals() {
  return useQuery({
    queryKey: ['journals', 'available'],
    queryFn: getAvailableJournals,
  })
}
