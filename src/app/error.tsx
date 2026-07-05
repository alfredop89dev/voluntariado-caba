"use client";

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
        <svg className="size-7 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
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
