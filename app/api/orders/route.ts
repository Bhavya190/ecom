import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { firstImage, generateOrderNumber } from "@/lib/utils";

const createOrderSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional().default(""),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  notes: z.string().optional().default(""),
  paymentMethod: z.enum(["COD", "ONLINE"]).default("COD"),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1) })).min(1)
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please check the checkout form" }, { status: 400 });
  }

  const requestedItems = parsed.data.items;
  const products = await prisma.product.findMany({
    where: {
      id: { in: requestedItems.map((item) => item.productId) },
      isActive: true
    }
  });

  if (products.length !== requestedItems.length) {
    return NextResponse.json({ message: "One or more products are unavailable" }, { status: 400 });
  }

  const items = requestedItems.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);

    if (!product) {
      throw new Error("Product missing from order");
    }

    if (product.stock < item.quantity) {
      throw new Error(`${product.name} does not have enough stock`);
    }

    return {
      product,
      quantity: item.quantity,
      lineTotal: Number(product.price) * item.quantity
    };
  });

  const totalAmount = items.reduce((sum, item) => sum + item.lineTotal, 0);

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: session?.user?.id,
          guestName: parsed.data.fullName,
          guestEmail: parsed.data.email.toLowerCase(),
          guestPhone: parsed.data.phone,
          totalAmount,
          paymentMethod: parsed.data.paymentMethod,
          paymentStatus: "PENDING",
          status: "PENDING",
          notes: parsed.data.notes,
          shippingAddress: {
            addressLine1: parsed.data.addressLine1,
            addressLine2: parsed.data.addressLine2,
            city: parsed.data.city,
            state: parsed.data.state,
            pincode: parsed.data.pincode
          },
          items: {
            create: items.map((item) => ({
              productId: item.product.id,
              productName: item.product.name,
              productImage: firstImage(item.product.images),
              price: item.product.price,
              quantity: item.quantity
            }))
          }
        }
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      if (session?.user?.id) {
        await tx.cartItem.deleteMany({ where: { userId: session.user.id } });
      }

      return created;
    });

    return NextResponse.json({ order: { id: order.id, orderNumber: order.orderNumber } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create order";

    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { items: true, customer: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ orders });
}
