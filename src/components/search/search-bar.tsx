'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  defaultValue?: string
}

export function SearchBar({ defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()
  const searchParams = useSearchParams()

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
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-2xl">
      <Input
        type="text"
        placeholder="Search journals..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit">Search</Button>
    </form>
  )
}
