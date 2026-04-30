import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/utils";

import { revalidatePath } from "next/cache";

const categorySchema = z.object({
  name: z.string().min(2),
  image: z.string().url()
});

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" }
  });

  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid category details" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug: makeSlug(parsed.data.name),
      image: parsed.data.image
    }
  });

  revalidatePath("/");
  revalidatePath("/products");

  return NextResponse.json({ category });
}
