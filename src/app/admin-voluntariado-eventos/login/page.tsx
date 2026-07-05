"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import { useAdminStore } from "@/stores/admin-store";
import { ADMIN } from "@/lib/config";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginForm = z.infer<typeof loginSchema>;

const inputClass =
  "w-full rounded-xl border border-muted/30 bg-white/90 px-4 py-2.5 text-sm text-navy outline-none transition-all duration-200 placeholder:text-taupe/40 focus:border-coral/40 focus:bg-white focus:ring-2 focus:ring-coral/10";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setAuth } = useAdminStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Error al iniciar sesión");
        return;
      }

      const body = await res.json();
      setAuth(body.username);
      router.push(ADMIN.DASHBOARD_PATH);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-white/10 bg-white/95 p-8 shadow-lg shadow-black/10 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-coral/10">
              <Lock size={20} className="text-coral" />
            </div>
            <p className="mb-1 text-xs font-medium text-coral uppercase tracking-[0.2em]">
              Admin
            </p>
            <h1 className="text-2xl font-light text-navy">
              Iniciar <span className="font-semibold">sesión</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-xl border border-coral/20 bg-coral/5 px-4 py-3 text-xs text-coral"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]"
              >
                Usuario
              </label>
              <input
                id="username"
                {...register("username")}
                className={inputClass}
                autoComplete="username"
                placeholder="tu usuario"
              />
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-coral/90"
                >
                  {errors.username.message}
                </motion.p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`${inputClass} pr-10`}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-taupe transition-colors hover:text-navy"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-coral/90"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-coral px-6 py-2.5 text-sm font-medium text-white shadow-xs shadow-coral/20 transition-all duration-200 hover:bg-coral/90 hover:shadow-sm hover:shadow-coral/25 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
