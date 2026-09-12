"use client";

import { BilingualFields } from "@/components/admin/bilingual-fields";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { updateContactSettings, updateMessageStatus } from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/utils";
import type { ContactMessage, ContactSettings, MessageStatus } from "@/types/database";
import { useState } from "react";

type Tab = "settings" | "messages";

export function ContactEditor({
  settings: initialSettings,
  messages: initialMessages,
}: {
  settings: ContactSettings;
  messages: ContactMessage[];
}) {
  const [tab, setTab] = useState<Tab>("settings");
  const disabled = !isSupabaseConfigured();

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text">Contact</h1>
        <p className="mt-1 text-sm text-text-muted">
          Edit contact page settings and manage messages
        </p>
      </header>

      <div className="mb-6 flex gap-2 border-b border-steel/20 pb-2">
        {(["settings", "messages"] as Tab[]).map((t) => (
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

      {tab === "settings" ? (
        <ContactSettingsForm settings={initialSettings} disabled={disabled} />
      ) : (
        <MessagesList messages={initialMessages} disabled={disabled} />
      )}
    </div>
  );
}

function ContactSettingsForm({
  settings: initial,
  disabled,
}: {
  settings: ContactSettings;
  disabled: boolean;
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await updateContactSettings(form);
    setLoading(false);
    if (result.ok) showToast("Contact settings saved");
    else showToast(result.error, "error");
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="max-w-3xl space-y-4">
      <BilingualFields
        label="Page Title"
        arValue={form.page_title_ar || ""}
        enValue={form.page_title_en || ""}
        onArChange={(v) => setForm({ ...form, page_title_ar: v })}
        onEnChange={(v) => setForm({ ...form, page_title_en: v })}
        disabled={disabled}
      />
      <BilingualFields
        label="Page Description"
        multiline
        arValue={form.page_description_ar || ""}
        enValue={form.page_description_en || ""}
        onArChange={(v) => setForm({ ...form, page_description_ar: v })}
        onEnChange={(v) => setForm({ ...form, page_description_en: v })}
        disabled={disabled}
      />
      <BilingualFields
        label="Company Name"
        arValue={form.company_name_ar || ""}
        enValue={form.company_name_en || ""}
        onArChange={(v) => setForm({ ...form, company_name_ar: v })}
        onEnChange={(v) => setForm({ ...form, company_name_en: v })}
        disabled={disabled}
      />
      <BilingualFields
        label="Address"
        multiline
        rows={2}
        arValue={form.address_ar || ""}
        enValue={form.address_en || ""}
        onArChange={(v) => setForm({ ...form, address_ar: v })}
        onEnChange={(v) => setForm({ ...form, address_en: v })}
        disabled={disabled}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Phone</Label>
          <Input
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            disabled={disabled}
          />
        </div>
        <div>
          <Label>WhatsApp</Label>
          <Input
            value={form.whatsapp || ""}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            disabled={disabled}
          />
        </div>
      </div>
      <BilingualFields
        label="Business Hours"
        arValue={form.business_hours_ar || ""}
        enValue={form.business_hours_en || ""}
        onArChange={(v) => setForm({ ...form, business_hours_ar: v })}
        onEnChange={(v) => setForm({ ...form, business_hours_en: v })}
        disabled={disabled}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Latitude</Label>
          <Input
            type="number"
            step="any"
            value={form.latitude ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                latitude: e.target.value ? Number(e.target.value) : null,
              })
            }
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Longitude</Label>
          <Input
            type="number"
            step="any"
            value={form.longitude ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                longitude: e.target.value ? Number(e.target.value) : null,
              })
            }
            disabled={disabled}
          />
        </div>
      </div>
      <div>
        <Label>Google Maps URL</Label>
        <Input
          value={form.google_maps_url || ""}
          onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
          disabled={disabled}
        />
      </div>
      <Button type="submit" disabled={disabled || loading}>
        {loading ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}

function MessagesList({
  messages: initial,
  disabled,
}: {
  messages: ContactMessage[];
  disabled: boolean;
}) {
  const { showToast } = useToast();
  const [messages, setMessages] = useState(initial);
  const [statusFilter, setStatusFilter] = useState<MessageStatus | "all">("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered =
    statusFilter === "all"
      ? messages
      : messages.filter((m) => m.status === statusFilter);

  async function changeStatus(id: string, status: MessageStatus) {
    setLoadingId(id);
    const result = await updateMessageStatus({ id, status });
    setLoadingId(null);
    if (result.ok) {
      setMessages((p) => p.map((m) => (m.id === id ? { ...m, status } : m)));
      showToast("Status updated");
    } else {
      showToast(result.error, "error");
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-text-muted">
        Contact messages require Supabase. No messages available in fallback mode.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as MessageStatus | "all")}
        className="w-auto min-w-[160px]"
      >
        <option value="all">All statuses</option>
        <option value="new">New</option>
        <option value="read">Read</option>
        <option value="replied">Replied</option>
        <option value="archived">Archived</option>
      </Select>

      {filtered.length === 0 ? (
        <p className="text-sm text-text-muted">No messages found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="rounded-lg border border-steel/20 bg-bg-soft p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text">{msg.subject}</p>
                  <p className="text-sm text-text-muted">
                    {msg.name} · {msg.email}
                    {msg.phone ? ` · ${msg.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-steel">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
                <Select
                  value={msg.status}
                  onChange={(e) =>
                    void changeStatus(msg.id, e.target.value as MessageStatus)
                  }
                  disabled={disabled || loadingId === msg.id}
                  className="w-auto min-w-[120px]"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>
              <Textarea
                readOnly
                value={msg.message}
                className="mt-3 min-h-24 bg-bg text-sm text-text-muted"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
