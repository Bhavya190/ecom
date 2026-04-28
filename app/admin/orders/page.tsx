import { AdminOrdersClient } from "@/components/admin/admin-orders-client";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams?: { customer?: string };
}) {
  const orders = await prisma.order.findMany({
    include: { customer: true, items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <AdminOrdersClient
      orders={orders.map(serializeOrder)}
      initialSearch={searchParams?.customer ?? ""}
    />
  );
}
