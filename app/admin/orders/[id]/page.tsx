import { notFound } from "next/navigation";

import { AdminOrderDetail } from "@/components/admin/admin-order-detail";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, customer: true }
  });

  if (!order) {
    notFound();
  }

  return <AdminOrderDetail order={serializeOrder(order)} />;
}
