"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import { v } from "@/lib/i18n/validation";
import { isSupabaseConfigured } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const messages = v(siteConfig.defaultLocale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(messages.emailFieldRequired);
      return;
    }
    if (!password) {
      setError(messages.passwordRequired);
      return;
    }

    if (!configured) {
      setError(messages.supabaseNotConfigured);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(messages.invalidCredentials);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError(messages.signInFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-lg border border-steel/20 bg-bg-elevated p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Building2 className="h-10 w-10 text-gold" />
          <h1 className="text-xl font-bold text-text">Falcon Design Admin</h1>
          <p className="text-sm text-text-muted">Sign in to manage site content</p>
        </div>

        {!configured && (
          <div className="mb-6 rounded-md border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-soft">
            Supabase is not configured. Login requires valid environment variables.
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!configured || loading}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!configured || loading}
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" className="w-full" disabled={!configured || loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
