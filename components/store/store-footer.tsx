import Link from "next/link";

export function StoreFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-neutral-500 dark:text-neutral-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} Northstar Goods. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/products" className="hover:text-brand-700">
            Products
          </Link>
          <Link href="/cart" className="hover:text-brand-700">
            Cart
          </Link>
          <Link href="/admin/login" className="hover:text-brand-700">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
