"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImagePreview } from "@/components/ui/image-preview";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToastStore } from "@/components/ui/toast";
import type { IEventData } from "@/lib/models/event";
import { ADMIN } from "@/lib/config";

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

type FormCtx = ReturnType<typeof useForm<EventFormData>>;

function EventForm({
  form,
  onSubmit,
  submitLabel,
}: {
  form: FormCtx;
  onSubmit: (data: EventFormData) => Promise<void>;
  submitLabel: string;
}) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
        <div className="space-y-3">
          <ImageUpload
            value={watch("flyer") ?? ""}
            onChange={(url) => form.setValue("flyer", url)}
            label="Flyer"
          />
          <input {...register("flyer")} placeholder="O ingresá una URL" className={inputClass} />
          {watch("flyer") && <ImagePreview url={watch("flyer")!} />}
        </div>
        <div className="space-y-3">
          <ImageUpload
            value={watch("image") ?? ""}
            onChange={(url) => form.setValue("image", url)}
            label="Imagen"
          />
          <input {...register("image")} placeholder="O ingresá una URL" className={inputClass} />
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
        {isSubmitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

export default function AdminEventsPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<IEventData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const createForm = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
  });

  const editForm = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
  });

  const openCreateModal = () => {
    createForm.reset();
    setShowCreateModal(true);
  };

  const startEditing = (event: IEventData) => {
    setEditingEvent(event);
    editForm.setValue("title", event.title);
    editForm.setValue("organizer", event.organizer ?? "");
    editForm.setValue("date", new Date(event.date).toISOString().split("T")[0]);
    editForm.setValue("time", event.time ?? "");
    editForm.setValue("location", event.location ?? "");
    editForm.setValue("description", event.description ?? "");
    editForm.setValue("flyer", event.flyer ?? "");
    editForm.setValue("image", event.image ?? "");
    editForm.setValue("logo", event.logo ?? "");
    editForm.setValue("instagram", event.instagram ?? "");
    editForm.setValue("googleMaps", event.googleMaps ?? "");
    editForm.setValue("phone", event.phone ?? "");
  };

  const onCreate = async (data: EventFormData) => {
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
        const err = await res.json();
        addToast(err.error ?? "Error al crear evento", "error");
        return;
      }

      createForm.reset();
      setShowCreateModal(false);
      addToast("Evento creado correctamente", "success");
      mutate();
    } catch {
      addToast("Error de conexión", "error");
    }
  };

  const onUpdate = async (data: EventFormData) => {
    if (!editingEvent) return;

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
        const err = await res.json();
        addToast(err.error ?? "Error al actualizar evento", "error");
        return;
      }

      setEditingEvent(null);
      editForm.reset();
      addToast("Evento actualizado correctamente", "success");
      mutate();
    } catch {
      addToast("Error de conexión", "error");
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/admin/events/${deleteTarget}`, { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json();
        addToast(err.error ?? "Error al eliminar evento", "error");
        return;
      }

      setDeleteTarget(null);
      addToast("Evento eliminado correctamente", "success");
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
          Gestión de <span className="font-semibold">eventos</span>
        </h1>
      </div>

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

      <Modal open={showCreateModal} title="Crear nuevo evento" onClose={() => setShowCreateModal(false)}>
        <EventForm form={createForm} onSubmit={onCreate} submitLabel="Crear evento" />
      </Modal>

      <Modal
        open={!!editingEvent}
        title="Editar evento"
        onClose={() => { setEditingEvent(null); editForm.reset(); }}
      >
        <EventForm form={editForm} onSubmit={onUpdate} submitLabel="Guardar cambios" />
      </Modal>

      <div className="rounded-2xl border border-muted/30 bg-white shadow-xs">
        <div className="border-b border-muted/20 px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-navy">
              Eventos existentes ({filteredEvents.length})
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-taupe/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar eventos..."
                  className="w-48 rounded-xl border border-muted/40 bg-white py-2 pl-9 pr-4 text-xs text-navy outline-none transition-all duration-200 placeholder:text-taupe/50 focus:border-coral/50 focus:ring-2 focus:ring-coral/15 sm:w-56"
                />
              </div>
              <button
                onClick={openCreateModal}
                className="cursor-pointer rounded-xl bg-coral px-4 py-2 text-xs font-medium text-white shadow-xs shadow-coral/20 transition-all duration-200 hover:bg-coral/90 hover:shadow-sm hover:shadow-coral/25 active:shadow-none"
              >
                Crear evento
              </button>
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
