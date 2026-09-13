import type { ReactNode } from "react";
import type { Locale } from "@/config/site";
import { Reveal } from "@/components/ui/motion";

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M16.37 12.86c-.03-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.71-3.18-1.73-1.35-.14-2.64.8-3.32.8-.69 0-1.74-.78-2.86-.76-1.47.02-2.83.86-3.59 2.18-1.54 2.66-.39 6.6 1.1 8.76.73 1.05 1.6 2.23 2.74 2.19 1.1-.05 1.52-.71 2.85-.71 1.33 0 1.71.71 2.87.69 1.19-.02 1.94-1.07 2.66-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.35-3.52zM14.5 6.3c.6-.73 1.01-1.75.9-2.76-.87.03-1.93.58-2.55 1.31-.56.65-1.05 1.7-.92 2.7.97.08 1.97-.5 2.57-1.25z"
      />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path fill="#EA4335" d="M3.6 2.3 13.8 12 3.6 21.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z" />
      <path fill="#FBBC04" d="M17.4 8.4 14.7 11l-1 1 1 1 2.7 2.6 3.5-2c.6-.3.9-.8.9-1.4 0-.6-.3-1.1-.9-1.4l-3.5-2.4z" />
      <path fill="#4285F4" d="M3.6 21.7 13.8 12l2.9 2.9-9.8 5.6c-.7.4-1.5.4-2.1.1-.4-.2-.8-.5-1.2-.9z" />
      <path fill="#34A853" d="M13.8 12 3.6 2.3c.4-.4.8-.7 1.2-.9.6-.3 1.4-.3 2.1.1l9.8 5.6L13.8 12z" />
    </svg>
  );
}

function ComingSoonBadge({ locale }: { locale: Locale }) {
  return (
    <span className="absolute -top-2 end-3 inline-flex items-center gap-1.5 rounded-full border border-gold/35 bg-card px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-gold shadow-sm">
      <span className="size-1.5 animate-pulse rounded-full bg-gold" aria-hidden />
      {locale === "ar" ? "قريبًا" : "Soon"}
    </span>
  );
}

function StoreButton({
  locale,
  label,
  store,
  icon,
}: {
  locale: Locale;
  label: string;
  store: string;
  icon: ReactNode;
}) {
  return (
    <div
      role="link"
      aria-disabled="true"
      aria-label={`${store} — ${locale === "ar" ? "قريبًا" : "Coming soon"}`}
      className="relative inline-flex min-w-[220px] cursor-not-allowed items-center gap-3 rounded-xl border border-steel/20 bg-card px-5 py-3.5 text-start opacity-70 shadow-sm"
    >
      <ComingSoonBadge locale={locale} />
      {icon}
      <span className="min-w-0">
        <span className="block text-[0.65rem] tracking-wide text-text-dark-muted uppercase">
          {label}
        </span>
        <span className="block text-base font-semibold text-text-dark">{store}</span>
      </span>
    </div>
  );
}

export function AppDownload({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";

  return (
    <section
      className="section-space border-y border-steel/15 bg-surface"
      aria-labelledby="app-download-heading"
    >
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">
              Falcon Design
            </p>
            <h2
              id="app-download-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-text-dark sm:text-3xl md:text-4xl"
            >
              {isAr ? "حمّل تطبيقنا" : "Download our app"}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-dark-muted sm:text-base">
              {isAr
                ? "تطبيق فالكون ديزاين لأندرويد وiOS قادم قريبًا."
                : "The Falcon Design app for Android and iOS is coming soon."}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <StoreButton
              locale={locale}
              label={isAr ? "احصل عليه من" : "Get it on"}
              store="Google Play"
              icon={<PlayIcon className="size-9 shrink-0 grayscale" />}
            />
            <StoreButton
              locale={locale}
              label={isAr ? "حمّله من" : "Download on the"}
              store="App Store"
              icon={<AppleIcon className="size-9 shrink-0 text-text-dark" />}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
