"use client";

import type React from "react";

type AppLinkCardProps = {
  name: string;
  href: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
};

export function AppLinkCard({ name, href, icon, comingSoon = false }: AppLinkCardProps) {
  return (
    <a
      href={comingSoon ? "#" : href}
      aria-label={`Open ${name}`}
      target={comingSoon ? undefined : "_blank"}
      rel={comingSoon ? undefined : "noopener noreferrer"}
      onClick={comingSoon ? (event) => event.preventDefault() : undefined}
      className={`group relative flex min-h-11 flex-col justify-between bg-primary px-6 py-5 text-on-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface-warm ${
        comingSoon ? "pointer-events-none opacity-60" : "hover:bg-[#0d4549]"
      }`}
    >
      <span className="flex items-start justify-between gap-4">
        <span className="text-section-label tracking-[0.14em] text-on-primary">{name}</span>
        {comingSoon ? (
          <span className="rounded-full bg-accent-sand px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-on-accent-sand">
            Coming Soon
          </span>
        ) : null}
      </span>
      <span className="mt-stack-md flex text-accent-teal" aria-hidden="true">
        {icon}
      </span>
      {!comingSoon ? <span className="sr-only">(opens in new tab)</span> : null}
    </a>
  );
}
