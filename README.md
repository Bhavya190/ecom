# Northstar Goods E-Commerce Store

A full-stack small business store built with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma ORM, NextAuth credentials auth, and PostgreSQL in Docker.

## Prerequisites

- Node.js 18.17 or newer
- Docker Desktop
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Start PostgreSQL:

```bash
docker-compose up -d
```

4. Generate Prisma Client:

```bash
npx prisma generate
```

5. Create and apply the database migration:

```bash
npx prisma migrate dev --name init
```

6. Seed categories, products, and the admin account:

```bash
npx prisma db seed
```

7. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Admin Login

Seeded admin credentials come from `.env`:

- Email: `admin@example.com`
- Password: `Admin123!`

Admin sign-in is available at `http://localhost:3000/admin/login`.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string. The Docker default is `postgresql://shopuser:shoppassword@localhost:5432/shopdb?schema=public`.
- `NEXTAUTH_SECRET`: Secret used to sign NextAuth JWT sessions. Use a long random value in production.
- `NEXTAUTH_URL`: Public app URL. Use `http://localhost:3000` locally.
- `ADMIN_EMAIL`: Email for the seeded admin user.
- `ADMIN_PASSWORD`: Password for the seeded admin user.

## Prisma Commands

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
```

## Included Features

- Public storefront with hero, featured products, categories, new arrivals, product search/filter/sort, product details with image gallery and optional video
- LocalStorage cart for guests and Prisma-backed cart for logged-in customers
- Guest checkout with Cash on Delivery and online payment placeholder
- Customer registration, login, and order history
- Admin dashboard, products, categories, orders, customers, inline product toggles, status updates, and mobile sidebar
- PostgreSQL Docker Compose setup, Prisma schema, seed data, and NextAuth credentials authentication
