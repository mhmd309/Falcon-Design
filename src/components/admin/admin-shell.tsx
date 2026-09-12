"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import { SetupBanner } from "@/components/admin/setup-banner";
import { ToastProvider } from "@/components/admin/toast";
import type { ReactNode } from "react";

export function AdminShell({
  children,
  configured,
}: {
  children: ReactNode;
  configured: boolean;
}) {
  return (
    <ToastProvider>
      <div className="admin-shell flex min-h-screen bg-bg text-text">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <SetupBanner configured={configured} />
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
