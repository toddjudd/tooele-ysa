"use server";

import { assertWriteToken, writeClient } from "@/lib/sanity/write-client";

export type SubmitEventState = {
  ok: boolean;
  error?: string;
};

function cleanString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function submitEvent(
  _prevState: SubmitEventState | null,
  formData: FormData,
): Promise<SubmitEventState> {
  // Honeypot: automated bots tend to fill hidden fields; humans leave it blank.
  if (cleanString(formData.get("website"))) {
    return { ok: true };
  }

  const title = cleanString(formData.get("title"));
  const dateTime = cleanString(formData.get("dateTime"));

  if (!title || !dateTime) {
    return { ok: false, error: "Event title and date/time are required." };
  }

  const parsedDate = new Date(dateTime);
  if (Number.isNaN(parsedDate.getTime())) {
    return { ok: false, error: "Please provide a valid date and time." };
  }

  const description = cleanString(formData.get("description"));
  const location = cleanString(formData.get("location"));
  const submitterName = cleanString(formData.get("submitterName"));
  const submitterEmail = cleanString(formData.get("submitterEmail"));

  try {
    assertWriteToken();

    await writeClient.create({
      _type: "wardEvent",
      status: "pending",
      title,
      dateTime: parsedDate.toISOString(),
      ...(description ? { description } : {}),
      ...(location ? { location } : {}),
      ...(submitterName ? { submitterName } : {}),
      ...(submitterEmail ? { submitterEmail } : {}),
    });

    return { ok: true };
  } catch (error) {
    console.error("Failed to submit event", error);
    return {
      ok: false,
      error: "Something went wrong submitting your event. Please try again later.",
    };
  }
}
