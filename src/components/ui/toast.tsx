"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useToastStore, type ToastType } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

const iconMap: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "pointer-events-auto flex max-w-xs items-center gap-3 rounded-xl px-4 py-3 shadow-lg ring-1 backdrop-blur-xs",
              toast.type === "success" && "bg-emerald-50 text-emerald-800 ring-emerald-200",
              toast.type === "error" && "bg-red-50 text-red-800 ring-red-200",
              toast.type === "info" && "bg-navy text-white ring-navy/20",
            )}
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {iconMap[toast.type]}
            </span>
            <p className="text-sm leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto cursor-pointer text-current/50 transition-colors hover:text-current"
              aria-label="Cerrar"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export { useToastStore };
