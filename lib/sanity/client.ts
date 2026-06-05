import { createClient } from "next-sanity";

export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const sanityClient = createClient({
  apiVersion: sanityApiVersion,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id",
  useCdn: true,
});
