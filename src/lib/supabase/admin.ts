import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function jwtRole(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as {
      role?: string;
    };
    return json.role ?? null;
  } catch {
    return null;
  }
}

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error("Supabase Storage is not configured");
  }

  const role = jwtRole(key);
  if (role && role !== "service_role") {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY must be the service_role key (got "${role}")`,
    );
  }

  // Reset cached client if env changed during dev hot reload.
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}

export function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || "projects";
}
