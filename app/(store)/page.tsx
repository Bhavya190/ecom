import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/store/product-card";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categories, newArrivals] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" }
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4
    })
  ]);

  return (
    <>
      <section className="relative isolate min-h-[calc(100svh-8rem)] overflow-hidden">
        <Image
          src="https://picsum.photos/seed/northstar-hero/1800/1100"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
        <div className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-100">
              Small Batch Essentials
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Northstar Goods
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-100">
              Thoughtfully chosen products for everyday living, work, and style.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center rounded-md bg-brand-600 px-5 font-medium text-white transition hover:bg-brand-700"
              >
                Shop Products
              </Link>
              <Link
                href="#featured"
                className="inline-flex h-12 items-center rounded-md border border-white/35 px-5 font-medium text-white transition hover:bg-white/10"
              >
                Featured Picks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Customer favorites, stocked and ready.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden h-10 items-center rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-950 transition hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800 sm:inline-flex"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={serializeProduct(product)} />
          ))}
        </div>
      </section>

      <section className="bg-white py-14 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Simple paths into the catalog.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {categories.map((category) => (
              <Link
                href={`/products?category=${category.slug}`}
                key={category.id}
                className="group relative min-h-64 overflow-hidden rounded-lg"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-semibold">{category.name}</h3>
                  <p className="mt-1 text-sm text-neutral-100">
                    {category._count.products} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              New Arrivals
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Fresh additions from the latest catalog update.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-brand-700 hover:text-brand-600"
          >
            Browse all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={serializeProduct(product)} />
          ))}
        </div>
      </section>
    </>
  );
}
