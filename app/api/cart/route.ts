export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { firstImage } from "@/lib/utils";

const cartLineSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1)
});

const cartSchema = z.object({
  items: z.array(cartLineSchema)
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ items: [] });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json({
    items: items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      image: firstImage(item.product.images),
      price: Number(item.product.price),
      comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
      stock: item.product.stock,
      quantity: item.quantity
    }))
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ ok: true });
  }

  const body = await request.json();
  const parsed = cartSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid cart payload" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { userId: session.user.id } }),
    prisma.cartItem.createMany({
      data: parsed.data.items.map((item) => ({
        userId: session.user.id,
        productId: item.productId,
        quantity: item.quantity
      })),
      skipDuplicates: true
    })
  ]);

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
  }

  return NextResponse.json({ ok: true });
}
