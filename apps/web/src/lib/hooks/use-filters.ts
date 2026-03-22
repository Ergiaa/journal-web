'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { SortBy } from 'journal-web-api/src/types'

export interface FilterState {
  authorFilter: string
  journalFilter: string[]
  keywordFilter: string[]
  yearFrom: number
  yearTo: number
  sortBy: SortBy
}

const YEAR_MIN = 2000
const YEAR_MAX = new Date().getFullYear()

export function useFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const authorFilter = searchParams.get('author') ?? ''
  const journalFilter = searchParams.getAll('journal')
  const keywordFilter = searchParams.getAll('keyword')
  const yearFrom = searchParams.get('yearFrom') ? parseInt(searchParams.get('yearFrom')!) : YEAR_MIN
  const yearTo = searchParams.get('yearTo') ? parseInt(searchParams.get('yearTo')!) : YEAR_MAX
  const sortBy = (searchParams.get('sortBy') as SortBy) ?? 'relevance'

  const activeFilterCount = [
    authorFilter ? 1 : 0,
    journalFilter.length > 0 ? 1 : 0,
    keywordFilter.length > 0 ? 1 : 0,
    yearFrom !== YEAR_MIN || yearTo !== YEAR_MAX ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', '1')

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          params.delete(key)
        } else if (Array.isArray(value)) {
          params.delete(key)
          for (const v of value) {
            params.append(key, v)
          }
        } else {
          params.set(key, value)
        }
      }

      router.push(`/search?${params.toString()}`)
    },
    [router, searchParams]
  )

  const setAuthorFilter = useCallback(
    (value: string) => updateParams({ author: value }),
    [updateParams]
  )

  const setJournalFilter = useCallback(
    (values: string[]) => updateParams({ journal: values }),
    [updateParams]
  )

  const setKeywordFilter = useCallback(
    (values: string[]) => updateParams({ keyword: values }),
    [updateParams]
  )

  const setYearRange = useCallback(
    (from: number, to: number) => {
      const updates: Record<string, string | null> = {}
      updates.yearFrom = from !== YEAR_MIN ? String(from) : null
      updates.yearTo = to !== YEAR_MAX ? String(to) : null
      updateParams(updates)
    },
    [updateParams]
  )

  const setSortBy = useCallback(
    (value: SortBy) => updateParams({ sortBy: value === 'relevance' ? null : value }),
    [updateParams]
  )

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('author')
    params.delete('journal')
    params.delete('keyword')
    params.delete('yearFrom')
    params.delete('yearTo')
    params.set('page', '1')
    router.push(`/search?${params.toString()}`)
  }, [router, searchParams])

  return {
    authorFilter,
    journalFilter,
    keywordFilter,
    yearFrom,
    yearTo,
    sortBy,
    activeFilterCount,
    setAuthorFilter,
    setJournalFilter,
    setKeywordFilter,
    setYearRange,
    setSortBy,
    clearAllFilters,
    YEAR_MIN,
    YEAR_MAX,
  }
}
