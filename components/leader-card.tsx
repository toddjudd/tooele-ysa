type LeaderCardProps = {
  name: string;
  title: string;
  phone?: string | null;
  email?: string | null;
};

export function LeaderCard({ name, title, phone, email }: LeaderCardProps) {
  const phoneHref = phone ? phone.replace(/[^+\d]/g, "") : null;

  return (
    <article className="bg-surface border border-border p-stack-md">
      <h3 className="text-section-label tracking-[0.14em] text-primary">{name}</h3>
      <p className="mt-stack-sm text-body-sm text-on-surface-muted">{title}</p>
      {(phone || email) && (
        <div className="mt-stack-sm text-body-sm">
          {phone && (
            <a
              href={`tel:${phoneHref}`}
              aria-label={`Call ${name}: ${phone}`}
              className="flex min-h-11 items-center text-accent-rust transition-colors hover:text-accent-teal focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {phone}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label={`Email ${name}`}
              className="flex min-h-11 items-center text-accent-rust transition-colors hover:text-accent-teal focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {email}
            </a>
          )}
        </div>
      )}
    </article>
  );
}
