import { SanityImage } from "@/components/sanity-image";
import type { HomeSectionBottomQueryResult, HomeSectionTopQueryResult } from "@/lib/types";

type HomeSectionData = HomeSectionTopQueryResult | HomeSectionBottomQueryResult;

type HomeContentSectionProps = {
  backgroundImage?: NonNullable<HomeSectionData>["backgroundImage"] | null;
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  fallbackEyebrow: string;
  fallbackHeading: string;
  fallbackBody: string;
  ariaLabel: string;
};

export function HomeContentSection({
  backgroundImage,
  eyebrow,
  heading,
  body,
  fallbackEyebrow,
  fallbackHeading,
  fallbackBody,
  ariaLabel,
}: HomeContentSectionProps) {
  const hasContent = Boolean(eyebrow && heading && body);
  const image = backgroundImage?.asset ? backgroundImage : null;
  const dimensions = image?.asset?.metadata?.dimensions;
  const width = dimensions?.width ?? 2400;
  const height = dimensions?.height ?? 1400;
  const contentImage = hasContent ? image : null;
  const hasImage = Boolean(contentImage);
  const sectionEyebrow = hasContent ? eyebrow : fallbackEyebrow;
  const sectionHeading = hasContent ? heading : fallbackHeading;
  const sectionBody = hasContent ? body : fallbackBody;

  return (
    <section
      aria-label={ariaLabel}
      className={`relative isolate overflow-hidden ${hasImage ? "bg-primary text-on-primary" : "bg-surface-warm text-on-surface"}`}
    >
      {contentImage ? (
        <SanityImage
          image={contentImage}
          alt=""
          width={width}
          height={height}
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      ) : null}
      {contentImage ? <div aria-hidden="true" className="absolute inset-0 -z-10 bg-primary/45" /> : null}

      <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
        <div className="max-w-3xl">
          <p className={`text-section-label tracking-[0.14em] ${hasImage ? "text-on-primary" : "text-accent-rust"}`}>
            {sectionEyebrow}
          </p>
          <h2 className={`mt-stack-sm text-headline-mobile md:text-headline ${hasImage ? "text-on-primary" : "text-on-surface"}`}>
            {sectionHeading}
          </h2>
          <p className={`mt-stack-md text-body-lg ${hasImage ? "text-on-primary" : "text-on-surface-muted"}`}>
            {sectionBody}
          </p>
        </div>
      </div>
    </section>
  );
}
