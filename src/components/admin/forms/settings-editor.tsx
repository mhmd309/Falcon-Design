"use client";

import { BilingualFields } from "@/components/admin/bilingual-fields";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { updateSiteSettings } from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/utils";
import type { SiteSettings } from "@/types/database";
import { useState } from "react";

export function SettingsEditor({ settings: initial }: { settings: SiteSettings }) {
  const { showToast } = useToast();
  const disabled = !isSupabaseConfigured();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await updateSiteSettings(form);
    setLoading(false);
    if (result.ok) showToast("Site settings saved");
    else showToast(result.error, "error");
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text">Site Settings</h1>
        <p className="mt-1 text-sm text-text-muted">
          Global company info, contact details, and social links
        </p>
      </header>

      <form onSubmit={(e) => void handleSubmit(e)} className="max-w-3xl space-y-4">
        <BilingualFields
          label="Company Name"
          required
          arValue={form.company_name_ar}
          enValue={form.company_name_en}
          onArChange={(v) => setForm({ ...form, company_name_ar: v })}
          onEnChange={(v) => setForm({ ...form, company_name_en: v })}
          disabled={disabled}
        />
        <BilingualFields
          label="Tagline"
          arValue={form.tagline_ar || ""}
          enValue={form.tagline_en || ""}
          onArChange={(v) => setForm({ ...form, tagline_ar: v })}
          onEnChange={(v) => setForm({ ...form, tagline_en: v })}
          disabled={disabled}
        />
        <ImageUploader
          label="Logo"
          value={form.logo_url || ""}
          onChange={(v) => setForm({ ...form, logo_url: v })}
          disabled={disabled}
          bucket="site-media"
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
          label="Address"
          multiline
          rows={2}
          arValue={form.address_ar || ""}
          enValue={form.address_en || ""}
          onArChange={(v) => setForm({ ...form, address_ar: v })}
          onEnChange={(v) => setForm({ ...form, address_en: v })}
          disabled={disabled}
        />

        <fieldset className="space-y-3 rounded-lg border border-steel/20 p-4">
          <legend className="px-2 text-sm font-semibold text-text-muted">
            Social Links
          </legend>
          {(
            [
              ["facebook_url", "Facebook"],
              ["instagram_url", "Instagram"],
              ["linkedin_url", "LinkedIn"],
              ["youtube_url", "YouTube"],
              ["x_url", "X (Twitter)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input
                value={form[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                disabled={disabled}
                placeholder="https://"
              />
            </div>
          ))}
        </fieldset>

        <Button type="submit" disabled={disabled || loading}>
          {loading ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
