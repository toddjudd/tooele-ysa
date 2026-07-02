import type { Metadata } from "next";

import { LeaderCard } from "@/components/leader-card";
import { MissionariesBlock } from "@/components/missionaries-block";
import { leaderCardsQuery } from "@/lib/sanity/queries";
import type { LeaderCardsQueryResult } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us — Tooele YSA Ward",
};

function hasSanityEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);
}

async function getLeaderCards(): Promise<LeaderCardsQueryResult> {
  if (!hasSanityEnv()) {
    return [];
  }

  try {
    const { client } = await import("@/lib/sanity/client");

    return await client.fetch(leaderCardsQuery);
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const leaderCards = await getLeaderCards();

  return (
    <>
      <section aria-labelledby="about-heading" className="bg-surface text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-on-surface-muted">ABOUT US</p>
            <h1 id="about-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
              A Ward for Young Single Adults in Tooele
            </h1>
            <p className="mt-stack-md text-body-lg text-on-surface-muted">
              Tooele YSA Ward is a place to worship Jesus Christ, build lasting friendships, and serve together. This
              page will continue to grow with more details about our ward and the people who help members feel welcome.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="leadership-heading" className="bg-surface-warm text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-on-surface-muted">ABOUT US</p>
            <h2 id="leadership-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
              OUR LEADERSHIP
            </h2>
            <p className="mt-stack-md text-body-lg text-on-surface-muted">
              Reach out to ward leaders when you need help connecting, have a question, or want to know where to go next.
            </p>
          </div>
          {leaderCards.length > 0 ? (
            <div className="mt-stack-lg grid grid-cols-1 gap-stack-md sm:grid-cols-2 lg:grid-cols-3">
              {leaderCards.map((leader) => (
                <LeaderCard
                  key={leader._id}
                  name={leader.name}
                  title={leader.title}
                  phone={leader.phone}
                  email={leader.email}
                />
              ))}
            </div>
          ) : (
            <p className="mt-stack-lg text-body text-on-surface-muted">Leadership information will be added soon.</p>
          )}
        </div>
      </section>

      <MissionariesBlock />
    </>
  );
}
