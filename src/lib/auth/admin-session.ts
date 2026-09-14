import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "fd_admin_session";
const SESSION_TTL = "7d";

type AdminSessionPayload = {
  role: "admin";
  email: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET must be set (min 16 characters)");
  }
  return new TextEncoder().encode(secret);
}

export function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    return null;
  }
  return { email, password };
}

export async function createAdminSessionToken(email: string) {
  return new SignJWT({ role: "admin", email } satisfies AdminSessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecret());
}

export async function verifyAdminSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin" || typeof payload.email !== "string") {
      return null;
    }
    return { email: payload.email } as const;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export function adminSessionCookieOptions(token: string) {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearAdminSessionCookieOptions() {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
