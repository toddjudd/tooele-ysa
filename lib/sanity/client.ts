import { createClient } from "next-sanity";
import { sanityConfig } from "./env";

export const client = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: "2026-07-01",
  useCdn: true,
  perspective: "published",
});
