import { defineField, defineType } from "sanity";

export const wardEvent = defineType({
  name: "wardEvent",
  title: "Ward Event",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Approval Status",
      type: "string",
      options: {
        list: [
          { title: "Pending Review", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (rule) => rule.required(),
    }),
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
    defineField({
      name: "submitterName",
      title: "Submitted By",
      type: "string",
      description: "Name provided by the person who submitted this event (public submissions only).",
      readOnly: true,
    }),
    defineField({
      name: "submitterEmail",
      title: "Submitter Email",
      type: "string",
      description: "Contact email provided by the submitter (not shown publicly).",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Date (soonest first)",
      name: "dateTimeAsc",
      by: [{ field: "dateTime", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", status: "status", dateTime: "dateTime" },
    prepare({ title, status, dateTime }) {
      const badge = status === "approved" ? "✅" : status === "rejected" ? "❌" : "🕒";
      const when = dateTime ? new Date(dateTime).toLocaleString() : "No date set";
      return { title: `${badge} ${title ?? "Untitled event"}`, subtitle: when };
    },
  },
});
