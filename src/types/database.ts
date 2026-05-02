export interface UnifiedMapEvent {
  id: string;
  event_type: 'General Event' | 'Regime Change' | 'Bombing' | 'Massacre' | 'Arrest' | 'Protest' | 'Assassination';
  title?: string;
  description?: string;
  event_date?: string;
  lat: number;
  lng: number;
  source_link?: string;
  youtube_link?: string;
}
