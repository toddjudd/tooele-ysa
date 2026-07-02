import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityConfig } from "./lib/sanity/env";
import { schemaTypes } from "./sanity/schema-types";

export default defineConfig({
  name: "default",
  title: "Tooele YSA CMS",
  basePath: "/studio",
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
