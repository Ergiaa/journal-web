import { Skeleton } from '@/components/ui/skeleton'

export default function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search bar skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-full max-w-2xl" />
      </div>

      <div className="flex gap-6">
        {/* Filter panel skeleton */}
        <div className="hidden lg:block w-56 shrink-0">
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-px w-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Result list skeleton */}
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-3">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-3 p-4 border rounded-lg">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
