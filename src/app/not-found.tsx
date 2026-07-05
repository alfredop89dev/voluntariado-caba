import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted/20">
        <span className="text-2xl font-bold text-taupe/50">?</span>
      </div>
      <p className="mb-3 text-xs font-medium text-coral uppercase tracking-[0.2em]">404</p>
      <h1 className="mb-4 text-3xl font-light text-navy sm:text-4xl">
        Página no <span className="font-semibold">encontrada</span>
      </h1>
      <p className="mb-8 text-sm text-taupe">La página que buscas no existe o fue eliminada.</p>
      <Link
        href="/"
        className="inline-flex cursor-pointer items-center rounded-xl bg-navy px-6 py-2.5 text-sm font-medium text-white shadow-xs shadow-navy/10 transition-all duration-200 hover:bg-navy/90 hover:shadow-sm hover:shadow-navy/15 active:shadow-none"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
