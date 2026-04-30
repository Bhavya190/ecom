import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/utils";

import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";

const updateProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  images: z.array(z.string().url()).min(1).max(8),
  videoUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false)
});

const patchProductSchema = z.object({
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional()
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid product details" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      slug: makeSlug(parsed.data.name),
      videoUrl: parsed.data.videoUrl || null
    }
  });

  revalidatePath("/");
  revalidatePath("/products");

  return NextResponse.json({ product });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = patchProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid product update" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id: params.id },
    data: parsed.data
  });

  revalidatePath("/");
  revalidatePath("/products");

  return NextResponse.json({ product });
}

function getPublicId(url: string): string | null {
  if (!url.includes("res.cloudinary.com")) return null;
  try {
    const parts = url.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) return null;
    const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
    return publicIdWithExt.split(".")[0];
  } catch {
    return null;
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id }
  });

  if (product) {
    for (const imageUrl of product.images) {
      const publicId = getPublicId(imageUrl);
      if (publicId) {
        await cloudinary.uploader
          .destroy(publicId)
          .catch((err) => console.error(`Failed to delete image ${publicId}:`, err));
      }
    }

    if (product.videoUrl) {
      const publicId = getPublicId(product.videoUrl);
      if (publicId) {
        await cloudinary.uploader
          .destroy(publicId, { resource_type: "video" })
          .catch((err) => console.error(`Failed to delete video ${publicId}:`, err));
      }
    }
  }

  await prisma.product.delete({ where: { id: params.id } });

  revalidatePath("/");
  revalidatePath("/products");

  return NextResponse.json({ ok: true });
}
