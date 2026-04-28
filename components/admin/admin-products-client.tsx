"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Plus, Search, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type StoreProduct } from "@/components/store/product-card";
import { firstImage, formatPrice } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export function AdminProductsClient({
  products,
  categories
}: {
  products: StoreProduct[];
  categories: Category[];
}) {
  const [rows, setRows] = useState(products);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const visibleRows = useMemo(
    () =>
      rows.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "all" || product.category?.slug === category;

        return matchesSearch && matchesCategory;
      }),
    [category, rows, search]
  );

  async function patchProduct(id: string, patch: Partial<StoreProduct>) {
    const response = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    });

    if (!response.ok) {
      toast.error("Could not update product");
      return;
    }

    setRows((current) =>
      current.map((product) => (product.id === id ? { ...product, ...patch } : product))
    );
    toast.success("Product saved");
  }

  async function deleteProduct(id: string) {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (!response.ok) {
      toast.error("Could not delete product");
      return;
    }

    setRows((current) => current.filter((product) => product.id !== id));
    toast.success("Product deleted");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Manage catalog availability, pricing, and merchandising.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="grid gap-3 border-b border-neutral-200 p-4 dark:border-neutral-800 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="pl-10"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-950"
          >
            <option value="all">All Categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {visibleRows.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900">
                        <Image
                          src={firstImage(product.images)}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-neutral-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{product.category?.name}</td>
                  <td className="px-4 py-4">{formatPrice(product.price)}</td>
                  <td className="px-4 py-4">{product.stock}</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => patchProduct(product.id, { isActive: !product.isActive })}
                    >
                      <Badge tone={product.isActive ? "green" : "neutral"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        patchProduct(product.id, { isFeatured: !product.isFeatured })
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900"
                      title="Toggle featured"
                    >
                      <Star
                        size={18}
                        className={
                          product.isFeatured
                            ? "fill-amber-400 text-amber-500"
                            : "text-neutral-400"
                        }
                      />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProduct(product.id)}
                        aria-label="Delete product"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
