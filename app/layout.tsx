import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Tooele YSA",
  description: "Tooele YSA ward information and connection hub.",
  appleWebApp: {
    title: "Tooele YSA",
  },
};

export const viewport: Viewport = {
  themeColor: "#af5031",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} ${montserrat.variable}`}>{children}</body>
    </html>
  );
}
