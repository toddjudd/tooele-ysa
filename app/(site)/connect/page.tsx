import type { Metadata } from "next";
import Image from "next/image";

import { AppLinkCard } from "@/components/app-link-card";
import { EventItem } from "@/components/event-item";
import { client } from "@/lib/sanity/client";
import { upcomingEventsQuery } from "@/lib/sanity/queries";
import { fetchUpcomingEvents } from "@/lib/sanity/upcoming-events";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Let's Connect — Tooele YSA Ward",
};

const appLinks = [
  {
    name: "Gospel Library",
    href: "https://www.churchofjesuschrist.org/learn/mobile-applications/gospel-library?lang=eng",
    iconSrc: "/images/app-icons/gospel-library.svg",
  },
  {
    name: "Gospel Living",
    href: "https://www.churchofjesuschrist.org/youth/childrenandyouth/gospel-living-app?lang=eng",
    iconSrc: "/images/app-icons/gospel-living.svg",
  },
  {
    name: "Member Tools",
    href: "https://www.churchofjesuschrist.org/tools/help/about-member-tools?lang=eng",
    iconSrc: "/images/app-icons/member-tools.svg",
  },
  {
    name: "My Institute",
    href: "https://myinstitute.churchofjesuschrist.org/",
    iconSrc: "/images/app-icons/my-institute.svg",
  },
] as const;

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    iconSrc: "/images/app-icons/instagram.svg",
  },
  {
    name: "Facebook",
    href: "#",
    iconSrc: "/images/app-icons/facebook.svg",
  },
] as const;

function AppIcon({ iconSrc }: { iconSrc: string }) {
  return <Image src={iconSrc} alt="" width={40} height={40} className="h-10 w-10" aria-hidden="true" />;
}

export default async function ConnectPage() {
  const events = await fetchUpcomingEvents(client, upcomingEventsQuery);

  return (
    <>
      <section aria-labelledby="connect-heading" className="bg-surface text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-on-surface-muted">LET&apos;S CONNECT</p>
            <h1 id="connect-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
              Tools and Accounts for Tooele YSA
            </h1>
            <p className="mt-stack-md text-body-lg text-on-surface-muted">
              Find the Church apps and ward social links members use most, all from one quick page.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="link-tree-heading" className="bg-surface-warm text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-on-surface-muted">STAY CONNECTED</p>
            <h2 id="link-tree-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
              Open Your Go-To LDS Apps
            </h2>
            <p className="mt-stack-md text-body-lg text-on-surface-muted">
              Jump straight to scripture study, youth and young adult resources, member tools, and institute access.
            </p>
          </div>
          <div className="mt-stack-lg grid grid-cols-2 gap-stack-sm lg:grid-cols-4 lg:gap-stack-md">
            {appLinks.map((link) => (
              <AppLinkCard
                key={link.name}
                name={link.name}
                href={link.href}
                icon={<AppIcon iconSrc={link.iconSrc} />}
              />
            ))}
            {socialLinks.map((link) => (
              <AppLinkCard
                key={link.name}
                name={link.name}
                href="#"
                icon={<AppIcon iconSrc={link.iconSrc} />}
                comingSoon={true}
              />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="events-heading" className="bg-surface text-on-surface">
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
