import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatEventDateTime } from "../lib/format-event-date.ts";

describe("formatEventDateTime", () => {
  it("formats Sanity ISO datetime values in a human-readable event style", () => {
    assert.equal(formatEventDateTime("2026-07-07T19:00:00-06:00"), "Tuesday, July 7 at 7:00 PM");
  });

  it("formats midnight events with the expected time", () => {
    assert.equal(formatEventDateTime("2026-07-07T00:00:00-06:00"), "Tuesday, July 7 at 12:00 AM");
  });

  it("handles all-day date-only values when provided", () => {
    assert.equal(formatEventDateTime("2026-07-07"), "Tuesday, July 7");
  });
});
