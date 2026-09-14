"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/config/site";
import { Button } from "@/components/ui/button";
import { FeedbackPopup, type FeedbackTone } from "@/components/ui/feedback-popup";
import { FieldError, Input, Label, Textarea } from "@/components/ui/form";
import { t } from "@/lib/i18n/ui";
import {
  isContactFormValid,
  validateContactField,
  type ContactFields,
} from "@/lib/validation/contact";

const emptyValues: ContactFields = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const MAX_PHONE_DIGITS = 15;

function normalizePhoneInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, MAX_PHONE_DIGITS);
  return value.trimStart().startsWith("+") ? `+${digits}` : digits;
}

export function ContactForm({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactFields>(emptyValues);
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFields, boolean>>>({});
  const [pending, setPending] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [feedback, setFeedback] = useState<{
    tone: FeedbackTone;
    message: string;
  } | null>(null);

  const fieldErrors = useMemo(() => {
    const next: Partial<Record<keyof ContactFields, string>> = {};
    (Object.keys(values) as (keyof ContactFields)[]).forEach((field) => {
      if (!touched[field]) return;
      const message = validateContactField(locale, field, values[field]);
      if (message) next[field] = message;
    });
    return next;
  }, [locale, touched, values]);

  const canSubmit = isContactFormValid(locale, values) && !pending;
  const dir = locale === "ar" ? "rtl" : "ltr";

  function updateField(field: keyof ContactFields, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function markAllTouched() {
    setTouched({
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    markAllTouched();
    setFeedback(null);

    if (!isContactFormValid(locale, values)) return;

    setPending(true);
    const formEl = formRef.current;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot,
          locale,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: Partial<Record<keyof ContactFields, string>>;
      } | null;

      if (!res.ok) {
        if (data?.fieldErrors) {
          setTouched({
            name: true,
            email: true,
            phone: true,
            subject: true,
            message: true,
          });
        }
        setFeedback({
          tone: "error",
          message: data?.error || copy.formError,
        });
        return;
      }

      setFeedback({
        tone: "success",
        message: copy.formSuccess,
      });
      setValues(emptyValues);
      setTouched({});
      setHoneypot("");
      formEl?.reset();
    } catch {
      setFeedback({
        tone: "error",
        message: copy.formError,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={(e) => void onSubmit(e)}
        className="relative space-y-5"
        noValidate
        lang={locale}
        dir={dir}
      >
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
            Falcon Design
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-text-dark sm:text-2xl">
            {copy.sendMessage}
          </h2>
          <p className="mt-2 text-sm text-text-dark-muted">
            {locale === "ar"
              ? "أدخل بياناتك وسنتواصل معك في أقرب وقت."
              : "Share your details and we will get back to you shortly."}
          </p>
          <div className="metallic-line mt-5 w-14" />
        </div>

        <div
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
          aria-hidden="true"
        >
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          <div className="sm:col-span-2">
            <Label htmlFor="name">{copy.name}</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => updateField("name", e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
            />
            <FieldError message={fieldErrors.name} />
          </div>
          <div>
            <Label htmlFor="email">{copy.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            />
            <FieldError message={fieldErrors.email} />
          </div>
          <div>
            <Label htmlFor="phone">{copy.phone}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={MAX_PHONE_DIGITS + 1}
              dir="ltr"
              value={values.phone}
              onChange={(e) =>
                updateField("phone", normalizePhoneInput(e.target.value))
              }
            />
            <FieldError message={fieldErrors.phone} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="subject">{copy.subject}</Label>
            <Input
              id="subject"
              name="subject"
              value={values.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, subject: true }))}
            />
            <FieldError message={fieldErrors.subject} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="message">{copy.message}</Label>
            <Textarea
              id="message"
              name="message"
              value={values.message}
              onChange={(e) => updateField("message", e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
              className="min-h-36"
            />
            <FieldError message={fieldErrors.message} />
          </div>
        </div>

        <div className="pt-1">
          <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto sm:min-w-44">
            {pending ? copy.loading : copy.sendMessage}
          </Button>
        </div>
      </form>

      <FeedbackPopup
        open={Boolean(feedback)}
        tone={feedback?.tone || "success"}
        title={
          feedback?.tone === "error" ? copy.formErrorTitle : copy.formSuccessTitle
        }
        message={feedback?.message || ""}
        closeLabel={copy.close}
        onClose={() => setFeedback(null)}
        dir={dir}
      />
    </>
  );
}
