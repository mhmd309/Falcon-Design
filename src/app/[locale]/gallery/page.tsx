import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { getMergedGalleryItems, getPageBySlug } from "@/lib/data";
import {
  JsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  galleryJsonLd,
} from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug("gallery");
  return buildPageMetadata(locale as Locale, "/gallery", page);
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const items = await getMergedGalleryItems();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: locale === "ar" ? "الرئيسية" : "Home", path: "" },
          {
            name: locale === "ar" ? "المشاريع" : "Gallery",
            path: "/gallery",
          },
        ])}
      />
      <JsonLd data={galleryJsonLd(locale, items)} />
      <GalleryGrid
        key={items.map((item) => item.id).join("|") || "empty"}
        locale={locale}
        items={items}
      />
    </>
  );
}
