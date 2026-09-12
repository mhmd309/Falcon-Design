"use client";

import { BilingualFields } from "@/components/admin/bilingual-fields";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form";
import {
  deleteGalleryCategory,
  deleteGalleryItem,
  upsertGalleryCategory,
  upsertGalleryItem,
} from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/utils";
import type { GalleryCategory, GalleryItem } from "@/types/database";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type Tab = "items" | "categories";

export function GalleryEditor({
  items: initialItems,
  categories: initialCategories,
}: {
  items: GalleryItem[];
  categories: GalleryCategory[];
}) {
  const [tab, setTab] = useState<Tab>("items");
  const disabled = !isSupabaseConfigured();

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text">Gallery</h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage gallery categories and project items
        </p>
      </header>

      <div className="mb-6 flex gap-2 border-b border-steel/20 pb-2">
        {(["items", "categories"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t
                ? "bg-gold/15 text-gold-soft"
                : "text-text-muted hover:bg-bg-soft hover:text-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "items" ? (
        <GalleryItemsTab
          items={initialItems}
          categories={initialCategories}
          disabled={disabled}
        />
      ) : (
        <GalleryCategoriesTab categories={initialCategories} disabled={disabled} />
      )}
    </div>
  );
}

function GalleryItemsTab({
  items: initial,
  categories,
  disabled,
}: {
  items: GalleryItem[];
  categories: GalleryCategory[];
  disabled: boolean;
}) {
  const { showToast } = useToast();
  const [items, setItems] = useState(initial);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const empty: GalleryItem = {
    id: "",
    category_id: categories[0]?.id || null,
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    image_url: "",
    alt_text_ar: "",
    alt_text_en: "",
    sort_order: items.length + 1,
    is_featured: false,
    is_active: true,
    is_published: true,
  };

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (featuredOnly && !item.is_featured) return false;
      if (categoryFilter !== "all" && item.category_id !== categoryFilter) return false;
      return true;
    });
  }, [items, categoryFilter, featuredOnly]);

  async function save(item: GalleryItem) {
    setLoading(true);
    const result = await upsertGalleryItem({ ...item, id: item.id || undefined });
    setLoading(false);
    if (result.ok) {
      showToast("Gallery item saved");
      if (item.id) setItems((p) => p.map((i) => (i.id === item.id ? item : i)));
      else setItems((p) => [...p, { ...item, id: crypto.randomUUID() }]);
      setEditing(null);
    } else showToast(result.error, "error");
  }

  async function remove() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteGalleryItem(deleteId);
    setLoading(false);
    if (result.ok) {
      setItems((p) => p.filter((i) => i.id !== deleteId));
      showToast("Item deleted");
      setDeleteId(null);
    } else showToast(result.error, "error");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-auto min-w-[160px]"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_en}
              </option>
            ))}
          </Select>
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
            />
            Featured only
          </label>
        </div>
        <Button type="button" size="sm" disabled={disabled} onClick={() => setEditing(empty)}>
          <Plus className="h-4 w-4" />
          Add item
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg border border-steel/20 bg-bg-soft"
          >
            {item.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image_url}
                alt={item.alt_text_en || item.title_en}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-4">
              <p className="font-medium text-text">{item.title_en}</p>
              <p className="mt-1 text-xs text-text-muted">
                {item.is_featured ? "Featured · " : ""}
                Order {item.sort_order}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={disabled}
                  onClick={() => setEditing(item)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={disabled}
                  onClick={() => setDeleteId(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <GalleryItemModal
          item={editing}
          categories={categories}
          disabled={disabled}
          loading={loading}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete gallery item?"
        message="This action cannot be undone."
        loading={loading}
        onConfirm={() => void remove()}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function GalleryItemModal({
  item: initial,
  categories,
  disabled,
  loading,
  onClose,
  onSave,
}: {
  item: GalleryItem;
  categories: GalleryCategory[];
  disabled: boolean;
  loading: boolean;
  onClose: () => void;
  onSave: (item: GalleryItem) => void;
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
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-steel/20 bg-white p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-text-dark">
          {form.id ? "Edit" : "Add"} Gallery Item
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
            label="Description"
            multiline
            arValue={form.description_ar || ""}
            enValue={form.description_en || ""}
            onArChange={(v) => setForm({ ...form, description_ar: v })}
            onEnChange={(v) => setForm({ ...form, description_en: v })}
            disabled={disabled}
          />
          <div>
            <Label>Category</Label>
            <Select
              value={form.category_id || ""}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value || null })
              }
              disabled={disabled}
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_en}
                </option>
              ))}
            </Select>
          </div>
          <ImageUploader
            value={form.image_url}
            onChange={(v) => setForm({ ...form, image_url: v })}
            disabled={disabled}
          />
          <BilingualFields
            label="Alt Text"
            arValue={form.alt_text_ar || ""}
            enValue={form.alt_text_en || ""}
            onArChange={(v) => setForm({ ...form, alt_text_ar: v })}
            onEnChange={(v) => setForm({ ...form, alt_text_en: v })}
            disabled={disabled}
          />
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
          <div className="flex flex-wrap gap-4 text-sm text-text-dark">
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
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                disabled={disabled}
              />
              Active
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

