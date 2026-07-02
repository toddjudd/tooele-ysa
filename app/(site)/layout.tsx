import { Footer } from "@/components/footer";
import { SiteNav } from "@/components/site-nav";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-accent-teal focus:px-4 focus:py-3 focus:text-section-label focus:text-on-accent-teal focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <SiteNav />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
