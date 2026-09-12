"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/config/site";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/form";
import { t } from "@/lib/i18n/ui";
import { v } from "@/lib/i18n/validation";

export function ContactForm({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const messages = v(locale);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      subject: String(form.get("subject") || ""),
      message: String(form.get("message") || ""),
      website: String(form.get("website") || ""),
      locale,
    };

    const errors: Record<string, string> = {};
    if (payload.name.trim().length < 2) {
      errors.name = messages.nameRequired;
    }
    if (!payload.email.trim()) {
      errors.email = messages.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
      errors.email = messages.emailInvalid;
    }
    if (payload.subject.trim().length < 2) {
      errors.subject = messages.subjectRequired;
    }
    if (payload.message.trim().length < 10) {
      errors.message = messages.messageTooShort;
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: Record<string, string>;
      } | null;

      if (!res.ok) {
        if (data?.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setError(data?.error || copy.formError);
      } else {
        setSuccess(true);
        e.currentTarget.reset();
      }
    } catch {
      setError(copy.formError);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative space-y-4 rounded-xl border border-steel/15 bg-white p-6"
      noValidate
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <Label htmlFor="name">{copy.name}</Label>
        <Input id="name" name="name" required autoComplete="name" />
        <FieldError message={fieldErrors.name} />
      </div>
      <div>
        <Label htmlFor="email">{copy.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <FieldError message={fieldErrors.email} />
      </div>
      <div>
        <Label htmlFor="phone">{copy.phone}</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        <FieldError message={fieldErrors.phone} />
      </div>
      <div>
        <Label htmlFor="subject">{copy.subject}</Label>
        <Input id="subject" name="subject" required />
        <FieldError message={fieldErrors.subject} />
      </div>
      <div>
        <Label htmlFor="message">{copy.message}</Label>
        <Textarea id="message" name="message" required />
        <FieldError message={fieldErrors.message} />
      </div>

      {success ? (
        <p className="text-sm text-success" role="status">
          {copy.formSuccess}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? copy.loading : copy.sendMessage}
      </Button>
    </form>
  );
}
