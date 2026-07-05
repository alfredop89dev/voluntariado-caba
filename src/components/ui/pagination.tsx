"use client";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-14 flex items-center justify-center gap-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={cn(
          "rounded-xl border border-muted/40 px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-200",
          currentPage === 0
            ? "cursor-not-allowed text-taupe/30"
            : "cursor-pointer text-taupe hover:border-muted/70 hover:bg-white hover:text-navy hover:shadow-xs",
        )}
      >
        Anterior
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-xl text-xs font-medium transition-all duration-200",
              i === currentPage
                ? "bg-navy text-white shadow-xs shadow-navy/10"
                : "text-taupe hover:bg-white hover:text-navy hover:shadow-xs",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={cn(
          "rounded-xl border border-muted/40 px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-200",
          currentPage === totalPages - 1
            ? "cursor-not-allowed text-taupe/30"
            : "cursor-pointer text-taupe hover:border-muted/70 hover:bg-white hover:text-navy hover:shadow-xs",
        )}
      >
        Siguiente
      </button>
    </div>
  );
}
