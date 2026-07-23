import type { StructureResolver } from "sanity/structure";

/**
 * Custom Studio structure.
 *
 * Adds a dedicated "Pending Events" queue so submitted events awaiting review
 * are easy to find and approve, alongside the full Ward Events list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Events")
        .child(
          S.list()
            .title("Events")
            .items([
              S.listItem()
                .title("Pending Review")
                .child(
                  S.documentList()
                    .title("Pending Review")
                    .filter('_type == "wardEvent" && status == "pending"')
                    .defaultOrdering([{ field: "dateTime", direction: "asc" }]),
                ),
              S.listItem()
                .title("Approved")
                .child(
                  S.documentList()
                    .title("Approved Events")
                    .filter('_type == "wardEvent" && status == "approved"')
                    .defaultOrdering([{ field: "dateTime", direction: "asc" }]),
                ),
              S.listItem()
                .title("All Ward Events")
                .child(
                  S.documentTypeList("wardEvent")
                    .title("All Ward Events")
                    .defaultOrdering([{ field: "dateTime", direction: "asc" }]),
                ),
            ]),
        ),
      S.divider(),
      // All other document types, excluding the one we render explicitly above.
      ...S.documentTypeListItems().filter(
        (listItem) => listItem.getId() !== "wardEvent",
      ),
    ]);
