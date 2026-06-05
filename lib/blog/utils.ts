import type { BlogAuthor, BlogCategory, BlogMedia } from "./types";

export const validSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string) {
  return validSlugPattern.test(slug);
}

export function asMedia(value: unknown): BlogMedia | undefined {
  return value && typeof value === "object" ? (value as BlogMedia) : undefined;
}

export function asAuthor(value: unknown): BlogAuthor | undefined {
  return value && typeof value === "object" ? (value as BlogAuthor) : undefined;
}

export function asCategory(value: unknown): BlogCategory | undefined {
  return value && typeof value === "object" ? (value as BlogCategory) : undefined;
}

export function formatDate(value?: string) {
  if (!value) return "Unscheduled";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function mediaUrl(value: unknown) {
  const media = asMedia(value);
  return media?.publicUrl || media?.url || "";
}

export function mediaAlt(value: unknown, fallback = "") {
  const media = asMedia(value);
  return media?.altText || media?.alt || fallback;
}
