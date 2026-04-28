import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/store/product-detail";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findFirst({
    where: { slug: params.slug, isActive: true },
    include: { category: true }
  });

  if (!product) {
    notFound();
  }

  return <ProductDetail product={serializeProduct(product)} />;
}
