'use client'

interface JournalFilterProps {
  available: string[]
  selected: string[]
  onChange: (values: string[]) => void
}

export function JournalFilter({ available, selected, onChange }: JournalFilterProps) {
  if (available.length === 0) {
    return <p className="text-xs text-muted-foreground">No journals available</p>
  }

  function toggle(journal: string) {
    if (selected.includes(journal)) {
      onChange(selected.filter((j) => j !== journal))
    } else {
      onChange([...selected, journal])
    }
  }

  return (
    <div className="space-y-1.5">
      {available.map((journal) => (
        <label
          key={journal}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={selected.includes(journal)}
            onChange={() => toggle(journal)}
            className="h-3.5 w-3.5 rounded border-input accent-foreground cursor-pointer"
          />
          <span className="text-sm group-hover:text-foreground text-muted-foreground leading-tight line-clamp-1">
            {journal}
          </span>
        </label>
      ))}
    </div>
  )
}
