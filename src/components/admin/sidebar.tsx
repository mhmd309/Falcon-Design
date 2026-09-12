"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Building2,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/home", label: "Home", icon: Home },
  { href: "/admin/about", label: "About", icon: Users },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/contact", label: "Contact", icon: MessageSquare },
  { href: "/admin/contact-emails", label: "Contact Emails", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (!isSupabaseConfigured()) {
      router.push("/admin/login");
      return;
    }
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <Building2 className="h-6 w-6 text-gold" />
        <div>
          <p className="text-sm font-bold text-text">Falcon Design</p>
          <p className="text-xs text-text-muted">Admin CMS</p>
        </div>
      </div>

      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
              active
                ? "bg-gold/15 text-gold-soft"
                : "text-text-muted hover:bg-bg-soft hover:text-text",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}

      <div className="mt-auto border-t border-steel/20 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start text-text-muted hover:text-text"
          disabled={loggingOut}
          onClick={() => void handleLogout()}
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Logging out…" : "Logout"}
        </Button>
      </div>
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-steel/20 bg-bg-elevated px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-gold" />
          <span className="font-semibold text-text">Admin</span>
        </div>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-md p-2 text-text-muted hover:bg-bg-soft hover:text-text"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-text-dark/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-steel/20 bg-bg-elevated transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {nav}
      </aside>
    </>
  );
}
