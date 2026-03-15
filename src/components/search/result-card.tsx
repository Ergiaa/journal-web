import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Journal } from '@/types/journal'

interface ResultCardProps {
  journal: Journal
}

export function ResultCard({ journal }: ResultCardProps) {
  return (
    <Card className="hover:border-primary transition-colors">
      <CardHeader>
        <Link href={`/journal/${journal.id}`}>
          <CardTitle className="text-lg line-clamp-2 hover:text-primary cursor-pointer">
            {journal.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href={`/journal/${journal.id}`} className="block">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {journal.abstract}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {journal.authors.slice(0, 3).map((author) => (
              <Badge key={author} variant="secondary">
                {author}
              </Badge>
            ))}
            {journal.authors.length > 3 && (
              <Badge variant="outline">+{journal.authors.length - 3}</Badge>
            )}
          </div>
        </Link>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>{journal.journal} • {formatDate(journal.publishedDate)}</span>
          <a
            href={journal.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View source
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
