"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminStore } from "@/stores/admin-store";

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginForm = z.infer<typeof loginSchema>;

const inputClass =
  "w-full rounded-xl border border-muted/40 bg-white px-4 py-2.5 text-sm text-navy outline-none transition-all duration-200 placeholder:text-taupe/50 focus:border-coral/50 focus:ring-2 focus:ring-coral/15";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      router.push("/admin-voluntariado-eventos/dashboard");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/30 to-white px-6">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-muted/30 bg-white p-8 shadow-xs">
          <div className="mb-8 text-center">
            <p className="mb-1 text-xs font-medium text-coral uppercase tracking-[0.2em]">
              Admin
            </p>
            <h1 className="text-2xl font-light text-navy">
              Iniciar <span className="font-semibold">sesión</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {error && (
              <div className="rounded-xl border border-coral/20 bg-coral/5 px-4 py-3 text-xs text-coral">
                {error}
              </div>
            )}

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
              />
              {errors.username && (
                <p className="mt-1.5 text-xs text-coral/90">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={inputClass}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-coral/90">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-xl bg-navy px-6 py-2.5 text-sm font-medium text-white shadow-xs shadow-navy/10 transition-all duration-200 hover:bg-navy/90 hover:shadow-sm hover:shadow-navy/15 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
