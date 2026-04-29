import { HomePageClient } from "@/components/store/home-page-client";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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

  return (
    <HomePageClient
      featuredProducts={featuredProducts.map(serializeProduct)}
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: category.image,
        productCount: category._count.products
      }))}
      newArrivals={newArrivals.map(serializeProduct)}
    />
  );
}
