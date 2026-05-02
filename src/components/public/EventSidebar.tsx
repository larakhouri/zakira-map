'use client'

import { UnifiedMapEvent } from '@/types/database'
import { X, ExternalLink, Video } from 'lucide-react'

interface EventSidebarProps {
  event: UnifiedMapEvent | null;
  onClose: () => void;
}

export default function EventSidebar({ event, onClose }: EventSidebarProps) {
  if (!event) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-96 backdrop-blur-xl bg-stone-50/95 border-l border-stone-200 shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out flex flex-col">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 py-1 bg-stone-200 rounded-md">
          {event.event_type}
        </span>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-800 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto flex-1">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{event.title || event.event_type}</h2>
        {event.event_date && (
          <p className="text-sm text-slate-500 font-medium mb-6">
            {new Date(event.event_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
        
        {event.description && (
          <div className="prose prose-stone text-slate-700 leading-relaxed mb-8">
            <p>{event.description}</p>
          </div>
        )}

        <div className="space-y-3">
          {event.source_link && (
            <a href={event.source_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white p-3 rounded-lg border border-stone-200">
              <ExternalLink className="w-4 h-4" />
              View Source Document
            </a>
          )}
          {event.youtube_link && (
            <a href={event.youtube_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white p-3 rounded-lg border border-stone-200">
              <Video className="w-4 h-4" />
              Watch Video Footage
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
