import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { getMergedGalleryItems, getPageBySlug } from "@/lib/data";
import { t } from "@/lib/i18n/ui";
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
  const copy = t(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: copy.home, path: "" },
          { name: copy.gallery, path: "/gallery" },
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
