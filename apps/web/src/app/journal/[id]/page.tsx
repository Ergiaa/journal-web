import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getJournal } from '@/lib/api/journals'
import { JournalDetail } from './journal-detail'

interface JournalPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: JournalPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    const journal = await getJournal(id)
    return {
      title: `${journal.title} - Journal Search`,
      description: journal.abstract?.slice(0, 160) || `Read ${journal.title} by ${journal.authors.join(', ')}`,
      authors: journal.authors.map(name => ({ name })),
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
      <Suspense fallback={<div>Loading...</div>}>
        <JournalDetail id={id} />
      </Suspense>
    </div>
  )
}
