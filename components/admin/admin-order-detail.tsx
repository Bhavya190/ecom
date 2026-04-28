"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type Order = ReturnType<typeof import("@/lib/serializers").serializeOrder>;
type ShippingAddress = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

const orderStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const paymentStatuses = ["PENDING", "PAID", "FAILED"];

export function AdminOrderDetail({ order }: { order: Order }) {
  const [status, setStatus] = useState<string>(order.status);
  const [paymentStatus, setPaymentStatus] = useState<string>(order.paymentStatus);
  const [saving, setSaving] = useState(false);
  const address = order.shippingAddress as ShippingAddress;

  async function saveOrder() {
    setSaving(true);
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus })
    });
    setSaving(false);

    if (!response.ok) {
      toast.error("Could not update order");
      return;
    }

    toast.success("Order updated");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/admin/orders" className="text-sm font-medium text-brand-700">
            Back to orders
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Created {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <Badge tone="blue">{order.paymentMethod}</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <div className="border-b border-neutral-200 p-5 dark:border-neutral-800">
              <h2 className="text-lg font-semibold">Items</h2>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="text-lg font-semibold">Customer</h2>
            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Name</p>
                <p className="font-medium">{order.customer?.name ?? order.guestName}</p>
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Email</p>
                <p className="font-medium">{order.customer?.email ?? order.guestEmail}</p>
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Phone</p>
                <p className="font-medium">{order.guestPhone}</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="text-lg font-semibold">Update Status</h2>
            <div className="mt-4 space-y-4">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Order Status</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-950"
                >
                  {orderStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium">Payment Status</span>
                <select
                  value={paymentStatus}
                  onChange={(event) => setPaymentStatus(event.target.value)}
                  className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-950"
                >
                  {paymentStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <Button className="w-full" onClick={saveOrder} disabled={saving}>
                <Save size={18} />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="text-lg font-semibold">Shipping Address</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {address.addressLine1}
              {address.addressLine2 ? <><br />{address.addressLine2}</> : null}
              <br />
              {address.city}, {address.state} {address.pincode}
            </p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
