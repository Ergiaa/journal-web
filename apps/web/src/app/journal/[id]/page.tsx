import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPaper } from '@/lib/api/journals'
import { Skeleton } from '@/components/ui/skeleton'
import { JournalDetail } from './journal-detail'

interface JournalPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: JournalPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    const journal = await getPaper(id)
    return {
      title: `${journal.title} - Journal Search`,
      description: journal.abstract?.slice(0, 160) || `Read ${journal.title} by ${journal.authors.join(', ')}`,
      authors: journal.authors.map((name: string) => ({ name })),
      keywords: journal.keywords,
    }
  } catch (e) {
    return {
      title: 'Journal Not Found - Journal Search',
    }
  }
}

export default async function JournalPage({ params }: JournalPageProps) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      }>
        <JournalDetail id={id} />
      </Suspense>
    </div>
  )
}
