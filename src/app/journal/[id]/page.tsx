import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { JournalDetail } from './journal-detail'

interface JournalPageProps {
  params: Promise<{ id: string }>
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
