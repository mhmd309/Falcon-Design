import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json(
    session ? { authenticated: true, email: session.email } : { authenticated: false },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
