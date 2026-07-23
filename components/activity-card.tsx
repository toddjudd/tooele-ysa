import { SanityImage } from "@/components/sanity-image";
import type { SanityImageSource } from "@sanity/image-url";

type ActivityCardImage = {
  asset?: {
    _id?: string;
    url?: string | null;
    metadata?: {
      lqip?: string | null;
      dimensions?: { width?: number | null; height?: number | null } | null;
    } | null;
  } | null;
} | null;

type ActivityCardProps = {
  title: string;
  body: string;
  linkUrl?: string | null;
  linkText?: string | null;
  image?: ActivityCardImage;
};

export function ActivityCard({ title, body, linkUrl, linkText, image }: ActivityCardProps) {
  const hasImage = Boolean(image?.asset);
  const dimensions = image?.asset?.metadata?.dimensions;
  const linkLabel = linkText || linkUrl;

  return (
    <article className="flex flex-col bg-surface border border-border">
      {hasImage ? (
        <SanityImage
          image={image as SanityImageSource}
          alt=""
          width={dimensions?.width ?? 640}
          height={dimensions?.height ?? 400}
          sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
          className="block h-auto w-full object-cover"
        />
      ) : null}
      <div className="p-stack-md">
        <h4 className="text-section-label tracking-[0.14em] text-primary">{title}</h4>
        <p className="mt-stack-sm text-body-sm text-on-surface-muted whitespace-pre-line">{body}</p>
        {linkUrl && (
          <a
            href={linkUrl}
            className="mt-stack-sm flex min-h-11 items-center text-accent-rust transition-colors hover:text-accent-teal focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {linkLabel}
          </a>
        )}
      </div>
    </article>
  );
}
