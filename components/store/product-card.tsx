"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/cart-provider";
import { firstImage, formatPrice } from "@/lib/utils";

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  images: string[];
  videoUrl?: string | null;
  categoryId: string;
  category?: { id: string; name: string; slug: string; image: string } | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
};

export function ProductCard({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();
  const disabled = product.stock <= 0;

  return (
    <article className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-neutral-800 dark:bg-neutral-950">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <Image
            src={firstImage(product.images)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          {disabled ? (
            <div className="absolute left-3 top-3">
              <Badge tone="red">Out of Stock</Badge>
            </div>
          ) : product.isFeatured ? (
            <div className="absolute left-3 top-3">
              <Badge tone="green">Featured</Badge>
            </div>
          ) : null}
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 min-h-10 font-medium text-neutral-950 transition hover:text-brand-700 dark:text-neutral-50"
          >
            {product.name}
          </Link>
          {product.category ? (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {product.category.name}
            </p>
          ) : null}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-neutral-950 dark:text-neutral-50">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice ? (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          ) : null}
        </div>
        <Button
          className="w-full"
          disabled={disabled}
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              image: firstImage(product.images),
              price: product.price,
              comparePrice: product.comparePrice,
              stock: product.stock
            })
          }
        >
          <ShoppingCart size={18} />
          Add to Cart
        </Button>
      </div>
    </article>
  );
}
