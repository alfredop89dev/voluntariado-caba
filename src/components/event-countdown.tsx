"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";

interface EventCountdownProps {
  date: Date;
  time?: string;
  variant?: "default" | "hero";
}

function getTimeRemaining(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return { days, hours, minutes, seconds, expired: false };
}

export function EventCountdown({ date, time, variant = "default" }: EventCountdownProps) {
  const target = useMemo(() => {
    const d = new Date(date);
    if (time) {
      const [h, m] = time.split(":").map(Number);
      d.setHours(h, m, 0, 0);
    }
    return d;
  }, [date, time]);

  const [remaining, setRemaining] = useState(() => getTimeRemaining(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getTimeRemaining(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (remaining.expired) return null;

  const units = [
    { value: remaining.days, label: "días" },
    { value: remaining.hours, label: "horas" },
    { value: remaining.minutes, label: "min" },
    { value: remaining.seconds, label: "seg" },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex flex-col items-center">
          <motion.span
            key={unit.value}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`text-2xl font-bold sm:text-3xl ${variant === "hero" ? "text-white" : "text-navy"}`}
          >
            {String(unit.value).padStart(2, "0")}
          </motion.span>
          <span className={`mt-0.5 text-[10px] font-medium uppercase tracking-wider ${variant === "hero" ? "text-white/50" : "text-taupe"}`}>
            {unit.label}
          </span>
          {i < units.length - 1 && (
            <span className={`hidden text-lg font-bold sm:block ${variant === "hero" ? "text-white/20" : "text-muted"}`}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}
