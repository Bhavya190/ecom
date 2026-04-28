import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { makeSlug } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  images: z.array(z.string().url()).min(1),
  videoUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false)
});

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ products: products.map(serializeProduct) });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid product details" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      slug: makeSlug(parsed.data.name),
      videoUrl: parsed.data.videoUrl || null
    }
  });

  return NextResponse.json({ product });
}
