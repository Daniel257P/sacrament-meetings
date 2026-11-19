'use client';

import { useActionState, type ReactNode } from 'react';
import Link from 'next/link';
import { createMeeting, updateMeeting } from '@/lib/actions';
import { MEETING_TYPE_LABELS } from '@/lib/format';
import type {
  MeetingFormField,
  MeetingFormState,
  MeetingType,
  SacramentMeeting,
  SpeakerItem,
} from '@/lib/types';

const initialState: MeetingFormState = { message: null, errors: {} };

const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 aria-[invalid=true]:border-red-600';

function speakerToLine(item: SpeakerItem): string {
  if (item.type === 'musical-number') return `${item.name} | ${item.topic} | music`;
  return item.topic ? `${item.name} | ${item.topic}` : item.name;
}

/** Turns an existing meeting into the string values the inputs expect. */
function meetingToValues(meeting?: SacramentMeeting): Record<MeetingFormField, string> {
  return {
    date: meeting?.date ?? '',
    meetingType: meeting?.meetingType ?? 'regular',
    presiding: meeting?.presiding ?? '',
    conducting: meeting?.conducting ?? '',
    announcements: (meeting?.announcements ?? []).join('\n'),
    openingHymnNumber: meeting ? String(meeting.openingHymn.number) : '',
    openingHymnTitle: meeting?.openingHymn.title ?? '',
    openingPrayer: meeting?.openingPrayer ?? '',
    wardBusiness: (meeting?.wardBusiness ?? []).map((item) => item.description).join('\n'),
    stakeBusiness: meeting?.stakeBusiness ? 'on' : '',
    sacramentHymnNumber: meeting?.sacramentHymn ? String(meeting.sacramentHymn.number) : '',
    sacramentHymnTitle: meeting?.sacramentHymn?.title ?? '',
    speakers: (meeting?.speakers ?? []).map(speakerToLine).join('\n'),
    closingHymnNumber: meeting ? String(meeting.closingHymn.number) : '',
    closingHymnTitle: meeting?.closingHymn.title ?? '',
    closingPrayer: meeting?.closingPrayer ?? '',
  };
}

/** Error container under each field. aria-live announces new errors to screen readers. */
function FieldErrors({ name, errors }: { name: MeetingFormField; errors?: string[] }) {
  return (
    <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
      {errors?.map((message) => (
        <p key={message} className="mt-1 text-sm text-red-700 dark:text-red-400">
          {message}
        </p>
      ))}
    </div>
  );
}

interface FieldProps {
  name: MeetingFormField;
  label: string;
  errors?: string[];
  hint?: string;
  children: (describedBy: string, invalid: boolean) => ReactNode;
}

function Field({ name, label, errors, hint, children }: FieldProps) {
  const describedBy = hint ? `${name}-hint ${name}-error` : `${name}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {children(describedBy, Boolean(errors?.length))}
      <FieldErrors name={name} errors={errors} />
    </div>
  );
}

interface MeetingFormProps {
  /** Pass a meeting to edit it; leave it out to create a new one. */
  meeting?: SacramentMeeting;
}

export default function MeetingForm({ meeting }: MeetingFormProps) {
  const action = meeting ? updateMeeting.bind(null, meeting.id) : createMeeting;
  const [state, formAction, isPending] = useActionState(action, initialState);

  // After a failed submit, show what the user typed instead of the original values.
  const values = state.values ?? meetingToValues(meeting);
  const errors = state.errors;

  const textInput = (name: MeetingFormField, label: string, type = 'text') => (
    <Field name={name} label={label} errors={errors[name]}>
      {(describedBy, invalid) => (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={values[name]}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={inputClass}
        />
      )}
    </Field>
  );

  const hymnInputs = (prefix: 'opening' | 'sacrament' | 'closing', label: string) => (
    <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
      {textInput(`${prefix}HymnNumber`, `${label} number`, 'number')}
      {textInput(`${prefix}HymnTitle`, `${label} title`)}
    </div>
  );

  const textArea = (name: MeetingFormField, label: string, hint: string) => (
    <Field name={name} label={label} hint={hint} errors={errors[name]}>
      {(describedBy, invalid) => (
        <textarea
          id={name}
          name={name}
          rows={4}
          defaultValue={values[name]}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={inputClass}
        />
      )}
    </Field>
  );

  const legendClass = 'mb-3 font-serif text-xl font-semibold';

  return (
    <form action={formAction} noValidate className="flex max-w-3xl flex-col gap-8">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className={legendClass}>Meeting details</legend>
        {textInput('date', 'Date (Sunday)', 'date')}
        <Field name="meetingType" label="Meeting type" errors={errors.meetingType}>
          {(describedBy, invalid) => (
            <select
              id="meetingType"
              name="meetingType"
              defaultValue={values.meetingType}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={inputClass}
            >
              {(Object.keys(MEETING_TYPE_LABELS) as MeetingType[]).map((type) => (
                <option key={type} value={type}>
                  {MEETING_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          )}
        </Field>
        {textInput('presiding', 'Presiding')}
        {textInput('conducting', 'Conducting')}
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className={legendClass}>Hymns and prayers</legend>
        {hymnInputs('opening', 'Opening hymn')}
        {textInput('openingPrayer', 'Opening prayer')}
        {hymnInputs('sacrament', 'Sacrament hymn')}
        {hymnInputs('closing', 'Closing hymn')}
        {textInput('closingPrayer', 'Closing prayer')}
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className={legendClass}>Program</legend>
        {textArea(
          'speakers',
          'Speakers and musical numbers',
          'One per line: "Name | Topic". For a musical number, add "| music" at the end, e.g. "Youth Choir | I Am a Child of God | music".',
        )}
        {textArea('wardBusiness', 'Ward business', 'One item per line, e.g. "Sustain - Sister Smith - Primary Teacher".')}
        {textArea('announcements', 'Announcements', 'One announcement per line.')}
        <div className="flex items-center gap-2">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={values.stakeBusiness === 'on'}
            className="h-4 w-4"
          />
          <label htmlFor="stakeBusiness" className="text-sm font-medium">
            There is stake business this week
          </label>
        </div>
      </fieldset>

      <div className="flex flex-col gap-3">
        <p aria-live="polite" className="text-sm font-medium text-red-700 dark:text-red-400">
          {state.message}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-primary px-5 py-2 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {isPending ? 'Saving…' : meeting ? 'Save changes' : 'Create meeting'}
          </button>
          <Link href="/meetings" className="underline underline-offset-4">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
