import type { UpcomingEventsQueryResult } from "../types";

type SanityEventClient = {
  fetch: (
    query: string,
    params?: Record<string, unknown>,
  ) => Promise<UpcomingEventsQueryResult>;
};

// The Tooele YSA Ward is in Mountain Time.
const EVENT_TIME_ZONE = "America/Denver";

/**
 * Start of the current calendar day in the ward's timezone, as a UTC ISO
 * string. Using this as the query cutoff (instead of the exact current instant)
 * keeps an event listed for the whole day it happens, so approved events don't
 * disappear the moment their start time passes.
 */
export function startOfToday(timeZone: string = EVENT_TIME_ZONE, reference: Date = new Date()): string {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone }).format(reference); // YYYY-MM-DD
  const midnightUtc = new Date(`${ymd}T00:00:00Z`);
  // Adjust that UTC midnight by the zone's offset for that day (DST-safe).
  const zoned = new Date(midnightUtc.toLocaleString("en-US", { timeZone }));
  const offsetMs = midnightUtc.getTime() - zoned.getTime();
  return new Date(midnightUtc.getTime() + offsetMs).toISOString();
}

export async function fetchUpcomingEvents(client: SanityEventClient, query: string) {
  try {
    return await client.fetch(query, { cutoff: startOfToday() });
  } catch {
    return [];
  }
}
