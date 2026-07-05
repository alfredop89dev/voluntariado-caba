"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useUiStore } from "@/stores/ui-store";
import { NAV_LINKS } from "@/lib/config";
import { useI18n } from "@/lib/i18n/translations-context";

export function Header() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();
  const { t } = useI18n();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-muted/20 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="cursor-pointer text-white transition-colors duration-200 hover:text-white/70"
          onClick={closeMobileMenu}
          aria-label={t("nav.calendario")}
        >
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <ellipse cx="12" cy="12" rx="4" ry="10" />
            <path d="M2 12h20" />
          </svg>
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-medium text-taupe uppercase tracking-[0.15em] sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer transition-colors duration-200 hover:text-navy"
            >
              {t(`nav.${link.label.toLowerCase()}`)}
            </Link>
          ))}
        </nav>

        <button
          onClick={toggleMobileMenu}
          className="flex size-8 cursor-pointer items-center justify-center sm:hidden"
          aria-label={t("nav.calendario")}
        >
          <div className="flex flex-col gap-1">
            <span className={`block h-px w-5 bg-navy transition-all duration-200 ${isMobileMenuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-navy transition-all duration-200 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-navy transition-all duration-200 ${isMobileMenuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-muted/20 bg-white/95 backdrop-blur-md sm:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="cursor-pointer text-sm font-medium text-taupe transition-colors duration-200 hover:text-navy"
                >
              {t(`nav.${link.label.toLowerCase()}`)}
            </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
