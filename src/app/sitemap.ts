import type { MetadataRoute } from "next";
import { getSiteUrl, siteConfig } from "@/config/site";

const paths = ["", "/about", "/services", "/gallery", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return siteConfig.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified,
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
