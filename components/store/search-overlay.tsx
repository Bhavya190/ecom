"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

import type { StoreProduct } from "@/components/store/product-card";
import { Input } from "@/components/ui/input";
import { firstImage, formatPrice } from "@/lib/utils";

export function SearchOverlay({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(query)}&limit=6`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.products);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full rounded-b-3xl bg-cream p-6 shadow-2xl md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-3xl">
              <div className="relative">
                <Search
                  size={24}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"
                />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for jewellery, portraits, paintings..."
                  className="h-16 rounded-2xl border-white/60 bg-white pl-14 pr-12 text-lg shadow-soft"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mt-8">
                {!query.trim() ? (
                  <div>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-charcoal/60">
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Jewellery",
                        "Portrait",
                        "Resin Art",
                        "Diwali Gift",
                        "Rakhi"
                      ].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="rounded-full border border-white/60 bg-white px-4 py-2 text-sm font-medium text-charcoal transition hover:bg-blush/20"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {loading ? (
                      <div className="py-8 text-center text-charcoal/60">
                        Searching...
                      </div>
                    ) : results.length > 0 ? (
                      <div className="space-y-2">
                        {results.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={onClose}
                            className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white/60"
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
                              <Image
                                src={firstImage(product.images)}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-soft-black transition group-hover:text-[#a85066]">
                                {product.name}
                              </h4>
                              <p className="text-sm text-charcoal/60">
                                {product.category?.name}
                              </p>
                            </div>
                            <div className="font-medium text-soft-black">
                              {formatPrice(product.price)}
                            </div>
                          </Link>
                        ))}
                        <Link
                          href={`/products`}
                          onClick={onClose}
                          className="mt-4 block py-2 text-center text-sm font-bold text-[#a85066]"
                        >
                          View all products
                        </Link>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-charcoal/70">
                          No products found for &quot;{query}&quot;
                        </p>
                        <Link
                          href="/products"
                          onClick={onClose}
                          className="mt-2 inline-block font-semibold text-[#a85066] hover:underline"
                        >
                          Browse all products
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
