import { StoreFooter } from "@/components/store/store-footer";
import { StoreNavbar } from "@/components/store/store-navbar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <StoreNavbar />
      <main>{children}</main>
      <StoreFooter />
    </div>
  );
}
