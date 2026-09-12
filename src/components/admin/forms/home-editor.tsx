"use client";

import { AdminTabs } from "@/components/ui/filter-tabs";
import { BilingualFields } from "@/components/admin/bilingual-fields";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import {
  deleteStatistic,
  updatePageSeo,
  updateSection,
  upsertStatistic,
} from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/utils";
import type { SitePage, SiteSection, Statistic } from "@/types/database";
import { Info, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Tab = "hero" | "statistics" | "cta" | "seo";

export function HomeEditor({
  hero,
  cta,
  page,
  statistics: initialStats,
}: {
  hero: SiteSection | null;
  cta: SiteSection | null;
  page: SitePage | null;
  statistics: Statistic[];
}) {
  const [tab, setTab] = useState<Tab>("hero");
  const disabled = !isSupabaseConfigured();

  const tabs: { id: Tab; label: string }[] = [
    { id: "hero", label: "Hero" },
    { id: "statistics", label: "Statistics" },
    { id: "cta", label: "CTA" },
    { id: "seo", label: "SEO" },
  ];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text">Home Page</h1>
        <p className="mt-1 text-sm text-text-muted">
          Edit hero, statistics, call-to-action, and SEO
        </p>
      </header>

      <div className="mb-4 flex items-start gap-2 rounded-md border border-steel/20 bg-bg-soft px-4 py-3 text-sm text-text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <p>
          Featured services and gallery items on the public home page are controlled
          via the <strong className="text-text">Services</strong> and{" "}
          <strong className="text-text">Gallery</strong> sections using the featured
          flag.
        </p>
      </div>

      <AdminTabs
        tabs={tabs}
        value={tab}
        onChange={(id) => setTab(id as Tab)}
      />

      {tab === "hero" && hero && (
        <SectionForm
          section={hero}
          disabled={disabled}
          showButtons
          showImage
        />
      )}
      {tab === "statistics" && (
        <StatisticsEditor statistics={initialStats} disabled={disabled} />
      )}
      {tab === "cta" && cta && (
        <SectionForm section={cta} disabled={disabled} showButtons />
      )}
      {tab === "seo" && page && <SeoForm page={page} disabled={disabled} />}
    </div>
  );
}

