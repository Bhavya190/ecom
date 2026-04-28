import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serializers";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ShippingAddress = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

export default async function OrderConfirmationPage({
  params
}: {
  params: { orderId: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: true, customer: true }
  });

  if (!order) {
    notFound();
  }

  const data = serializeOrder(order);
  const address = data.shippingAddress as ShippingAddress;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
        <Badge tone="green">Order Placed</Badge>
        <h1 className="mt-4 text-3xl font-semibold">Thank you for your order</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Order number: <span className="font-medium text-neutral-950 dark:text-neutral-50">{data.orderNumber}</span>
        </p>

        <div className="mt-8 space-y-4">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b border-neutral-100 pb-4 text-sm dark:border-neutral-800"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-neutral-500 dark:text-neutral-400">Qty {item.quantity}</p>
              </div>
              <p>{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-semibold">Shipping Address</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {address.addressLine1}
              {address.addressLine2 ? <><br />{address.addressLine2}</> : null}
              <br />
              {address.city}, {address.state} {address.pincode}
            </p>
          </div>
          <div className="md:text-right">
            <h2 className="font-semibold">Total</h2>
            <p className="mt-2 text-2xl font-semibold">{formatPrice(data.totalAmount)}</p>
          </div>
        </div>

        <Link
          href="/products"
          className="mt-8 inline-flex h-11 items-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
