import { redirect } from "next/navigation";

import { AdminInquiriesClient } from "@/components/admin/admin-inquiries-client";
import { isAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  if (!(await isAdminSession())) redirect("/admin/login");

  const inquiries = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Contact Inquiries</h1>
      <p className="mb-8 text-neutral-500">
        Manage messages from customers and visitors.
      </p>
      <AdminInquiriesClient initialInquiries={inquiries} />
    </div>
  );
}
