"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, ShoppingCart } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/store/cart-provider";
import { type StoreProduct } from "@/components/store/product-card";
import { categoryAccent } from "@/lib/brand";
import { cn, firstImage, formatPrice } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
};

const heights = [
  "h-[340px]",
  "h-[440px]",
  "h-[300px]",
  "h-[390px]",
  "h-[470px]",
  "h-[330px]"
];

function MasonryProductCard({
  product,
  index
}: {
  product: StoreProduct;
  index: number;
}) {
  const { addItem } = useCart();
  const reducedMotion = useReducedMotion();
  const accent = categoryAccent(product.category?.slug);
  const disabled = product.stock <= 0;

  return (
    <motion.article
      layout
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      className="mb-5 break-inside-avoid"
    >
      <div
        className={cn(
          "group relative overflow-hidden rounded-[24px] bg-white shadow-soft",
          heights[index % heights.length]
        )}
        style={{ boxShadow: `0 20px 55px ${accent}30` }}
      >
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10">
          <span className="sr-only">View {product.name}</span>
        </Link>
        <Image
          src={firstImage(product.images)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-8 bg-gradient-to-t from-black/86 via-black/55 to-transparent p-5 pt-20 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
            {product.category?.name}
          </div>
          <h3 className="product-name line-clamp-2 text-lg font-bold leading-tight">
            {product.name}
          </h3>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="font-bold">{formatPrice(product.price)}</span>
              {product.comparePrice ? (
                <span className="text-xs text-white/60 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              ) : null}
            </div>
            <motion.button
              type="button"
              whileTap={reducedMotion ? undefined : { scale: 0.92 }}
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                addItem({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  image: firstImage(product.images),
                  price: product.price,
                  comparePrice: product.comparePrice,
                  stock: product.stock
                });
              }}
              className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-cream text-charcoal disabled:opacity-50"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </motion.button>
          </div>
        </div>
        {disabled ? (
          <div className="absolute left-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-red-700">
            Out of Stock
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

export function ProductBrowser({
  products,
  categories,
  initialCategory
}: {
  products: StoreProduct[];
  categories: Category[];
  initialCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [sort, setSort] = useState("newest");
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryParam = searchParams?.get("category");

  useEffect(() => {
    setCategory(categoryParam ?? "all");
  }, [categoryParam]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (newCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || product.category?.slug === category;

      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "featured") return Number(b.isFeatured) - Number(a.isFeatured);

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [category, products, search, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-blush/20 to-lavender/20 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-charcoal/55">
            Studio Shop
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold text-soft-black sm:text-6xl">
            Handmade Creations
          </h1>
          <p className="mt-3 max-w-2xl text-charcoal/65">
            Browse resin jewellery, portraits, festive art, ring platters, and custom gifts.
          </p>
        </div>

        <div className="mb-6 grid gap-4 rounded-[28px] border border-white/60 bg-white/45 p-4 shadow-soft backdrop-blur md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/45"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search artwork"
              className="h-12 rounded-full border-white/70 bg-cream/80 pl-11 font-body"
            />
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-12 rounded-full border border-white/70 bg-cream/80 px-5 font-body text-sm font-semibold text-charcoal outline-none"
          >
            <option value="newest">Newest</option>
            <option value="featured">Featured</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
          </select>
        </div>

        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition",
              category === "all"
                ? "border-charcoal bg-charcoal text-white"
                : "border-white/80 bg-white/50 text-charcoal"
            )}
          >
            All Collections
          </button>
          {categories.map((item) => {
            const accent = categoryAccent(item.slug);
            const active = category === item.slug;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCategoryChange(item.slug)}
                className="whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition"
                style={{
                  backgroundColor: active ? accent : `${accent}40`,
                  borderColor: active ? "#2D2D2D" : `${accent}AA`,
                  color: "#2D2D2D"
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {visibleProducts.length ? (
          <div className="columns-2 gap-4 md:columns-3 xl:columns-4">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product, index) => (
                <MasonryProductCard key={product.id} product={product} index={index} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            title="No creations found"
            message="Try another collection, search term, or sort option."
            href="/products"
            action="View all creations"
          />
        )}
      </div>
    </div>
  );
}
