import type { Metadata } from "next";
import Image from "next/image";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { sacramentProgramQuery } from "@/lib/sanity/queries";
import type { SacramentProgramQueryResult } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sunday Church — Tooele YSA Ward",
};

const directionsUrl = "https://maps.app.goo.gl/s6kaRrALfUj1PGRU7";
const floorPlanAlt = "Floor plan of the Tooele chapel showing room locations";

function getFloorPlanSrc() {
  const imageDirectory = join(process.cwd(), "public", "images");

  if (!existsSync(imageDirectory)) {
    return null;
  }

  const floorPlanFile = readdirSync(imageDirectory).find((fileName) => /^floor-plan\./i.test(fileName));

  return floorPlanFile ? `/images/${floorPlanFile}` : null;
}

function hasSanityEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);
}

async function getSacramentProgram(): Promise<SacramentProgramQueryResult> {
  if (!hasSanityEnv()) {
    return null;
  }

  try {
    const { client } = await import("@/lib/sanity/client");

    return await client.fetch(sacramentProgramQuery);
  } catch {
    return null;
  }
}

function formatMeetingDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);

  if (!year || !month || !day) {
    return isoDate;
  }

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function SundayChurchPage() {
  const floorPlanSrc = getFloorPlanSrc();
  const program = await getSacramentProgram();

  return (
    <>
      <section aria-labelledby="sunday-church-heading" className="bg-surface text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-on-surface-muted">SUNDAY CHURCH</p>
            <h1 id="sunday-church-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
              Gather With Us on Sundays
            </h1>
            <p className="mt-stack-md text-body-lg text-on-surface-muted">
              Come worship with other young single adults in Tooele. Sacrament meeting begins at 11:00 AM, with
              second-hour classes following afterward.
            </p>
            <div className="mt-stack-lg grid gap-stack-md border-l-4 border-accent-rust pl-stack-md text-body-lg">
              <p>
                <span className="block text-section-label tracking-[0.14em] text-on-surface-muted">Time</span>
                <strong>Sundays, 11:00 AM – 1:00 PM</strong>
              </p>
              <p>
                <span className="block text-section-label tracking-[0.14em] text-on-surface-muted">Chapel</span>
                <strong>196 N Pinehurst Ave, Tooele, UT 84074</strong>
              </p>
            </div>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get Directions to the Chapel (opens in new tab)"
              className="mt-stack-lg inline-flex min-h-11 items-center justify-center bg-accent-rust px-8 py-3.5 text-center text-cta tracking-[0.1em] text-on-accent-rust transition-colors hover:bg-[#8f3f23] focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Get Directions to the Chapel
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="sacrament-program-heading" className="bg-surface-warm text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-on-surface-muted">SACRAMENT PROGRAM</p>
            <h2 id="sacrament-program-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
              This Week&apos;s Sacrament Meeting
            </h2>

            {program ? (
              <>
                <p className="mt-stack-sm text-body-sm font-semibold uppercase tracking-[0.08em] text-primary">
                  {formatMeetingDate(program.meetingDate)}
                </p>

                {program.presiding || program.conducting || program.chorister || program.organist ? (
                  <dl className="mt-stack-md grid gap-stack-sm border-l-4 border-accent-rust pl-stack-md text-body sm:grid-cols-2">
                    {program.presiding ? (
                      <div>
                        <dt className="text-section-label tracking-[0.14em] text-on-surface-muted">Presiding</dt>
                        <dd className="font-semibold">{program.presiding}</dd>
                      </div>
                    ) : null}
                    {program.conducting ? (
                      <div>
                        <dt className="text-section-label tracking-[0.14em] text-on-surface-muted">Conducting</dt>
                        <dd className="font-semibold">{program.conducting}</dd>
                      </div>
                    ) : null}
                    {program.chorister ? (
                      <div>
                        <dt className="text-section-label tracking-[0.14em] text-on-surface-muted">Chorister</dt>
                        <dd className="font-semibold">{program.chorister}</dd>
                      </div>
                    ) : null}
                    {program.organist ? (
                      <div>
                        <dt className="text-section-label tracking-[0.14em] text-on-surface-muted">Organist</dt>
                        <dd className="font-semibold">{program.organist}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}

                {program.program && program.program.length > 0 ? (
                  <ol className="mt-stack-lg space-y-stack-md border-t border-border">
                    {program.program.map((item) => {
                      switch (item._type) {
                        case "programHymn":
                          return (
                            <li key={item._key} className="grid gap-1 border-b border-border pb-stack-md">
                              <span className="text-section-label tracking-[0.14em] text-on-surface-muted">
                                {item.label || "Hymn"}
                              </span>
                              <span className="text-body-lg">
                                <strong>{item.number ? `#${item.number} — ` : null}{item.title}</strong>
                              </span>
                            </li>
                          );
                        case "programPrayer":
                          return (
                            <li key={item._key} className="grid gap-1 border-b border-border pb-stack-md">
                              <span className="text-section-label tracking-[0.14em] text-on-surface-muted">
                                {item.type}
                              </span>
                              <span className="text-body-lg">
                                <strong>{item.person}</strong>
                              </span>
                            </li>
                          );
                        case "programSpeaker":
                          return (
                            <li key={item._key} className="grid gap-1 border-b border-border pb-stack-md">
                              <span className="text-section-label tracking-[0.14em] text-on-surface-muted">Speaker</span>
                              <span className="text-body-lg">
                                <strong>{item.name}</strong>
                                {item.topic ? (
                                  <span className="text-on-surface-muted"> — {item.topic}</span>
                                ) : null}
                              </span>
                            </li>
                          );
                        case "programMusicalNumber":
                          return (
                            <li key={item._key} className="grid gap-1 border-b border-border pb-stack-md">
                              <span className="text-section-label tracking-[0.14em] text-on-surface-muted">
                                Musical Number
                              </span>
                              <span className="text-body-lg">
                                <strong>{item.title}</strong>
                                {item.performer ? (
                                  <span className="text-on-surface-muted"> — {item.performer}</span>
                                ) : null}
                              </span>
                            </li>
                          );
                        default:
                          return null;
                      }
                    })}
                  </ol>
                ) : null}
              </>
            ) : (
              <p className="mt-stack-md text-body-lg text-on-surface-muted">
                This week&apos;s program will be posted here soon.
              </p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="building-heading" className="bg-surface text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-on-surface-muted">BUILDING GUIDE</p>
            <h2 id="building-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
              Find Your Way Around the Chapel
            </h2>
            <p className="mt-stack-md text-body-lg text-on-surface-muted">
              The chapel is easy to navigate once you arrive. A floor plan will be added here when the static image is
              available.
            </p>
          </div>
          <div className="mt-stack-lg grid gap-stack-lg lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] lg:items-start">
            {floorPlanSrc ? (
              <Image
                src={floorPlanSrc}
                alt={floorPlanAlt}
                width={1100}
                height={700}
                className="h-auto w-full border-2 border-border bg-surface"
                priority={false}
              />
            ) : (
              <div className="flex min-h-[260px] items-center justify-center border-2 border-dashed border-border bg-surface px-stack-md py-stack-lg text-center text-body text-on-surface-muted">
                Floor plan image coming soon
              </div>
            )}
            <div className="border-2 border-border bg-surface p-stack-md">
              <h3 className="text-section-label tracking-[0.14em] text-on-surface-muted">Classroom Assignments</h3>
              <ul className="mt-stack-sm space-y-stack-sm text-body text-on-surface-muted">
                <li>
                  <strong className="text-on-surface">Sacrament meeting:</strong> Chapel
                </li>
                <li>
                  <strong className="text-on-surface">Sunday School:</strong> Ask a greeter for the current room
                </li>
                <li>
                  <strong className="text-on-surface">Relief Society:</strong> Assigned classroom after sacrament meeting
                </li>
                <li>
                  <strong className="text-on-surface">Elders quorum:</strong> Assigned classroom after sacrament meeting
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="first-time-heading" className="bg-surface-warm text-on-surface">
        <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
          <div className="max-w-3xl">
            <p className="text-section-label tracking-[0.14em] text-on-surface-muted">FIRST TIME?</p>
            <h2 id="first-time-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
              What to Expect When You Arrive
            </h2>
            <div className="mt-stack-md space-y-stack-md text-body-lg text-on-surface-muted">
              <p>
                Parking is available around the chapel at 196 N Pinehurst Ave. Come in through the main entrance and
                look for a greeter or another YSA member if you want help finding the chapel or classrooms.
              </p>
              <p>
                A YSA sacrament meeting includes hymns, prayers, the sacrament, and short talks from ward members.
                Dress ranges from Sunday best to simple and comfortable. You can sit anywhere, participate as much as
                you feel comfortable, and stay afterward for second-hour classes and introductions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
