"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/store/cart-provider";
import { categoryAccent } from "@/lib/brand";
import { cn, firstImage, formatPrice } from "@/lib/utils";

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

type ProductCardProps = {
  product: StoreProduct;
  className?: string;
  large?: boolean;
  imagePriority?: boolean;
};

export function ProductCard({
  product,
  className,
  large = false,
  imagePriority = false
}: ProductCardProps) {
  const { addItem } = useCart();
  const reducedMotion = useReducedMotion();
  const [bounced, setBounced] = useState(false);
  const disabled = product.stock <= 0;
  const accent = categoryAccent(product.category?.slug);

  async function handleAddToCart() {
    setBounced(true);
    window.setTimeout(() => setBounced(false), 450);
    await addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: firstImage(product.images),
      price: product.price,
      comparePrice: product.comparePrice,
      stock: product.stock
    });
  }

  return (
    <motion.article
      layout
      whileHover={reducedMotion ? undefined : { scale: 1.02, y: -4 }}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn(
        "group relative overflow-hidden rounded-[20px] bg-white shadow-soft",
        large ? "min-h-[440px]" : "min-h-[340px]",
        className
      )}
      style={{ boxShadow: `0 24px 60px ${accent}38` }}
    >
      <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {product.name}</span>
      </Link>
      <Image
        src={firstImage(product.images)}
        alt={product.name}
        fill
        sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 90vw, 33vw"}
        priority={imagePriority}
        className="object-cover transition duration-500 group-hover:scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/12 to-transparent opacity-85 transition group-hover:opacity-95" />
      {disabled ? (
        <div className="absolute left-4 top-4 z-20">
          <Badge tone="red">Out of Stock</Badge>
        </div>
      ) : product.isFeatured ? (
        <div className="absolute left-4 top-4 z-20">
          <Badge tone="green">Featured</Badge>
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-4 p-5 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {product.category ? (
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: accent }}
            />
            {product.category.name}
          </div>
        ) : null}
        <h3 className="product-name line-clamp-2 text-lg font-bold leading-tight">
          {product.name}
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-body text-lg font-bold">{formatPrice(product.price)}</span>
          {product.comparePrice ? (
            <span className="font-body text-sm text-white/65 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          ) : null}
        </div>
        <motion.button
          type="button"
          disabled={disabled}
          animate={bounced && !reducedMotion ? { scale: [1, 1.12, 0.96, 1] } : undefined}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleAddToCart();
          }}
          className="pointer-events-auto mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-cream px-4 text-sm font-bold text-charcoal shadow-lg transition duration-300 disabled:pointer-events-none disabled:opacity-60"
        >
          <ShoppingCart size={17} />
          Add to Cart
        </motion.button>
      </div>
    </motion.article>
  );
}
