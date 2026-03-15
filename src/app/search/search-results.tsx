'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchJournals } from '@/lib/hooks/use-journals'
import { useFilters } from '@/lib/hooks/use-filters'
import { ResultCard } from '@/components/search/result-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/pagination'
import { PageSizeSelector } from '@/components/search/page-size-selector'
import { SortDropdown } from '@/components/search/sort-dropdown'
import { FilterPanel } from '@/components/search/filter-panel'
import { ActiveFilters } from '@/components/search/active-filters'
import { getMockJournals } from '@/lib/api/mock-data'

interface SearchResultsProps {
  query: string
  page: number
  pageSize: number
}

// Static list of all journal names for the journal filter
const ALL_JOURNALS = Array.from(new Set(getMockJournals().map((j) => j.journal))).sort()

export function SearchResults({ query, page, pageSize }: SearchResultsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { authorFilter, journalFilter, yearFrom, yearTo, sortBy, YEAR_MIN, YEAR_MAX } = useFilters()

  const hasYearFilter = yearFrom !== YEAR_MIN || yearTo !== YEAR_MAX

  const { data, isLoading, error } = useSearchJournals({
    q: query,
    page,
    pageSize,
    authorFilter: authorFilter || undefined,
    journalFilter: journalFilter.length > 0 ? journalFilter : undefined,
    yearFrom: hasYearFilter ? yearFrom : undefined,
    yearTo: hasYearFilter ? yearTo : undefined,
    sortBy,
  })

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`/search?${params.toString()}`)
  }

  function handlePageChange(newPage: number) {
    updateParam('page', String(newPage))
  }

  function handlePageSizeChange(newSize: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('pageSize', String(newSize))
    params.set('page', '1')
    router.push(`/search?${params.toString()}`)
  }

  if (!query) {
    return (
      <p className="text-center text-muted-foreground">
        Enter a search term to find journals
      </p>
    )
  }

  const resultsArea = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-3 p-4 border rounded-lg">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <p className="text-center text-destructive">
          Error loading results. Please try again.
        </p>
      )
    }

    if (!data?.journals.length) {
      return (
        <p className="text-center text-muted-foreground">
          No results found for &quot;{query}&quot;
        </p>
      )
    }

    const start = (page - 1) * pageSize + 1
    const end = Math.min(page * pageSize, data.total)

    return (
      <div className="space-y-4">
        {/* Results header: count + page size + sort */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Showing {start}–{end} of {data.total} results
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <PageSizeSelector pageSize={pageSize} onPageSizeChange={handlePageSizeChange} />
            <SortDropdown />
          </div>
        </div>

        {/* Active filter chips */}
        <ActiveFilters />

        {/* Result list */}
        <div className="grid gap-4">
          {data.journals.map((journal) => (
            <ResultCard key={journal.id} journal={journal} />
          ))}
        </div>

        {/* Pagination */}
        <div className="pt-2">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={data.total}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar filters */}
      <FilterPanel
        facets={data?.facets}
        availableJournals={ALL_JOURNALS}
      />

      {/* Main results column */}
      <div className="min-w-0 flex-1">
        {resultsArea()}
      </div>
    </div>
  )
}
