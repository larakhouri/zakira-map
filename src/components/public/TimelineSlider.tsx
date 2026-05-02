'use client'

interface TimelineSliderProps {
  year: number;
  onChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export default function TimelineSlider({ year, onChange, minYear = 1970, maxYear = 2025 }: TimelineSliderProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-11/12 max-w-3xl z-[1000]">
      <div className="backdrop-blur-md bg-stone-50/80 border border-stone-200 shadow-lg rounded-full px-6 py-4 flex items-center gap-4">
        <span className="text-sm font-semibold text-slate-500">{minYear}</span>
        <div className="relative flex-1 flex flex-col items-center">
          <div className="text-xl font-bold text-slate-800 mb-1">{year}</div>
          <input 
            type="range" 
            min={minYear} 
            max={maxYear} 
            step={1} 
            value={year}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-slate-700 focus:outline-none"
          />
        </div>
        <span className="text-sm font-semibold text-slate-500">{maxYear}</span>
      </div>
    </div>
  )
}
