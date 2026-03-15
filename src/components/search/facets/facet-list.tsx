'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FacetItem } from './facet-item'
import type { FacetItem as FacetItemType } from '@/types/journal'

const DEFAULT_VISIBLE = 5

interface FacetListProps {
  title: string
  items: FacetItemType[]
  selectedValues: string[]
  onToggle: (value: string) => void
}

export function FacetList({ title, items, selectedValues, onToggle }: FacetListProps) {
  const [expanded, setExpanded] = useState(false)

  if (items.length === 0) return null

  const visible = expanded ? items : items.slice(0, DEFAULT_VISIBLE)
  const hasMore = items.length > DEFAULT_VISIBLE

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
        {title}
      </p>
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
              Show {items.length - DEFAULT_VISIBLE} more
            </>
          )}
        </button>
      )}
    </div>
  )
}
