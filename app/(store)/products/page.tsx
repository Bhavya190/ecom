import { ProductBrowser } from "@/components/store/product-browser";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams
}: {
  searchParams?: { category?: string };
}) {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <ProductBrowser
      products={products.map(serializeProduct)}
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug
      }))}
      initialCategory={searchParams?.category}
    />
  );
}
