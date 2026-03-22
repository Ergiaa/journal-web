import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          Journal Search
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
