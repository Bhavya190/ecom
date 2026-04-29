import { type ClassValue, clsx } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeSlug(value: string) {
  return slugify(value, { lower: true, strict: true, trim: true });
}

export function formatPrice(value: number | string) {
  const amount = typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
}

export function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `SB-${stamp}-${random}`;
}

export function firstImage(images: string[]) {
  return images[0] ?? "https://picsum.photos/seed/product-placeholder/600/600";
}
