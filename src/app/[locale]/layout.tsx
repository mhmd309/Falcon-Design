import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { localeDirection, siteConfig, type Locale } from "@/config/site";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LocaleHtmlAttributes } from "@/components/layout/locale-html";
import {
  getContactEmails,
  getContactSettings,
  getSiteSettings,
} from "@/lib/data/queries";
import { pickLocalized } from "@/lib/utils";

export function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!siteConfig.locales.includes(localeParam as Locale)) {
    notFound();
  }
  const locale = localeParam as Locale;
  const [settings, contact, emails] = await Promise.all([
    getSiteSettings(),
    getContactSettings(),
    getContactEmails(),
  ]);

  return (
    <div lang={locale} dir={localeDirection[locale]}>
      <LocaleHtmlAttributes locale={locale} />
      <Navbar
        locale={locale}
        companyName={pickLocalized(settings, locale, "company_name")}
      />
      <main id="main-content">{children}</main>
      <Footer
        locale={locale}
        settings={settings}
        contact={contact}
        emails={emails}
      />
    </div>
  );
}
