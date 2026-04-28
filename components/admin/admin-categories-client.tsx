"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Save, Search, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { makeSlug } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
};

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  image: z.string().url("Enter a valid image URL")
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function AdminCategoriesClient({ categories }: { categories: Category[] }) {
  const [rows, setRows] = useState(categories);
  const [editing, setEditing] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "https://picsum.photos/seed/category/600/600"
    }
  });

  const visibleRows = useMemo(
    () => rows.filter((category) => category.name.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );
  const slugPreview = makeSlug(watch("name") || "");

  function startEdit(category: Category) {
    setEditing(category);
    reset({ name: category.name, image: category.image });
  }

  function cancelEdit() {
    setEditing(null);
    reset({ name: "", image: "https://picsum.photos/seed/category/600/600" });
  }

  async function onSubmit(values: CategoryFormValues) {
    const response = await fetch(editing ? `/api/categories/${editing.id}` : "/api/categories", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.message ?? "Could not save category");
      return;
    }

    const data = await response.json();
    const nextCategory = {
      ...data.category,
      productCount: editing?.productCount ?? 0
    };

    setRows((current) =>
      editing
        ? current.map((category) => (category.id === editing.id ? nextCategory : category))
        : [...current, nextCategory]
    );
    toast.success("Category saved");
    cancelEdit();
  }

  async function deleteCategory(category: Category) {
    if (!window.confirm(`Delete ${category.name}?`)) {
      return;
    }

    const response = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.message ?? "Could not delete category");
      return;
    }

    setRows((current) => current.filter((item) => item.id !== category.id));
    toast.success("Category deleted");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Organize products into storefront collections.
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
            <label className="relative block">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search categories"
                className="pl-10"
              />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-neutral-50 text-left text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Products</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {visibleRows.map((category) => (
                  <tr key={category.id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <p className="font-medium">{category.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-neutral-500">{category.slug}</td>
                    <td className="px-4 py-4">{category.productCount}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(category)}
                          aria-label="Edit category"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCategory(category)}
                          aria-label="Delete category"
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
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-fit rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{editing ? "Edit Category" : "Add Category"}</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Slug: {slugPreview || "category-slug"}
            </p>
          </div>
          {editing ? (
            <Button variant="ghost" size="icon" onClick={cancelEdit} aria-label="Cancel edit">
              <X size={18} />
            </Button>
          ) : null}
        </div>
        <div className="mt-5 space-y-4">
          <label className="space-y-1 block">
            <span className="text-sm font-medium">Name</span>
            <Input {...register("name")} />
            {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
          </label>
          <label className="space-y-1 block">
            <span className="text-sm font-medium">Image URL</span>
            <Input {...register("image")} />
            {errors.image ? <p className="text-xs text-red-600">{errors.image.message}</p> : null}
          </label>
        </div>
        <Button type="submit" className="mt-5 w-full" disabled={isSubmitting}>
          <Save size={18} />
          {isSubmitting ? "Saving..." : "Save Category"}
        </Button>
      </form>
    </div>
  );
}
