import { NextResponse } from "next/server";
import { clearAdminSessionCookieOptions } from "@/lib/auth/admin-session";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json(
    { ok: true },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
  response.cookies.set(clearAdminSessionCookieOptions());
  return response;
}
