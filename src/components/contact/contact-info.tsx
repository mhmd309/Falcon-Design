import type { ReactNode } from "react";
import { MapPin, Phone, Clock, Mail, MessageCircle } from "lucide-react";
import type { Locale } from "@/config/site";
import type { ContactEmail, ContactSettings } from "@/types/database";
import { phoneDigits, pickLocalized, whatsappChatUrl } from "@/lib/utils";
import { t } from "@/lib/i18n/ui";
import { Reveal } from "@/components/ui/motion";

export function ContactInfo({
  locale,
  settings,
  emails,
}: {
  locale: Locale;
  settings: ContactSettings;
  emails: ContactEmail[];
}) {
  const copy = t(locale);
  const phoneHref = phoneDigits(settings.phone);
  const whatsappHref = whatsappChatUrl(settings.whatsapp);

  const rows = [
    {
      icon: MapPin,
      label: copy.address,
      content: (
        <>
          <span className="block font-medium text-text-dark">
            {pickLocalized(settings, locale, "company_name")}
          </span>
          <span className="mt-1 block text-text-dark-muted">
            {pickLocalized(settings, locale, "address")}
          </span>
        </>
      ),
    },
    settings.phone && phoneHref
      ? {
          icon: Phone,
          label: copy.phone,
          content: (
            <a
              className="text-text-dark transition hover:text-gold"
              href={`tel:+${phoneHref}`}
              dir="ltr"
            >
              {settings.phone}
            </a>
          ),
        }
      : null,
    settings.whatsapp && whatsappHref
      ? {
          icon: MessageCircle,
          label: copy.whatsapp,
          content: (
            <a
              className="text-text-dark transition hover:text-gold"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
            >
              {settings.whatsapp}
            </a>
          ),
        }
      : null,
    {
      icon: Clock,
      label: copy.hours,
      content: (
        <span className="text-text-dark-muted">
          {pickLocalized(settings, locale, "business_hours")}
        </span>
      ),
    },
  ].filter(Boolean) as Array<{
    icon: typeof MapPin;
    label: string;
    content: ReactNode;
  }>;

  return (
    <div className="space-y-10">
      <Reveal>
        <h2 className="text-2xl font-semibold tracking-tight text-text-dark sm:text-3xl">
          {locale === "ar" ? "بيانات التواصل" : "Contact details"}
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-text-dark-muted">
          {pickLocalized(settings, locale, "page_description")}
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <ul className="space-y-0 divide-y divide-steel/15 border-y border-steel/15">
          {rows.map((row) => (
            <li key={row.label} className="flex gap-4 py-5">
              <row.icon
                className="mt-0.5 size-5 shrink-0 text-gold"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-text-dark-muted uppercase">
                  {row.label}
                </p>
                <div className="mt-1.5 text-sm sm:text-base">{row.content}</div>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      {emails.length ? (
        <Reveal delay={0.1}>
          <div className="flex gap-4">
            <Mail className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
            <div>
              <p className="text-xs font-semibold tracking-wide text-text-dark-muted uppercase">
                {copy.contactEmails}
              </p>
              <ul className="mt-3 space-y-2">
                {emails.map((email) => (
                  <li key={email.id}>
                    <a
                      href={`mailto:${email.email}`}
                      className="group inline-flex flex-wrap items-baseline gap-x-2 text-sm sm:text-base"
                    >
                      <span className="font-medium text-text-dark">
                        {pickLocalized(email, locale, "label")}
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
      ) : null}
    </div>
  );
}
