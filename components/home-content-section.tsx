import { SanityImage } from "@/components/sanity-image";
import type { HomeSectionBottomQueryResult, HomeSectionTopQueryResult } from "@/lib/types";

type HomeSectionData = HomeSectionTopQueryResult | HomeSectionBottomQueryResult;
type SectionImage = NonNullable<HomeSectionData>["desktopImage"] | null | undefined;

type HomeContentSectionProps = {
  desktopImage?: SectionImage;
  mobileImage?: SectionImage;
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  fallbackEyebrow: string;
  fallbackHeading: string;
  fallbackBody: string;
  ariaLabel: string;
};

function resolveImage(image: SectionImage): NonNullable<SectionImage> | null {
  return image?.asset ? image : null;
}

function imageDimensions(
  image: NonNullable<SectionImage> | null,
  fallbackWidth: number,
  fallbackHeight: number,
) {
  const dimensions = image?.asset?.metadata?.dimensions;
  return {
    width: dimensions?.width ?? fallbackWidth,
    height: dimensions?.height ?? fallbackHeight,
  };
}

export function HomeContentSection({
  desktopImage,
  mobileImage,
  eyebrow,
  heading,
  body,
  fallbackEyebrow,
  fallbackHeading,
  fallbackBody,
  ariaLabel,
}: HomeContentSectionProps) {
  const desktop = resolveImage(desktopImage);
  const mobile = resolveImage(mobileImage);
  const hasImages = Boolean(desktop || mobile);

  // Gracefully cover the other breakpoint if only one image is provided.
  const desktopResolved = desktop ?? mobile;
  const mobileResolved = mobile ?? desktop;

  const hasText = Boolean(eyebrow || heading || body);

  // When all text is empty and images exist, show the images as full content.
  const imageOnly = !hasText && hasImages;

  if (imageOnly) {
    const desktopSize = imageDimensions(desktopResolved, 2400, 1400);
    const mobileSize = imageDimensions(mobileResolved, 1200, 1500);

    return (
      <section aria-label={ariaLabel} className="relative isolate overflow-hidden bg-primary">
        {mobileResolved ? (
          <SanityImage
            image={mobileResolved}
            alt=""
            width={mobileSize.width}
            height={mobileSize.height}
            sizes="100vw"
            className="block h-auto w-full md:hidden"
          />
        ) : null}
        {desktopResolved ? (
          <SanityImage
            image={desktopResolved}
            alt=""
            width={desktopSize.width}
            height={desktopSize.height}
            sizes="100vw"
            className="hidden h-auto w-full md:block"
          />
        ) : null}
      </section>
    );
  }

  // Text mode: images (if any) become the responsive background behind the copy.
  const showBackground = hasText && hasImages;
  const desktopSize = imageDimensions(desktopResolved, 2400, 1400);
  const mobileSize = imageDimensions(mobileResolved, 1200, 1500);
  const sectionEyebrow = eyebrow || fallbackEyebrow;
  const sectionHeading = heading || fallbackHeading;
  const sectionBody = body || fallbackBody;

  return (
    <section
      aria-label={ariaLabel}
      className={`relative isolate overflow-hidden ${showBackground ? "bg-primary text-on-primary" : "bg-surface-warm text-on-surface"}`}
    >
      {showBackground && mobileResolved ? (
        <SanityImage
          image={mobileResolved}
          alt=""
          width={mobileSize.width}
          height={mobileSize.height}
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover md:hidden"
        />
      ) : null}
      {showBackground && desktopResolved ? (
        <SanityImage
          image={desktopResolved}
          alt=""
          width={desktopSize.width}
          height={desktopSize.height}
          sizes="100vw"
          className="absolute inset-0 -z-20 hidden h-full w-full object-cover md:block"
        />
      ) : null}
      {showBackground ? <div aria-hidden="true" className="absolute inset-0 -z-10 bg-primary/45" /> : null}

      <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
        <div className="max-w-3xl">
          <p className={`text-section-label tracking-[0.14em] ${showBackground ? "text-on-primary" : "text-accent-rust"}`}>
            {sectionEyebrow}
          </p>
          <h2 className={`mt-stack-sm text-headline-mobile md:text-headline ${showBackground ? "text-on-primary" : "text-on-surface"}`}>
            {sectionHeading}
          </h2>
          <p className={`mt-stack-md text-body-lg ${showBackground ? "text-on-primary" : "text-on-surface-muted"}`}>
            {sectionBody}
          </p>
        </div>
      </div>
    </section>
  );
}
