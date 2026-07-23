import type { Metadata } from "next";

import { EventItem } from "@/components/event-item";
import { client } from "@/lib/sanity/client";
import { upcomingEventsQuery } from "@/lib/sanity/queries";
import { fetchUpcomingEvents } from "@/lib/sanity/upcoming-events";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Calendar — Tooele YSA Ward",
};

export default async function CalendarPage() {
  const events = await fetchUpcomingEvents(client, upcomingEventsQuery);

  return (
    <>
      <section aria-labelledby="calendar-heading" className="bg-surface text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-on-surface-muted">CALENDAR</p>
            <h1 id="calendar-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
              Tooele YSA Ward Calendar
            </h1>
            <p className="mt-stack-md text-body-lg text-on-surface-muted">
              Stay up to date with ward activities, firesides, service projects, and other events happening across the
              Tooele YSA Ward.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="events-heading" className="bg-surface-warm text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-accent-rust">UPCOMING EVENTS</p>
            <h2 id="events-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
              Upcoming Events
            </h2>
            {events.length > 0 ? (
              <div className="mt-stack-lg space-y-stack-md">
                {events.map((event) => (
                  <EventItem
                    key={event._id}
                    title={event.title}
                    dateTime={event.dateTime}
                    description={event.description}
                    location={event.location}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-stack-md text-body text-on-surface-muted">No upcoming events listed yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
