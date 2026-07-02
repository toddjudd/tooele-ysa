import type { UpcomingEventsQueryResult } from "../types";

type SanityEventClient = {
  fetch: (query: string) => Promise<UpcomingEventsQueryResult>;
};

export async function fetchUpcomingEvents(client: SanityEventClient, query: string) {
  try {
    return await client.fetch(query);
  } catch {
    return [];
  }
}
