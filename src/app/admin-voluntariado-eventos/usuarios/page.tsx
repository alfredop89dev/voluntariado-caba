"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { z } from "zod";
import { useToastStore } from "@/components/ui/toast";

interface UserEntry {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
}

const createUserSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres").max(50),
  password: z.string().min(6, "Mínimo 6 caracteres").max(100),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al cargar datos");
  return res.json();
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const inputClass =
  "w-full rounded-xl border border-muted/40 bg-white px-4 py-2.5 text-sm text-navy outline-none transition-all duration-200 placeholder:text-taupe/50 focus:border-coral/50 focus:ring-2 focus:ring-coral/15";

export default function AdminUsersPage() {
  const addToast = useToastStore((s) => s.addToast);

  const { data: users, error: fetchError, isLoading, mutate } = useSWR<UserEntry[]>(
    "/api/admin/users",
    fetcher,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
  });

  const onCreate = async (data: CreateUserForm) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        addToast(body.error ?? "Error al crear usuario", "error");
        return;
      }

      reset();
      addToast("Usuario creado correctamente", "success");
      mutate();
    } catch {
      addToast("Error de conexión", "error");
    }
  };

  const onDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const body = await res.json();
        addToast(body.error ?? "Error al eliminar usuario", "error");
        return;
      }

      addToast("Usuario eliminado correctamente", "success");
      mutate();
    } catch {
      addToast("Error de conexión", "error");
    }
  };

  return (
    <div>
      <div className="mb-10">
        <p className="mb-2 text-xs font-medium text-coral uppercase tracking-[0.2em]">
          Admin
        </p>
        <h1 className="text-3xl font-light text-navy">
          Gestión de <span className="font-semibold">usuarios</span>
        </h1>
      </div>

      <div className="mb-12 rounded-2xl border border-muted/30 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="mb-6 text-lg font-semibold text-navy">Crear nuevo usuario</h2>

        <form onSubmit={handleSubmit(onCreate)} className="space-y-5" noValidate>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">
                Usuario
              </label>
              <input
                id="username"
                {...register("username")}
                className={inputClass}
              />
              {errors.username && (
                <p className="mt-1.5 text-xs text-coral/90">{errors.username.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={inputClass}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-coral/90">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer rounded-xl bg-coral px-6 py-2.5 text-sm font-medium text-white shadow-xs shadow-coral/20 transition-all duration-200 hover:bg-coral/90 hover:shadow-sm hover:shadow-coral/25 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? "Creando..." : "Crear usuario"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-muted/30 bg-white shadow-xs">
        <div className="border-b border-muted/20 px-6 py-4 sm:px-8">
          <h2 className="text-lg font-semibold text-navy">
            Usuarios ({users?.length ?? 0})
          </h2>
        </div>

        {fetchError && (
          <div className="px-6 py-8 text-center text-sm text-coral">
            Error al cargar usuarios
          </div>
        )}

        {isLoading && (
          <div className="px-6 py-8 text-center text-sm text-taupe">Cargando...</div>
        )}

        {!isLoading && !fetchError && users?.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-taupe">
            No hay usuarios creados aún.
          </div>
        )}

        {!isLoading && users && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-muted/20 text-xs font-medium text-taupe uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium sm:px-8">Usuario</th>
                  <th className="px-6 py-4 font-medium sm:px-8">Rol</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell sm:px-8">Creado</th>
                  <th className="px-6 py-4 font-medium sm:px-8">Acción</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-muted/10 transition-colors hover:bg-muted/10">
                    <td className="px-6 py-4 font-medium text-navy sm:px-8">{user.username}</td>
                    <td className="px-6 py-4 text-taupe sm:px-8">{user.role}</td>
                    <td className="hidden px-6 py-4 text-taupe sm:table-cell sm:px-8">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 sm:px-8">
                      <button
                        onClick={() => onDelete(user.id)}
                        className="cursor-pointer rounded-xl border border-coral/30 px-3 py-1.5 text-xs font-medium text-coral transition-all duration-200 hover:bg-coral/5 hover:shadow-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
