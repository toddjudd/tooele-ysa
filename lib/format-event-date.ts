const dateOnlyFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: "America/Denver",
});

// Separate formatter for date-only values (no time component)
// Uses UTC to prevent timezone shifts when parsing YYYY-MM-DD strings
const dateOnlyFormatterUTC = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const eventTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Denver",
});

export function formatEventDateTime(dateTime: string) {
  const hasTime = /T\d{2}:\d{2}/.test(dateTime);
  const date = new Date(dateTime);
  
  if (!hasTime) {
    // For date-only values, parse components to avoid timezone shifts
    const formattedDate = formatDateOnly(dateTime);
    return formattedDate;
  }

  const formattedDate = dateOnlyFormatter.format(date);
  return `${formattedDate} at ${eventTimeFormatter.format(date)}`;
}

function formatDateOnly(dateTime: string) {
  const [, year, month, day] = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateTime) ?? [];

  if (!year || !month || !day) {
    return dateOnlyFormatterUTC.format(new Date(dateTime));
  }

  // Use UTC to prevent timezone shifts for date-only values
  return dateOnlyFormatterUTC.format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))));
}
