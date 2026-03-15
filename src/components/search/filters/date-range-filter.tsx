'use client'

interface DateRangeFilterProps {
  yearFrom: number
  yearTo: number
  yearMin: number
  yearMax: number
  onYearRangeChange: (from: number, to: number) => void
}

export function DateRangeFilter({
  yearFrom,
  yearTo,
  yearMin,
  yearMax,
  onYearRangeChange,
}: DateRangeFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{yearFrom}</span>
        <span>{yearTo}</span>
      </div>

      {/* From slider */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">From</label>
        <input
          type="range"
          min={yearMin}
          max={yearMax}
          value={yearFrom}
          onChange={(e) => {
            const val = parseInt(e.target.value)
            onYearRangeChange(Math.min(val, yearTo), yearTo)
          }}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-foreground"
        />
      </div>

      {/* To slider */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">To</label>
        <input
          type="range"
          min={yearMin}
          max={yearMax}
          value={yearTo}
          onChange={(e) => {
            const val = parseInt(e.target.value)
            onYearRangeChange(yearFrom, Math.max(val, yearFrom))
          }}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-foreground"
        />
      </div>
    </div>
  )
}
