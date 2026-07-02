import { defineCliConfig } from "sanity/cli";
import { sanityConfig } from "./lib/sanity/env";

export default defineCliConfig({
  api: {
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
  },
  typegen: {
    enabled: true,
    path: "./**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "./lib/types.ts",
    overloadClientMethods: false,
  },
});
