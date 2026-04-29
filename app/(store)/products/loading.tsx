import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-48" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950"
          >
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="mt-4 h-5 w-4/5" />
            <Skeleton className="mt-3 h-4 w-1/2" />
            <Skeleton className="mt-4 h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
