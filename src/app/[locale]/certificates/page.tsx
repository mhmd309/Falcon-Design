import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { CertificatesGrid } from "@/components/certificates/certificates-grid";
import {
  getCertificates,
  getPageBySlug,
  getSection,
} from "@/lib/data";
import {
  JsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo/metadata";
import { pickLocalized } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug("certificates");
  return buildPageMetadata(locale as Locale, "/certificates", page);
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const [items, intro] = await Promise.all([
    getCertificates(),
    getSection("certificates", "intro"),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: locale === "ar" ? "الرئيسية" : "Home", path: "" },
          {
            name: locale === "ar" ? "الشهادات" : "Certificates",
            path: "/certificates",
          },
        ])}
      />
      <CertificatesGrid
        locale={locale}
        items={items}
        title={intro ? pickLocalized(intro, locale, "title") : undefined}
        description={
          intro
            ? [
                pickLocalized(intro, locale, "subtitle"),
                pickLocalized(intro, locale, "description"),
              ]
                .filter(Boolean)
                .join(" — ")
            : undefined
        }
      />
    </>
  );
}
