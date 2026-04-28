import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { MyOrdersList } from "@/components/store/my-orders-list";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-orders");
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return <MyOrdersList orders={orders.map(serializeOrder)} />;
}
