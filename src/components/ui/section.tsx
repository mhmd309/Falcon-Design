import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.22em]",
            light ? "text-gold-soft" : "text-gold",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-2xl font-semibold tracking-tight text-text-dark sm:text-3xl md:text-4xl",
          light && "text-text",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed text-text-dark-muted sm:mt-4 sm:text-base md:text-lg",
            light && "text-text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-steel/30 bg-white/60 px-6 py-12 text-center">
      <p className="text-lg font-medium text-text-dark">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-text-dark-muted">{description}</p>
      ) : null}
    </div>
  );
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-steel-dark",
        className,
      )}
    >
      {children}
    </span>
  );
}
