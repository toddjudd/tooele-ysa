"use client";

import Image, { type ImageProps } from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/lib/sanity/image";

type SanityImageProps = Omit<ImageProps, "src" | "loader" | "width" | "height"> & {
  image: SanityImageSource;
  width: number;
  height: number;
};

export function SanityImage({ image, width, height, alt, sizes, ...props }: SanityImageProps) {
  const aspectRatio = height / width;
  const src = urlFor(image).width(width).height(height).fit("crop").format("webp").quality(80).url();

  return (
    <Image
      {...props}
      alt={alt}
      height={height}
      loader={({ width: requestedWidth, quality }) =>
        urlFor(image)
          .width(requestedWidth)
          .height(Math.round(requestedWidth * aspectRatio))
          .fit("crop")
          .format("webp")
          .quality(quality ?? 80)
          .url()
      }
      sizes={sizes}
      src={src}
      width={width}
    />
  );
}
