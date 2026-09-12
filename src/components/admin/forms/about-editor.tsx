"use client";

import { AdminTabs } from "@/components/ui/filter-tabs";
import { BilingualFields } from "@/components/admin/bilingual-fields";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import {
  deleteCoreValue,
  deleteTeamMember,
  deleteTimelineItem,
  updateSection,
  upsertCoreValue,
  upsertTeamMember,
  upsertTimelineItem,
} from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/utils";
import type {
  CoreValue,
  SiteSection,
  TeamMember,
  TimelineItem,
} from "@/types/database";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Tab = "introduction" | "vision" | "mission" | "values" | "timeline" | "team";

export function AboutEditor({
  introduction,
  vision,
  mission,
  coreValues,
  timeline,
  team,
}: {
  introduction: SiteSection | null;
  vision: SiteSection | null;
  mission: SiteSection | null;
  coreValues: CoreValue[];
  timeline: TimelineItem[];
  team: TeamMember[];
}) {
  const [tab, setTab] = useState<Tab>("introduction");
  const disabled = !isSupabaseConfigured();

  const tabs: { id: Tab; label: string }[] = [
    { id: "introduction", label: "Introduction" },
    { id: "vision", label: "Vision" },
    { id: "mission", label: "Mission" },
    { id: "values", label: "Core Values" },
    { id: "timeline", label: "Timeline" },
    { id: "team", label: "Team" },
  ];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text">About Page</h1>
        <p className="mt-1 text-sm text-text-muted">
          Edit about sections, values, timeline, and team
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-steel/20 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-gold/15 text-gold-soft"
                : "text-text-muted hover:bg-bg-soft hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "introduction" && introduction && (
        <AboutSectionForm section={introduction} disabled={disabled} withImage />
      )}
      {tab === "vision" && vision && (
        <AboutSectionForm section={vision} disabled={disabled} />
      )}
      {tab === "mission" && mission && (
        <AboutSectionForm section={mission} disabled={disabled} />
      )}
      {tab === "values" && (
        <CoreValuesEditor items={coreValues} disabled={disabled} />
      )}
      {tab === "timeline" && (
        <TimelineEditor items={timeline} disabled={disabled} />
      )}
      {tab === "team" && <TeamEditor items={team} disabled={disabled} />}
    </div>
  );
}

