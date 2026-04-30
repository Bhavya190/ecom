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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid category details" }, { status: 400 });
  }

  const category = await prisma.category.update({
    where: { id: params.id },
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

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.count({ where: { categoryId: params.id } });

  if (products > 0) {
    return NextResponse.json(
      { message: "Move or delete products before deleting this category" },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id: params.id } });

  revalidatePath("/");
  revalidatePath("/products");

  return NextResponse.json({ ok: true });
}
