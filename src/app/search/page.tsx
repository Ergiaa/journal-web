import { Suspense } from 'react'
import { SearchBar } from '@/components/search/search-bar'
import { SearchResults } from './search-results'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const page = params.page ? parseInt(params.page) : 1

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar defaultValue={query} />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults query={query} page={page} />
      </Suspense>
    </div>
  )
}
