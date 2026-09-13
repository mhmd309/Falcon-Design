"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Statistic } from "@/types/content";
import type { Locale } from "@/config/site";
import { pickLocalized } from "@/lib/utils";
import { Reveal } from "@/components/ui/motion";

function AnimatedValue({
  value,
  prefix,
  suffix,
}: {
  value: string;
  prefix?: string | null;
  suffix?: string | null;
}) {
  const reduce = useReducedMotion();
  const numeric = Number(value.replace(/[^\d.]/g, ""));
  const isNumeric = !Number.isNaN(numeric) && /^\d/.test(value);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce || !isNumeric) {
      setDisplay(value);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        setDisplay("0");
        let frame = 0;
        const total = 36;
        const id = window.setInterval(() => {
          frame += 1;
          const next = Math.round((numeric * frame) / total);
          setDisplay(String(next));
          if (frame >= total) {
            setDisplay(value);
            window.clearInterval(id);
          }
        }, 20);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, reduce, isNumeric, numeric]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function StatsSection({
  stats,
  locale,
}: {
  stats: Statistic[];
  locale: Locale;
}) {
  if (!stats.length) return null;
  return (
    <section className="border-b border-steel/15 bg-bg text-text">
      <div className="container-page grid grid-cols-2 place-items-center gap-6 py-10 md:grid-cols-4 md:py-14">
        {stats.map((stat, index) => (
          <Reveal key={stat.id} delay={index * 0.05} className="w-full">
            <div className="text-center">
              <p className="text-3xl font-semibold text-gold md:text-4xl">
                <AnimatedValue
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </p>
              <p className="mt-2 text-sm text-text-muted">
                {pickLocalized(stat, locale, "label")}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
