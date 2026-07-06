"use client";

import { TriangleAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-coral/10">
        <TriangleAlert size={28} className="text-coral" />
      </div>
      <p className="mb-3 text-xs font-medium text-coral uppercase tracking-[0.2em]">Error</p>
      <h1 className="mb-4 text-3xl font-light text-navy sm:text-4xl">
        Algo salió <span className="font-semibold">mal</span>
      </h1>
      <p className="mb-8 text-sm text-taupe">{error.message || "Ocurrió un error inesperado."}</p>
      <button
        onClick={reset}
        className="cursor-pointer rounded-xl bg-coral px-6 py-2.5 text-sm font-medium text-white shadow-xs shadow-coral/20 transition-all duration-200 hover:bg-coral/90 hover:shadow-sm hover:shadow-coral/25 active:shadow-none"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
