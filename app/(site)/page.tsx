import type { Metadata } from "next";
import Link from "next/link";

import { Hero } from "@/components/hero";
import { HomeContentSection } from "@/components/home-content-section";
import { heroImageQuery, homeSectionBottomQuery, homeSectionTopQuery } from "@/lib/sanity/queries";
import type { HeroImageQueryResult, HomeSectionBottomQueryResult, HomeSectionTopQueryResult } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tooele YSA Ward",
};

const directionsUrl = "https://maps.app.goo.gl/s6kaRrALfUj1PGRU7";

function hasSanityEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);
}

async function getHeroImage(): Promise<HeroImageQueryResult> {
  if (!hasSanityEnv()) {
    return null;
  }

  try {
    const { client } = await import("@/lib/sanity/client");

    return await client.fetch(heroImageQuery);
  } catch {
    return null;
  }
}

async function getHomeSectionTop(): Promise<HomeSectionTopQueryResult> {
  if (!hasSanityEnv()) {
    return null;
  }

  try {
    const { client } = await import("@/lib/sanity/client");

    return await client.fetch(homeSectionTopQuery);
  } catch {
    return null;
  }
}

async function getHomeSectionBottom(): Promise<HomeSectionBottomQueryResult> {
  if (!hasSanityEnv()) {
    return null;
  }

  try {
    const { client } = await import("@/lib/sanity/client");

    return await client.fetch(homeSectionBottomQuery);
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [heroImage, topSection, bottomSection] = await Promise.all([
    getHeroImage(),
    getHomeSectionTop(),
    getHomeSectionBottom(),
  ]);

  return (
    <>
      <Hero heroImage={heroImage} />
      <HomeContentSection
        ariaLabel="Welcome message"
        backgroundImage={topSection?.backgroundImage}
        eyebrow={topSection?.eyebrow}
        heading={topSection?.heading}
        body={topSection?.body}
        fallbackEyebrow="WELCOME"
        fallbackHeading="A place to belong"
        fallbackBody="Come worship, serve, and grow with other young single adults in Tooele."
      />
      <HomeContentSection
        ariaLabel="Ward life"
        backgroundImage={bottomSection?.backgroundImage}
        eyebrow={bottomSection?.eyebrow}
        heading={bottomSection?.heading}
        body={bottomSection?.body}
        fallbackEyebrow="CONNECT"
        fallbackHeading="Grow together in Christ"
        fallbackBody="Find friendship, build faith, and make Tooele YSA Ward part of your week."
      />
      <section aria-label="Join us" className="bg-surface text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-accent-rust">JOIN US</p>
            <h2 className="mt-stack-sm text-headline-mobile md:text-headline">Sundays, 11:00 AM – 1:00 PM</h2>
            <p className="mt-stack-md text-body-lg text-on-surface-muted">
              Worship with us each Sunday, then stay connected through activities, service, and ward gatherings.
            </p>
            <div className="mt-stack-lg flex flex-col gap-4 sm:flex-row">
              <Link
                href="/gatherings"
                className="flex min-h-11 items-center justify-center bg-accent-rust px-8 py-3.5 text-center text-cta tracking-[0.1em] text-on-accent-rust transition-colors hover:bg-[#8f3f23] focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                View Gatherings
              </Link>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center justify-center border-2 border-primary bg-transparent px-[30px] py-3 text-center text-cta tracking-[0.1em] text-primary transition-colors hover:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Open Map
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