function GalleryCategoriesTab({
  categories: initial,
  disabled,
}: {
  categories: GalleryCategory[];
  disabled: boolean;
}) {
  const { showToast } = useToast();
  const [categories, setCategories] = useState(initial);
  const [editing, setEditing] = useState<GalleryCategory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const empty: GalleryCategory = {
    id: "",
    name_ar: "",
    name_en: "",
    slug: "",
    sort_order: categories.length + 1,
    is_active: true,
  };

  async function save(cat: GalleryCategory) {
    setLoading(true);
    const result = await upsertGalleryCategory({ ...cat, id: cat.id || undefined });
    setLoading(false);
    if (result.ok) {
      showToast("Category saved");
      if (cat.id) setCategories((p) => p.map((c) => (c.id === cat.id ? cat : c)));
      else setCategories((p) => [...p, { ...cat, id: crypto.randomUUID() }]);
      setEditing(null);
    } else showToast(result.error, "error");
  }

  async function remove() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteGalleryCategory(deleteId);
    setLoading(false);
    if (result.ok) {
      setCategories((p) => p.filter((c) => c.id !== deleteId));
      showToast("Category deleted");
      setDeleteId(null);
    } else showToast(result.error, "error");
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" size="sm" disabled={disabled} onClick={() => setEditing(empty)}>
          <Plus className="h-4 w-4" />
          Add category
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-steel/20">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-bg-soft text-text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t border-steel/10">
                <td className="px-4 py-3 font-medium text-text">{cat.name_en}</td>
                <td className="px-4 py-3 text-text-muted">{cat.slug}</td>
                <td className="px-4 py-3">{cat.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => setEditing(cat)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => setDeleteId(cat.id)}
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-text-dark/50"
            onClick={() => setEditing(null)}
          />
          <CategoryForm
            category={editing}
            disabled={disabled}
            loading={loading}
            onClose={() => setEditing(null)}
            onSave={save}
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete category?"
        message="Items in this category may become uncategorized."
        loading={loading}
        onConfirm={() => void remove()}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function CategoryForm({
  category: initial,
  disabled,
  loading,
  onClose,
  onSave,
}: {
  category: GalleryCategory;
  disabled: boolean;
  loading: boolean;
  onClose: () => void;
  onSave: (cat: GalleryCategory) => void;
}) {
  const [form, setForm] = useState(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="relative w-full max-w-md rounded-lg border border-steel/20 bg-white p-6"
    >
      <h3 className="mb-4 text-lg font-semibold text-text-dark">
        {form.id ? "Edit" : "Add"} Category
      </h3>
      <div className="space-y-3">
        <BilingualFields
          label="Name"
          required
          arValue={form.name_ar}
          enValue={form.name_en}
          onArChange={(v) => setForm({ ...form, name_ar: v })}
          onEnChange={(v) => setForm({ ...form, name_en: v })}
          disabled={disabled}
        />
        <div>
          <Label>Slug</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Sort Order</Label>
          <Input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            disabled={disabled}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-text-dark">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            disabled={disabled}
          />
          Active
        </label>
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
  );
}
