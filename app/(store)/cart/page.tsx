"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/components/store/cart-provider";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (!items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Your cart is empty"
          message="Add a few products and they will appear here."
          href="/products"
          action="Shop products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 sm:grid-cols-[96px_1fr_auto]"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </div>
              <div>
                <Link
                  href={`/products/${item.slug}`}
                  className="font-medium text-neutral-950 hover:text-brand-700 dark:text-neutral-50"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {formatPrice(item.price)}
                </p>
                <div className="mt-4 inline-flex h-10 items-center rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    aria-label="Decrease quantity"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    aria-label="Increase quantity"
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-start justify-between gap-3 sm:flex-col sm:items-end">
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.productId)}
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="border-t border-neutral-200 pt-3 text-base dark:border-neutral-800">
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
