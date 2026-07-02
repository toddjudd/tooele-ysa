import { SanityImage } from "@/components/sanity-image";
import type { HeroImageQueryResult } from "@/lib/types";

type HeroProps = {
  heroImage: HeroImageQueryResult;
};

const directionsUrl = "https://maps.app.goo.gl/s6kaRrALfUj1PGRU7";
const missionariesUrl = "https://www.churchofjesuschrist.org/welcome/meet-with-missionaries?lang=eng";

export function Hero({ heroImage }: HeroProps) {
  const image = heroImage?.image?.asset ? heroImage.image : null;
  const dimensions = image?.asset?.metadata?.dimensions;
  const width = dimensions?.width ?? 2400;
  const height = dimensions?.height ?? 1600;

  return (
    <section
      role="region"
      aria-label="Hero"
      className="relative isolate flex min-h-[85vh] items-center overflow-hidden bg-primary text-on-primary md:min-h-screen"
    >
      {image ? (
        <SanityImage
          image={image}
          alt={heroImage?.title ?? "Tooele YSA Ward"}
          width={width}
          height={height}
          sizes="100vw"
          priority
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      ) : null}
      {image ? <div aria-hidden="true" className="absolute inset-0 -z-10 bg-primary/45" /> : null}

      <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
        <div className="max-w-4xl">
          <p className="text-section-label tracking-[0.14em] text-on-primary">TOOELE YSA WARD</p>
          <h1 className="mt-stack-sm text-display-mobile tracking-[0.02em] text-on-primary md:text-display">
            Together in Christ
          </h1>
          <div className="mt-stack-lg flex flex-col gap-4 sm:flex-row">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get Directions to the Chapel"
              className="flex min-h-11 items-center justify-center bg-accent-rust px-8 py-3.5 text-center text-cta tracking-[0.1em] text-on-accent-rust transition-colors hover:bg-[#8f3f23] focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Get Directions
            </a>
            <a
              href={missionariesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center border-2 border-on-primary bg-transparent px-[30px] py-3 text-center text-cta tracking-[0.1em] text-on-primary transition-colors hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Meet With Missionaries
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
