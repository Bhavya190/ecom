"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

type Order = ReturnType<typeof import("@/lib/serializers").serializeOrder>;

const statuses = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function statusTone(status: string) {
  if (status === "DELIVERED") return "green";
  if (status === "CANCELLED") return "red";
  if (status === "PENDING") return "amber";

  return "blue";
}

export function AdminOrdersClient({
  orders,
  initialSearch
}: {
  orders: Order[];
  initialSearch?: string;
}) {
  const [search, setSearch] = useState(initialSearch ?? "");
  const [status, setStatus] = useState("ALL");

  const visibleOrders = useMemo(
    () =>
      orders.filter((order) => {
        const customerName = order.customer?.name ?? order.guestName ?? "";
        const customerEmail = order.customer?.email ?? order.guestEmail ?? "";
        const matchesSearch =
          order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          customerName.toLowerCase().includes(search.toLowerCase()) ||
          customerEmail.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === "ALL" || order.status === status;

        return matchesSearch && matchesStatus;
      }),
    [orders, search, status]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Track fulfillment, payment state, and customer order details.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="grid gap-3 border-b border-neutral-200 p-4 dark:border-neutral-800 lg:grid-cols-[1fr_260px]">
          <label className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order or customer"
              className="pl-10"
            />
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-950"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item === "ALL" ? "All Statuses" : item}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment Method</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {visibleOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="px-4 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-700">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{order.customer?.name ?? order.guestName}</p>
                    <p className="text-xs text-neutral-500">
                      {order.customer?.email ?? order.guestEmail}
                    </p>
                  </td>
                  <td className="px-4 py-4">{formatPrice(order.totalAmount)}</td>
                  <td className="px-4 py-4">{order.paymentMethod}</td>
                  <td className="px-4 py-4">
                    <Badge tone={order.paymentStatus === "PAID" ? "green" : "amber"}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
