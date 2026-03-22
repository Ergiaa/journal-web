'use client'

import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DateRangeFilter } from './filters/date-range-filter'
import { AuthorFilter } from './filters/author-filter'
import { FacetList } from './facets/facet-list'
import type { Facets } from 'journal-web-api/src/types'
import { useFilters } from '@/lib/hooks/use-filters'

interface FilterPanelProps {
  facets?: Facets
  availableJournals: string[]
}

function FilterContent({
  facets,
  availableJournals,
}: FilterPanelProps) {
  const {
    authorFilter,
    journalFilter,
    keywordFilter,
    yearFrom,
    yearTo,
    activeFilterCount,
    setAuthorFilter,
    setJournalFilter,
    setKeywordFilter,
    setYearRange,
    clearAllFilters,
    YEAR_MIN,
    YEAR_MAX,
  } = useFilters()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Filters</span>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Publication Year
        </p>
        <DateRangeFilter
          yearFrom={yearFrom}
          yearTo={yearTo}
          yearMin={YEAR_MIN}
          yearMax={YEAR_MAX}
          onYearRangeChange={setYearRange}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Author
        </p>
        <AuthorFilter value={authorFilter} onChange={setAuthorFilter} />
      </div>

      <Separator />

      {facets && facets.journals.length > 0 ? (
        <FacetList
          title="Journal"
          items={facets.journals}
          selectedValues={journalFilter}
          onToggle={(value) => {
            if (journalFilter.includes(value)) {
              setJournalFilter(journalFilter.filter((j) => j !== value))
            } else {
              setJournalFilter([...journalFilter, value])
            }
          }}
          searchable
        />
      ) : null}

      {facets && facets.keywords.length > 0 && (
        <>
          <Separator />
          <FacetList
            title="Keywords"
            items={facets.keywords}
            selectedValues={keywordFilter}
            onToggle={(value) => {
              if (keywordFilter.includes(value)) {
                setKeywordFilter(keywordFilter.filter((k) => k !== value))
              } else {
                setKeywordFilter([...keywordFilter, value])
              }
            }}
            searchable
          />
        </>
      )}
    </div>
  )
}

export function FilterPanel({ facets, availableJournals }: FilterPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { activeFilterCount } = useFilters()

  return (
    <>
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs text-background">
                {activeFilterCount}
              </span>
            )}
          </span>
          {mobileOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {mobileOpen && (
          <div className="mt-2 rounded-lg border bg-card p-4 shadow-sm">
            <FilterContent facets={facets} availableJournals={availableJournals} />
          </div>
        )}
      </div>

      <div className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-6 rounded-lg border bg-card p-4">
          <FilterContent facets={facets} availableJournals={availableJournals} />
        </div>
      </div>
    </>
  )
}
