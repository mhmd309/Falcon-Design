import type { ReactNode } from "react";
import { MapPin, Phone, Clock, Mail, MessageCircle } from "lucide-react";
import type { Locale } from "@/config/site";
import type { ContactEmail, ContactSettings } from "@/types/database";
import { pickLocalized, safeExternalUrl } from "@/lib/utils";
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
  const mapUrl =
    safeExternalUrl(settings.google_maps_url) ||
    (settings.latitude && settings.longitude
      ? `https://maps.google.com/?q=${settings.latitude},${settings.longitude}`
      : null);
  const embedSrc =
    settings.latitude && settings.longitude
      ? `https://maps.google.com/maps?q=${settings.latitude},${settings.longitude}&z=12&output=embed`
      : null;

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
    settings.phone
      ? {
          icon: Phone,
          label: copy.phone,
          content: (
            <a
              className="text-text-dark transition hover:text-gold"
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
            >
              {settings.phone}
            </a>
          ),
        }
      : null,
    settings.whatsapp
      ? {
          icon: MessageCircle,
          label: copy.whatsapp,
          content: (
            <a
              className="text-text-dark transition hover:text-gold"
              href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
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

      {embedSrc ? (
        <Reveal delay={0.12}>
          <div className="overflow-hidden rounded-2xl border border-steel/15">
            <iframe
              title="Google Maps"
              src={embedSrc}
              className="h-56 w-full border-0 sm:h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-gold transition hover:text-gold-soft"
            >
              {locale === "ar" ? "فتح في خرائط جوجل" : "Open in Google Maps"}
            </a>
          ) : null}
        </Reveal>
      ) : null}
    </div>
  );
}
