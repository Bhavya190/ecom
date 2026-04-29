import Link from "next/link";

type EmptyStateProps = {
  title: string;
  message: string;
  href?: string;
  action?: string;
};

export function EmptyState({ title, message, href, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
      <h2 className="text-xl font-semibold text-neutral-950">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm text-neutral-500">
        {message}
      </p>
      {href && action ? (
        <Link
          href={href}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          {action}
        </Link>
      ) : null}
    </div>
  );
}
