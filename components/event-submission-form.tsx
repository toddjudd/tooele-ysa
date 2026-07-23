"use client";

import { useActionState } from "react";

import { submitEvent, type SubmitEventState } from "@/app/(site)/calendar/actions";

const initialState: SubmitEventState | null = null;

const inputClass =
  "mt-stack-xs w-full rounded-md border border-on-surface/15 bg-surface px-3 py-2 text-body text-on-surface outline-none focus:border-accent-rust focus:ring-1 focus:ring-accent-rust";
const labelClass = "block text-body-sm font-medium text-on-surface";

export function EventSubmissionForm() {
  const [state, action, pending] = useActionState(submitEvent, initialState);

  if (state?.ok) {
    return (
      <div
        role="status"
        className="rounded-md border-l-[3px] border-accent-rust bg-surface px-stack-md py-stack-md"
      >
        <p className="text-body-lg text-on-surface">Thanks! Your event was submitted.</p>
        <p className="mt-stack-sm text-body text-on-surface-muted">
          A ward leader will review it before it appears on the calendar.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-stack-lg max-w-xl space-y-stack-md">
      <div>
        <label htmlFor="event-title" className={labelClass}>
          Event title <span className="text-accent-rust">*</span>
        </label>
        <input id="event-title" name="title" type="text" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="event-datetime" className={labelClass}>
          Date and time <span className="text-accent-rust">*</span>
        </label>
        <input
          id="event-datetime"
          name="dateTime"
          type="datetime-local"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="event-location" className={labelClass}>
          Location
        </label>
        <input id="event-location" name="location" type="text" className={inputClass} />
      </div>

      <div>
        <label htmlFor="event-description" className={labelClass}>
          Description
        </label>
        <textarea id="event-description" name="description" rows={4} className={inputClass} />
      </div>

      <div className="grid gap-stack-md sm:grid-cols-2">
        <div>
          <label htmlFor="event-submitter-name" className={labelClass}>
            Your name
          </label>
          <input id="event-submitter-name" name="submitterName" type="text" className={inputClass} />
        </div>
        <div>
          <label htmlFor="event-submitter-email" className={labelClass}>
            Your email
          </label>
          <input
            id="event-submitter-email"
            name="submitterEmail"
            type="email"
            className={inputClass}
          />
        </div>
      </div>

      {/* Honeypot field — hidden from real users, catches bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="event-website">Leave this field empty</label>
        <input id="event-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state?.error ? (
        <p role="alert" className="text-body-sm text-accent-rust">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-md bg-accent-rust px-6 py-3 text-body font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit event for review"}
      </button>
    </form>
  );
}
