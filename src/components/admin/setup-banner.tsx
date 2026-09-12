"use client";

import { AlertTriangle } from "lucide-react";

export function SetupBanner({ configured }: { configured: boolean }) {
  if (configured) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-md border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-text-dark">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
      <div>
        <p className="font-semibold">Supabase not configured</p>
        <p className="mt-1 text-text-dark-muted">
          Set <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your
          environment. Forms display fallback data and changes will not persist until
          Supabase is connected.
        </p>
      </div>
    </div>
  );
}
