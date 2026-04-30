import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

const toSlug = (value: string) =>
  slugify(value, { lower: true, strict: true, trim: true });

const categories = [
  "Jewellery",
  "Photo Frame",
  "Paintings",
  "Broche",
  "Portrait",
  "Rakhi",
  "Diwali",
  "Ring Platter"
];

const legacyDemoProductSlugs = [
  "novabass-wireless-headphones",
  "aerocharge-20000mah-power-bank",
  "lumidesk-smart-led-lamp",
  "everyday-cotton-tee",
  "urban-trail-jacket",
  "harbor-linen-shirt"
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@artbydruvangi.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Druvangi123!";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      password: await bcrypt.hash(adminPassword, 12)
    },
    create: {
      email: adminEmail,
      name: "Dhruvangi Admin",
      role: Role.ADMIN,
      password: await bcrypt.hash(adminPassword, 12)
    }
  });

  await prisma.product.deleteMany({
    where: { slug: { in: legacyDemoProductSlugs } }
  });

  for (const legacySlug of ["electronics", "clothing"]) {
    const legacyCategory = await prisma.category.findUnique({
      where: { slug: legacySlug },
      include: { _count: { select: { products: true } } }
    });

    if (legacyCategory && legacyCategory._count.products === 0) {
      await prisma.category.delete({ where: { id: legacyCategory.id } });
    }
  }

  const categoryRecords = new Map<string, { id: string }>();

  for (const name of categories) {
    const slug = toSlug(name);
    const category = await prisma.category.upsert({
      where: { slug },
      update: {
        name,
        image: `https://picsum.photos/seed/${slug}/600/400`
      },
      create: {
        name,
        slug,
        image: `https://picsum.photos/seed/${slug}/600/400`
      }
    });

    categoryRecords.set(slug, category);
  }

  const products = [
    {
      name: "Rose Petal Resin Pendant",
      description:
        "A delicate handmade pendant with preserved floral tones, soft shimmer, and a glossy resin finish.",
      price: 2656,
      comparePrice: 3486,
      stock: 12,
      categorySlug: "jewellery",
      isFeatured: true
    },
    {
      name: "Ocean Bloom Resin Earrings",
      description:
        "Lightweight resin earrings inspired by ocean colors, tiny blooms, and gold-flecked details.",
      price: 2324,
      comparePrice: 2988,
      stock: 18,
      categorySlug: "jewellery",
      isFeatured: true
    },
    {
      name: "Lavender Resin Flow Canvas",
      description:
        "A dreamy abstract resin painting with lavender, blush, mint, and metallic gold movement.",
      price: 12035,
      comparePrice: 14940,
      stock: 3,
      categorySlug: "paintings",
      isFeatured: true
    },
    {
      name: "Golden Tide Mini Painting",
      description:
        "A small resin art panel with layered waves, pearlescent texture, and warm gold accents.",
      price: 6474,
      comparePrice: 7968,
      stock: 5,
      categorySlug: "paintings",
      isFeatured: false
    },
    {
      name: "Charcoal Portrait Study",
      description:
        "A demo portrait artwork showcasing expressive line work, soft shading, and personal detail.",
      price: 9960,
      comparePrice: 12450,
      stock: 4,
      categorySlug: "portrait",
      isFeatured: true
    },
    {
      name: "Custom Couple Portrait Demo",
      description:
        "A warm sample portrait piece for custom gifting, anniversaries, and personal keepsakes.",
      price: 13695,
      comparePrice: 17430,
      stock: 2,
      categorySlug: "portrait",
      isFeatured: false
    }
  ];

  for (const product of products) {
    const slug = toSlug(product.name);
    const category = categoryRecords.get(product.categorySlug);

    if (!category) {
      throw new Error(`Missing category ${product.categorySlug}`);
    }

    await prisma.product.upsert({
      where: { slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        stock: product.stock,
        categoryId: category.id,
        isFeatured: product.isFeatured,
        images: [
          `https://picsum.photos/seed/${slug}/600/600`,
          `https://picsum.photos/seed/${slug}-detail/600/600`
        ],
        isActive: true
      },
      create: {
        name: product.name,
        slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        stock: product.stock,
        categoryId: category.id,
        isFeatured: product.isFeatured,
        images: [
          `https://picsum.photos/seed/${slug}/600/600`,
          `https://picsum.photos/seed/${slug}-detail/600/600`
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
