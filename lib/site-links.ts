export const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Sunday Church", href: "/sunday-church" },
  { label: "Weekly Activities", href: "/weekly-activities" },
  { label: "Calendar", href: "/calendar" },
  { label: "Contacts", href: "/contacts" },
  { label: "Links", href: "/links" },
] as const;

export function isActiveSiteLink(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
