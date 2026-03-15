'use client'

import { X } from 'lucide-react'
import { useFilters } from '@/lib/hooks/use-filters'

export function ActiveFilters() {
  const {
    authorFilter,
    journalFilter,
    yearFrom,
    yearTo,
    setAuthorFilter,
    setJournalFilter,
    setYearRange,
    YEAR_MIN,
    YEAR_MAX,
  } = useFilters()

  const hasYearFilter = yearFrom !== YEAR_MIN || yearTo !== YEAR_MAX
  const chips: { label: string; onRemove: () => void }[] = []

  if (authorFilter) {
    chips.push({
      label: `Author: ${authorFilter}`,
      onRemove: () => setAuthorFilter(''),
    })
  }

  if (hasYearFilter) {
    chips.push({
      label: `Years: ${yearFrom}–${yearTo}`,
      onRemove: () => setYearRange(YEAR_MIN, YEAR_MAX),
    })
  }

  for (const journal of journalFilter) {
    chips.push({
      label: journal,
      onRemove: () => setJournalFilter(journalFilter.filter((j) => j !== journal)),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip.label}
          className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            aria-label={`Remove filter: ${chip.label}`}
            className="ml-0.5 hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  )
}
