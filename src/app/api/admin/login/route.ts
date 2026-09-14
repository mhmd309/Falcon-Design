import { NextResponse } from "next/server";
import {
  adminSessionCookieOptions,
  createAdminSessionToken,
  getAdminCredentials,
} from "@/lib/auth/admin-session";

export const runtime = "nodejs";

function json(data: object, status = 200, headers?: HeadersInit) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

export async function POST(request: Request) {
  try {
    const credentials = getAdminCredentials();
    if (!credentials) {
      return json({ error: "Admin credentials are not configured" }, 503);
    }

    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase() || "";
    const password = body.password || "";

    if (
      email !== credentials.email ||
      password !== credentials.password
    ) {
      return json({ error: "Invalid email or password" }, 401);
    }

    const token = await createAdminSessionToken(email);
    const response = json({ ok: true, email });
    response.cookies.set(adminSessionCookieOptions(token));
    return response;
  } catch (error) {
    console.error("admin login failed", error);
    return json({ error: "Login failed" }, 500);
  }
}
