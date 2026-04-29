import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(20, "Message must be at least 20 characters")
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid form data", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await prisma.contact.create({
      data: parsed.data
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { message: "Failed to submit form" },
      { status: 500 }
    );
  }
}
