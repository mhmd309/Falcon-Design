"use client";

import { BilingualFields } from "@/components/admin/bilingual-fields";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { updateContactEmails } from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/utils";
import type { ContactEmail } from "@/types/database";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

export function ContactEmailsEditor({ emails: initial }: { emails: ContactEmail[] }) {
  const { showToast } = useToast();
  const disabled = !isSupabaseConfigured();
  const [emails, setEmails] = useState(
    [...initial].sort((a, b) => a.sort_order - b.sort_order).slice(0, 5),
  );
  const [loading, setLoading] = useState(false);

  function updateEmail(index: number, patch: Partial<ContactEmail>) {
    setEmails((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    );
  }

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= emails.length) return;
    const copy = [...emails];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setEmails(
      copy.map((e, i) => ({ ...e, sort_order: i + 1 })),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = emails.map((email, i) => ({
      ...email,
      sort_order: i + 1,
    }));
    const result = await updateContactEmails(payload);
    setLoading(false);
    if (result.ok) showToast("Contact emails saved");
    else showToast(result.error, "error");
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text">Contact Emails</h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage exactly 5 contact email slots (sort order 1–5)
        </p>
      </header>

      <form onSubmit={(e) => void handleSubmit(e)} className="max-w-3xl space-y-6">
        {emails.map((email, index) => (
          <div
            key={email.id}
            className="rounded-lg border border-steel/20 bg-bg-soft p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gold">
                Slot {index + 1}
              </span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={disabled || index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={disabled || index === emails.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <BilingualFields
                label="Label"
                required
                arValue={email.label_ar}
                enValue={email.label_en}
                onArChange={(v) => updateEmail(index, { label_ar: v })}
                onEnChange={(v) => updateEmail(index, { label_en: v })}
                disabled={disabled}
              />
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email.email}
                  onChange={(e) => updateEmail(index, { email: e.target.value })}
                  required
                  disabled={disabled}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-text-muted">
                <input
                  type="checkbox"
                  checked={email.is_active}
                  onChange={(e) =>
                    updateEmail(index, { is_active: e.target.checked })
                  }
                  disabled={disabled}
                />
                Active
              </label>
            </div>
          </div>
        ))}

        <Button type="submit" disabled={disabled || loading}>
          {loading ? "Saving…" : "Save all emails"}
        </Button>
      </form>
    </div>
  );
}
