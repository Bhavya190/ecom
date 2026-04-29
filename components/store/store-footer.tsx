/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

import { BRAND_NAME } from "@/lib/brand";

export function StoreFooter() {
  return (
    <footer id="contact" className="bg-blush/70 text-charcoal">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/art-by-dhruvangi-logo.svg"
              alt={`${BRAND_NAME} logo`}
              className="h-14 w-14 rounded-full"
            />
            <div>
              <p className="font-display text-2xl font-semibold">{BRAND_NAME}</p>
              <p className="mt-1 text-sm">Resin art, portraits, festive gifts & handmade keepsakes.</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              href="#"
              className="grid h-10 w-10 place-items-center rounded-full bg-cream/70 transition hover:bg-cream"
              aria-label="Instagram"
            >
              <Instagram size={19} />
            </Link>
            <Link
              href="#"
              className="grid h-10 w-10 place-items-center rounded-full bg-cream/70 transition hover:bg-cream"
              aria-label="WhatsApp"
            >
              <MessageCircle size={19} />
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold md:justify-end">
          <Link href="/products" className="hover:text-[#a85066]">
            Products
          </Link>
          <Link href="/#collections" className="hover:text-[#a85066]">
            Collections
          </Link>
          <Link href="/about" className="hover:text-[#a85066]">
            About
          </Link>
          <Link href="/contact" className="hover:text-[#a85066]">
            Contact
          </Link>
          <Link href="/my-orders" className="hover:text-[#a85066]">
            My Orders
          </Link>
        </div>
      </div>
      <div className="border-t border-charcoal/10 py-4 text-center text-sm">
        &copy; 2025 {BRAND_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
