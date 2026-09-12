import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) {
    return { user: null, isAdmin: false as const };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("admin_users")
    .select("id, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  return {
    user,
    isAdmin: Boolean(data) as boolean,
  };
}

export async function assertAdmin() {
  const { user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
