import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <p className="text-7xl font-bold text-muted-foreground/30 mb-4">404</p>
      <h2 className="text-2xl font-bold mb-2">Page not found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Go home
      </Link>
    </div>
  )
}
