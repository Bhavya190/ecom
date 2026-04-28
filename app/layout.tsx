import type { Metadata } from "next";

import { Providers } from "@/components/store/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northstar Goods",
  description: "A modern small business e-commerce storefront."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
