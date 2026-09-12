"use client";

import { useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page section-space text-center">
      <h1 className="text-2xl font-semibold text-text-dark">
        Something went wrong / حدث خطأ ما
      </h1>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-text-dark"
        >
          Try again
        </button>
        <Link
          href={`/${siteConfig.defaultLocale}`}
          className="rounded-md border border-steel/30 px-5 py-2.5 text-sm font-semibold"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
