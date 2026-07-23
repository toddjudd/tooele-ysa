import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityConfig } from "./lib/sanity/env";
import { structure } from "./sanity/structure";
import { schemaTypes } from "./sanity/schema-types";

export default defineConfig({
  name: "default",
  title: "Tooele YSA CMS",
  basePath: "/studio",
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
