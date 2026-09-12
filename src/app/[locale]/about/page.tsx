import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { AboutContent } from "@/components/about/about-content";
import {
  getCoreValues,
  getPageBySlug,
  getSection,
  getTimeline,
} from "@/lib/data";
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
  const page = await getPageBySlug("about");
  return buildPageMetadata(locale as Locale, "/about", page);
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const [intro, vision, mission, values, timeline] = await Promise.all([
    getSection("about", "introduction"),
    getSection("about", "vision"),
    getSection("about", "mission"),
    getCoreValues(),
    getTimeline(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: locale === "ar" ? "الرئيسية" : "Home", path: "" },
          { name: locale === "ar" ? "من نحن" : "About", path: "/about" },
        ])}
      />
      <AboutContent
        locale={locale}
        intro={intro}
        vision={vision}
        mission={mission}
        values={values}
        timeline={timeline}
      />
    </>
  );
}
