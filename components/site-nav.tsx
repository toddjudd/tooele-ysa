"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { isActiveSiteLink, siteLinks } from "@/lib/site-links";

const navLinkClassName =
  "flex min-h-11 items-center px-3 text-section-label tracking-[0.14em] text-white transition-colors focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

const navLinks = siteLinks.filter((link) => link.href !== "/");

export function SiteNav() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const shouldRestoreFocusRef = useRef(false);

  function closeDrawer({ restoreFocus }: { restoreFocus: boolean }) {
    shouldRestoreFocusRef.current = restoreFocus;
    setIsDrawerOpen(false);
  }

  useEffect(() => {
    if (!isDrawerOpen && shouldRestoreFocusRef.current) {
      shouldRestoreFocusRef.current = false;
      menuButtonRef.current?.focus();
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    firstElement?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer({ restoreFocus: true });
        return;
      }

      if (event.key !== "Tab" || !firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen]);

  return (
    <header className="sticky top-0 z-50 bg-primary text-white">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-container-max items-center justify-between px-container-px md:h-[72px] lg:px-container-px-lg">
        <Link
          href="/"
          className="flex min-h-11 items-center text-section-label tracking-[0.14em] text-white focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          onClick={() => closeDrawer({ restoreFocus: false })}
        >
          <span className="flex h-11 items-center border border-white/25 px-3 text-[11px] font-black leading-none tracking-[0.16em]">
            Tooele YSA
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActiveSiteLink(pathname, link.href) ? "page" : undefined}
              className={`${navLinkClassName} ${
                isActiveSiteLink(pathname, link.href) ? "text-accent-teal" : "text-white hover:text-accent-teal"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center border border-white/25 text-white focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-primary md:hidden"
          aria-label={isDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsDrawerOpen((current) => !current)}
        >
          {isDrawerOpen ? (
            <span aria-hidden="true" className="text-2xl leading-none">
              X
            </span>
          ) : (
            <span aria-hidden="true" className="grid gap-1">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </span>
          )}
        </button>
      </nav>

      {isDrawerOpen ? (
        <div
          id="mobile-navigation"
          ref={drawerRef}
          className="border-t border-white/10 bg-primary px-container-px pb-5 md:hidden"
        >
          <button
            type="button"
            className="ml-auto mt-4 flex min-h-11 min-w-11 items-center justify-center border border-white/25 text-white focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            aria-label="Close navigation menu"
            onClick={() => closeDrawer({ restoreFocus: true })}
          >
            <span aria-hidden="true" className="text-xl leading-none">
              X
            </span>
          </button>
          <div className="mt-4 grid gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActiveSiteLink(pathname, link.href) ? "page" : undefined}
                className={`${navLinkClassName} border border-white/10 ${
                  isActiveSiteLink(pathname, link.href) ? "text-accent-teal" : "text-white hover:text-accent-teal"
                }`}
                onClick={() => closeDrawer({ restoreFocus: false })}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
