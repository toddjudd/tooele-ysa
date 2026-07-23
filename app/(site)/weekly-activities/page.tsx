import type { Metadata } from "next";

import { ActivityCard } from "@/components/activity-card";
import { SanityImage } from "@/components/sanity-image";
import { weeklyActivitiesQuery } from "@/lib/sanity/queries";
import type { WeeklyActivitiesQueryResult } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Weekly Activities — Tooele YSA Ward",
};

function hasSanityEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);
}

async function getWeeklyActivities(): Promise<WeeklyActivitiesQueryResult> {
  if (!hasSanityEnv()) {
    return [];
  }

  try {
    const { client } = await import("@/lib/sanity/client");

    return await client.fetch(weeklyActivitiesQuery);
  } catch {
    return [];
  }
}

export default async function WeeklyActivitiesPage() {
  const activities = await getWeeklyActivities();

  return (
    <>
      <section aria-labelledby="weekly-activities-heading" className="bg-surface text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-on-surface-muted">WEEKLY ACTIVITIES</p>
            <h1 id="weekly-activities-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
              Get Involved Throughout the Week
            </h1>
            <p className="mt-stack-md text-body-lg text-on-surface-muted">
              Beyond Sundays, the Tooele YSA Ward gathers for institute, activities, service, and time together. Here is
              what happens each week.
            </p>
          </div>
        </div>
      </section>

      {activities.length > 0 ? (
        activities.map((activity, index) => {
          const isWarm = index % 2 === 0;
          const dimensions = activity.image?.asset?.metadata?.dimensions;

          return (
            <section
              key={activity._id}
              aria-labelledby={`activity-${activity._id}`}
              className={isWarm ? "bg-surface-warm text-on-surface" : "bg-surface text-on-surface"}
            >
              <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
                <div className="max-w-3xl">
                  {activity.subtitle ? (
                    <p className="text-section-label tracking-[0.14em] text-accent-rust">{activity.subtitle}</p>
                  ) : null}
                  <h2 id={`activity-${activity._id}`} className="mt-stack-sm text-headline-mobile md:text-headline">
                    {activity.title}
                  </h2>
                  {activity.schedule ? (
                    <p className="mt-stack-sm text-body-sm font-semibold uppercase tracking-[0.08em] text-primary">
                      {activity.schedule}
                    </p>
                  ) : null}
                  {activity.body ? (
                    <p className="mt-stack-md text-body-lg text-on-surface-muted whitespace-pre-line">{activity.body}</p>
                  ) : null}
                </div>

                {activity.image?.asset ? (
                  <div className="mt-stack-lg">
                    <SanityImage
                      image={activity.image}
                      alt=""
                      width={dimensions?.width ?? 1200}
                      height={dimensions?.height ?? 675}
                      sizes="(min-width: 1100px) 1100px, 100vw"
                      className="block h-auto w-full object-cover"
                    />
                  </div>
                ) : null}

                {activity.cards && activity.cards.length > 0 ? (
                  <div className="mt-stack-lg grid grid-cols-1 gap-stack-md sm:grid-cols-2 lg:grid-cols-3">
                    {activity.cards.map((card) => (
                      <ActivityCard
                        key={card._key}
                        title={card.title}
                        body={card.body}
                        linkUrl={card.linkUrl}
                        linkText={card.linkText}
                        image={card.image}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          );
        })
      ) : (
        <section aria-label="Weekly activities" className="bg-surface-warm text-on-surface">
          <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
            <p className="text-body text-on-surface-muted">Weekly activity details will be added here soon.</p>
          </div>
        </section>
      )}
    </>
  );
}
