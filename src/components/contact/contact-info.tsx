import { MapPin, Phone, Clock, Mail, MessageCircle } from "lucide-react";
import type { Locale } from "@/config/site";
import { t } from "@/lib/i18n/ui";
import { Reveal } from "@/components/ui/motion";

/** Fully static contact block — no queries / settings lookup. */
const CONTACT = {
  company_ar: "فالكون ديزاين للمقاولات العامة — مؤسسة فردية",
  company_en: "Falcon Design General Contracting — Sole Proprietorship",
  address_ar: "العين، أبوظبي، الإمارات العربية المتحدة",
  address_en: "Al Ain, Abu Dhabi, United Arab Emirates",
  phoneDisplay: "+971 56 233 1020",
  phoneTel: "+971562331020",
  whatsappUrl: "https://api.whatsapp.com/send?phone=971562331020",
  hours_ar: "الأحد – الخميس: 8:00 ص – 6:00 م",
  hours_en: "Sunday – Thursday: 8:00 AM – 6:00 PM",
  description_ar: "راسلنا لمناقشة مشروعك القادم في أعمال الصلب والألمنيوم.",
  description_en: "Reach out to discuss your next steel and aluminum project.",
  emails: [
    {
      id: "email-1",
      label_ar: "عام",
      label_en: "General",
      email: "falcondesign20@gmail.com",
    },
    {
      id: "email-2",
      label_ar: "المبيعات",
      label_en: "Sales",
      email: "sales@falcondesign.ae",
    },
    {
      id: "email-3",
      label_ar: "المشاريع",
      label_en: "Projects",
      email: "projects@falcondesign.ae",
    },
  ],
} as const;

export function ContactInfo({ locale }: { locale: Locale }) {
  const copy = t(locale);

  return (
    <div className="space-y-10">
      <Reveal>
        <h2 className="text-2xl font-semibold tracking-tight text-text-dark sm:text-3xl">
          {locale === "ar" ? "بيانات التواصل" : "Contact details"}
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-text-dark-muted">
          {locale === "ar" ? CONTACT.description_ar : CONTACT.description_en}
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <ul className="space-y-0 divide-y divide-steel/15 border-y border-steel/15">
          <li className="flex gap-4 py-5">
            <MapPin className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-text-dark-muted uppercase">
                {copy.address}
              </p>
              <div className="mt-1.5 text-sm sm:text-base">
                <span className="block font-medium text-text-dark">
                  {locale === "ar" ? CONTACT.company_ar : CONTACT.company_en}
                </span>
                <span className="mt-1 block text-text-dark-muted">
                  {locale === "ar" ? CONTACT.address_ar : CONTACT.address_en}
                </span>
              </div>
            </div>
          </li>

          <li className="flex gap-4 py-5">
            <Phone className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-text-dark-muted uppercase">
                {copy.phone}
              </p>
              <div className="mt-1.5 text-sm sm:text-base">
                <a
                  className="text-text-dark transition hover:text-gold"
                  href={`tel:${CONTACT.phoneTel}`}
                  dir="ltr"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </div>
            </div>
          </li>

          <li className="py-5">
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 rounded-lg outline-none transition hover:bg-gold/5 focus-visible:ring-2 focus-visible:ring-gold/40"
              aria-label={
                locale === "ar"
                  ? "فتح واتساب في تبويب جديد"
                  : "Open WhatsApp in a new tab"
              }
            >
              <MessageCircle
                className="mt-0.5 size-5 shrink-0 text-gold"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-text-dark-muted uppercase">
                  {copy.whatsapp}
                </p>
                <div className="mt-1.5 text-sm sm:text-base">
                  <span
                    dir="ltr"
                    className="text-text-dark transition group-hover:text-gold"
                  >
                    {CONTACT.phoneDisplay}
                  </span>
                </div>
              </div>
            </a>
          </li>

          <li className="flex gap-4 py-5">
            <Clock className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-text-dark-muted uppercase">
                {copy.hours}
              </p>
              <div className="mt-1.5 text-sm sm:text-base">
                <span className="text-text-dark-muted">
                  {locale === "ar" ? CONTACT.hours_ar : CONTACT.hours_en}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="flex gap-4">
          <Mail className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
          <div>
            <p className="text-xs font-semibold tracking-wide text-text-dark-muted uppercase">
              {copy.contactEmails}
            </p>
            <ul className="mt-3 space-y-2">
              {CONTACT.emails.map((email) => (
                <li key={email.id}>
                  <a
                    href={`mailto:${email.email}`}
                    className="group inline-flex flex-wrap items-baseline gap-x-2 text-sm sm:text-base"
                  >
                    <span className="font-medium text-text-dark">
                      {locale === "ar" ? email.label_ar : email.label_en}
                    </span>
                    <span className="text-text-dark-muted transition group-hover:text-gold">
                      {email.email}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
