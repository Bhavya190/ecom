import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Customers</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Registered customer accounts and order counts.
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Total Orders</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/orders?customer=${encodeURIComponent(customer.email)}`}
                    className="font-medium text-brand-700"
                  >
                    {customer.name ?? "Customer"}
                  </Link>
                </td>
                <td className="px-5 py-4">{customer.email}</td>
                <td className="px-5 py-4">{customer._count.orders}</td>
                <td className="px-5 py-4">{customer.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
