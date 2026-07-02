const dateOnlyFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const eventTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatEventDateTime(dateTime: string) {
  const hasTime = /T\d{2}:\d{2}/.test(dateTime);
  const authoredDateTime = normalizeAuthoredDateTime(dateTime);
  const date = new Date(authoredDateTime);
  const formattedDate = hasTime ? formatAuthoredDate(dateTime) : dateOnlyFormatter.format(date);

  if (!hasTime) {
    return formattedDate;
  }

  return `${formattedDate} at ${eventTimeFormatter.format(date)}`;
}

function formatAuthoredDate(dateTime: string) {
  const [, year, month, day] = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateTime) ?? [];

  if (!year || !month || !day) {
    return dateOnlyFormatter.format(new Date(dateTime));
  }

  return dateOnlyFormatter.format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))));
}

function normalizeAuthoredDateTime(dateTime: string) {
  return dateTime.replace(/([T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)(?:Z|[+-]\d{2}:?\d{2})?$/, "$1Z");
}
