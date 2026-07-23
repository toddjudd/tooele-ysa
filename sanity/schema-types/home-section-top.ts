import { defineField, defineType } from "sanity";

export const homeSectionTop = defineType({
  name: "homeSectionTop",
  title: "Home Section Top",
  type: "document",
  fields: [
    defineField({
      name: "desktopImage",
      title: "Desktop Background Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mobileImage",
      title: "Mobile Background Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow Text",
      type: "string",
      description: "Leave the eyebrow, heading, and body all empty to display the background images on their own.",
    }),
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body Text",
      type: "text",
    }),
  ],
});
