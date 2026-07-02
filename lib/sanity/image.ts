import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

function createUrlBuilder() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    throw new Error("Sanity image URLs require NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET");
  }

  return createImageUrlBuilder({ projectId, dataset });
}

export const urlFor = (source: SanityImageSource) => createUrlBuilder().image(source);
