import { HomePageWrapper } from "@/components/store/home-page-wrapper";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
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

    return (
      <HomePageWrapper
        initialFeaturedProducts={featuredProducts.map(serializeProduct)}
        initialCategories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          image: category.image,
          productCount: category._count.products
        }))}
        initialNewArrivals={newArrivals.map(serializeProduct)}
      />
    );
  } catch (error) {
    console.error('Error fetching home page data:', error);
    // Return fallback data to prevent blank page
    return (
      <HomePageWrapper
        initialFeaturedProducts={[]}
        initialCategories={[]}
        initialNewArrivals={[]}
      />
    );
  }
}
