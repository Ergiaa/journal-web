import { Skeleton } from '@/components/ui/skeleton'

export default function JournalLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back button */}
        <Skeleton className="h-4 w-28" />

        {/* Title */}
        <Skeleton className="h-8 w-3/4 mt-4" />

        {/* Author badges */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="h-px w-full" />

        {/* Abstract card */}
        <div className="rounded-lg border p-6 space-y-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Details card */}
        <div className="rounded-lg border p-6 space-y-3">
          <Skeleton className="h-5 w-16" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        {/* Keywords card */}
        <div className="rounded-lg border p-6 space-y-3">
          <Skeleton className="h-5 w-20" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
