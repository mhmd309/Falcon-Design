import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/admin";
import { isSupabaseConfigured } from "@/lib/utils";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const configured = isSupabaseConfigured();

  // Local/demo preview: allow read-only CMS UI when Supabase is not wired yet.
  // Mutations still fail safely via assertAdmin / notConfigured checks.
  if (configured) {
    const { isAdmin } = await requireAdmin();
    if (!isAdmin) {
      redirect("/admin/login");
    }
  }

  return <AdminShell configured={configured}>{children}</AdminShell>;
}
