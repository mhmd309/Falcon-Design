"use client";

import { useEffect } from "react";
import type { Locale } from "@/config/site";
import { localeDirection } from "@/config/site";

export function LocaleHtmlAttributes({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirection[locale];
  }, [locale]);
  return null;
}
