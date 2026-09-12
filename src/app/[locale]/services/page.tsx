import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { ServicesGrid } from "@/components/services/services-grid";
import { getPageBySlug, getSection, getServices } from "@/lib/data/queries";
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
  const page = await getPageBySlug("services");
  return buildPageMetadata(locale as Locale, "/services", page);
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const [services, intro] = await Promise.all([
    getServices(),
    getSection("services", "intro"),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: locale === "ar" ? "الرئيسية" : "Home", path: "" },
          {
            name: locale === "ar" ? "خدماتنا" : "Services",
            path: "/services",
          },
        ])}
      />
      <ServicesGrid locale={locale} services={services} intro={intro} />
    </>
  );
}
