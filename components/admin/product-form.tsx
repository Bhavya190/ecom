"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type StoreProduct } from "@/components/store/product-card";
import { makeSlug } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is too short"),
  price: z.coerce.number().positive("Price must be positive"),
  comparePrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Choose a category"),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  images: z.array(z.object({ url: z.string().url("Enter a valid image URL") })).min(1),
  videoUrl: z.string().url("Enter a valid video URL").optional().or(z.literal(""))
});

type ProductFormValues = z.infer<typeof productSchema>;

type Category = {
  id: string;
  name: string;
};

export function ProductForm({
  product,
  categories
}: {
  product?: StoreProduct;
  categories: Category[];
}) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      comparePrice: product?.comparePrice ?? null,
      stock: product?.stock ?? 0,
      categoryId: product?.categoryId ?? categories[0]?.id ?? "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      images: product?.images?.length
        ? product.images.map((url) => ({ url }))
        : [{ url: "https://picsum.photos/seed/new-product/600/600" }],
      videoUrl: product?.videoUrl ?? ""
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images"
  });

  const watchedName = watch("name");
  const slugPreview = useMemo(() => makeSlug(watchedName || ""), [watchedName]);

  async function onSubmit(values: ProductFormValues) {
    const payload = {
      ...values,
      comparePrice: values.comparePrice || null,
      images: values.images.map((image) => image.url)
    };

    const response = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.message ?? "Could not save product");
      return;
    }

    toast.success("Product saved");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {product ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Slug preview: {slugPreview || "product-slug"}
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-neutral-500 hover:text-brand-700"
        >
          Cancel
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Name</span>
            <Input {...register("name")} />
            {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <Textarea {...register("description")} />
            {errors.description ? (
              <p className="text-xs text-red-600">{errors.description.message}</p>
            ) : null}
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Price</span>
            <Input type="number" step="0.01" {...register("price")} />
            {errors.price ? <p className="text-xs text-red-600">{errors.price.message}</p> : null}
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Compare Price</span>
            <Input type="number" step="0.01" {...register("comparePrice")} />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Stock</span>
            <Input type="number" {...register("stock")} />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Category</span>
            <select
              {...register("categoryId")}
              className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-950"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Image URLs</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => append({ url: "https://picsum.photos/seed/product/600/600" })}
            >
              <Plus size={16} />
              Add URL
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input {...register(`images.${index}.url`)} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fields.length > 1 && remove(index)}
                aria-label="Remove image URL"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          {errors.images ? <p className="text-xs text-red-600">Add valid image URLs.</p> : null}
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Video URL</span>
          <Input {...register("videoUrl")} placeholder="Optional product video URL" />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            <input type="checkbox" {...register("isActive")} />
            <span className="text-sm font-medium">Active</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            <input type="checkbox" {...register("isFeatured")} />
            <span className="text-sm font-medium">Featured</span>
          </label>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          <Save size={18} />
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </form>
    </div>
  );
}
