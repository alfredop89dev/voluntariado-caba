import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-muted/20">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
          <Skeleton className="h-3 w-32" />
        </div>
      </header>

      <section className="flex min-h-[55dvh] items-center justify-center">
        <div className="w-full max-w-5xl px-6">
          <Skeleton className="mx-auto mb-4 h-3 w-48" />
          <Skeleton className="mx-auto h-10 w-3/4 max-w-lg" />
        </div>
      </section>

      <main className="flex-1 px-6 py-16 sm:py-20">
        <article className="mx-auto max-w-2xl">
          <div className="mb-8 flex flex-wrap gap-3">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="mt-10 flex gap-3">
            <Skeleton className="h-11 w-40 rounded-xl" />
            <Skeleton className="h-11 w-28 rounded-xl" />
          </div>
        </article>
      </main>
    </div>
  );
}
