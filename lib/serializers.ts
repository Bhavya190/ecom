import type { Category, Order, OrderItem, Product, User } from "@prisma/client";

export function serializeProduct(
  product: Product & { category?: Category | null; _count?: { orderItems?: number } }
) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    stock: product.stock,
    images: product.images,
    videoUrl: product.videoUrl,
    categoryId: product.categoryId,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
          image: product.category.image
        }
      : null,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

export function serializeOrder(
  order: Order & {
    customer?: User | null;
    items?: (OrderItem & { product?: Product | null })[];
  }
) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerId: order.customerId,
    customer: order.customer
      ? {
          id: order.customer.id,
          name: order.customer.name,
          email: order.customer.email
        }
      : null,
    guestName: order.guestName,
    guestEmail: order.guestEmail,
    guestPhone: order.guestPhone,
    totalAmount: Number(order.totalAmount),
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    shippingAddress: order.shippingAddress,
    notes: order.notes,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items:
      order.items?.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: Number(item.price),
        quantity: item.quantity
      })) ?? []
  };
}
