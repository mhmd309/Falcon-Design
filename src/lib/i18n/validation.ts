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
    invalidFile:
      "Invalid file. Use JPEG, PNG, WebP, GIF, or AVIF under 10 MB.",
    uploadFailed: "Upload failed. Please try again.",
    uploadRequiresSupabase: "Upload requires Supabase configuration.",
    invalidCredentials: "Invalid email or password.",
    signInFailed: "Unable to sign in. Please try again.",
    supabaseNotConfigured:
      "Supabase is not configured. Add environment variables to enable login.",
    emailPasswordRequired: "Email and password are required.",
    passwordRequired: "Password is required.",
    emailFieldRequired: "Email is required.",
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
    invalidFile:
      "ملف غير صالح. استخدم JPEG أو PNG أو WebP أو GIF أو AVIF بحجم أقل من 10 ميجابايت.",
    uploadFailed: "فشل رفع الملف. حاول مرة أخرى.",
    uploadRequiresSupabase: "رفع الصور يتطلب إعداد Supabase.",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    signInFailed: "تعذر تسجيل الدخول. حاول مرة أخرى.",
    supabaseNotConfigured:
      "لم يتم إعداد Supabase. أضف متغيرات البيئة لتفعيل تسجيل الدخول.",
    emailPasswordRequired: "البريد الإلكتروني وكلمة المرور مطلوبان.",
    passwordRequired: "كلمة المرور مطلوبة.",
    emailFieldRequired: "البريد الإلكتروني مطلوب.",
  },
} as const;

export type ValidationCopy = (typeof validationMessages)[Locale];

export function v(locale: Locale): ValidationCopy {
  return validationMessages[locale] ?? validationMessages.ar;
}

export function resolveLocale(input?: string | null): Locale {
  return input === "en" ? "en" : "ar";
}
