'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { FacetItem } from './facet-item'
import type { FacetItem as FacetItemType } from '@/types/journal'

const DEFAULT_VISIBLE = 5

interface FacetListProps {
  title: string
  items: FacetItemType[]
  selectedValues: string[]
  onToggle: (value: string) => void
  searchable?: boolean
}

export function FacetList({
  title,
  items,
  selectedValues,
  onToggle,
  searchable = false,
}: FacetListProps) {
  const [expanded, setExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  if (items.length === 0) return null

  const filteredItems = searchable && searchTerm
    ? items.filter((item) =>
        item.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items

  const visible = expanded ? filteredItems : filteredItems.slice(0, DEFAULT_VISIBLE)
  const hasMore = filteredItems.length > DEFAULT_VISIBLE

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
        {title}
      </p>

      {searchable && (
        <div className="relative mb-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-7 pl-6 pr-2 text-xs rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      )}

      {filteredItems.length === 0 && searchTerm ? (
        <p className="text-xs text-muted-foreground py-1">No matches found</p>
      ) : (
        <>
          <div className="space-y-0.5">
            {visible.map((item) => (
              <FacetItem
                key={item.value}
                value={item.value}
                count={item.count}
                checked={selectedValues.includes(item.value)}
                onToggle={onToggle}
              />
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Show {filteredItems.length - DEFAULT_VISIBLE} more
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  )
}
