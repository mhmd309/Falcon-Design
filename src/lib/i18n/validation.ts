import type { Locale } from "@/config/site";

export const validationMessages = {
  en: {
    required: "This field is required.",
    nameRequired: "Please enter your name (at least 2 characters).",
    emailRequired: "Please enter your email address.",
    emailInvalid: "Please enter a valid email address.",
    phoneInvalid: "Please enter a valid phone number.",
    subjectRequired: "Please enter a subject (at least 2 characters).",
    messageRequired: "Please enter your message (at least 10 characters).",
    messageTooShort: "Your message is too short (minimum 10 characters).",
    invalidForm: "Please check the form fields and try again.",
    rateLimit: "Too many requests. Please try again later.",
    sendFailed: "Unable to send your message right now.",
  },
  ar: {
    required: "هذا الحقل مطلوب.",
    nameRequired: "يرجى إدخال الاسم (حرفان على الأقل).",
    emailRequired: "يرجى إدخال البريد الإلكتروني.",
    emailInvalid: "يرجى إدخال بريد إلكتروني صالح.",
    phoneInvalid: "يرجى إدخال رقم هاتف صالح.",
    subjectRequired: "يرجى إدخال الموضوع (حرفان على الأقل).",
    messageRequired: "يرجى إدخال الرسالة (10 أحرف على الأقل).",
    messageTooShort: "الرسالة قصيرة جدًا (الحد الأدنى 10 أحرف).",
    invalidForm: "يرجى مراجعة الحقول والمحاولة مرة أخرى.",
    rateLimit: "عدد كبير من المحاولات. يرجى المحاولة لاحقًا.",
    sendFailed: "تعذر إرسال الرسالة حاليًا.",
  },
} as const;

export type ValidationCopy = (typeof validationMessages)[Locale];

export function v(locale: Locale): ValidationCopy {
  return validationMessages[locale] ?? validationMessages.ar;
}

export function resolveLocale(input?: string | null): Locale {
  return input === "en" ? "en" : "ar";
}
