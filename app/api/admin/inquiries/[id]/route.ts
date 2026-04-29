import { NextResponse } from "next/server";

import { isAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (typeof body.isRead !== "boolean") {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.contact.update({
    where: { id: params.id },
    data: { isRead: body.isRead }
  });

  return NextResponse.json({ inquiry: updated });
}
