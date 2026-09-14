import {
  MapPin,
  Phone,
  Clock,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import type { Locale } from "@/config/site";
import type { SiteSettings } from "@/types/content";
import { t } from "@/lib/i18n/ui";
import { Reveal } from "@/components/ui/motion";
import { pickLocalized } from "@/lib/utils";

const CONTACT = {
  company_ar: "فالكون ديزاين للمقاولات العامة — مؤسسة فردية",
  company_en: "Falcon Design General Contracting — Sole Proprietorship",
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.851L1.25 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
      />
    </svg>
  );
}

function phoneDigits(phone: string | null | undefined) {
  return (phone || "").replace(/\D/g, "");
}

function whatsappUrl(phone: string | null | undefined) {
  const digits = phoneDigits(phone);
  return digits ? `https://wa.me/${digits}` : null;
}

export function ContactInfo({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SiteSettings;
}) {
  const copy = t(locale);
  const phoneDisplay = settings.phone || "+971 56 233 1020";
  const phoneTel = `+${phoneDigits(phoneDisplay)}`;
  const waUrl = whatsappUrl(settings.whatsapp || settings.phone);

  const socials = [
    {
      id: "facebook",
      label: "Facebook",
      href: settings.facebook_url,
      icon: Facebook,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: waUrl,
      icon: MessageCircle,
    },
    {
      id: "youtube",
      label: "YouTube",
      href: settings.youtube_url,
      icon: Youtube,
    },
    {
      id: "instagram",
      label: "Instagram",
      href: settings.instagram_url,
      icon: Instagram,
    },
    {
      id: "x",
      label: "X",
      href: settings.x_url,
      icon: XIcon,
    },
  ].filter((item) => Boolean(item.href));

  return (
    <div className="space-y-10">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">
          Falcon Design
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-dark sm:text-3xl">
          {locale === "ar" ? "بيانات التواصل" : "Contact details"}
        </h2>
        <div className="metallic-line mt-5 w-16" />
        <p className="mt-5 max-w-xl text-base leading-relaxed text-text-dark-muted">
          {locale === "ar" ? CONTACT.description_ar : CONTACT.description_en}
        </p>
      </Reveal>

      <Reveal delay={0.05}>
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
                  {pickLocalized(settings, locale, "address")}
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
                  href={`tel:${phoneTel}`}
                  dir="ltr"
                >
                  {phoneDisplay}
                </a>
              </div>
            </div>
          </li>

          {waUrl ? (
            <li className="py-5">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-4 rounded-md outline-none transition hover:bg-gold/5 focus-visible:ring-2 focus-visible:ring-gold/40"
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
                      {phoneDisplay}
                    </span>
                  </div>
                </div>
              </a>
            </li>
          ) : null}

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

      <Reveal delay={0.08}>
        <div className="flex gap-4">
          <Mail className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
          <div>
            <p className="text-xs font-semibold tracking-wide text-text-dark-muted uppercase">
              {copy.contactEmails}
            </p>
            <ul className="mt-3 space-y-2.5">
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

      {socials.length ? (
        <Reveal delay={0.12}>
          <div>
            <p className="text-xs font-semibold tracking-wide text-text-dark-muted uppercase">
              {copy.followUs}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    className="inline-flex size-11 items-center justify-center rounded-md border border-gold/35 text-text-dark transition hover:border-gold hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}
