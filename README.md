# Art by Dhruvangi E-Commerce Store

A full-stack artist storefront for a professional resin artist and drawing artist. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma ORM, NextAuth credentials auth, Cloudinary uploads, and PostgreSQL in Docker.

## Prerequisites

- Node.js 18.17 or newer
- Docker Desktop
- npm
- A Cloudinary account for admin image/video uploads

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Add Cloudinary credentials to `.env`:

```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. Start PostgreSQL:

```bash
docker-compose up -d
```

5. Generate Prisma Client:

```bash
npx prisma generate
```

6. Create and apply the database migration:

```bash
npx prisma migrate dev --name init
```

7. Seed the artist categories, demo products, and admin account:

```bash
npx prisma db seed
```

8. Start the development server:

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
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name for product media uploads.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.

## Prisma Commands

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
```

## Included Features

- Artist-branded storefront for Art by Dhruvangi with motion, collection colors, masonry browsing, and gallery-style product pages
- Categories: Jewellery, Photo Frame, Paintings, Broche, Portrait, Rakhi, Diwali, Ring Platter
- LocalStorage cart for guests and Prisma-backed cart for logged-in customers
- Guest checkout with Cash on Delivery and online payment placeholder
- Customer registration, login, and order history
- Admin dashboard, products, categories, orders, customers, inline product toggles, status updates, and mobile sidebar
- Cloudinary upload route for product images and video files, with URL fallback in the admin product form
