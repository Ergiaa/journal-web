import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="text-xl font-semibold">
          Journal Search
        </Link>
      </div>
    </header>
  )
}
