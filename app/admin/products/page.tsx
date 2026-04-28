import { AdminProductsClient } from "@/components/admin/admin-products-client";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <AdminProductsClient
      products={products.map(serializeProduct)}
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug
      }))}
    />
  );
}
