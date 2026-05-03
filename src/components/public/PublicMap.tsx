'use client'

import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { UnifiedMapEvent } from '@/types/database'

// Fix Leaflet's default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const EVENT_COLORS: Record<string, string> = {
  'General Event': '#64748b', // slate
  'Regime Change': '#dc2626', // red
  'Bombing': '#9a3412', // dark rust
  'Massacre': '#7f1d1d', // dark red
  'Arrest': '#ca8a04', // amber
  'Protest': '#4f46e5', // muted indigo
  'Assassination': '#1e293b' // deep slate
}

function createCustomIcon(eventType: string) {
  const color = EVENT_COLORS[eventType] || EVENT_COLORS['General Event']
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  })
}

interface PublicMapProps {
  events: UnifiedMapEvent[];
  onEventClick: (event: UnifiedMapEvent) => void;
}

export default function PublicMap({ events, onEventClick }: PublicMapProps) {
  const defaultCenter: L.LatLngExpression = [34.8, 38.9]
  const syriaBounds: L.LatLngBoundsExpression = [
    [32.3, 35.7], // SouthWest
    [37.3, 42.4]  // NorthEast
  ]

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={6} 
      minZoom={6}
      maxBounds={syriaBounds}
      maxBoundsViscosity={1.0}
      scrollWheelZoom={true} 
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {events.map((event) => {
        if (!event.lat || !event.lng) return null;
        
        return (
          <Marker 
            key={event.id}
            position={[event.lat, event.lng]}
            icon={createCustomIcon(event.event_type)}
            eventHandlers={{
              click: () => onEventClick(event)
            }}
          />
        );
      })}
    </MapContainer>
  )
}
