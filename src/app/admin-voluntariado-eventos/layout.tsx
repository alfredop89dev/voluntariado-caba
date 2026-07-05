"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAdminStore } from "@/stores/admin-store";
import { useShallow } from "zustand/react/shallow";

const NAV_ITEMS = [
  { href: "/admin-voluntariado-eventos/dashboard", label: "Dashboard" },
  { href: "/admin-voluntariado-eventos", label: "Eventos" },
  { href: "/admin-voluntariado-eventos/voluntarios", label: "Voluntarios" },
  { href: "/admin-voluntariado-eventos/usuarios", label: "Usuarios" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading, username } = useAdminStore(
    useShallow((s) => ({
      isAuthenticated: s.isAuthenticated,
      isLoading: s.isLoading,
      username: s.username,
    })),
  );

  useEffect(() => {
    const store = useAdminStore.getState();

    if (pathname === "/admin-voluntariado-eventos/login") {
      store.setLoading(false);
      return;
    }

    fetch("/api/admin/verify")
      .then(async (res) => {
        if (res.ok) {
          const body = await res.json();
          store.setAuth(body.username);
        } else {
          store.clearAuth();
          router.replace("/admin-voluntariado-eventos/login");
        }
      })
      .catch(() => {
        store.clearAuth();
        router.replace("/admin-voluntariado-eventos/login");
      });
  }, [pathname, router]);

  if (pathname === "/admin-voluntariado-eventos/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const sidebarContent = (
    <>
      <div className="flex h-14 items-center border-b border-muted/20 px-6">
        <Link
          href="/admin-voluntariado-eventos/dashboard"
          className="text-sm font-semibold tracking-wide text-navy uppercase"
        >
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-navy text-white shadow-xs shadow-navy/10"
                  : "text-taupe hover:bg-muted/20 hover:text-navy"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-muted/20 px-6 py-4">
        <p className="mb-2 text-xs text-taupe/70">{username}</p>
        <button
          onClick={async () => {
            await fetch("/api/admin/login", { method: "DELETE" });
            useAdminStore.getState().clearAuth();
            router.replace("/admin-voluntariado-eventos/login");
          }}
          className="cursor-pointer text-xs font-medium text-coral transition-colors duration-200 hover:text-coral/80"
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="hidden w-64 flex-col border-r border-muted/30 bg-white lg:flex">
        {sidebarContent}
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-muted/20 bg-white px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-8 cursor-pointer items-center justify-center"
            aria-label="Menú"
          >
            <div className="flex flex-col gap-1">
              <span className={`block h-px w-5 bg-navy transition-all duration-200 ${mobileOpen ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-navy transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px w-5 bg-navy transition-all duration-200 ${mobileOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </div>
          </button>
          <Link
            href="/admin-voluntariado-eventos/dashboard"
            className="text-sm font-semibold tracking-wide text-navy uppercase"
          >
            Admin Panel
          </Link>
          <div className="size-8" />
        </header>

        {mobileOpen && (
          <div className="border-b border-muted/20 bg-white px-3 pb-4 lg:hidden">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-navy text-white shadow-xs shadow-navy/10"
                        : "text-taupe hover:bg-muted/20 hover:text-navy"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={async () => {
                  await fetch("/api/admin/login", { method: "DELETE" });
                  useAdminStore.getState().clearAuth();
                  router.replace("/admin-voluntariado-eventos/login");
                }}
                className="w-full cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm font-medium text-coral transition-colors duration-200 hover:bg-muted/20"
              >
                Cerrar sesión ({username})
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
