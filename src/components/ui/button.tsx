"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex cursor-pointer items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
    variant === "primary" && "rounded-xl bg-coral text-white shadow-xs shadow-coral/20 hover:bg-coral/90 hover:shadow-sm hover:shadow-coral/25 active:shadow-none",
    variant === "secondary" && "rounded-xl bg-navy text-white shadow-xs shadow-navy/10 hover:bg-navy/90 hover:shadow-sm hover:shadow-navy/15 active:shadow-none",
    variant === "outline" && "rounded-xl border border-muted/50 bg-white text-navy shadow-xs hover:border-muted/80 hover:bg-muted/10 hover:shadow-sm active:shadow-none",
    variant === "ghost" && "rounded-xl text-taupe hover:bg-muted/20 hover:text-navy active:bg-muted/30",
    size === "sm" && "h-9 px-4 text-xs tracking-wider uppercase",
    size === "md" && "h-11 px-6 text-sm tracking-wider uppercase",
    size === "lg" && "h-12 px-8 text-sm tracking-widest uppercase",
    className,
  );

  const shared = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 20, mass: 0.8 }}
      className="inline-flex"
    >
      {href
        ? <a href={href} target={target} rel={rel} className={classes}>{children}</a>
        : <button className={classes} {...props}>{children}</button>}
    </motion.span>
  );

  return shared;
}
