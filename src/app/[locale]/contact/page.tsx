import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { Reveal } from "@/components/ui/motion";
import { getPageBySlug, getSiteSettings } from "@/lib/data";
import { t } from "@/lib/i18n/ui";
import {
  JsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  contactPageJsonLd,
} from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug("contact");
  return buildPageMetadata(locale as Locale, "/contact", page);
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const settings = await getSiteSettings();
  const copy = t(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: copy.home, path: "" },
          { name: copy.contact, path: "/contact" },
        ])}
      />
      <JsonLd data={contactPageJsonLd(locale, settings.phone)} />

      <section className="relative overflow-hidden border-b border-steel/15 bg-bg text-text">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 320px at 85% 10%, rgba(198,161,91,0.16), transparent 58%)",
          }}
          aria-hidden
        />
        <div className="container-page relative py-12 sm:py-16 md:py-18">
          <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">
            Falcon Design
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {copy.contactUs}
          </h1>
          <div className="metallic-line mt-5 w-20" />
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
            {copy.contactPageDesc}
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="container-page grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <ContactInfo locale={locale} settings={settings} />
          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-steel/15 bg-card p-6 shadow-[0_20px_50px_rgba(18,22,28,0.06)] sm:p-8">
              <ContactForm locale={locale} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
