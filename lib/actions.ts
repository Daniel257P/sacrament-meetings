'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as db from './meetings-db';
import type {
  MeetingFormField,
  MeetingFormState,
  SacramentMeeting,
  SpeakerItem,
} from './types';

// ---- Validation ----------------------------------------------------------

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseIsoDate(value: string): Date | null {
  if (!ISO_DATE.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value) ? date : null;
}

const requiredText = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(120, `${label} must be 120 characters or fewer.`);

const hymnNumber = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} number is required.`)
    .regex(/^\d+$/, `${label} number must be a whole number.`)
    .transform(Number)
    .refine((n) => n >= 1 && n <= 1000, `${label} number must be between 1 and 1000.`);

// One item per line; blank lines are ignored.
const lines = z
  .string()
  .transform((value) => value.split('\n').map((line) => line.trim()).filter(Boolean));

// Speakers: one per line as "Name | Topic", or "Name | Song | music" for a musical number.
function parseSpeakerLine(line: string): SpeakerItem {
  const [name = '', topic = '', kind = ''] = line.split('|').map((part) => part.trim());
  return {
    name,
    topic,
    type: kind.toLowerCase() === 'music' ? 'musical-number' : 'speaker',
  };
}

const speakers = z
  .string()
  .transform((value) => value.split('\n').map((line) => line.trim()).filter(Boolean))
  .refine(
    (items) => items.every((line) => parseSpeakerLine(line).name.length > 0),
    'Each line needs a name before the first "|".',
  )
  .transform((items) => items.map(parseSpeakerLine));

const MeetingFormSchema = z.object({
  date: z
    .string()
    .refine((value) => parseIsoDate(value) !== null, 'Enter a valid date.')
    .refine((value) => parseIsoDate(value)?.getUTCDay() === 0, 'Meetings must be on a Sunday.'),
  meetingType: z.enum(['testimony', 'regular', 'stake', 'general'], {
    error: 'Choose a meeting type.',
  }),
  presiding: requiredText('Presiding'),
  conducting: requiredText('Conducting'),
  announcements: lines,
  openingHymnNumber: hymnNumber('Opening hymn'),
  openingHymnTitle: requiredText('Opening hymn title'),
  openingPrayer: requiredText('Opening prayer'),
  wardBusiness: lines,
  stakeBusiness: z.string().transform((value) => value === 'on'),
  sacramentHymnNumber: hymnNumber('Sacrament hymn'),
  sacramentHymnTitle: requiredText('Sacrament hymn title'),
  speakers,
  closingHymnNumber: hymnNumber('Closing hymn'),
  closingHymnTitle: requiredText('Closing hymn title'),
  closingPrayer: requiredText('Closing prayer'),
});

type ValidMeetingForm = z.output<typeof MeetingFormSchema>;

const FIELDS: MeetingFormField[] = [
  'date', 'meetingType', 'presiding', 'conducting', 'announcements',
  'openingHymnNumber', 'openingHymnTitle', 'openingPrayer', 'wardBusiness',
  'stakeBusiness', 'sacramentHymnNumber', 'sacramentHymnTitle', 'speakers',
  'closingHymnNumber', 'closingHymnTitle', 'closingPrayer',
];

/** Reads every form field as a string ('' when missing). */
function readForm(formData: FormData): Record<MeetingFormField, string> {
  const values = {} as Record<MeetingFormField, string>;
  for (const field of FIELDS) {
    const value = formData.get(field);
    values[field] = typeof value === 'string' ? value : '';
  }
  return values;
}

function toMeeting(data: ValidMeetingForm): Omit<SacramentMeeting, 'id'> {
  return {
    date: data.date,
    meetingType: data.meetingType,
    presiding: data.presiding,
    conducting: data.conducting,
    announcements: data.announcements,
    openingHymn: { number: data.openingHymnNumber, title: data.openingHymnTitle },
    openingPrayer: data.openingPrayer,
    wardBusiness: data.wardBusiness.map((description) => ({ description })),
    stakeBusiness: data.stakeBusiness,
    sacramentHymn: { number: data.sacramentHymnNumber, title: data.sacramentHymnTitle },
    speakers: data.speakers,
    closingHymn: { number: data.closingHymnNumber, title: data.closingHymnTitle },
    closingPrayer: data.closingPrayer,
  };
}

/** Postgres error 23505 = unique violation (the meetings.date column is UNIQUE). */
function isDuplicateDate(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}

const DUPLICATE_DATE: MeetingFormState['errors'] = {
  date: ['A meeting already exists on this date.'],
};

// ---- Server Actions ------------------------------------------------------
// With useActionState, each action receives the previous state first.
// It is not needed here, so it is named with a leading "_".

export async function createMeeting(
  _prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  const values = readForm(formData);
  const validated = MeetingFormSchema.safeParse(values);

  if (!validated.success) {
    return {
      message: 'Please fix the errors below and try again.',
      errors: z.flattenError(validated.error).fieldErrors,
      values,
    };
  }

  try {
    await db.addMeeting(toMeeting(validated.data));
  } catch (error) {
    if (isDuplicateDate(error)) {
      return { message: 'Please fix the errors below and try again.', errors: DUPLICATE_DATE, values };
    }
    console.error('Database error: failed to create meeting.', error);
    throw new Error('Failed to create the meeting. Please try again later.');
  }

  // redirect() must stay outside try/catch because it works by throwing.
  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function updateMeeting(
  id: number,
  _prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  const values = readForm(formData);
  const validated = MeetingFormSchema.safeParse(values);

  if (!validated.success) {
    return {
      message: 'Please fix the errors below and try again.',
      errors: z.flattenError(validated.error).fieldErrors,
      values,
    };
  }

  let updated: SacramentMeeting | null;
  try {
    updated = await db.updateMeeting(id, toMeeting(validated.data));
  } catch (error) {
    if (isDuplicateDate(error)) {
      return { message: 'Please fix the errors below and try again.', errors: DUPLICATE_DATE, values };
    }
    console.error(`Database error: failed to update meeting ${id}.`, error);
    throw new Error('Failed to update the meeting. Please try again later.');
  }

  if (!updated) {
    return { message: 'This meeting no longer exists. It may have been deleted.', errors: {}, values };
  }

  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}`);
  redirect('/meetings');
}

export async function deleteMeeting(id: number): Promise<void> {
  try {
    await db.deleteMeeting(id);
  } catch (error) {
    console.error(`Database error: failed to delete meeting ${id}.`, error);
    throw new Error('Failed to delete the meeting. Please try again later.');
  }

  revalidatePath('/meetings');
}
