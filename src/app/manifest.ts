import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.nameAr,
    short_name: siteConfig.nameShortAr,
    description: siteConfig.tagline.ar,
    start_url: "/ar",
    display: "standalone",
    background_color: "#0f1419",
    theme_color: "#c6a15b",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
