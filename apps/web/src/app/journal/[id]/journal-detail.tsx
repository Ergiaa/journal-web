'use client'

import { useRouter } from 'next/navigation'
import { useJournal, useRelatedJournals } from '@/lib/hooks/use-journals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface JournalDetailProps {
  id: string
}

export function JournalDetail({ id }: JournalDetailProps) {
  const router = useRouter()
  const { data: journal, isLoading, error } = useJournal(id)
  const { data: related } = useRelatedJournals(id)

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error || !journal) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading journal</p>
        <button onClick={() => router.back()} className="text-primary hover:underline">
          Back to search
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:underline">
          ← Back to search
        </button>
        <h1 className="text-3xl font-bold mt-4">{journal.title}</h1>
        <div className="flex flex-wrap gap-2 mt-4">
          {journal.authors.map((author) => (
            <Badge key={author} variant="secondary">
              {author}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Abstract</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {journal.abstract || 'No abstract available'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Journal</span>
            <span>{journal.journal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Published</span>
            <span>{formatDate(journal.publishedAt)}</span>
          </div>
          {journal.doi && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">DOI</span>
              <a
                href={`https://doi.org/${journal.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {journal.doi}
              </a>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Source</span>
            <a
              href={journal.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View original
            </a>
          </div>
        </CardContent>
      </Card>

      {journal.keywords && journal.keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {journal.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {related && related.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Journals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {related.slice(0, 5).map((j) => (
              <Link
                key={j.id}
                href={`/journal/${j.id}`}
                className="block text-primary hover:underline"
              >
                {j.title}
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
