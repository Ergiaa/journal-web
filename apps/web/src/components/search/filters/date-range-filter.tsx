'use client'

import { useState, useEffect, useRef } from 'react'

interface DateRangeFilterProps {
  yearFrom: number
  yearTo: number
  yearMin: number
  yearMax: number
  onYearRangeChange: (from: number, to: number) => void
}

const DEBOUNCE_MS = 500

export function DateRangeFilter({
  yearFrom,
  yearTo,
  yearMin,
  yearMax,
  onYearRangeChange,
}: DateRangeFilterProps) {
  const [localFrom, setLocalFrom] = useState(yearFrom)
  const [localTo, setLocalTo] = useState(yearTo)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync external values into local state (e.g. on clear all)
  useEffect(() => {
    setLocalFrom(yearFrom)
    setLocalTo(yearTo)
  }, [yearFrom, yearTo])

  // Keep latest callback in ref to avoid stale closures
  const callbackRef = useRef(onYearRangeChange)
  useEffect(() => {
    callbackRef.current = onYearRangeChange
  }, [onYearRangeChange])

  // Debounced callback
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      // Only trigger if values actually changed from the external props
      if (localFrom !== yearFrom || localTo !== yearTo) {
        callbackRef.current(localFrom, localTo)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [localFrom, localTo, yearFrom, yearTo])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{localFrom}</span>
        <span>{localTo}</span>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">From</label>
        <input
          type="range"
          min={yearMin}
          max={yearMax}
          value={localFrom}
          onChange={(e) => {
            const val = parseInt(e.target.value)
            setLocalFrom(Math.min(val, localTo))
          }}
          className="w-full cursor-pointer"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">To</label>
        <input
          type="range"
          min={yearMin}
          max={yearMax}
          value={localTo}
          onChange={(e) => {
            const val = parseInt(e.target.value)
            setLocalTo(Math.max(val, localFrom))
          }}
          className="w-full cursor-pointer"
        />
      </div>
    </div>
  )
}
