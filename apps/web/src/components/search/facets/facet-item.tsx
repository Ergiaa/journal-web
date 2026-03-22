interface FacetItemProps {
  value: string
  count: number
  checked: boolean
  onToggle: (value: string) => void
}

export function FacetItem({ value, count, checked, onToggle }: FacetItemProps) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer group py-0.5">
      <div className="flex items-center gap-2 min-w-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(value)}
          className="h-3.5 w-3.5 shrink-0 rounded border-input accent-foreground cursor-pointer"
        />
        <span className="text-sm text-muted-foreground group-hover:text-foreground truncate leading-tight">
          {value}
        </span>
      </div>
      <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
        {count}
      </span>
    </label>
  )
}
