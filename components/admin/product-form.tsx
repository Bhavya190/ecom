"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Film,
  Image as ImageIcon,
  LinkIcon,
  Plus,
  Save,
  Trash2,
  UploadCloud
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
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
  images: z
    .array(z.object({ url: z.string().url("Enter a valid image URL") }))
    .min(1, "Add at least one product image")
    .max(8, "Use up to 8 images"),
  videoUrl: z.string().url("Enter a valid video URL").optional().or(z.literal(""))
});

type ProductFormValues = z.infer<typeof productSchema>;

type Category = {
  id: string;
  name: string;
};

type UploadItem = {
  id: string;
  name: string;
  preview?: string;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
};

function id() {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

function uploadFile(
  file: File,
  onProgress: (progress: number) => void
): Promise<{ url: string; resourceType: "image" | "video" }> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    request.onload = () => {
      const data = JSON.parse(request.responseText || "{}");

      if (request.status >= 200 && request.status < 300) {
        resolve(data);
        return;
      }

      reject(new Error(data.message ?? "Upload failed"));
    };

    request.onerror = () => reject(new Error("Upload failed"));
    request.open("POST", "/api/upload");
    request.send(formData);
  });
}

export function ProductForm({
  product,
  categories
}: {
  product?: StoreProduct;
  categories: Category[];
}) {
  const router = useRouter();
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [videoUpload, setVideoUpload] = useState<UploadItem | null>(null);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
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
        : [],
      videoUrl: product?.videoUrl ?? ""
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images"
  });

  const watchedName = watch("name");
  const videoUrl = watch("videoUrl");
  const slugPreview = useMemo(() => makeSlug(watchedName || ""), [watchedName]);

  async function uploadImages(files: File[]) {
    const remaining = Math.max(0, 8 - fields.length);
    const accepted = files.slice(0, remaining);

    if (!remaining) {
      toast.error("Use up to 8 images per product");
      return;
    }

    if (accepted.length < files.length) {
      toast.error("Only 8 images are allowed per product");
    }

    for (const file of accepted) {
      const uploadId = id();
      const preview = URL.createObjectURL(file);

      setUploads((current) => [
        ...current,
        { id: uploadId, name: file.name, preview, progress: 0, status: "uploading" }
      ]);

      try {
        const result = await uploadFile(file, (progress) => {
          setUploads((current) =>
            current.map((item) => (item.id === uploadId ? { ...item, progress } : item))
          );
        });

        append({ url: result.url });
        setUploads((current) =>
          current.map((item) =>
            item.id === uploadId ? { ...item, progress: 100, status: "done" } : item
          )
        );
      } catch (error) {
        setUploads((current) =>
          current.map((item) =>
            item.id === uploadId
              ? {
                  ...item,
                  status: "error",
                  error: error instanceof Error ? error.message : "Upload failed"
                }
              : item
          )
        );
        toast.error(error instanceof Error ? error.message : "Upload failed");
      }
    }
  }

  async function uploadVideo(files: File[]) {
    const file = files[0];
    if (!file) return;

    const uploadId = id();
    setVideoUpload({ id: uploadId, name: file.name, progress: 0, status: "uploading" });

    try {
      const result = await uploadFile(file, (progress) => {
        setVideoUpload((current) => (current ? { ...current, progress } : current));
      });
      setValue("videoUrl", result.url, { shouldValidate: true });
      setVideoUpload((current) =>
        current ? { ...current, progress: 100, status: "done" } : current
      );
      toast.success("Video uploaded");
    } catch (error) {
      setVideoUpload((current) =>
        current
          ? {
              ...current,
              status: "error",
              error: error instanceof Error ? error.message : "Upload failed"
            }
          : current
      );
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
  }

  const imageDropzone = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
    onDrop: uploadImages,
    onDropRejected: () => toast.error("Images must be jpg, png, or webp and 10MB or smaller")
  });

  const videoDropzone = useDropzone({
    accept: {
      "video/mp4": [".mp4"],
      "video/quicktime": [".mov"]
    },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
    onDrop: uploadVideo,
    onDropRejected: () => toast.error("Video must be mp4 or mov and 50MB or smaller")
  });

  function addImageUrl() {
    if (fields.length >= 8) {
      toast.error("Use up to 8 images per product");
      return;
    }

    try {
      const url = new URL(urlInput);
      append({ url: url.toString() });
      setUrlInput("");
      toast.success("Image URL added");
    } catch {
      toast.error("Enter a valid image URL");
    }
  }

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

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Product Images</h2>
              <p className="mt-1 text-xs text-neutral-500">
                Upload up to 8 jpg, png, or webp images. Each image can be up to 10MB.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowUrlInput((value) => !value)}
            >
              <LinkIcon size={16} />
              Add by URL
            </Button>
          </div>

          <div
            {...imageDropzone.getRootProps()}
            className={`cursor-pointer rounded-lg border border-dashed p-6 text-center transition ${
              imageDropzone.isDragActive
                ? "border-brand-600 bg-brand-50"
                : "border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900"
            }`}
          >
            <input {...imageDropzone.getInputProps()} />
            <UploadCloud className="mx-auto text-neutral-500" size={28} />
            <p className="mt-3 text-sm font-medium">Drag and drop images here</p>
            <p className="mt-1 text-xs text-neutral-500">or click to choose files</p>
          </div>

          {showUrlInput ? (
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(event) => setUrlInput(event.target.value)}
                placeholder="https://example.com/product-image.jpg"
              />
              <Button variant="secondary" onClick={addImageUrl}>
                <Plus size={16} />
                Add
              </Button>
            </div>
          ) : null}

          {uploads.length ? (
            <div className="space-y-2">
              {uploads.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  {item.preview ? (
                    <img
                      src={item.preview}
                      alt=""
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <ImageIcon size={22} className="text-neutral-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div
                        className={`h-full ${item.status === "error" ? "bg-red-500" : "bg-brand-600"}`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    {item.error ? <p className="mt-1 text-xs text-red-600">{item.error}</p> : null}
                  </div>
                  <span className="text-xs font-medium text-neutral-500">{item.progress}%</span>
                </div>
              ))}
            </div>
          ) : null}

          {fields.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <input type="hidden" {...register(`images.${index}.url`)} />
                  <img
                    src={field.url}
                    alt=""
                    className="aspect-square w-full rounded-md object-cover"
                  />
                  <p className="mt-2 truncate text-xs text-neutral-500">{field.url}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={16} />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
          {errors.images ? <p className="text-xs text-red-600">{errors.images.message}</p> : null}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">Product Video</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Upload mp4 or mov up to 50MB, or paste a YouTube/Vimeo/Cloudinary URL.
            </p>
          </div>
          <div
            {...videoDropzone.getRootProps()}
            className={`cursor-pointer rounded-lg border border-dashed p-5 text-center transition ${
              videoDropzone.isDragActive
                ? "border-brand-600 bg-brand-50"
                : "border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900"
            }`}
          >
            <input {...videoDropzone.getInputProps()} />
            <Film className="mx-auto text-neutral-500" size={26} />
            <p className="mt-2 text-sm font-medium">Drop a product video here</p>
            <p className="mt-1 text-xs text-neutral-500">or click to upload one file</p>
          </div>
          {videoUpload ? (
            <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium">{videoUpload.name}</p>
                <span className="text-xs font-medium text-neutral-500">{videoUpload.progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className={`h-full ${videoUpload.status === "error" ? "bg-red-500" : "bg-brand-600"}`}
                  style={{ width: `${videoUpload.progress}%` }}
                />
              </div>
              {videoUpload.error ? (
                <p className="mt-1 text-xs text-red-600">{videoUpload.error}</p>
              ) : null}
            </div>
          ) : null}
          <label className="block space-y-1">
            <span className="text-sm font-medium">Video URL</span>
            <Input
              {...register("videoUrl")}
              placeholder="Optional product video URL"
              value={videoUrl ?? ""}
              onChange={(event) =>
                setValue("videoUrl", event.target.value, { shouldValidate: true })
              }
            />
            {errors.videoUrl ? (
              <p className="text-xs text-red-600">{errors.videoUrl.message}</p>
            ) : null}
          </label>
        </section>

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