function SectionForm({
  section,
  disabled,
  showButtons,
  showImage,
}: {
  section: SiteSection;
  disabled: boolean;
  showButtons?: boolean;
  showImage?: boolean;
}) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(section);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await updateSection({
      page_slug: form.page_slug,
      section_key: form.section_key,
      title_ar: form.title_ar,
      title_en: form.title_en,
      subtitle_ar: form.subtitle_ar,
      subtitle_en: form.subtitle_en,
      description_ar: form.description_ar,
      description_en: form.description_en,
      primary_button_ar: form.primary_button_ar,
      primary_button_en: form.primary_button_en,
      primary_button_href: form.primary_button_href,
      secondary_button_ar: form.secondary_button_ar,
      secondary_button_en: form.secondary_button_en,
      secondary_button_href: form.secondary_button_href,
      image_url: form.image_url,
      alt_text_ar: form.alt_text_ar,
      alt_text_en: form.alt_text_en,
      is_published: form.is_published,
    });
    setLoading(false);
    if (result.ok) showToast("Section saved");
    else showToast(result.error, "error");
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="max-w-3xl space-y-4">
      <BilingualFields
        label="Title"
        arValue={form.title_ar || ""}
        enValue={form.title_en || ""}
        onArChange={(v) => setForm({ ...form, title_ar: v })}
        onEnChange={(v) => setForm({ ...form, title_en: v })}
        disabled={disabled}
      />
      <BilingualFields
        label="Subtitle"
        arValue={form.subtitle_ar || ""}
        enValue={form.subtitle_en || ""}
        onArChange={(v) => setForm({ ...form, subtitle_ar: v })}
        onEnChange={(v) => setForm({ ...form, subtitle_en: v })}
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
      {showButtons && (
        <>
          <BilingualFields
            label="Primary Button"
            arValue={form.primary_button_ar || ""}
            enValue={form.primary_button_en || ""}
            onArChange={(v) => setForm({ ...form, primary_button_ar: v })}
            onEnChange={(v) => setForm({ ...form, primary_button_en: v })}
            disabled={disabled}
          />
          <div>
            <Label>Primary Button Link</Label>
            <Input
              value={form.primary_button_href || ""}
              onChange={(e) => setForm({ ...form, primary_button_href: e.target.value })}
              disabled={disabled}
            />
          </div>
          <BilingualFields
            label="Secondary Button"
            arValue={form.secondary_button_ar || ""}
            enValue={form.secondary_button_en || ""}
            onArChange={(v) => setForm({ ...form, secondary_button_ar: v })}
            onEnChange={(v) => setForm({ ...form, secondary_button_en: v })}
            disabled={disabled}
          />
          <div>
            <Label>Secondary Button Link</Label>
            <Input
              value={form.secondary_button_href || ""}
              onChange={(e) =>
                setForm({ ...form, secondary_button_href: e.target.value })
              }
              disabled={disabled}
            />
          </div>
        </>
      )}
      {showImage && (
        <>
          <ImageUploader
            value={form.image_url || ""}
            onChange={(v) => setForm({ ...form, image_url: v })}
            disabled={disabled}
            bucket="site-media"
          />
          <BilingualFields
            label="Image Alt Text"
            arValue={form.alt_text_ar || ""}
            enValue={form.alt_text_en || ""}
            onArChange={(v) => setForm({ ...form, alt_text_ar: v })}
            onEnChange={(v) => setForm({ ...form, alt_text_en: v })}
            disabled={disabled}
          />
        </>
      )}
      <Button type="submit" disabled={disabled || loading}>
        {loading ? "Saving…" : "Save section"}
      </Button>
    </form>
  );
}

