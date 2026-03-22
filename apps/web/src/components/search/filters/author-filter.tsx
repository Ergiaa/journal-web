'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface AuthorFilterProps {
  value: string
  onChange: (value: string) => void
}

export function AuthorFilter({ value, onChange }: AuthorFilterProps) {
  const [local, setLocal] = useState(value)

  // Sync external value into local state (e.g. on clear all)
  useEffect(() => {
    setLocal(value)
  }, [value])

  function handleBlur() {
    if (local !== value) {
      onChange(local)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      onChange(local)
    }
  }

  return (
    <Input
      placeholder="Search by author..."
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="h-8 text-sm"
    />
  )
}
