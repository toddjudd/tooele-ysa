import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

test("calendar page is ISR and exposes the required page shell", () => {
  assert.match(source, /export\s+const\s+revalidate\s*=\s*60/);
  assert.match(source, /title:\s*["']Calendar — Tooele YSA Ward["']/);
  assert.equal((source.match(/<h1\b/g) ?? []).length, 1);
  assert.match(source, />CALENDAR</);
  assert.match(source, /text-headline-mobile md:text-headline/);
  assert.match(source, /py-section-v-mobile/);
  assert.match(source, /lg:py-section-v/);
  assert.match(source, /@\/lib\/sanity\/client/);
  assert.match(source, /@\/lib\/sanity\/queries/);
  assert.match(source, /@\/lib\/sanity\/upcoming-events/);
  assert.match(source, /fetchUpcomingEvents\(client, upcomingEventsQuery\)/);
  assert.doesNotMatch(source, /client\.fetch|defineQuery|groq/i);
});

test("calendar page renders the ward events section", () => {
  assert.match(source, />UPCOMING EVENTS</);
  assert.match(source, /<h2 id="events-heading"/);
  assert.match(source, /<EventItem/);
  assert.match(source, /events\.map/);
  assert.match(source, /No upcoming events listed yet\./);
  assert.match(source, /text-body text-on-surface-muted/);
});
