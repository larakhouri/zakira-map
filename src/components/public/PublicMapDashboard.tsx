'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/utils/supabase/client'
import { UnifiedMapEvent } from '@/types/database'
import TimelineSlider from './TimelineSlider'
import EventSidebar from './EventSidebar'

const PublicMap = dynamic(() => import('./PublicMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-stone-100 flex items-center justify-center text-slate-500 font-medium">Loading map interface...</div>
})

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function PublicMapDashboard() {
  const [year, setYear] = useState<number>(2011)
  const debouncedYear = useDebounce<number>(year, 500)
  
  const [events, setEvents] = useState<UnifiedMapEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<UnifiedMapEvent | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchEvents() {
      const startDate = `${debouncedYear}-01-01`
      const endDate = `${debouncedYear}-12-31`

      const { data, error } = await supabase
        .from('unified_map_events')
        .select('*')
        .gte('event_date', startDate)
        .lte('event_date', endDate)

      if (error) {
        console.error('Error fetching events:', error)
      } else {
        setEvents(data as UnifiedMapEvent[] || [])
      }
    }

    fetchEvents()
  }, [debouncedYear, supabase])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-stone-50">
      <PublicMap events={events} onEventClick={setSelectedEvent} />
      <TimelineSlider year={year} onChange={setYear} />
      <EventSidebar event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}
