"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { Search } from "lucide-react";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImagePreview } from "@/components/ui/image-preview";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToastStore } from "@/components/ui/toast";
import { fetchJson, formatDate } from "@/lib/api-utils";
import { useI18n } from "@/lib/i18n/translations-context";
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
  status: z.string().optional().or(z.literal("")),
});

type EventFormData = z.infer<typeof eventFormSchema>;

const inputClass =
  "w-full rounded-xl border border-muted/40 bg-white px-4 py-2.5 text-sm text-navy outline-none transition-all duration-200 placeholder:text-taupe/50 focus:border-coral/50 focus:ring-2 focus:ring-coral/15";

type FormCtx = ReturnType<typeof useForm<EventFormData>>;

function EventForm({
  form,
  onSubmit,
  submitLabel,
  savingLabel,
}: {
  form: FormCtx;
  onSubmit: (data: EventFormData) => Promise<void>;
  submitLabel: string;
  savingLabel: string;
}) {
  const { t } = useI18n();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.events.form.title")}</label>
          <input {...register("title")} className={inputClass} />
          {errors.title && <p className="mt-1.5 text-xs text-coral/90">{errors.title.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.events.form.organizer")}</label>
          <input {...register("organizer")} className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.events.form.date")}</label>
          <input type="date" {...register("date")} className={inputClass} />
          {errors.date && <p className="mt-1.5 text-xs text-coral/90">{errors.date.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.events.form.time")}</label>
          <input type="time" {...register("time")} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.events.form.location")}</label>
        <input {...register("location")} className={inputClass} />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.events.form.status")}</label>
        <select {...register("status")} className={inputClass}>
          <option value="">{t("admin.events.form.active_default")}</option>
          <option value="activo">Activo</option>
          <option value="pendiente">Pendiente</option>
          <option value="pospuesto">Pospuesto</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.events.form.description")}</label>
        <textarea rows={3} {...register("description")} className={`${inputClass} resize-none`} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-3">
          <ImageUpload
            value={watch("flyer") ?? ""}
            onChange={(url) => form.setValue("flyer", url)}
            label={t("admin.events.form.flyer")}
          />
          <input {...register("flyer")} placeholder={t("admin.events.form.or_url")} className={inputClass} />
          {watch("flyer") && <ImagePreview url={watch("flyer")!} />}
        </div>
        <div className="space-y-3">
          <ImageUpload
            value={watch("image") ?? ""}
            onChange={(url) => form.setValue("image", url)}
            label={t("admin.events.form.image")}
          />
          <input {...register("image")} placeholder={t("admin.events.form.or_url")} className={inputClass} />
          {watch("image") && <ImagePreview url={watch("image")!} />}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.events.form.logo")}</label>
          <input {...register("logo")} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.events.form.instagram")}</label>
          <input {...register("instagram")} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.events.form.phone")}</label>
          <input {...register("phone")} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.events.form.google_maps")}</label>
        <input {...register("googleMaps")} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer rounded-xl bg-coral px-6 py-2.5 text-sm font-medium text-white shadow-xs shadow-coral/20 transition-all duration-200 hover:bg-coral/90 hover:shadow-sm hover:shadow-coral/25 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? savingLabel : submitLabel}
      </button>
    </form>
  );
}

const PAGE_SIZE = 10;

export default function AdminEventsPage() {
  const { t } = useI18n();
  const addToast = useToastStore((s) => s.addToast);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<IEventData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  const { data: events, error: fetchError, isLoading, mutate } = useSWR<IEventData[]>(
    "/api/admin/events",
    fetchJson,
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

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paginatedEvents = filteredEvents.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const exportCSV = () => {
    if (!filteredEvents || filteredEvents.length === 0) return;
    const headers = [t("admin.events.table.title"), t("admin.events.table.organizer"), t("admin.events.table.status"), t("admin.events.table.date"), t("admin.events.table.time"), "Ubicación", "Descripción", "Instagram", "Teléfono"];
    const rows = filteredEvents.map((e) => [
      e.title, e.organizer ?? "", e.status ?? "activo", formatDate(e.date),
      e.time ?? "", e.location ?? "", e.description ?? "", e.instagram ?? "", e.phone ?? "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eventos.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

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
    editForm.setValue("status", event.status ?? "");
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
      addToast(t("admin.events.created"), "success");
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
      addToast(t("admin.events.updated"), "success");
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
      addToast(t("admin.events.deleted"), "success");
      mutate();
    } catch {
      addToast("Error de conexión", "error");
    }
  };

  return (
    <div>
      <div className="mb-10">
        <p className="mb-2 text-xs font-medium text-coral uppercase tracking-[0.2em]">
          {t("admin.events.badge")}
        </p>
        <h1 className="text-3xl font-light text-navy">
          {t("admin.events.title")} <span className="font-semibold">{t("admin.events.title_accent")}</span>
        </h1>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t("admin.events.delete_confirm_title")}
        message={t("admin.events.delete_confirm_message")}
        confirmLabel={t("admin.events.delete_confirm_label")}
        cancelLabel={t("admin.events.cancel_label")}
        variant="danger"
        onConfirm={onDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Modal open={showCreateModal} title={t("admin.events.create_modal_title")} onClose={() => setShowCreateModal(false)}>
        <EventForm form={createForm} onSubmit={onCreate} submitLabel={t("admin.events.create_submit")} savingLabel={t("admin.events.saving")} />
      </Modal>

      <Modal
        open={!!editingEvent}
        title={t("admin.events.edit_modal_title")}
        onClose={() => { setEditingEvent(null); editForm.reset(); }}
      >
        <EventForm form={editForm} onSubmit={onUpdate} submitLabel={t("admin.events.edit_submit")} savingLabel={t("admin.events.saving")} />
      </Modal>

      <div className="rounded-2xl border border-muted/30 bg-white shadow-xs">
        <div className="border-b border-muted/20 px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-navy">
              {t("admin.events.table_title")} ({filteredEvents.length})
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                  placeholder={t("admin.events.search_placeholder")}
                  className="w-48 rounded-xl border border-muted/40 bg-white py-2 pl-9 pr-4 text-xs text-navy outline-none transition-all duration-200 placeholder:text-taupe/50 focus:border-coral/50 focus:ring-2 focus:ring-coral/15 sm:w-56"
                />
              </div>
              {filteredEvents.length > 0 && (
                <button
                  onClick={exportCSV}
                  className="cursor-pointer rounded-xl border border-muted/40 px-3 py-2 text-xs font-medium text-taupe transition-all duration-200 hover:border-muted/70 hover:text-navy hover:shadow-xs"
                >
                  {t("admin.events.export_csv")}
                </button>
              )}
              <button
                onClick={openCreateModal}
                className="cursor-pointer rounded-xl bg-coral px-4 py-2 text-xs font-medium text-white shadow-xs shadow-coral/20 transition-all duration-200 hover:bg-coral/90 hover:shadow-sm hover:shadow-coral/25 active:shadow-none"
              >
                {t("admin.events.create")}
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

        {!isLoading && !fetchError && paginatedEvents.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-taupe">
            {searchQuery ? t("admin.events.no_results_search") : t("admin.events.no_results")}
          </div>
        )}

        {!isLoading && paginatedEvents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-muted/20 text-xs font-medium text-taupe uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium sm:px-8">{t("admin.events.table.title")}</th>
                  <th className="px-6 py-4 font-medium sm:px-8">{t("admin.events.table.organizer")}</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell sm:px-8">{t("admin.events.table.status")}</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell sm:px-8">{t("admin.events.table.date")}</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell sm:px-8">{t("admin.events.table.time")}</th>
                  <th className="px-6 py-4 font-medium sm:px-8">{t("admin.events.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEvents.map((event) => (
                  <tr key={event.id} className="border-b border-muted/10 transition-colors hover:bg-muted/10">
                    <td className="px-6 py-4 font-medium text-navy sm:px-8">{event.title}</td>
                    <td className="px-6 py-4 text-taupe sm:px-8">{event.organizer ?? "—"}</td>
                    <td className="hidden px-6 py-4 sm:table-cell sm:px-8">
                      {event.status && event.status !== "activo" ? (
                        <span className="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium text-taupe">
                          {event.status === "pendiente" ? "Pendiente" : event.status === "pospuesto" ? "Pospuesto" : event.status === "cerrado" ? "Cerrado" : event.status}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                          {t("admin.events.status_active")}
                        </span>
                      )}
                    </td>
                    <td className="hidden px-6 py-4 text-taupe sm:table-cell sm:px-8">{formatDate(event.date)}</td>
                    <td className="hidden px-6 py-4 text-taupe sm:table-cell sm:px-8">{event.time ?? "—"}</td>
                    <td className="px-6 py-4 sm:px-8">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(event)}
                          className="cursor-pointer rounded-xl border border-muted/40 px-3 py-1.5 text-xs font-medium text-navy transition-all duration-200 hover:bg-muted/20 hover:shadow-xs"
                        >
                          {t("admin.events.edit")}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(event.id)}
                          className="cursor-pointer rounded-xl border border-coral/30 px-3 py-1.5 text-xs font-medium text-coral transition-all duration-200 hover:bg-coral/5 hover:shadow-xs"
                        >
                          {t("admin.events.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-muted/20 px-6 py-3 sm:px-8">
                <p className="text-xs text-taupe">
                  {t("admin.events.page")} {safePage + 1} {t("admin.events.of")} {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={safePage === 0}
                    className="cursor-pointer rounded-xl border border-muted/40 px-3 py-1.5 text-xs font-medium text-navy transition-all duration-200 hover:bg-muted/20 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {t("admin.events.previous")}
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={safePage >= totalPages - 1}
                    className="cursor-pointer rounded-xl border border-muted/40 px-3 py-1.5 text-xs font-medium text-navy transition-all duration-200 hover:bg-muted/20 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {t("admin.events.next")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
