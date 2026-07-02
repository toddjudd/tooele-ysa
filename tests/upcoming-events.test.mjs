import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fetchUpcomingEvents } from "../lib/sanity/upcoming-events.ts";

describe("fetchUpcomingEvents", () => {
  it("returns upcoming ward events from the provided Sanity client", async () => {
    const events = [
      {
        _id: "event-1",
        title: "FHE",
        dateTime: "2026-07-07T19:00:00-06:00",
        description: "Meet at the chapel.",
        location: "Tooele Stake Center",
      },
    ];

    const result = await fetchUpcomingEvents({ fetch: async () => events }, "events query");

    assert.deepEqual(result, events);
  });

  it("returns an empty list when the GROQ fetch fails", async () => {
    const result = await fetchUpcomingEvents(
      { fetch: async () => Promise.reject(new Error("Sanity unavailable")) },
      "events query",
    );

    assert.deepEqual(result, []);
  });
});
