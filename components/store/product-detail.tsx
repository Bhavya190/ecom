"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/cart-provider";
import { type StoreProduct } from "@/components/store/product-card";
import { firstImage, formatPrice } from "@/lib/utils";

export function ProductDetail({ product }: { product: StoreProduct }) {
  const [selectedImage, setSelectedImage] = useState(firstImage(product.images));
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const inStock = product.stock > 0;

  const thumbnails = useMemo(
    () => (product.images.length ? product.images : [selectedImage]),
    [product.images, selectedImage]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        <Link href="/products" className="hover:text-brand-700">
          Products
        </Link>
        {product.category ? (
          <>
            <span className="mx-2">/</span>
            <span>{product.category.name}</span>
          </>
        ) : null}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {thumbnails.map((image) => (
              <button
                type="button"
                key={image}
                onClick={() => setSelectedImage(image)}
                className="relative aspect-square overflow-hidden rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
              >
                <Image src={image} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
          {product.videoUrl ? (
            <video
              className="aspect-video w-full rounded-lg bg-black"
              src={product.videoUrl}
              controls
            />
          ) : null}
        </div>

        <section className="lg:pt-4">
          {product.category ? <Badge tone="blue">{product.category.name}</Badge> : null}
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
            {product.comparePrice ? (
              <span className="text-lg text-neutral-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            ) : null}
          </div>
          <p className="mt-6 leading-7 text-neutral-600 dark:text-neutral-300">
            {product.description}
          </p>
          <div className="mt-6">
            {inStock ? (
              <Badge tone={product.stock < 5 ? "amber" : "green"}>
                {product.stock < 5 ? `Only ${product.stock} left` : "In Stock"}
              </Badge>
            ) : (
              <Badge tone="red">Out of Stock</Badge>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="inline-flex h-12 w-36 items-center justify-between rounded-md border border-neutral-200 bg-white px-2 dark:border-neutral-800 dark:bg-neutral-950">
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>
              <span className="font-medium">{quantity}</span>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900"
                onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
                aria-label="Increase quantity"
                disabled={!inStock}
              >
                <Plus size={18} />
              </button>
            </div>
            <Button
              size="lg"
              disabled={!inStock}
              onClick={() =>
                addItem(
                  {
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    image: firstImage(product.images),
                    price: product.price,
                    comparePrice: product.comparePrice,
                    stock: product.stock
                  },
                  quantity
                )
              }
            >
              <ShoppingCart size={20} />
              Add to Cart
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
