"use client";

import { type ReactNode } from "react";
import { TranslationProvider } from "@/lib/i18n/translations-context";
import { ToastContainer } from "@/components/ui/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      {children}
      <ToastContainer />
    </TranslationProvider>
  );
}
