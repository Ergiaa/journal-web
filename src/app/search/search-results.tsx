'use client'

import { useSearchJournals } from '@/lib/hooks/use-journals'
import { ResultCard } from '@/components/search/result-card'
import { Skeleton } from '@/components/ui/skeleton'

interface SearchResultsProps {
  query: string
  page: number
}

export function SearchResults({ query, page }: SearchResultsProps) {
  const { data, isLoading, error } = useSearchJournals({
    q: query,
    page,
    pageSize: 10,
  })

  if (!query) {
    return (
      <p className="text-center text-muted-foreground">
        Enter a search term to find journals
      </p>
    )
  }

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

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Found {data.total} results for &quot;{query}&quot;
      </p>
      <div className="grid gap-4">
        {data.journals.map((journal) => (
          <ResultCard key={journal.id} journal={journal} />
        ))}
      </div>
    </div>
  )
}
