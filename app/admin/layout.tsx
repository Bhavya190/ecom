import { AdminShell } from "@/components/admin/admin-shell";
import { isAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let unreadInquiriesCount = 0;
  try {
    if (await isAdminSession()) {
      unreadInquiriesCount = await prisma.contact.count({ where: { isRead: false } });
    }
  } catch (e) {
    // ignore
  }

  return <AdminShell unreadInquiriesCount={unreadInquiriesCount}>{children}</AdminShell>;
}
