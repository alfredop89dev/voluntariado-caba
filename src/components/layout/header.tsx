"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useUiStore } from "@/stores/ui-store";
import { SECTION_IDS, ADMIN } from "@/lib/config";
import { useI18n } from "@/lib/i18n/translations-context";
import { useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  if (isAdmin) return null;

  const navItems = [
    { href: `#${SECTION_IDS.calendario}`, label: t("nav.calendario") },
    { href: `#${SECTION_IDS.voluntariado}`, label: t("nav.voluntariado") },
    { href: `#${SECTION_IDS.donaciones}`, label: t("nav.donaciones") },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className="border-b border-white/10 bg-navy/95 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white transition-opacity hover:opacity-80"
            aria-label="Red de Voluntarios"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-coral/20">
              <Globe size={18} className="text-coral" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-white/90">
              Voluntarios CABA
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-2 text-[13px] font-medium tracking-wide text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="mx-3 h-5 w-px bg-white/10" />
            <Link
              href={ADMIN.LOGIN_PATH}
              className="rounded-lg px-4 py-2 text-[13px] font-medium tracking-wide text-coral/80 transition-all duration-200 hover:bg-coral/10 hover:text-coral"
            >
              Admin
            </Link>
          </nav>

          <button
            onClick={toggleMobileMenu}
            className="flex size-10 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-white/10 md:hidden"
            aria-label="Menú"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block h-px w-5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px w-5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-b border-white/10 bg-navy/95 backdrop-blur-lg md:hidden"
          >
            <nav className="space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-white/10" />
              <Link
                href={ADMIN.LOGIN_PATH}
                onClick={closeMobileMenu}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-coral/80 transition-all duration-200 hover:bg-coral/10 hover:text-coral"
              >
                Admin
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
