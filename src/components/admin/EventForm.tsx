'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'

const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-stone-100 animate-pulse rounded-lg flex items-center justify-center text-stone-500 font-medium">Loading map...</div>
})

const CATEGORIES = [
  'General Event',
  'Regime Change',
  'Bombing',
  'Massacre',
  'Arrest',
  'Protest',
  'Assassination'
] as const

type Category = typeof CATEGORIES[number]

export default function EventForm() {
  const supabase = createClient()
  const [category, setCategory] = useState<Category>('General Event')
  const [loading, setLoading] = useState(false)
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  
  // Common Fields
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [sourceLink, setSourceLink] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')

  // Specific Fields
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [targetType, setTargetType] = useState('')
  const [explosiveType, setExplosiveType] = useState('')
  const [perpetratorFaction, setPerpetratorFaction] = useState('')
  const [casualtyCount, setCasualtyCount] = useState<number | ''>('')
  const [victimDemographic, setVictimDemographic] = useState('')
  const [weaponsUsed, setWeaponsUsed] = useState('')
  const [estimatedParticipants, setEstimatedParticipants] = useState<number | ''>('')
  const [demands, setDemands] = useState('')
  const [securityResponse, setSecurityResponse] = useState('')
  const [targetName, setTargetName] = useState('')
  const [targetAffiliation, setTargetAffiliation] = useState('')
  const [perpetratorName, setPerpetratorName] = useState('')
  const [method, setMethod] = useState('')
  const [detaineeName, setDetaineeName] = useState('')
  const [detaineeAffiliation, setDetaineeAffiliation] = useState('')
  const [arrestingFaction, setArrestingFaction] = useState('')
  const [dateOfArrest, setDateOfArrest] = useState('')
  const [dateOfRelease, setDateOfRelease] = useState('')
  const [detentionFacility, setDetentionFacility] = useState('')
  const [fate, setFate] = useState('')
  const [eventName, setEventName] = useState('')
  const [leaderTakingPower, setLeaderTakingPower] = useState('')
  const [leaderOusted, setLeaderOusted] = useState('')

  const handleLocationSelect = (selectedLat: number, selectedLng: number) => {
    setLat(selectedLat)
    setLng(selectedLng)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const commonPayload = {
      description: description || null,
      image_url: imageUrl || null,
      source_link: sourceLink || null,
      youtube_link: youtubeLink || null,
      lat,
      lng
    }

    let tableName = ''
    let payload = {}

    switch (category) {
      case 'General Event':
        tableName = 'events'
        payload = { ...commonPayload, title, event_date: eventDate || null }
        break
      case 'Bombing':
        tableName = 'bombings'
        payload = { 
          ...commonPayload, 
          location, target_type: targetType, event_date: eventDate || null, 
          explosive_type: explosiveType, perpetrator_faction: perpetratorFaction, 
          casualty_count: casualtyCount || 0 
        }
        break
      case 'Massacre':
        tableName = 'massacres'
        payload = {
          ...commonPayload,
          location, event_date: eventDate || null, perpetrator_faction: perpetratorFaction,
          victim_demographic: victimDemographic, casualty_count: casualtyCount || 0, weapons_used: weaponsUsed
        }
        break
      case 'Protest':
        tableName = 'protests'
        payload = {
          ...commonPayload,
          location, event_date: eventDate || null, estimated_participants: estimatedParticipants || 0,
          demands, security_response: securityResponse, casualties: casualtyCount || 0
        }
        break
      case 'Assassination':
        tableName = 'assassinations'
        payload = {
          ...commonPayload,
          target_name: targetName, target_affiliation: targetAffiliation, perpetrator_name: perpetratorName,
          event_date: eventDate || null, location, method
        }
        break
      case 'Arrest':
        tableName = 'arrests'
        payload = {
          ...commonPayload,
          detainee_name: detaineeName, detainee_affiliation: detaineeAffiliation, arresting_faction: arrestingFaction,
          date_of_arrest: dateOfArrest || null, date_of_release: dateOfRelease || null, detention_facility: detentionFacility, fate
        }
        break
      case 'Regime Change':
        tableName = 'regime_changes'
        payload = {
          ...commonPayload,
          event_name: eventName, event_date: eventDate || null, leader_taking_power: leaderTakingPower, leader_ousted: leaderOusted
        }
        break
    }

    const { error } = await supabase.from(tableName).insert(payload)

    if (error) {
      console.error('Supabase Error:', error)
      toast.error('Failed to save event. See console for details.')
    } else {
      toast.success('Event saved successfully!')
    }
    
    setLoading(false)
  }

  const inputClass = "w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white transition-colors"
  const labelClass = "block text-sm font-medium text-slate-700 mb-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-stone-50 p-6 sm:p-8 rounded-xl border border-stone-200 shadow-sm">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-b border-stone-200 pb-2">Location</h2>
        <MapPicker onLocationSelect={handleLocationSelect} />
        
        {lat && lng && (
          <div className="flex gap-4 text-sm text-stone-600 bg-white p-3 rounded-lg border border-stone-200 shadow-sm">
            <div><span className="font-medium text-slate-700">Lat:</span> {lat.toFixed(5)}</div>
            <div><span className="font-medium text-slate-700">Lng:</span> {lng.toFixed(5)}</div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-b border-stone-200 pb-2">Event Details</h2>
        
        <div>
          <label className={labelClass}>Event Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value as Category)}
            className={inputClass}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(category === 'General Event' || category === 'Bombing' || category === 'Massacre' || category === 'Protest' || category === 'Assassination' || category === 'Regime Change') && (
            <div>
              <label className={labelClass}>Event Date</label>
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className={inputClass} />
            </div>
          )}

          {category === 'General Event' && (
            <div>
              <label className={labelClass}>Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} required />
            </div>
          )}

          {(category === 'Bombing' || category === 'Massacre' || category === 'Protest' || category === 'Assassination') && (
            <div>
              <label className={labelClass}>Location (Text)</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} className={inputClass} />
            </div>
          )}

          {category === 'Bombing' && (
            <>
              <div>
                <label className={labelClass}>Target Type</label>
                <input type="text" value={targetType} onChange={e => setTargetType(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Explosive Type</label>
                <input type="text" value={explosiveType} onChange={e => setExplosiveType(e.target.value)} className={inputClass} />
              </div>
            </>
          )}

          {(category === 'Bombing' || category === 'Massacre') && (
            <div>
              <label className={labelClass}>Perpetrator Faction</label>
              <input type="text" value={perpetratorFaction} onChange={e => setPerpetratorFaction(e.target.value)} className={inputClass} />
            </div>
          )}

          {(category === 'Bombing' || category === 'Massacre' || category === 'Protest') && (
            <div>
              <label className={labelClass}>{category === 'Protest' ? 'Casualties' : 'Casualty Count'}</label>
              <input type="number" value={casualtyCount} onChange={e => setCasualtyCount(e.target.value ? Number(e.target.value) : '')} className={inputClass} />
            </div>
          )}

          {category === 'Massacre' && (
            <>
              <div>
                <label className={labelClass}>Victim Demographic</label>
                <input type="text" value={victimDemographic} onChange={e => setVictimDemographic(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Weapons Used</label>
                <input type="text" value={weaponsUsed} onChange={e => setWeaponsUsed(e.target.value)} className={inputClass} />
              </div>
            </>
          )}

          {category === 'Protest' && (
            <>
              <div>
                <label className={labelClass}>Estimated Participants</label>
                <input type="number" value={estimatedParticipants} onChange={e => setEstimatedParticipants(e.target.value ? Number(e.target.value) : '')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Demands</label>
                <input type="text" value={demands} onChange={e => setDemands(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Security Response</label>
                <input type="text" value={securityResponse} onChange={e => setSecurityResponse(e.target.value)} className={inputClass} />
              </div>
            </>
          )}

          {category === 'Assassination' && (
            <>
              <div>
                <label className={labelClass}>Target Name</label>
                <input type="text" value={targetName} onChange={e => setTargetName(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Target Affiliation</label>
                <input type="text" value={targetAffiliation} onChange={e => setTargetAffiliation(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Perpetrator Name</label>
                <input type="text" value={perpetratorName} onChange={e => setPerpetratorName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Method</label>
                <input type="text" value={method} onChange={e => setMethod(e.target.value)} className={inputClass} />
              </div>
            </>
          )}

          {category === 'Arrest' && (
            <>
              <div>
                <label className={labelClass}>Detainee Name</label>
                <input type="text" value={detaineeName} onChange={e => setDetaineeName(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Detainee Affiliation</label>
                <input type="text" value={detaineeAffiliation} onChange={e => setDetaineeAffiliation(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Arresting Faction</label>
                <input type="text" value={arrestingFaction} onChange={e => setArrestingFaction(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date of Arrest</label>
                <input type="date" value={dateOfArrest} onChange={e => setDateOfArrest(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date of Release</label>
                <input type="date" value={dateOfRelease} onChange={e => setDateOfRelease(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Detention Facility</label>
                <input type="text" value={detentionFacility} onChange={e => setDetentionFacility(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Fate</label>
                <input type="text" value={fate} onChange={e => setFate(e.target.value)} className={inputClass} />
              </div>
            </>
          )}

          {category === 'Regime Change' && (
            <>
              <div>
                <label className={labelClass}>Event Name</label>
                <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Leader Taking Power</label>
                <input type="text" value={leaderTakingPower} onChange={e => setLeaderTakingPower(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Leader Ousted</label>
                <input type="text" value={leaderOusted} onChange={e => setLeaderOusted(e.target.value)} className={inputClass} />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-b border-stone-200 pb-2">Additional Information</h2>
        
        <div>
          <label className={labelClass}>Description</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            rows={4} 
            className={inputClass} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Image URL</label>
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Source Link</label>
            <input type="url" value={sourceLink} onChange={e => setSourceLink(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>YouTube Link</label>
            <input type="url" value={youtubeLink} onChange={e => setYoutubeLink(e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50 font-medium shadow-sm"
      >
        {loading ? 'Saving Event...' : 'Save Event'}
      </button>
    </form>
  )
}
