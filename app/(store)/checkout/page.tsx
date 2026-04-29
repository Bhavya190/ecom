"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/store/cart-provider";
import { formatPrice } from "@/lib/utils";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  notes: ""
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setForm((current) => ({
        ...current,
        fullName: current.fullName || session.user.name || "",
        email: current.email || session.user.email || ""
      }));
    }
  }, [session]);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        paymentMethod: "COD",
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      })
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.message ?? "Could not place order");
      return;
    }

    const data = await response.json();
    await clearCart();
    toast.success("Order placed");
    router.push(`/order-confirmation/${data.order.id}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-soft-black">Checkout</h1>
      <form onSubmit={submitOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6 rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
          <section>
            <h2 className="text-lg font-semibold">Contact Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input
                required
                placeholder="Full Name"
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
              />
              <Input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
              <Input
                required
                placeholder="Phone"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="sm:col-span-2"
              />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Shipping Address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input
                required
                placeholder="Address Line 1"
                value={form.addressLine1}
                onChange={(event) => setForm({ ...form, addressLine1: event.target.value })}
                className="sm:col-span-2"
              />
              <Input
                placeholder="Address Line 2"
                value={form.addressLine2}
                onChange={(event) => setForm({ ...form, addressLine2: event.target.value })}
                className="sm:col-span-2"
              />
              <Input
                required
                placeholder="City"
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
              />
              <Input
                required
                placeholder="State"
                value={form.state}
                onChange={(event) => setForm({ ...form, state: event.target.value })}
              />
              <Input
                required
                placeholder="Pincode"
                value={form.pincode}
                onChange={(event) => setForm({ ...form, pincode: event.target.value })}
                className="sm:col-span-2"
              />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Payment Method</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="rounded-lg border border-brand-600 bg-brand-50 p-4 text-sm dark:bg-brand-950/40">
                <input type="radio" checked readOnly className="mr-2" />
                Cash on Delivery
              </label>
              <div className="rounded-lg border border-dashed border-neutral-300 p-4 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                Online Payment Coming Soon
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-neutral-500 dark:text-neutral-400">Qty {item.quantity}</p>
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
          <Button type="submit" className="mt-6 w-full" disabled={loading || !items.length}>
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
