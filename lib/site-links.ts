export const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Gatherings", href: "/gatherings" },
  { label: "About Us", href: "/about" },
  { label: "Let's Connect", href: "/connect" },
] as const;

export function isActiveSiteLink(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
