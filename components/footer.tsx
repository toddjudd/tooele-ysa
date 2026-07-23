import Link from "next/link";

import { siteLinks } from "@/lib/site-links";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-primary text-white">
      <div className="mx-auto flex max-w-container-max flex-col gap-8 px-container-px py-10 lg:px-container-px-lg">
        <p className="text-headline-mobile text-accent-teal">Together in Christ</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center text-section-label tracking-[0.14em] text-white/65 transition-colors hover:text-accent-teal focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-body-sm text-white/65">© {currentYear} Tooele YSA Ward</p>
        <p className="max-w-prose text-body-sm text-white/45">
          This website is not an official website of The Church of Jesus Christ
          of Latter-day Saints, nor is it sponsored by the Church. It follows the
          guidelines in the Church handbook, section 38.8.21.
        </p>
      </div>
    </footer>
  );
}
