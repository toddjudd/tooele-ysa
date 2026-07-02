import { defineField, defineType } from "sanity";

export const wardEvent = defineType({
  name: "wardEvent",
  title: "Ward Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dateTime",
      title: "Date and Time",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
  ],
});
