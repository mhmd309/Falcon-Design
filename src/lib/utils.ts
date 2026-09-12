import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pickLocalized<T extends object>(
  row: T,
  locale: Locale,
  field: string,
): string {
  const record = row as Record<string, unknown>;
  const key = `${field}_${locale}`;
  const fallbackKey = `${field}_${locale === "ar" ? "en" : "ar"}`;
  const value = record[key] ?? record[fallbackKey] ?? "";
  return typeof value === "string" ? value : String(value ?? "");
}

export function localizedPath(locale: Locale, path = "") {
  const clean = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/${locale}${clean}`;
}

export function switchLocalePath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/");
  if (segments.length > 1 && (segments[1] === "en" || segments[1] === "ar")) {
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }
  return `/${nextLocale}`;
}

export function absoluteUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://falcon-design.vercel.app/";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function safeExternalUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}
