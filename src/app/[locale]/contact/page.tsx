import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { Reveal } from "@/components/ui/motion";
import {
  getContactEmails,
  getContactSettings,
  getPageBySlug,
} from "@/lib/data/queries";
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
  const page = await getPageBySlug("contact");
  return buildPageMetadata(locale as Locale, "/contact", page);
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const [settings, emails] = await Promise.all([
    getContactSettings(),
    getContactEmails(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: locale === "ar" ? "الرئيسية" : "Home", path: "" },
          {
            name: locale === "ar" ? "تواصل معنا" : "Contact",
            path: "/contact",
          },
        ])}
      />
      <section className="relative overflow-hidden border-b border-steel/15 bg-bg text-text">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(800px 400px at 80% 20%, rgba(198,161,91,0.18), transparent 60%), linear-gradient(135deg, #0b0d10 0%, #161c24 100%)",
          }}
        />
        <div className="container-page relative py-14 sm:py-18 md:py-20">
          <p className="text-xs font-semibold tracking-[0.22em] text-gold-soft uppercase">
            Falcon Design
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {locale === "ar" ? "لنبدأ مشروعك القادم" : "Let's start your next project"}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
            {locale === "ar"
              ? "فريقنا في العين وأبوظبي جاهز لمناقشة متطلبات الصلب والألمنيوم الخاصة بك."
              : "Our team in Al Ain and Abu Dhabi is ready to discuss your steel and aluminum requirements."}
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="container-page grid items-start gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <ContactInfo locale={locale} settings={settings} emails={emails} />
          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-steel/15 bg-white/80 p-6 shadow-[0_20px_60px_rgba(18,22,28,0.06)] backdrop-blur-sm sm:p-8">
              <ContactForm locale={locale} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
