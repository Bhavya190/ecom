"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Boxes,
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Tags,
  Users,
  X,
  Mail
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail }
];

export function AdminShell({ 
  children,
  unreadInquiriesCount = 0 
}: { 
  children: React.ReactNode;
  unreadInquiriesCount?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-slate-50 dark:bg-neutral-950">{children}</div>;
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand-600 text-white">
            <Boxes size={20} />
          </span>
          Admin
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex h-11 items-center justify-between rounded-md px-3 text-sm font-medium transition",
                active
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-100"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                {item.label}
              </div>
              {item.href === "/admin/inquiries" && unreadInquiriesCount > 0 && (
                <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-600 px-1.5 text-xs font-semibold text-white">
                  {unreadInquiriesCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">{sidebar}</div>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 lg:hidden",
          open ? "block" : "hidden"
        )}
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform transition lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebar}
      </div>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </Button>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-brand-700 dark:text-neutral-400"
          >
            <ChevronLeft size={16} />
            Storefront
          </Link>
        </header>
        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
