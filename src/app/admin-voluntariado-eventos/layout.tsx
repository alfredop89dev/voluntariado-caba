"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Shield,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { useShallow } from "zustand/react/shallow";
import { ADMIN } from "@/lib/config";
import { useI18n } from "@/lib/i18n/translations-context";

interface NavItem {
  href: string;
  icon: typeof LayoutDashboard;
  i18nKey: string;
  external?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: ADMIN.DASHBOARD_PATH, icon: LayoutDashboard, i18nKey: "admin.nav.dashboard" },
  { href: ADMIN.BASE_PATH, icon: Calendar, i18nKey: "admin.nav.events" },
  { href: "/admin-voluntariado-eventos/voluntarios", icon: Users, i18nKey: "admin.nav.volunteers" },
  { href: "/admin-voluntariado-eventos/usuarios", icon: Shield, i18nKey: "admin.nav.users" },
  { href: "/", icon: ExternalLink, i18nKey: "admin.nav.landing", external: true },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading, username } = useAdminStore(
    useShallow((s) => ({
      isAuthenticated: s.isAuthenticated,
      isLoading: s.isLoading,
      username: s.username,
    })),
  );

  useEffect(() => {
    setMobileOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
    const store = useAdminStore.getState();

    if (pathname === ADMIN.LOGIN_PATH) {
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
          router.replace(ADMIN.LOGIN_PATH);
        }
      })
      .catch(() => {
        store.clearAuth();
        router.replace(ADMIN.LOGIN_PATH);
      });
  }, [pathname, router]);

  if (pathname === ADMIN.LOGIN_PATH) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const sidebarWidth = sidebarOpen ? "w-60" : "w-16";

  const navLinkClasses = (isActive: boolean, collapsed: boolean) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      collapsed ? "justify-center px-0" : ""
    } ${
      isActive
        ? "bg-navy text-white shadow-xs shadow-navy/10"
        : "text-taupe hover:bg-muted/20 hover:text-navy"
    }`;

  const sidebarContent = (
    <>
      <div className={`flex h-16 items-center border-b border-muted/20 ${sidebarOpen ? "justify-between px-5" : "justify-center"}`}>
        {sidebarOpen ? (
          <Link
            href={ADMIN.DASHBOARD_PATH}
            className="text-sm font-semibold tracking-wide text-navy uppercase"
          >
            {t("admin.title")}
          </Link>
        ) : (
          <Link
            href={ADMIN.DASHBOARD_PATH}
            className="flex size-8 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white"
            aria-label="Admin Panel"
          >
            A
          </Link>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = !item.external && pathname === item.href;
          const Icon = item.icon;

          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                className={navLinkClasses(false, !sidebarOpen)}
                title={!sidebarOpen ? t(item.i18nKey) : undefined}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{t(item.i18nKey)}</span>}
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClasses(isActive, !sidebarOpen)}
              title={!sidebarOpen ? t(item.i18nKey) : undefined}
            >
              <Icon size={18} />
              {sidebarOpen && <span>{t(item.i18nKey)}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-muted/20 ${sidebarOpen ? "px-5 py-4" : "px-2 py-4"}`}>
        {sidebarOpen ? (
          <>
            <p className="mb-2 truncate text-xs text-taupe/70">{username}</p>
            <button
              onClick={async () => {
                await fetch("/api/admin/login", { method: "DELETE" });
                useAdminStore.getState().clearAuth();
                router.replace(ADMIN.LOGIN_PATH);
              }}
              className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-coral transition-colors duration-200 hover:bg-coral/5"
            >
              <LogOut size={14} />
              {t("admin.layout.logout")}
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted/30 text-[11px] font-bold text-taupe" title={username ?? ""}>
              {username?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={async () => {
                await fetch("/api/admin/login", { method: "DELETE" });
                useAdminStore.getState().clearAuth();
                router.replace(ADMIN.LOGIN_PATH);
              }}
              className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-coral transition-colors duration-200 hover:bg-coral/5"
              title={t("admin.layout.logout")}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

      <div className={`border-t border-muted/20 ${sidebarOpen ? "px-5 py-3" : "flex justify-center py-3"}`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-taupe transition-colors duration-200 hover:bg-muted/20 hover:text-navy"
          aria-label={sidebarOpen ? "Colapsar sidebar" : "Expandir sidebar"}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-warm">
      <aside
        className={`fixed top-0 left-0 z-30 hidden h-screen flex-col border-r border-muted/30 bg-white transition-all duration-300 lg:flex ${sidebarWidth}`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col border-r border-muted/30 bg-white shadow-lg">
            <div className="flex h-16 items-center justify-between border-b border-muted/20 px-5">
              <Link
                href={ADMIN.DASHBOARD_PATH}
                className="text-sm font-semibold tracking-wide text-navy uppercase"
                onClick={() => setMobileOpen(false)}
              >
                {t("admin.title")}
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-taupe transition-colors hover:bg-muted/20 hover:text-navy"
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {NAV_ITEMS.map((item) => {
                const isActive = !item.external && pathname === item.href;
                const Icon = item.icon;

                if (item.external) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-taupe transition-all duration-200 hover:bg-muted/20 hover:text-navy"
                    >
                      <Icon size={18} />
                      <span>{t(item.i18nKey)}</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-navy text-white shadow-xs shadow-navy/10"
                        : "text-taupe hover:bg-muted/20 hover:text-navy"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{t(item.i18nKey)}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-muted/20 px-5 py-4">
              <p className="mb-2 text-xs text-taupe/70">{username}</p>
              <button
                onClick={async () => {
                  await fetch("/api/admin/login", { method: "DELETE" });
                  useAdminStore.getState().clearAuth();
                  router.replace(ADMIN.LOGIN_PATH);
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-coral transition-colors duration-200 hover:bg-coral/5"
              >
                <LogOut size={14} />
                {t("admin.layout.logout")}
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-60" : "lg:ml-16"}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-muted/20 bg-white/95 backdrop-blur-md px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-taupe transition-colors hover:bg-muted/20 hover:text-navy lg:hidden"
            aria-label="Menú"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-taupe sm:block">{username}</span>
            <div className="flex size-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
              {username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
