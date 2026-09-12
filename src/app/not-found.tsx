import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Page not found | Falcon Design",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-text-dark">
          Page not found / الصفحة غير موجودة
        </h1>
        <p className="mt-3 text-text-dark-muted">
          The page you are looking for does not exist.
          <br />
          الصفحة التي تبحث عنها غير متاحة.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${siteConfig.defaultLocale}`}
            className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-text-dark"
            hrefLang="en"
          >
            Back to Home
          </Link>
          <Link
            href="/ar"
            className="rounded-md border border-steel/30 px-5 py-2.5 text-sm font-semibold text-text-dark"
            hrefLang="ar"
            lang="ar"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
