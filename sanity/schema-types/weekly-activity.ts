import { defineArrayMember, defineField, defineType } from "sanity";

export const weeklyActivity = defineType({
  name: "weeklyActivity",
  title: "Weekly Activity",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "Optional smaller line of text shown above the title.",
    }),
    defineField({
      name: "schedule",
      title: "Schedule",
      type: "string",
      description:
        'When the activity recurs — a day of the week, time, or cadence. For example "Every Tuesday at 7:00 PM" or "Every other Wednesday".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Description",
      type: "text",
      description: "Main description body for the activity.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "Optional image displayed alongside the activity.",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Activities are sorted low to high by this number.",
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      description: "Optional sub-cards displayed beneath the activity.",
      of: [
        defineArrayMember({
          name: "activityCard",
          title: "Card",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "linkUrl",
              title: "Link URL",
              type: "url",
              description: "Optional hyperlink for this card.",
              validation: (rule) =>
                rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
            }),
            defineField({
              name: "linkText",
              title: "Link Display Text",
              type: "string",
              description: "Text shown for the hyperlink. Defaults to the URL if left blank.",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              description: "Optional image for this card.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "body", media: "image" },
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "schedule", media: "image" },
  },
});
