import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);
type SanityImageSource = Parameters<typeof builder.image>[0];

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function sanityImageUrl(source: unknown, width = 1200) {
  if (!source) return "";

  try {
    return urlFor(source as SanityImageSource).width(width).auto("format").fit("max").url();
  } catch {
    return "";
  }
}