function StatisticsEditor({
  statistics,
  disabled,
}: {
  statistics: Statistic[];
  disabled: boolean;
}) {
  const { showToast } = useToast();
  const [items, setItems] = useState(statistics);
  const [editing, setEditing] = useState<Statistic | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const empty: Statistic = {
    id: "",
    value: "",
    prefix: "",
    suffix: "",
    label_ar: "",
    label_en: "",
    sort_order: items.length + 1,
    is_active: true,
  };

  async function handleSave(stat: Statistic) {
    setLoading(true);
    const payload = { ...stat, id: stat.id || undefined };
    const result = await upsertStatistic(payload);
    setLoading(false);
    if (result.ok) {
      showToast("Statistic saved");
      if (stat.id) {
        setItems((prev) => prev.map((s) => (s.id === stat.id ? stat : s)));
      } else {
        setItems((prev) => [...prev, { ...stat, id: crypto.randomUUID() }]);
      }
      setEditing(null);
    } else {
      showToast(result.error, "error");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteStatistic(deleteId);
    setLoading(false);
    if (result.ok) {
      setItems((prev) => prev.filter((s) => s.id !== deleteId));
      showToast("Statistic deleted");
      setDeleteId(null);
    } else {
      showToast(result.error, "error");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          disabled={disabled}
          onClick={() => setEditing(empty)}
        >
          <Plus className="h-4 w-4" />
          Add statistic
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-steel/20">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-bg-soft text-text-muted">
            <tr>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Label (EN)</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((stat) => (
              <tr key={stat.id} className="border-t border-steel/10">
                <td className="px-4 py-3 font-medium text-text">
                  {stat.prefix}
                  {stat.value}
                  {stat.suffix}
                </td>
                <td className="px-4 py-3 text-text-muted">{stat.label_en}</td>
                <td className="px-4 py-3">{stat.sort_order}</td>
                <td className="px-4 py-3">{stat.is_active ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => setEditing(stat)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => setDeleteId(stat.id)}
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSave(editing);
            }}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-steel/20 bg-white p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-text-dark">
              {editing.id ? "Edit" : "Add"} Statistic
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Prefix</Label>
                  <Input
                    value={editing.prefix || ""}
                    onChange={(e) => setEditing({ ...editing, prefix: e.target.value })}
                    disabled={disabled}
                  />
                </div>
                <div>
                  <Label>Value</Label>
                  <Input
                    value={editing.value}
                    onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                    required
                    disabled={disabled}
                  />
                </div>
                <div>
                  <Label>Suffix</Label>
                  <Input
                    value={editing.suffix || ""}
                    onChange={(e) => setEditing({ ...editing, suffix: e.target.value })}
                    disabled={disabled}
                  />
                </div>
              </div>
              <BilingualFields
                label="Label"
                required
                arValue={editing.label_ar}
                enValue={editing.label_en}
                onArChange={(v) => setEditing({ ...editing, label_ar: v })}
                onEnChange={(v) => setEditing({ ...editing, label_en: v })}
                disabled={disabled}
              />
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) =>
                    setEditing({ ...editing, sort_order: Number(e.target.value) })
                  }
                  disabled={disabled}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-text-dark">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  disabled={disabled}
                />
                Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={disabled || loading}>
                Save
              </Button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete statistic?"
        message="This action cannot be undone."
        loading={loading}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function SeoForm({ page, disabled }: { page: SitePage; disabled: boolean }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(page);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await updatePageSeo("home", {
      seo_title_ar: form.seo_title_ar || "",
      seo_title_en: form.seo_title_en || "",
      seo_description_ar: form.seo_description_ar || "",
      seo_description_en: form.seo_description_en || "",
      og_title_ar: form.og_title_ar || "",
      og_title_en: form.og_title_en || "",
      og_description_ar: form.og_description_ar || "",
      og_description_en: form.og_description_en || "",
      og_image: form.og_image || "",
      canonical_url: form.canonical_url || "",
    });
    setLoading(false);
    if (result.ok) showToast("SEO saved");
    else showToast(result.error, "error");
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="max-w-3xl space-y-4">
      <BilingualFields
        label="SEO Title"
        arValue={form.seo_title_ar || ""}
        enValue={form.seo_title_en || ""}
        onArChange={(v) => setForm({ ...form, seo_title_ar: v })}
        onEnChange={(v) => setForm({ ...form, seo_title_en: v })}
        disabled={disabled}
      />
      <BilingualFields
        label="SEO Description"
        multiline
        rows={3}
        arValue={form.seo_description_ar || ""}
        enValue={form.seo_description_en || ""}
        onArChange={(v) => setForm({ ...form, seo_description_ar: v })}
        onEnChange={(v) => setForm({ ...form, seo_description_en: v })}
        disabled={disabled}
      />
      <BilingualFields
        label="OG Title"
        arValue={form.og_title_ar || ""}
        enValue={form.og_title_en || ""}
        onArChange={(v) => setForm({ ...form, og_title_ar: v })}
        onEnChange={(v) => setForm({ ...form, og_title_en: v })}
        disabled={disabled}
      />
      <BilingualFields
        label="OG Description"
        multiline
        rows={3}
        arValue={form.og_description_ar || ""}
        enValue={form.og_description_en || ""}
        onArChange={(v) => setForm({ ...form, og_description_ar: v })}
        onEnChange={(v) => setForm({ ...form, og_description_en: v })}
        disabled={disabled}
      />
      <div>
        <Label>OG Image URL</Label>
        <Input
          value={form.og_image || ""}
          onChange={(e) => setForm({ ...form, og_image: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div>
        <Label>Canonical URL</Label>
        <Input
          value={form.canonical_url || ""}
          onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
          disabled={disabled}
        />
      </div>
      <Button type="submit" disabled={disabled || loading}>
        {loading ? "Saving…" : "Save SEO"}
      </Button>
    </form>
  );
}
