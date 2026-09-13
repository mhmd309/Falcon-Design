import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { HomeHero } from "@/components/home/hero";
import { StatsSection } from "@/components/home/stats-section";
import { FeaturedServices } from "@/components/home/featured-services";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { FeaturedCertificates } from "@/components/home/featured-certificates";
import { AppDownload } from "@/components/home/app-download";
import { CtaBanner } from "@/components/home/cta-banner";
import {
  getCertificates,
  getGalleryItems,
  getPageBySlug,
  getSection,
  getServices,
  getSiteSettings,
  getStatistics,
} from "@/lib/data";
import {
  JsonLd,
  buildPageMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageBySlug("home");
  return buildPageMetadata(locale as Locale, "", page);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;

  const [hero, cta, stats, services, projects, certs, settings] =
    await Promise.all([
      getSection("home", "hero"),
      getSection("home", "cta"),
      getStatistics(),
      getServices({ featuredOnly: true }),
      getGalleryItems({ featuredOnly: true }),
      getCertificates({ featuredOnly: true }),
      getSiteSettings(),
    ]);

  return (
    <>
      <JsonLd data={organizationJsonLd(settings, locale)} />
      <JsonLd data={websiteJsonLd(locale)} />
      {hero ? <HomeHero locale={locale} section={hero} /> : null}
      <StatsSection locale={locale} stats={stats} />
      <FeaturedServices locale={locale} services={services} />
      <FeaturedProjects locale={locale} items={projects} />
      <FeaturedCertificates locale={locale} items={certs} />
      <AppDownload locale={locale} />
      <CtaBanner locale={locale} section={cta} />
    </>
  );
}
