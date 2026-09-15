import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
let clientKey: string | null = null;
const ensuredBuckets = new Set<string>();

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

export function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || "projects";
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
      `SUPABASE_SERVICE_ROLE_KEY must be the service_role key (got "${role}"). Open Supabase → Project Settings → API → service_role`,
    );
  }

  if (!client || clientKey !== key) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    clientKey = key;
    ensuredBuckets.clear();
  }

  return client;
}

export async function ensureStorageBucket() {
  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucket();

  if (ensuredBuckets.has(bucket)) return bucket;

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(`Could not list storage buckets: ${listError.message}`);
  }

  const exists = buckets?.some((item) => item.name === bucket);
  if (!exists) {
    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ],
    });

    if (
      createError &&
      !/already exists|duplicate/i.test(createError.message)
    ) {
      throw new Error(
        `Could not create bucket "${bucket}": ${createError.message}`,
      );
    }
  }

  ensuredBuckets.add(bucket);
  return bucket;
}
