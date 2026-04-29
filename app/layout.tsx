import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";

import { Providers } from "@/components/store/providers";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/brand";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: BRAND_NAME,
    template: `%s | ${BRAND_NAME}`
  },
  description: BRAND_DESCRIPTION,
  icons: {
    icon: "/art-by-dhruvangi-logo.svg",
    shortcut: "/art-by-dhruvangi-logo.svg",
    apple: "/art-by-dhruvangi-logo.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${dmSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
