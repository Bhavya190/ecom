"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { ProductCard, type StoreProduct } from "@/components/store/product-card";
import { ART_CATEGORIES, BRAND_NAME, BRAND_TAGLINE, categoryAccent } from "@/lib/brand";

type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
};

function SectionReveal({
  children,
  className = "",
  id
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      id={id}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const categorySpans = [
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-3"
];

const testimonials = [
  {
    quote: "The resin finish feels so personal and premium. It turned a simple gift into a keepsake.",
    name: "Happy Collector",
    color: "bg-blush/60"
  },
  {
    quote: "Dhruvangi captures tiny details beautifully. The portrait had warmth, softness, and soul.",
    name: "Portrait Client",
    color: "bg-lavender/55"
  },
  {
    quote: "Every piece feels handmade in the best way: thoughtful, polished, and one of a kind.",
    name: "Art Lover",
    color: "bg-mint/60"
  }
];

export function HomePageClient({
  featuredProducts,
  categories,
  newArrivals
}: {
  featuredProducts: StoreProduct[];
  categories: HomeCategory[];
  newArrivals: StoreProduct[];
}) {
  const reducedMotion = useReducedMotion();
  const heroItem = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0 }
  };

  // Ensure we have valid data arrays to prevent rendering issues
  const safeFeaturedProducts = Array.isArray(featuredProducts) ? featuredProducts : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeNewArrivals = Array.isArray(newArrivals) ? newArrivals : [];

  return (
    <>
      <section key="hero" className="art-hero-gradient relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 text-center">
        <div className="absolute left-[8%] top-[18%] h-52 w-52 rounded-full bg-blush/50 blur-[60px]" />
        <div className="absolute right-[10%] top-[16%] h-64 w-64 rounded-full bg-lavender/45 blur-[70px]" />
        <div className="absolute bottom-[10%] left-[48%] h-56 w-56 rounded-full bg-gold/40 blur-[68px]" />
        <motion.div
          initial={reducedMotion ? false : "hidden"}
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } }
          }}
          className="relative z-10 mx-auto max-w-4xl"
        >
          <motion.img
            src="/art-by-dhruvangi-logo.svg"
            alt={`${BRAND_NAME} logo`}
            className="mx-auto h-24 w-24 rounded-full shadow-art"
            variants={heroItem}
          />
          <motion.p
            variants={heroItem}
            className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-charcoal/70"
          >
            Professional Resin Artist & Drawing Artist
          </motion.p>
          <motion.h1
            variants={heroItem}
            className="mt-5 font-display text-5xl font-semibold leading-[0.95] text-soft-black sm:text-7xl lg:text-8xl"
          >
            {BRAND_NAME}
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-charcoal/75 sm:text-xl"
          >
            {BRAND_TAGLINE}
          </motion.p>
          <motion.div variants={heroItem} className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex h-12 items-center rounded-full bg-soft-black px-6 text-sm font-bold text-white shadow-art transition hover:-translate-y-0.5"
            >
              Shop Now
            </Link>
            <Link
              href="#about"
              className="inline-flex h-12 items-center rounded-full border border-charcoal/20 bg-white/35 px-6 text-sm font-bold text-charcoal backdrop-blur transition hover:bg-white/60"
            >
              About the Artist
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <SectionReveal id="collections" className="overflow-hidden bg-cream px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-4xl font-semibold text-soft-black">
                Shop by Collection
              </h2>
              <p className="mt-2 max-w-xl text-charcoal/65">
                Explore handmade pieces by mood, occasion, and material.
              </p>
            </div>
            <Link href="/products" className="text-sm font-bold text-[#a85066]">
              View all work
            </Link>
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:auto-rows-[380px] lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
            {safeCategories.map((category, index) => {
              const accent = categoryAccent(category.slug);

              return (
                <motion.div
                  key={category.id}
                  whileHover={reducedMotion ? undefined : { y: -8 }}
                  className={`min-w-[260px] overflow-hidden rounded-[28px] lg:min-w-0 ${categorySpans[index % categorySpans.length]}`}
                  style={{ boxShadow: `0 24px 60px ${accent}30` }}
                >
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="group relative block h-72 overflow-hidden rounded-[28px] lg:h-full"
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 1024px) 260px, 40vw"
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 opacity-75 transition group-hover:opacity-90"
                      style={{
                        background: `linear-gradient(180deg, transparent 15%, ${accent}22 45%, rgba(26,26,46,0.78) 100%)`
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <h3 className="font-display text-3xl font-semibold">{category.name}</h3>
                      <p className="mt-1 text-sm text-white/80">
                        {category.productCount} creations
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="bg-gradient-to-br from-lavender/35 via-cream to-mint/35 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="font-display text-4xl font-semibold text-soft-black">
              Featured Creations
            </h2>
            <p className="mt-2 max-w-xl text-charcoal/65">
              A magazine-style look at signature pieces and demo artworks.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-4">
            {safeFeaturedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                large={index === 0 || index === 3}
                imagePriority={index === 0}
                className={
                  index === 0
                    ? "lg:col-span-2"
                    : index === 3
                      ? "lg:col-span-2"
                      : "lg:col-span-1"
                }
              />
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="about" className="bg-gradient-to-r from-blush/70 to-peach/55 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-5 -top-5 h-full w-full rounded-[36px] bg-gold/55" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] bg-cream p-3 shadow-art">
              <Image
                src="https://picsum.photos/seed/dhruvangi-artist/700/900"
                alt="Artist portrait placeholder"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover p-3"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-charcoal/60">
              About the Artist
            </p>
            <h2 className="mt-3 font-display text-5xl font-semibold text-soft-black">
              Meet Dhruvangi
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-charcoal/75">
              Dhruvangi creates expressive resin art and hand-drawn portraits that blend
              color, texture, memory, and celebration. Her work is made for personal
              gifting, festive moments, home corners, and keepsakes that feel quietly
              special.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-charcoal px-6 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Read More About Me &rarr;
            </Link>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="bg-cream px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-4xl font-semibold text-soft-black">
                New Arrivals
              </h2>
              <p className="mt-2 text-charcoal/65">Fresh pieces and demo products from the studio.</p>
            </div>
            <Link href="/products" className="text-sm font-bold text-[#a85066]">
              Browse all
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {safeNewArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="bg-gradient-to-r from-mint/45 via-cream to-lavender/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-4xl font-semibold text-soft-black">
            Studio Notes
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className={`rounded-[28px] p-6 shadow-soft ${item.color}`}>
                <p className="text-lg leading-8 text-charcoal/78">&quot;{item.quote}&quot;</p>
                <p className="mt-5 text-sm font-bold text-charcoal/70">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>
    </>
  );
}
