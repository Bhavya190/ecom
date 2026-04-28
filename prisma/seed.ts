import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

const toSlug = (value: string) =>
  slugify(value, { lower: true, strict: true, trim: true });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      password: await bcrypt.hash(adminPassword, 12)
    },
    create: {
      email: adminEmail,
      name: "Store Admin",
      role: Role.ADMIN,
      password: await bcrypt.hash(adminPassword, 12)
    }
  });

  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      image: "https://picsum.photos/seed/electronics/600/600"
    }
  });

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: {
      name: "Clothing",
      slug: "clothing",
      image: "https://picsum.photos/seed/clothing/600/600"
    }
  });

  const products = [
    {
      name: "NovaBass Wireless Headphones",
      description:
        "Comfortable over-ear wireless headphones with deep bass, soft cushions, and all-day battery life.",
      price: 89.99,
      comparePrice: 129.99,
      stock: 18,
      categoryId: electronics.id,
      isFeatured: true
    },
    {
      name: "AeroCharge 20000mAh Power Bank",
      description:
        "Slim portable charger with fast USB-C output, dual-device charging, and travel-ready capacity.",
      price: 54.5,
      comparePrice: 69.99,
      stock: 24,
      categoryId: electronics.id,
      isFeatured: false
    },
    {
      name: "LumiDesk Smart LED Lamp",
      description:
        "Adjustable desk lamp with touch dimming, warm-to-cool light modes, and a compact base.",
      price: 42,
      comparePrice: 58,
      stock: 4,
      categoryId: electronics.id,
      isFeatured: true,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
      name: "Everyday Cotton Tee",
      description:
        "Soft breathable cotton T-shirt with a relaxed fit made for daily wear and easy layering.",
      price: 24,
      comparePrice: 32,
      stock: 35,
      categoryId: clothing.id,
      isFeatured: true
    },
    {
      name: "Urban Trail Jacket",
      description:
        "Lightweight water-resistant jacket with a clean silhouette, zip pockets, and breathable lining.",
      price: 118,
      comparePrice: 148,
      stock: 9,
      categoryId: clothing.id,
      isFeatured: false
    },
    {
      name: "Harbor Linen Shirt",
      description:
        "Airy linen-blend button-down shirt with a crisp collar, natural texture, and coastal feel.",
      price: 64,
      comparePrice: 78,
      stock: 16,
      categoryId: clothing.id,
      isFeatured: true
    }
  ];

  for (const product of products) {
    const slug = toSlug(product.name);
    await prisma.product.upsert({
      where: { slug },
      update: {
        ...product,
        images: [
          `https://picsum.photos/seed/${slug}/600/600`,
          `https://picsum.photos/seed/${slug}-alt/600/600`
        ],
        isActive: true
      },
      create: {
        ...product,
        slug,
        images: [
          `https://picsum.photos/seed/${slug}/600/600`,
          `https://picsum.photos/seed/${slug}-alt/600/600`
        ],
        isActive: true
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
