import type { Locale } from "@/config/site";
import { v } from "@/lib/i18n/validation";

export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export function validateContactField(
  locale: Locale,
  field: keyof ContactFields,
  value: string,
): string | undefined {
  const messages = v(locale);
  const trimmed = value.trim();

  switch (field) {
    case "name":
      return trimmed.length < 2 ? messages.nameRequired : undefined;
    case "email":
      if (!trimmed) return messages.emailRequired;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
        ? undefined
        : messages.emailInvalid;
    case "phone": {
      if (!trimmed) return undefined;
      if (trimmed.length > 20) return messages.phoneInvalid;
      if (!/^\+?[0-9\s()-]*$/.test(trimmed)) return messages.phoneInvalid;
      if (trimmed.replace(/\D/g, "").length > 15) return messages.phoneInvalid;
      return undefined;
    }
    case "subject":
      return trimmed.length < 2 ? messages.subjectRequired : undefined;
    case "message":
      return trimmed.length < 10 ? messages.messageTooShort : undefined;
    default:
      return undefined;
  }
}

export function validateContactForm(
  locale: Locale,
  values: ContactFields,
): Partial<Record<keyof ContactFields, string>> {
  const errors: Partial<Record<keyof ContactFields, string>> = {};
  (Object.keys(values) as (keyof ContactFields)[]).forEach((field) => {
    const message = validateContactField(locale, field, values[field]);
    if (message) errors[field] = message;
  });
  return errors;
}

export function isContactFormValid(locale: Locale, values: ContactFields) {
  return Object.keys(validateContactForm(locale, values)).length === 0;
}
