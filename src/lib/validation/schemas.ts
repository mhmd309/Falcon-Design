import { z } from "zod";

const noControlChars = (value: string) => !/[\0\r]/.test(value);
const noHeaderControlChars = (value: string) => !/[\0\r\n]/.test(value);

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .refine(noHeaderControlChars, { message: "Invalid characters." }),
  email: z
    .string()
    .trim()
    .email()
    .max(200)
    .refine(noHeaderControlChars, { message: "Invalid characters." }),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^\+?[0-9\s()-]*$/, { message: "Invalid phone." })
    .refine((value) => value.replace(/\D/g, "").length <= 15, {
      message: "Phone number must contain at most 15 digits.",
    })
    .optional(),
  subject: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .refine(noHeaderControlChars, { message: "Invalid characters." }),
  message: z
    .string()
    .trim()
    .min(10)
    .max(5000)
    .refine(noControlChars, { message: "Invalid characters." }),
  locale: z.enum(["en", "ar"]).optional(),
  website: z.string().max(100).optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX_KEYS = 5_000;

function pruneRateLimitStore(now: number) {
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) rateLimitStore.delete(key);
  }

  if (rateLimitStore.size <= RATE_LIMIT_MAX_KEYS) return;

  const overflow = rateLimitStore.size - RATE_LIMIT_MAX_KEYS;
  const oldest = [...rateLimitStore.entries()]
    .sort((a, b) => a[1].resetAt - b[1].resetAt)
    .slice(0, overflow);

  for (const [key] of oldest) {
    rateLimitStore.delete(key);
  }
}

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  pruneRateLimitStore(now);

  const entry = rateLimitStore.get(key);
  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true as const,
      remaining: limit - 1,
      retryAfterSec: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false as const,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return {
    allowed: true as const,
    remaining: limit - entry.count,
    retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

export function getRequestIp(request: Request) {
  const vercel =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim();
  if (vercel) return vercel;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    return parts.at(-1) || parts[0] || "local";
  }

  return "local";
}
