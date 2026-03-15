import { Suspense } from 'react'
import { SearchBar } from '@/components/search/search-bar'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="text-center space-y-6 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Journal Search</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Search and discover academic journals from our comprehensive database
        </p>
      </div>
      <Suspense fallback={<div className="h-10 w-full max-w-2xl bg-muted rounded-md animate-pulse" />}>
        <SearchBar />
      </Suspense>
    </div>
  )
}
