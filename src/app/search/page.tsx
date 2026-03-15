import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchBar } from '@/components/search/search-bar'
import { SearchResults } from './search-results'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams
  const query = params.q

  if (!query) {
    return {
      title: 'Search Journals - Journal Search',
      description: 'Search for academic journals, articles, and publications.',
    }
  }

  return {
    title: `Search results for "${query}" - Journal Search`,
    description: `Find academic journals and articles related to ${query}.`,
  }
}
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const page = params.page ? parseInt(params.page) : 1
  const pageSize = params.pageSize ? parseInt(params.pageSize) : 10

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar defaultValue={query} />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults query={query} page={page} pageSize={pageSize} />
      </Suspense>
    </div>
  )
}
