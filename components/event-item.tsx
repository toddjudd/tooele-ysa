import { formatEventDateTime } from "@/lib/format-event-date";

type EventItemProps = {
  title: string;
  dateTime: string;
  description?: string | null;
  location?: string | null;
};

export function EventItem({ title, dateTime, description, location }: EventItemProps) {
  return (
    <article className="border-l-[3px] border-accent-rust pl-stack-md">
      <time dateTime={dateTime} className="block text-section-label tracking-[0.14em] text-accent-rust">
        {formatEventDateTime(dateTime)}
      </time>
      <h3 className="mt-stack-sm text-body-lg text-on-surface">{title}</h3>
      {description ? <p className="mt-stack-sm text-body text-on-surface-muted">{description}</p> : null}
      {location ? <p className="mt-stack-sm text-body-sm text-on-surface-muted">{location}</p> : null}
    </article>
  );
}
