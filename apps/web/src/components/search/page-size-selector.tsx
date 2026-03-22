'use client'

const PAGE_SIZES = [10, 25, 50]

interface PageSizeSelectorProps {
  pageSize: number
  onPageSizeChange: (size: number) => void
}

export function PageSizeSelector({ pageSize, onPageSizeChange }: PageSizeSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <label htmlFor="page-size-selector">Show</label>
      <select
        id="page-size-selector"
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        aria-label="Results per page"
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span>per page</span>
    </div>
  )
}
