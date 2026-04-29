"use client";

import React, { useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export function AdminInquiriesClient({
  initialInquiries
}: {
  initialInquiries: Inquiry[];
}) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function toggleReadStatus(id: string, currentStatus: boolean) {
    try {
      // Optimistic update
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id ? { ...inq, isRead: !currentStatus } : inq
        )
      );

      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");
      toast.success(currentStatus ? "Marked as unread" : "Marked as read");
    } catch (error) {
      // Revert optimistic update
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id ? { ...inq, isRead: currentStatus } : inq
        )
      );
      toast.error("Failed to update status");
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
            <tr>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Sender</th>
              <th className="px-6 py-4 font-medium">Subject</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">
                  No inquiries found.
                </td>
              </tr>
            ) : null}
            {inquiries.map((inquiry) => (
              <tr
                key={inquiry.id}
                className={cn(
                  "group transition hover:bg-neutral-50 dark:hover:bg-neutral-900/50",
                  !inquiry.isRead && "bg-blush/10 dark:bg-brand-950/20"
                )}
              >
                <td className="px-6 py-4 align-top">
                  {!inquiry.isRead ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-400">
                      <Mail size={14} />
                      Unread
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                      <MailOpen size={14} />
                      Read
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 align-top text-neutral-500">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  }).format(new Date(inquiry.createdAt))}
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    {inquiry.name}
                  </div>
                  <div className="text-neutral-500">{inquiry.email}</div>
                  {inquiry.phone && (
                    <div className="text-neutral-500">{inquiry.phone}</div>
                  )}
                </td>
                <td className="max-w-md px-6 py-4 align-top">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    {inquiry.subject}
                  </div>
                  <div className="mt-1 text-neutral-600 dark:text-neutral-400">
                    {expandedId === inquiry.id ? (
                      <div className="whitespace-pre-wrap">{inquiry.message}</div>
                    ) : (
                      <div className="line-clamp-2">{inquiry.message}</div>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === inquiry.id ? null : inquiry.id)
                    }
                    className="mt-2 text-xs font-medium text-brand-600 transition hover:underline dark:text-brand-400"
                  >
                    {expandedId === inquiry.id ? "Show less" : "Read full message"}
                  </button>
                </td>
                <td className="px-6 py-4 text-right align-top">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleReadStatus(inquiry.id, inquiry.isRead)}
                  >
                    {inquiry.isRead ? "Mark Unread" : "Mark Read"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
