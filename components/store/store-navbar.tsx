"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/cart-provider";
import { ART_CATEGORIES, BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" }
];

export function StoreNavbar() {
  const { count } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const transparent = pathname === "/" && !scrolled && !open;


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: transparent ? "rgba(253,246,236,0)" : "rgba(253,246,236,0.92)",
        boxShadow: transparent ? "0 0 0 rgba(0,0,0,0)" : "0 12px 40px rgba(45,45,45,0.08)"
      }}
      transition={{ duration: reducedMotion ? 0 : 0.25 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/30 backdrop-blur-md"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/art-by-dhruvangi-logo.svg"
            alt={`${BRAND_NAME} logo`}
            className="h-12 w-12 rounded-full object-contain"
          />
          <span
            className={cn(
              "hidden font-display text-xl font-semibold tracking-wide sm:block",
              transparent ? "text-soft-black" : "text-charcoal"
            )}
          >
            {BRAND_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-charcoal/80 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#a85066]">
              {item.label}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 transition hover:text-[#a85066]"
              onClick={() => setCollectionsOpen((value) => !value)}
            >
              Collections
              <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {collectionsOpen ? (
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-1/2 top-9 grid w-72 -translate-x-1/2 grid-cols-2 gap-2 rounded-2xl border border-white/60 bg-cream/95 p-3 shadow-art backdrop-blur"
                >
                  {ART_CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      className="rounded-xl px-3 py-2 text-sm transition hover:shadow-sm"
                      style={{ backgroundColor: `${category.accent}40` }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/products"
            className="grid h-10 w-10 place-items-center rounded-full text-charcoal transition hover:bg-white/55"
            title="Search products"
          >
            <Search size={20} />
          </Link>
          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-charcoal transition hover:bg-white/55"
            title="Cart"
          >
            <ShoppingCart size={20} />
            <AnimatePresence>
              {count > 0 ? (
                <motion.span
                  key={count}
                  initial={reducedMotion ? false : { scale: 0.4 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#a85066] px-1 text-xs font-semibold text-white"
                >
                  {count}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </Link>
          {session ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden h-10 items-center gap-2 rounded-full border border-white/60 bg-white/45 px-3 text-sm font-semibold text-charcoal transition hover:bg-white/75 sm:flex"
            >
              <UserRound size={18} />
              Account
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden h-10 items-center gap-2 rounded-full border border-white/60 bg-white/45 px-3 text-sm font-semibold text-charcoal transition hover:bg-white/75 sm:flex"
            >
              <UserRound size={18} />
              Login
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-0 z-50 bg-cream/98 px-6 py-6 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <img
                  src="/art-by-dhruvangi-logo.svg"
                  alt={`${BRAND_NAME} logo`}
                  className="h-12 w-12 rounded-full"
                />
                <span className="font-display text-xl font-semibold">{BRAND_NAME}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X size={22} />
              </Button>
            </div>
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: reducedMotion ? 0 : 0.06 }
                }
              }}
              className="mt-12 flex flex-col gap-5"
            >
              {[...navItems, { href: "/my-orders", label: "My Orders" }].map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <Link
                    href={item.href}
                    className="font-display text-4xl font-semibold text-soft-black"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 }
                }}
                className="pt-4"
              >
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-charcoal/55">
                  Collections
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ART_CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      onClick={() => setOpen(false)}
                      className="rounded-2xl px-4 py-3 text-sm font-semibold"
                      style={{ backgroundColor: `${category.accent}55` }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
