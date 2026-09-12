import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import {
  getContactEmails,
  getContactSettings,
  getPageBySlug,
} from "@/lib/data/queries";
import {
  JsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
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
  const [settings, emails] = await Promise.all([
    getContactSettings(),
    getContactEmails(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: locale === "ar" ? "الرئيسية" : "Home", path: "" },
          {
            name: locale === "ar" ? "تواصل معنا" : "Contact",
            path: "/contact",
          },
        ])}
      />
      <section className="section-space">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ContactInfo locale={locale} settings={settings} emails={emails} />
          <ContactForm locale={locale} />
        </div>
      </section>
    </>
  );
}
