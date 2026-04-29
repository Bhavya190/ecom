import { StoreFooter } from "@/components/store/store-footer";
import { StoreNavbar } from "@/components/store/store-navbar";
import { StoreTransition } from "@/components/store/store-transition";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-charcoal dark:bg-neutral-950 dark:text-neutral-50">
      <StoreNavbar />
      <main>
        <StoreTransition>{children}</StoreTransition>
      </main>
      <StoreFooter />
    </div>
  );
}
