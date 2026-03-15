'use client'

import { useFilters } from '@/lib/hooks/use-filters'
import type { SortBy } from '@/types/journal'

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date_desc', label: 'Date: Newest first' },
  { value: 'date_asc', label: 'Date: Oldest first' },
  { value: 'title_asc', label: 'Title: A–Z' },
  { value: 'author_asc', label: 'Author: A–Z' },
]

export function SortDropdown() {
  const { sortBy, setSortBy } = useFilters()

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="shrink-0">Sort by</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortBy)}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        aria-label="Sort results"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
