import type { MetadataRoute } from "next";
import { getSiteUrl, siteConfig } from "@/config/site";

type PathConfig = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

/** Content last reviewed — update when pages/services/gallery change. */
const CONTENT_LAST_MODIFIED = new Date("2026-09-12");

const paths: PathConfig[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/certificates", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return siteConfig.locales.flatMap((locale) =>
    paths.map(({ path, changeFrequency, priority }) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: `${siteUrl}/en${path}`,
          ar: `${siteUrl}/ar${path}`,
          "x-default": `${siteUrl}/ar${path}`,
        },
      },
    })),
  );
}
