"use client";

import { motion, AnimatePresence } from "motion/react";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-muted/30 bg-white p-6 shadow-lg"
          >
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
              <TriangleAlert size={20} />
            </div>
            <h3 className="mb-1 text-base font-semibold text-navy">{title}</h3>
            <p className="mb-6 text-sm text-taupe">{message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="cursor-pointer rounded-xl border border-muted/40 px-4 py-2 text-xs font-medium text-taupe transition-all duration-200 hover:border-muted/70 hover:text-navy"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-medium text-white shadow-xs transition-all duration-200 hover:shadow-sm active:shadow-none ${
                  variant === "danger"
                    ? "bg-coral shadow-coral/20 hover:bg-coral/90 hover:shadow-coral/25"
                    : "bg-navy shadow-navy/10 hover:bg-navy/90 hover:shadow-navy/15"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
