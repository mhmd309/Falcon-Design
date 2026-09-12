"use client";

import { BilingualFields } from "@/components/admin/bilingual-fields";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form";
import { deleteService, upsertService } from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/utils";
import type { Service } from "@/types/database";
import { Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export function ServicesEditor({ services: initial }: { services: Service[] }) {
  const { showToast } = useToast();
  const disabled = !isSupabaseConfigured();
  const [items, setItems] = useState(initial);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const empty: Service = {
    id: "",
    title_ar: "",
    title_en: "",
    short_description_ar: "",
    short_description_en: "",
    description_ar: "",
    description_en: "",
    image_url: "",
    alt_text_ar: "",
    alt_text_en: "",
    icon: "",
    category: "steel",
    is_active: true,
    is_featured: false,
    is_published: true,
    sort_order: items.length + 1,
  };

  const filtered = useMemo(() => {
    return items.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        s.title_en.toLowerCase().includes(q) ||
        s.title_ar.includes(q) ||
        s.category.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "all" || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  async function save(service: Service) {
    setLoading(true);
    const result = await upsertService({ ...service, id: service.id || undefined });
    setLoading(false);
    if (result.ok) {
      showToast("Service saved");
      if (service.id) {
        setItems((p) => p.map((s) => (s.id === service.id ? service : s)));
      } else {
        setItems((p) => [...p, { ...service, id: crypto.randomUUID() }]);
      }
      setEditing(null);
    } else {
      showToast(result.error, "error");
    }
  }

  async function remove() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteService(deleteId);
    setLoading(false);
    if (result.ok) {
      setItems((p) => p.filter((s) => s.id !== deleteId));
      showToast("Service deleted");
      setDeleteId(null);
    } else {
      showToast(result.error, "error");
    }
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Services</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage bilingual services with categories and featured flags
          </p>
        </div>
        <Button type="button" size="sm" disabled={disabled} onClick={() => setEditing(empty)}>
          <Plus className="h-4 w-4" />
          Add service
        </Button>
      </header>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel" />
          <Input
            className="pl-9"
            placeholder="Search services…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-auto min-w-[140px]"
        >
          <option value="all">All categories</option>
          <option value="steel">Steel</option>
          <option value="aluminum">Aluminum</option>
          <option value="other">Other</option>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-steel/20">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-bg-soft text-text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((service) => (
              <tr key={service.id} className="border-t border-steel/10">
                <td className="px-4 py-3 font-medium text-text">{service.title_en}</td>
                <td className="px-4 py-3 capitalize text-text-muted">{service.category}</td>
                <td className="px-4 py-3">{service.is_featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{service.is_active ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{service.is_published ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => setEditing(service)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => setDeleteId(service.id)}
                    >
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ServiceFormModal
          service={editing}
          disabled={disabled}
          loading={loading}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete service?"
        message="This action cannot be undone."
        loading={loading}
        onConfirm={() => void remove()}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function ServiceFormModal({
  service: initial,
  disabled,
  loading,
  onClose,
  onSave,
}: {
  service: Service;
  disabled: boolean;
  loading: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
}) {
  const [form, setForm] = useState(initial);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-text-dark/50"
        onClick={onClose}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-steel/20 bg-white p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-text-dark">
          {form.id ? "Edit" : "Add"} Service
        </h3>
        <div className="space-y-4">
          <BilingualFields
            label="Title"
            required
            arValue={form.title_ar}
            enValue={form.title_en}
            onArChange={(v) => setForm({ ...form, title_ar: v })}
            onEnChange={(v) => setForm({ ...form, title_en: v })}
            disabled={disabled}
          />
          <BilingualFields
            label="Short Description"
            multiline
            rows={2}
            arValue={form.short_description_ar || ""}
            enValue={form.short_description_en || ""}
            onArChange={(v) => setForm({ ...form, short_description_ar: v })}
            onEnChange={(v) => setForm({ ...form, short_description_en: v })}
            disabled={disabled}
          />
          <BilingualFields
            label="Full Description"
            multiline
            arValue={form.description_ar || ""}
            enValue={form.description_en || ""}
            onArChange={(v) => setForm({ ...form, description_ar: v })}
            onEnChange={(v) => setForm({ ...form, description_en: v })}
            disabled={disabled}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                disabled={disabled}
              >
                <option value="steel">Steel</option>
                <option value="aluminum">Aluminum</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label>Icon</Label>
              <Input
                value={form.icon || ""}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                disabled={disabled}
              />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm({ ...form, sort_order: Number(e.target.value) })
                }
                disabled={disabled}
              />
            </div>
          </div>
          <ImageUploader
            value={form.image_url || ""}
            onChange={(v) => setForm({ ...form, image_url: v })}
            disabled={disabled}
          />
          <BilingualFields
            label="Image Alt"
            arValue={form.alt_text_ar || ""}
            enValue={form.alt_text_en || ""}
            onArChange={(v) => setForm({ ...form, alt_text_ar: v })}
            onEnChange={(v) => setForm({ ...form, alt_text_en: v })}
            disabled={disabled}
          />
          <div className="flex flex-wrap gap-4 text-sm text-text-dark">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                disabled={disabled}
              />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                disabled={disabled}
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                disabled={disabled}
              />
              Published
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={disabled || loading}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