function AboutSectionForm({
  section,
  disabled,
  withImage,
}: {
  section: SiteSection;
  disabled: boolean;
  withImage?: boolean;
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
      {withImage && (
        <BilingualFields
          label="Subtitle"
          arValue={form.subtitle_ar || ""}
          enValue={form.subtitle_en || ""}
          onArChange={(v) => setForm({ ...form, subtitle_ar: v })}
          onEnChange={(v) => setForm({ ...form, subtitle_en: v })}
          disabled={disabled}
        />
      )}
      <BilingualFields
        label="Description"
        multiline
        arValue={form.description_ar || ""}
        enValue={form.description_en || ""}
        onArChange={(v) => setForm({ ...form, description_ar: v })}
        onEnChange={(v) => setForm({ ...form, description_en: v })}
        disabled={disabled}
      />
      {withImage && (
        <>
          <ImageUploader
            value={form.image_url || ""}
            onChange={(v) => setForm({ ...form, image_url: v })}
            disabled={disabled}
            bucket="site-media"
          />
          <BilingualFields
            label="Image Alt"
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

function CoreValuesEditor({
  items: initial,
  disabled,
}: {
  items: CoreValue[];
  disabled: boolean;
}) {
  const { showToast } = useToast();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<CoreValue | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const empty: CoreValue = {
    id: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    icon: "",
    sort_order: items.length + 1,
    is_active: true,
  };

  async function save(item: CoreValue) {
    setLoading(true);
    const result = await upsertCoreValue({ ...item, id: item.id || undefined });
    setLoading(false);
    if (result.ok) {
      showToast("Core value saved");
      if (item.id) setItems((p) => p.map((i) => (i.id === item.id ? item : i)));
      else setItems((p) => [...p, { ...item, id: crypto.randomUUID() }]);
      setEditing(null);
    } else showToast(result.error, "error");
  }

  async function remove() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteCoreValue(deleteId);
    setLoading(false);
    if (result.ok) {
      setItems((p) => p.filter((i) => i.id !== deleteId));
      showToast("Deleted");
      setDeleteId(null);
    } else showToast(result.error, "error");
  }

  return (
    <ListEditor
      title="Core Values"
      items={items}
      disabled={disabled}
      loading={loading}
      editing={editing}
      deleteId={deleteId}
      onAdd={() => setEditing(empty)}
      onEdit={setEditing}
      onDelete={setDeleteId}
      onSave={save}
      onRemove={() => void remove()}
      onCancelEdit={() => setEditing(null)}
      onCancelDelete={() => setDeleteId(null)}
      renderRow={(item) => (
        <>
          <td className="px-4 py-3 font-medium text-text">{item.title_en}</td>
          <td className="px-4 py-3">{item.sort_order}</td>
        </>
      )}
      renderForm={(item, setItem) => (
        <>
          <BilingualFields
            label="Title"
            required
            arValue={item.title_ar}
            enValue={item.title_en}
            onArChange={(v) => setItem({ ...item, title_ar: v })}
            onEnChange={(v) => setItem({ ...item, title_en: v })}
            disabled={disabled}
          />
          <BilingualFields
            label="Description"
            multiline
            arValue={item.description_ar || ""}
            enValue={item.description_en || ""}
            onArChange={(v) => setItem({ ...item, description_ar: v })}
            onEnChange={(v) => setItem({ ...item, description_en: v })}
            disabled={disabled}
          />
          <div>
            <Label>Icon</Label>
            <Input
              value={item.icon || ""}
              onChange={(e) => setItem({ ...item, icon: e.target.value })}
              disabled={disabled}
            />
          </div>
          <SortActiveFields item={item} setItem={setItem} disabled={disabled} />
        </>
      )}
    />
  );
}

function TimelineEditor({
  items: initial,
  disabled,
}: {
  items: TimelineItem[];
  disabled: boolean;
}) {
  const { showToast } = useToast();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<TimelineItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const empty: TimelineItem = {
    id: "",
    year: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    sort_order: items.length + 1,
    is_active: true,
  };

  async function save(item: TimelineItem) {
    setLoading(true);
    const result = await upsertTimelineItem({ ...item, id: item.id || undefined });
    setLoading(false);
    if (result.ok) {
      showToast("Timeline item saved");
      if (item.id) setItems((p) => p.map((i) => (i.id === item.id ? item : i)));
      else setItems((p) => [...p, { ...item, id: crypto.randomUUID() }]);
      setEditing(null);
    } else showToast(result.error, "error");
  }

  async function remove() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteTimelineItem(deleteId);
    setLoading(false);
    if (result.ok) {
      setItems((p) => p.filter((i) => i.id !== deleteId));
      showToast("Deleted");
      setDeleteId(null);
    } else showToast(result.error, "error");
  }

  return (
    <ListEditor
      title="Timeline"
      items={items}
      disabled={disabled}
      loading={loading}
      editing={editing}
      deleteId={deleteId}
      onAdd={() => setEditing(empty)}
      onEdit={setEditing}
      onDelete={setDeleteId}
      onSave={save}
      onRemove={() => void remove()}
      onCancelEdit={() => setEditing(null)}
      onCancelDelete={() => setDeleteId(null)}
      renderRow={(item) => (
        <>
          <td className="px-4 py-3 font-medium text-gold">{item.year}</td>
          <td className="px-4 py-3 text-text">{item.title_en}</td>
        </>
      )}
      renderForm={(item, setItem) => (
        <>
          <div>
            <Label>Year</Label>
            <Input
              value={item.year}
              onChange={(e) => setItem({ ...item, year: e.target.value })}
              required
              disabled={disabled}
            />
          </div>
          <BilingualFields
            label="Title"
            required
            arValue={item.title_ar}
            enValue={item.title_en}
            onArChange={(v) => setItem({ ...item, title_ar: v })}
            onEnChange={(v) => setItem({ ...item, title_en: v })}
            disabled={disabled}
          />
          <BilingualFields
            label="Description"
            multiline
            arValue={item.description_ar || ""}
            enValue={item.description_en || ""}
            onArChange={(v) => setItem({ ...item, description_ar: v })}
            onEnChange={(v) => setItem({ ...item, description_en: v })}
            disabled={disabled}
          />
          <SortActiveFields item={item} setItem={setItem} disabled={disabled} />
        </>
      )}
    />
  );
}

function TeamEditor({
  items: initial,
  disabled,
}: {
  items: TeamMember[];
  disabled: boolean;
}) {
  const { showToast } = useToast();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const empty: TeamMember = {
    id: "",
    name_ar: "",
    name_en: "",
    position_ar: "",
    position_en: "",
    bio_ar: "",
    bio_en: "",
    image_url: "",
    alt_text_ar: "",
    alt_text_en: "",
    sort_order: items.length + 1,
    is_active: true,
  };

  async function save(item: TeamMember) {
    setLoading(true);
    const result = await upsertTeamMember({ ...item, id: item.id || undefined });
    setLoading(false);
    if (result.ok) {
      showToast("Team member saved");
      if (item.id) setItems((p) => p.map((i) => (i.id === item.id ? item : i)));
      else setItems((p) => [...p, { ...item, id: crypto.randomUUID() }]);
      setEditing(null);
    } else showToast(result.error, "error");
  }

  async function remove() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteTeamMember(deleteId);
    setLoading(false);
    if (result.ok) {
      setItems((p) => p.filter((i) => i.id !== deleteId));
      showToast("Deleted");
      setDeleteId(null);
    } else showToast(result.error, "error");
  }

  return (
    <ListEditor
      title="Team"
      items={items}
      disabled={disabled}
      loading={loading}
      editing={editing}
      deleteId={deleteId}
      onAdd={() => setEditing(empty)}
      onEdit={setEditing}
      onDelete={setDeleteId}
      onSave={save}
      onRemove={() => void remove()}
      onCancelEdit={() => setEditing(null)}
      onCancelDelete={() => setDeleteId(null)}
      renderRow={(item) => (
        <>
          <td className="px-4 py-3 font-medium text-text">{item.name_en}</td>
          <td className="px-4 py-3 text-text-muted">{item.position_en}</td>
        </>
      )}
      renderForm={(item, setItem) => (
        <>
          <BilingualFields
            label="Name"
            required
            arValue={item.name_ar}
            enValue={item.name_en}
            onArChange={(v) => setItem({ ...item, name_ar: v })}
            onEnChange={(v) => setItem({ ...item, name_en: v })}
            disabled={disabled}
          />
          <BilingualFields
            label="Position"
            arValue={item.position_ar || ""}
            enValue={item.position_en || ""}
            onArChange={(v) => setItem({ ...item, position_ar: v })}
            onEnChange={(v) => setItem({ ...item, position_en: v })}
            disabled={disabled}
          />
          <BilingualFields
            label="Bio"
            multiline
            arValue={item.bio_ar || ""}
            enValue={item.bio_en || ""}
            onArChange={(v) => setItem({ ...item, bio_ar: v })}
            onEnChange={(v) => setItem({ ...item, bio_en: v })}
            disabled={disabled}
          />
          <ImageUploader
            value={item.image_url || ""}
            onChange={(v) => setItem({ ...item, image_url: v })}
            disabled={disabled}
            bucket="site-media"
          />
          <SortActiveFields item={item} setItem={setItem} disabled={disabled} />
        </>
      )}
    />
  );
}

function SortActiveFields<T extends { sort_order: number; is_active: boolean }>({
  item,
  setItem,
  disabled,
}: {
  item: T;
  setItem: (item: T) => void;
  disabled: boolean;
}) {
  return (
    <>
      <div>
        <Label>Sort Order</Label>
        <Input
          type="number"
          value={item.sort_order}
          onChange={(e) => setItem({ ...item, sort_order: Number(e.target.value) })}
          disabled={disabled}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-text-dark">
        <input
          type="checkbox"
          checked={item.is_active}
          onChange={(e) => setItem({ ...item, is_active: e.target.checked })}
          disabled={disabled}
        />
        Active
      </label>
    </>
  );
}

function ListEditor<T extends { id: string }>({
  title,
  items,
  disabled,
  loading,
  editing,
  deleteId,
  onAdd,
  onEdit,
  onDelete,
  onSave,
  onRemove,
  onCancelEdit,
  onCancelDelete,
  renderRow,
  renderForm,
}: {
  title: string;
  items: T[];
  disabled: boolean;
  loading: boolean;
  editing: T | null;
  deleteId: string | null;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onSave: (item: T) => void;
  onRemove: () => void;
  onCancelEdit: () => void;
  onCancelDelete: () => void;
  renderRow: (item: T) => React.ReactNode;
  renderForm: (item: T, setItem: (item: T) => void) => React.ReactNode;
}) {
  const [draft, setDraft] = useState(editing);

  useEffect(() => {
    setDraft(editing);
  }, [editing]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" size="sm" disabled={disabled} onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add {title.toLowerCase()}
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-steel/20">
        <table className="w-full min-w-[480px] text-left text-sm">
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-steel/10 first:border-t-0">
                {renderRow(item)}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => onDelete(item.id)}
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
            onClick={onCancelEdit}
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (draft) onSave(draft);
            }}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-steel/20 bg-white p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-text-dark">
              {draft?.id ? "Edit" : "Add"} {title}
            </h3>
            <div className="space-y-3">
              {draft && renderForm(draft, setDraft)}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onCancelEdit}>
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
        title={`Delete ${title.toLowerCase()}?`}
        message="This action cannot be undone."
        loading={loading}
        onConfirm={onRemove}
        onCancel={onCancelDelete}
      />
    </div>
  );
}
