import { defineArrayMember, defineField, defineType } from "sanity";

export const sacramentProgram = defineType({
  name: "sacramentProgram",
  title: "Sacrament Program",
  type: "document",
  description:
    "The weekly sacrament meeting program. The page shows the program with the most recent meeting date. Add, remove, and reorder the items in the Program list to match each week.",
  fields: [
    defineField({
      name: "meetingDate",
      title: "Meeting Date",
      type: "date",
      description: "The Sunday this program is for. The most recent dated program is shown on the site.",
      options: { dateFormat: "dddd, MMMM D, YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "presiding",
      title: "Presiding",
      type: "string",
      description: "Optional. Person presiding over the meeting.",
    }),
    defineField({
      name: "conducting",
      title: "Conducting",
      type: "string",
      description: "Optional. Person conducting the meeting.",
    }),
    defineField({
      name: "chorister",
      title: "Chorister",
      type: "string",
      description: "Optional. Person leading the music.",
    }),
    defineField({
      name: "organist",
      title: "Organist / Pianist",
      type: "string",
      description: "Optional. Person accompanying the music.",
    }),
    defineField({
      name: "program",
      title: "Program",
      type: "array",
      description:
        "The order of the meeting. Add hymns, prayers, speakers, and musical numbers in any order, and drag to reorder them.",
      of: [
        defineArrayMember({
          name: "programHymn",
          title: "Hymn",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'What kind of hymn this is, e.g. "Opening Hymn", "Sacrament Hymn", "Closing Hymn".',
            }),
            defineField({
              name: "number",
              title: "Hymn Number",
              type: "string",
              description: 'Hymn number, e.g. "152".',
            }),
            defineField({
              name: "title",
              title: "Hymn Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { label: "label", number: "number", title: "title" },
            prepare({ label, number, title }) {
              return {
                title: number ? `${number} — ${title}` : title,
                subtitle: label || "Hymn",
              };
            },
          },
        }),
        defineArrayMember({
          name: "programPrayer",
          title: "Prayer",
          type: "object",
          fields: [
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Opening Prayer", value: "Opening Prayer" },
                  { title: "Closing Prayer", value: "Closing Prayer" },
                ],
                layout: "radio",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "person",
              title: "Offered By",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { type: "type", person: "person" },
            prepare({ type, person }) {
              return {
                title: person,
                subtitle: type || "Prayer",
              };
            },
          },
        }),
        defineArrayMember({
          name: "programSpeaker",
          title: "Speaker",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Speaker Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "topic",
              title: "Topic",
              type: "string",
              description: "Optional talk topic or theme.",
            }),
          ],
          preview: {
            select: { name: "name", topic: "topic" },
            prepare({ name, topic }) {
              return {
                title: name,
                subtitle: topic ? `Speaker — ${topic}` : "Speaker",
              };
            },
          },
        }),
        defineArrayMember({
          name: "programMusicalNumber",
          title: "Musical Number",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "performer",
              title: "Performed By",
              type: "string",
              description: "Optional performer name(s).",
            }),
          ],
          preview: {
            select: { title: "title", performer: "performer" },
            prepare({ title, performer }) {
              return {
                title,
                subtitle: performer ? `Musical Number — ${performer}` : "Musical Number",
              };
            },
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Meeting Date, Newest First",
      name: "meetingDateDesc",
      by: [{ field: "meetingDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { date: "meetingDate" },
    prepare({ date }) {
      return {
        title: "Sacrament Program",
        subtitle: date,
      };
    },
  },
});
