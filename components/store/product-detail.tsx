"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Play, Plus, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/store/cart-provider";
import { type StoreProduct } from "@/components/store/product-card";
import { categoryAccent } from "@/lib/brand";
import { firstImage, formatPrice } from "@/lib/utils";

function videoEmbedUrl(url: string) {
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }

  return url;
}

function isDirectVideo(url: string) {
  return /\.(mp4|mov)(\?|$)/i.test(url) || url.includes("res.cloudinary.com");
}

export function ProductDetail({ product }: { product: StoreProduct }) {
  const [selectedImage, setSelectedImage] = useState(firstImage(product.images));
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"gallery" | "video">("gallery");
  const [bounced, setBounced] = useState(false);
  const reducedMotion = useReducedMotion();
  const { addItem } = useCart();
  const inStock = product.stock > 0;
  const accent = categoryAccent(product.category?.slug);

  const thumbnails = useMemo(
    () => (product.images.length ? product.images : [selectedImage]),
    [product.images, selectedImage]
  );

  async function handleAddToCart() {
    setBounced(true);
    window.setTimeout(() => setBounced(false), 450);
    await addItem(
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-peach/20 to-lavender/30 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-sm font-semibold text-charcoal/60">
          <Link href="/products" className="hover:text-[#a85066]">
            Shop
          </Link>
          {product.category ? (
            <>
              <span className="mx-2">/</span>
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-[#a85066]">
                {product.category.name}
              </Link>
            </>
          ) : null}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5">
            {product.videoUrl ? (
              <div className="inline-flex rounded-full bg-white/55 p-1 shadow-soft">
                <button
                  type="button"
                  onClick={() => setTab("gallery")}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    tab === "gallery" ? "bg-charcoal text-white" : "text-charcoal"
                  }`}
                >
                  Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setTab("video")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                    tab === "video" ? "bg-charcoal text-white" : "text-charcoal"
                  }`}
                >
                  <Play size={15} />
                  Watch Video
                </button>
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              {tab === "gallery" ? (
                <motion.div
                  key="gallery"
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-4 lg:grid-cols-[1fr_96px]"
                >
                  <div
                    className="relative aspect-square overflow-hidden rounded-[32px] bg-white shadow-art"
                    style={{ boxShadow: `0 28px 80px ${accent}35` }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedImage}
                        initial={reducedMotion ? false : { opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.28 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={selectedImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 52vw"
                          className="object-cover"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
                    {thumbnails.map((image) => (
                      <button
                        type="button"
                        key={image}
                        onClick={() => setSelectedImage(image)}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white lg:h-24 lg:w-24"
                        style={{
                          borderColor: selectedImage === image ? accent : "rgba(255,255,255,0.75)"
                        }}
                      >
                        <Image src={image} alt="" fill sizes="96px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="video"
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-video overflow-hidden rounded-[32px] bg-black shadow-art"
                >
                  {product.videoUrl && isDirectVideo(product.videoUrl) ? (
                    <video className="h-full w-full" src={product.videoUrl} controls />
                  ) : product.videoUrl ? (
                    <iframe
                      src={videoEmbedUrl(product.videoUrl)}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${product.name} video`}
                    />
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <section className="rounded-[32px] border border-white/70 bg-white/50 p-6 shadow-soft backdrop-blur lg:p-8">
            {product.category ? (
              <span
                className="inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-charcoal"
                style={{ backgroundColor: `${accent}80` }}
              >
                {product.category.name}
              </span>
            ) : null}
            <h1 className="mt-5 font-display text-5xl font-semibold leading-tight text-soft-black">
              {product.name}
            </h1>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-body text-4xl font-bold text-gold">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice ? (
                <span className="font-body text-lg text-charcoal/35 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              ) : null}
            </div>
            <p className="mt-6 text-lg leading-8 text-charcoal/72">{product.description}</p>
            <div className="mt-6">
              {inStock ? (
                <Badge tone={product.stock < 5 ? "amber" : "green"}>
                  {product.stock < 5 ? `Only ${product.stock} left` : "In Stock"}
                </Badge>
              ) : (
                <Badge tone="red">Out of Stock</Badge>
              )}
            </div>

            <div className="mt-8">
              <p className="mb-2 text-sm font-bold text-charcoal/60">Quantity</p>
              <div className="inline-flex h-12 items-center justify-between rounded-full bg-blush/70 px-2">
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-charcoal"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-charcoal"
                  onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
                  aria-label="Increase quantity"
                  disabled={!inStock}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <motion.button
              type="button"
              disabled={!inStock}
              animate={bounced && !reducedMotion ? { scale: [1, 1.05, 0.98, 1] } : undefined}
              onClick={handleAddToCart}
              className="shimmer-hover mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 text-sm font-bold text-white shadow-art transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-55"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </motion.button>
          </section>
        </div>
      </div>
    </div>
  );
}
