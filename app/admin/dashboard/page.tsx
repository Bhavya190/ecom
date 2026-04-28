import Link from "next/link";
import { AlertTriangle, DollarSign, Package, ShoppingBag, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalOrders, revenue, totalProducts, totalCustomers, recentOrders, lowStock] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
      prisma.product.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({
        include: { customer: true },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      prisma.product.findMany({
        where: { stock: { lt: 5 } },
        include: { category: true },
        orderBy: { stock: "asc" },
        take: 8
      })
    ]);

  const kpis = [
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag },
    { label: "Total Revenue", value: formatPrice(Number(revenue._sum.totalAmount ?? 0)), icon: DollarSign },
    { label: "Total Products", value: totalProducts, icon: Package },
    { label: "Total Customers", value: totalCustomers, icon: Users }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Store health, orders, and stock at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.label}</p>
                <Icon size={20} className="text-brand-700" />
              </div>
              <p className="mt-4 text-2xl font-semibold">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <div className="border-b border-neutral-200 p-5 dark:border-neutral-800">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-neutral-50 text-left text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-700">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4">{order.customer?.name ?? order.guestName}</td>
                    <td className="px-5 py-4">{formatPrice(Number(order.totalAmount))}</td>
                    <td className="px-5 py-4">
                      <Badge tone="blue">{order.status}</Badge>
                    </td>
                    <td className="px-5 py-4">{order.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-600" />
            <h2 className="text-lg font-semibold">Low Stock</h2>
          </div>
          <div className="mt-5 space-y-3">
            {lowStock.length ? (
              lowStock.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-neutral-500 dark:text-neutral-400">{product.category.name}</p>
                  </div>
                  <Badge tone={product.stock === 0 ? "red" : "amber"}>{product.stock}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">No low stock items.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
