"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { CartProvider } from "@/components/store/cart-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
      </CartProvider>
    </SessionProvider>
  );
}
