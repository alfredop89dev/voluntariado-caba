"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { z } from "zod";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImagePreview } from "@/components/ui/image-preview";
import type { IEventData } from "@/lib/models/event";

const eventFormSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200),
  organizer: z.string().max(100).optional().or(z.literal("")),
  image: z.string().url("URL inválida").optional().or(z.literal("")),
  date: z.string().min(1, "La fecha es obligatoria"),
  time: z.string().optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  flyer: z.string().url("URL inválida").optional().or(z.literal("")),
  logo: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram: z.string().max(200).optional().or(z.literal("")),
  googleMaps: z.string().url("URL inválida").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
});

type EventFormData = z.infer<typeof eventFormSchema>;

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

export default function AdminEventsPage() {
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<IEventData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, error: fetchError, isLoading, mutate } = useSWR<IEventData[]>(
    "/api/admin/events",
    fetcher,
  );

  const filteredEvents = useMemo(
    () =>
      (events ?? []).filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.organizer ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.location ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [events, searchQuery],
  );

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
  });

  const editForm = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
  });

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = form;

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    watch: watchEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
  } = editForm;

  const startEditing = (event: IEventData) => {
    setEditingEvent(event);
    setValueEdit("title", event.title);
    setValueEdit("organizer", event.organizer ?? "");
    setValueEdit("date", new Date(event.date).toISOString().split("T")[0]);
    setValueEdit("time", event.time ?? "");
    setValueEdit("location", event.location ?? "");
    setValueEdit("description", event.description ?? "");
    setValueEdit("flyer", event.flyer ?? "");
    setValueEdit("image", event.image ?? "");
    setValueEdit("logo", event.logo ?? "");
    setValueEdit("instagram", event.instagram ?? "");
    setValueEdit("googleMaps", event.googleMaps ?? "");
    setValueEdit("phone", event.phone ?? "");
  };

  const cancelEditing = () => {
    setEditingEvent(null);
    resetEdit();
  };

  const onCreate = async (data: EventFormData) => {
    setCreateError(null);
    setSuccessMessage(null);

    try {
      const dateObj = new Date(data.date);
      const body = Object.fromEntries(
        Object.entries({ ...data, date: dateObj.toISOString() }).filter(([, v]) => v !== ""),
      ) as Record<string, unknown>;

      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const body = await res.json();
        setCreateError(body.error ?? "Error al crear evento");
        return;
      }

      reset();
      setSuccessMessage("Evento creado correctamente");
      mutate();
    } catch {
      setCreateError("Error de conexión");
    }
  };

  const onUpdate = async (data: EventFormData) => {
    if (!editingEvent) return;
    setCreateError(null);
    setSuccessMessage(null);

    try {
      const dateObj = new Date(data.date);
      const body = Object.fromEntries(
        Object.entries({ ...data, date: dateObj.toISOString() }).filter(([, v]) => v !== ""),
      ) as Record<string, unknown>;

      const res = await fetch(`/api/admin/events/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const body = await res.json();
        setCreateError(body.error ?? "Error al actualizar evento");
        return;
      }

      cancelEditing();
      setSuccessMessage("Evento actualizado correctamente");
      mutate();
    } catch {
      setCreateError("Error de conexión");
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/admin/events/${deleteTarget}`, { method: "DELETE" });

      if (!res.ok) {
        const body = await res.json();
        setDeleteError(body.error ?? "Error al eliminar evento");
        return;
      }

      setDeleteTarget(null);
      setSuccessMessage("Evento eliminado correctamente");
      mutate();
    } catch {
      setDeleteError("Error de conexión");
    }
  };

  return (
    <div>
      <div className="mb-10">
        <p className="mb-2 text-xs font-medium text-coral uppercase tracking-[0.2em]">
          Admin
        </p>
        <h1 className="text-3xl font-light text-navy">
          Gestión de <span className="font-semibold">eventos</span>
        </h1>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
          {successMessage}
        </div>
      )}

      {deleteError && (
        <div className="mb-6 rounded-xl border border-coral/20 bg-coral/5 px-4 py-3 text-xs text-coral">
          {deleteError}
        </div>
      )}

      {createError && (
        <div className="mb-6 rounded-xl border border-coral/20 bg-coral/5 px-4 py-3 text-xs text-coral">
          {createError}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar evento"
        message="¿Estás seguro? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={onDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {editingEvent ? (
        <div className="mb-12 rounded-2xl border border-muted/30 bg-white p-6 shadow-xs sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Editar evento</h2>
            <button
              onClick={cancelEditing}
              className="cursor-pointer rounded-xl border border-muted/40 px-3 py-1.5 text-xs font-medium text-taupe transition-all duration-200 hover:border-muted/70 hover:text-navy"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmitEdit(onUpdate)} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Título</label>
                <input {...registerEdit("title")} className={inputClass} />
                {errorsEdit.title && <p className="mt-1.5 text-xs text-coral/90">{errorsEdit.title.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Organizador</label>
                <input {...registerEdit("organizer")} className={inputClass} />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Fecha</label>
                <input type="date" {...registerEdit("date")} className={inputClass} />
                {errorsEdit.date && <p className="mt-1.5 text-xs text-coral/90">{errorsEdit.date.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Hora</label>
                <input type="time" {...registerEdit("time")} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Ubicación</label>
              <input {...registerEdit("location")} className={inputClass} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Descripción</label>
              <textarea rows={3} {...registerEdit("description")} className={`${inputClass} resize-none`} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Flyer (URL)</label>
                <input {...registerEdit("flyer")} className={inputClass} />
                {watchEdit("flyer") && <ImagePreview url={watchEdit("flyer")!} />}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Imagen (URL)</label>
                <input {...registerEdit("image")} className={inputClass} />
                {watchEdit("image") && <ImagePreview url={watchEdit("image")!} />}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Logo (URL)</label>
                <input {...registerEdit("logo")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Instagram</label>
                <input {...registerEdit("instagram")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Teléfono</label>
                <input {...registerEdit("phone")} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Google Maps (URL)</label>
              <input {...registerEdit("googleMaps")} className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={isSubmittingEdit}
              className="cursor-pointer rounded-xl bg-navy px-6 py-2.5 text-sm font-medium text-white shadow-xs shadow-navy/10 transition-all duration-200 hover:bg-navy/90 hover:shadow-sm hover:shadow-navy/15 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmittingEdit ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-12 rounded-2xl border border-muted/30 bg-white p-6 shadow-xs sm:p-8">
          <h2 className="mb-6 text-lg font-semibold text-navy">Crear nuevo evento</h2>

          <form onSubmit={handleSubmit(onCreate)} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Título</label>
                <input {...register("title")} className={inputClass} />
                {errors.title && <p className="mt-1.5 text-xs text-coral/90">{errors.title.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Organizador</label>
                <input {...register("organizer")} className={inputClass} />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Fecha</label>
                <input type="date" {...register("date")} className={inputClass} />
                {errors.date && <p className="mt-1.5 text-xs text-coral/90">{errors.date.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Hora</label>
                <input type="time" {...register("time")} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Ubicación</label>
              <input {...register("location")} className={inputClass} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Descripción</label>
              <textarea rows={3} {...register("description")} className={`${inputClass} resize-none`} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Flyer (URL)</label>
                <input {...register("flyer")} className={inputClass} />
                {watch("flyer") && <ImagePreview url={watch("flyer")!} />}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Imagen (URL)</label>
                <input {...register("image")} className={inputClass} />
                {watch("image") && <ImagePreview url={watch("image")!} />}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Logo (URL)</label>
                <input {...register("logo")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Instagram</label>
                <input {...register("instagram")} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Teléfono</label>
                <input {...register("phone")} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">Google Maps (URL)</label>
              <input {...register("googleMaps")} className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl bg-coral px-6 py-2.5 text-sm font-medium text-white shadow-xs shadow-coral/20 transition-all duration-200 hover:bg-coral/90 hover:shadow-sm hover:shadow-coral/25 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? "Creando..." : "Crear evento"}
            </button>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-muted/30 bg-white shadow-xs">
        <div className="border-b border-muted/20 px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-navy">
              Eventos existentes ({filteredEvents.length})
            </h2>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-taupe/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar eventos..."
                className="w-56 rounded-xl border border-muted/40 bg-white py-2 pl-9 pr-4 text-xs text-navy outline-none transition-all duration-200 placeholder:text-taupe/50 focus:border-coral/50 focus:ring-2 focus:ring-coral/15"
              />
            </div>
          </div>
        </div>

        {fetchError && (
          <div className="px-6 py-8 text-center text-sm text-coral">
            Error al cargar eventos
          </div>
        )}

        {isLoading && (
          <div className="px-6 py-8 text-center text-sm text-taupe">Cargando...</div>
        )}

        {!isLoading && !fetchError && filteredEvents.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-taupe">
            {searchQuery ? "No se encontraron eventos con ese criterio." : "No hay eventos creados aún."}
          </div>
        )}

        {!isLoading && filteredEvents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-muted/20 text-xs font-medium text-taupe uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium sm:px-8">Título</th>
                  <th className="px-6 py-4 font-medium sm:px-8">Organizador</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell sm:px-8">Fecha</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell sm:px-8">Hora</th>
                  <th className="px-6 py-4 font-medium sm:px-8">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-muted/10 transition-colors hover:bg-muted/10">
                    <td className="px-6 py-4 font-medium text-navy sm:px-8">{event.title}</td>
                    <td className="px-6 py-4 text-taupe sm:px-8">{event.organizer ?? "—"}</td>
                    <td className="hidden px-6 py-4 text-taupe sm:table-cell sm:px-8">{formatDate(event.date)}</td>
                    <td className="hidden px-6 py-4 text-taupe sm:table-cell sm:px-8">{event.time ?? "—"}</td>
                    <td className="px-6 py-4 sm:px-8">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(event)}
                          className="cursor-pointer rounded-xl border border-muted/40 px-3 py-1.5 text-xs font-medium text-navy transition-all duration-200 hover:bg-muted/20 hover:shadow-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteTarget(event.id)}
                          className="cursor-pointer rounded-xl border border-coral/30 px-3 py-1.5 text-xs font-medium text-coral transition-all duration-200 hover:bg-coral/5 hover:shadow-xs"
                        >
                          Eliminar
                        </button>
                      </div>
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
