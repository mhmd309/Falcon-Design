import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/config/site";
import type { Certificate } from "@/types/database";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section";
import { localizedPath, pickLocalized } from "@/lib/utils";
import { t } from "@/lib/i18n/ui";

export function FeaturedCertificates({
  locale,
  items,
}: {
  locale: Locale;
  items: Certificate[];
}) {
  const copy = t(locale);
  if (!items.length) return null;

  return (
    <section
      className="section-space"
      aria-labelledby="featured-certificates-heading"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            title={copy.certificates}
            description={
              locale === "ar"
                ? "اعتمادات وشهادات تعكس التزامنا بالجودة والسلامة."
                : "Accreditations that reflect our commitment to quality and safety."
            }
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {items.slice(0, 3).map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <Link
                href={localizedPath(locale, "/certificates")}
                className="group block overflow-hidden rounded-xl border border-steel/15 bg-card shadow-sm transition hover:border-gold/40"
              >
                <span className="relative block aspect-[2/3] bg-white">
                  <Image
                    src={item.image_url}
                    alt={
                      pickLocalized(item, locale, "alt_text") ||
                      pickLocalized(item, locale, "title")
                    }
                    fill
                    sizes="(max-width:640px) 100vw, 33vw"
                    className="object-contain transition duration-500 group-hover:scale-[1.02]"
                  />
                </span>
                <span className="block border-t border-steel/15 bg-card px-4 py-3 text-center text-sm font-semibold text-text-dark">
                  {pickLocalized(item, locale, "title")}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link
            href={localizedPath(locale, "/certificates")}
            className="inline-flex items-center justify-center rounded-md border border-gold/40 px-6 py-2.5 text-sm font-semibold text-text-dark transition hover:border-gold hover:bg-gold/10"
          >
            {copy.viewAll}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
