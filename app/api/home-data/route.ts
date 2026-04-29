import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";

export async function GET() {
  try {
    const [featuredProducts, categories, newArrivals] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 4
      }),
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" }
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 4
      })
    ]);

    const data = {
      featuredProducts: featuredProducts.map(serializeProduct),
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: category.image,
        productCount: category._count.products
      })),
      newArrivals: newArrivals.map(serializeProduct)
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home data' },
      { status: 500 }
    );
  }
}
