'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  defaultValue?: string
}

export function SearchBar({ defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus on '/' press, but only if not already typing in an input
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Preserve existing filters, but update 'q' and clear 'page'
      const params = new URLSearchParams(searchParams?.toString() || '')
      params.set('q', query.trim())
      params.delete('page') // Reset to page 1 on new search
      
      router.push(`/search?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative flex items-center w-full">
      <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search for articles, authors, or topics..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-14 pl-12 pr-40 text-lg rounded-lg border-0 bg-transparent focus-visible:ring-0 shadow-none w-full"
      />
      <div className="absolute right-2 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground font-medium pointer-events-none border mr-2">
          <span>/</span>
        </div>
        <Button type="submit" size="lg" className="h-10 px-6 rounded-md">
          Search
        </Button>
      </div>
    </form>
  )
}
