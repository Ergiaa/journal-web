'use client'

import { useQuery } from '@tanstack/react-query'
import { searchJournals, getJournal, getRelatedJournals } from '@/lib/api/journals'
import type { SearchParams } from '@/types/journal'

export function useSearchJournals(params: SearchParams) {
  return useQuery({
    queryKey: ['journals', 'search', params],
    queryFn: () => searchJournals(params),
    enabled: !!params.q,
  })
}

export function useJournal(id: string) {
  return useQuery({
    queryKey: ['journal', id],
    queryFn: () => getJournal(id),
    enabled: !!id,
  })
}

export function useRelatedJournals(id: string) {
  return useQuery({
    queryKey: ['journals', 'related', id],
    queryFn: () => getRelatedJournals(id),
    enabled: !!id,
  })
}
