'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'

const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-zinc-900 animate-pulse rounded-lg flex items-center justify-center text-zinc-400 font-medium">Loading map...</div>
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
  const [locationCategory, setLocationCategory] = useState('')
  const [location, setLocation] = useState('')

  // Specific Fields
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
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

    if (!lat || !lng) {
      toast.error('Please select a location on the map')
      return
    }

    setLoading(true)

    const commonPayload = {
      description: description || null,
      image_url: imageUrl || null,
      source_link: sourceLink || null,
      youtube_link: youtubeLink || null,
      location_category: locationCategory || null,
      location: location || null,
      lat,
      lng
    }

    let tableName = ''
    let payload = {}

    switch (category) {
      case 'General Event':
        tableName = 'events'
        payload = { ...commonPayload, title: title || null, event_date: eventDate || null }
        break
      case 'Bombing':
        tableName = 'bombings'
        payload = {
          ...commonPayload,
          target_type: targetType || null, event_date: eventDate || null,
          explosive_type: explosiveType || null, perpetrator_faction: perpetratorFaction || null,
          casualty_count: casualtyCount || 0
        }
        break
      case 'Massacre':
        tableName = 'massacres'
        payload = {
          ...commonPayload,
          event_date: eventDate || null, perpetrator_faction: perpetratorFaction || null,
          victim_demographic: victimDemographic || null, casualty_count: casualtyCount || 0, weapons_used: weaponsUsed || null
        }
        break
      case 'Protest':
        tableName = 'protests'
        payload = {
          ...commonPayload,
          event_date: eventDate || null, estimated_participants: estimatedParticipants || 0,
          demands: demands || null, security_response: securityResponse || null, casualties: casualtyCount || 0
        }
        break
      case 'Assassination':
        tableName = 'assassinations'
        payload = {
          ...commonPayload,
          target_name: targetName || null, target_affiliation: targetAffiliation || null, perpetrator_name: perpetratorName || null,
          event_date: eventDate || null, method: method || null
        }
        break
      case 'Arrest':
        tableName = 'arrests'
        payload = {
          ...commonPayload,
          detainee_name: detaineeName || null, detainee_affiliation: detaineeAffiliation || null, arresting_faction: arrestingFaction || null,
          date_of_arrest: dateOfArrest || null, date_of_release: dateOfRelease || null, detention_facility: detentionFacility || null, fate: fate || null
        }
        break
      case 'Regime Change':
        tableName = 'regime_changes'
        payload = {
          ...commonPayload,
          event_name: eventName || null, event_date: eventDate || null, leader_taking_power: leaderTakingPower || null, leader_ousted: leaderOusted || null
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

  const inputClass = "w-full px-4 py-2 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 bg-zinc-900 text-white placeholder-zinc-500 transition-colors"
  const labelClass = "block text-sm font-medium text-zinc-300 mb-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-950 p-6 sm:p-8 rounded-xl border border-zinc-900 shadow-sm">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">Location</h2>
        <MapPicker onLocationSelect={handleLocationSelect} />

        {lat && lng && (
          <div className="flex gap-4 text-sm text-zinc-400 bg-zinc-900 p-3 rounded-lg border border-zinc-800 shadow-sm">
            <div><span className="font-medium text-zinc-200">Lat:</span> {lat.toFixed(5)}</div>
            <div><span className="font-medium text-zinc-200">Lng:</span> {lng.toFixed(5)}</div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">Geographic Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Place Name (City/Neighborhood)</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className={inputClass}
              placeholder="e.g., Aleppo, Bab al-Hawa"
            />
          </div>
          <div>
            <label className={labelClass}>Site Type (Market, Hospital, etc.)</label>
            <input
              type="text"
              value={locationCategory}
              onChange={e => setLocationCategory(e.target.value)}
              className={inputClass}
              placeholder="e.g., Urban, Rural, Camp"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">Event Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Event Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={inputClass}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-zinc-900 text-white">{cat}</option>
              ))}
            </select>
          </div>

          {(category === 'General Event' || category === 'Bombing' || category === 'Massacre' || category === 'Protest' || category === 'Assassination' || category === 'Regime Change') && (
            <div>
              <label className={labelClass}>Event Date</label>
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className={inputClass} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {category === 'General Event' && (
            <div>
              <label className={labelClass}>Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
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
                <input type="text" value={targetName} onChange={e => setTargetName(e.target.value)} className={inputClass} />
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
                <input type="text" value={detaineeName} onChange={e => setDetaineeName(e.target.value)} className={inputClass} />
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
                <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} className={inputClass} />
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
        <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">Additional Information</h2>

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
        className="w-full md:w-auto px-8 py-3 bg-zinc-800 text-white border border-zinc-700 rounded-lg hover:bg-zinc-700 transition disabled:opacity-50 font-medium shadow-sm"
      >
        {loading ? 'Saving Event...' : 'Save Event'}
      </button>
    </form>
  )
}