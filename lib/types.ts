export type MeetingType =
  | 'testimony'
  | 'regular'
  | 'stake'
  | 'general';

export interface Hymn {
  number: number;
  title: string;
}

export interface SpeakerItem {
  name: string;
  topic: string;
  type: 'speaker' | 'musical-number';
}

export interface WardBusinessItem {
  description: string;
}

export interface SacramentMeeting {
  id: number;
  date: string;              // ISO date string: 'YYYY-MM-DD'
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements?: string[];
  openingHymn: Hymn;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: boolean;
  // Optional because stake and general conference Sundays are
  // non-sacrament meetings, so no sacrament hymn is sung.
  sacramentHymn?: Hymn;
  speakers: SpeakerItem[];
  closingHymn: Hymn;
  closingPrayer: string;
}

/** Shape of the JSON body the API returns when a request fails. */
export interface ApiError {
  error: string;
}

/** Names of the inputs in the create/edit meeting form. */
export type MeetingFormField =
  | 'date'
  | 'meetingType'
  | 'presiding'
  | 'conducting'
  | 'announcements'
  | 'openingHymnNumber'
  | 'openingHymnTitle'
  | 'openingPrayer'
  | 'wardBusiness'
  | 'stakeBusiness'
  | 'sacramentHymnNumber'
  | 'sacramentHymnTitle'
  | 'speakers'
  | 'closingHymnNumber'
  | 'closingHymnTitle'
  | 'closingPrayer';

/** State returned by the createMeeting/updateMeeting Server Actions. */
export interface MeetingFormState {
  message: string | null;
  errors: Partial<Record<MeetingFormField, string[]>>;
  // The values the user submitted, so the form can show them again
  // after a failed validation instead of clearing every field.
  values?: Record<MeetingFormField, string>;
}

/** A single link rendered by the NavLinks component. */
export interface NavItem {
  href: string;
  label: string;
}
