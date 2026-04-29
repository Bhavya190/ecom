"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice } from "@/lib/utils";

type Order = ReturnType<typeof import("@/lib/serializers").serializeOrder>;

export function MyOrdersList({ orders }: { orders: Order[] }) {
  const [openOrder, setOpenOrder] = useState<string | null>(orders[0]?.id ?? null);

  if (!orders.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <EmptyState
          title="No orders yet"
          message="Your past orders will appear here once you place one."
          href="/products"
          action="Shop products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-soft-black">My Orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => {
          const isOpen = openOrder === order.id;

          return (
            <article
              key={order.id}
              className="rounded-lg border border-neutral-200 bg-white"
            >
              <button
                type="button"
                onClick={() => setOpenOrder(isOpen ? null : order.id)}
                className="grid w-full gap-3 p-5 text-left sm:grid-cols-[1fr_auto_auto_auto]"
              >
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge tone="blue">{order.status}</Badge>
                <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                <ChevronDown
                  size={20}
                  className={isOpen ? "rotate-180 transition" : "transition"}
                />
              </button>
              {isOpen ? (
                <div className="border-t border-neutral-100 p-5">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between gap-4 text-sm">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-neutral-500">
                            Qty {item.quantity}
                          </p>
                        </div>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
