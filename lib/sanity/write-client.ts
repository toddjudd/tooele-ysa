import { createClient } from "next-sanity";

import { sanityConfig } from "./env";

const token = process.env.SANITY_API_WRITE_TOKEN;

/**
 * Server-only Sanity client with write access.
 *
 * Requires a token with Editor/Write permissions, set via the
 * SANITY_API_WRITE_TOKEN environment variable. Never expose this client or its
 * token to the browser (do not prefix the env var with NEXT_PUBLIC_).
 */
export const writeClient = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: "2026-07-01",
  useCdn: false,
  token,
});

export function assertWriteToken() {
  if (!token) {
    throw new Error("SANITY_API_WRITE_TOKEN is required to write to Sanity.");
  }
}
