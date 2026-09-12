import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { sendContactEmail } from "@/lib/email/send-contact";
import { checkRateLimit, contactFormSchema } from "@/lib/validation/schemas";
import { resolveLocale, v } from "@/lib/i18n/validation";

const MAX_BODY_BYTES = 12_000;

function jsonError(error: string, status: number, extra?: object) {
  return NextResponse.json(
    { error, ...extra },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export async function POST(request: Request) {
  let locale = resolveLocale(null);

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return jsonError(v(locale).invalidForm, 415);
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return jsonError(v(locale).invalidForm, 413);
    }

    const raw = await request.text();
    if (!raw || raw.length > MAX_BODY_BYTES) {
      return jsonError(v(locale).invalidForm, 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(raw) as unknown;
    } catch {
      return jsonError(v(locale).invalidForm, 400);
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonError(v(locale).invalidForm, 400);
    }

    const payload = body as Record<string, unknown>;
    locale = resolveLocale(
      typeof payload.locale === "string" ? payload.locale : null,
    );
    const messages = v(locale);

    const parsed = contactFormSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || "");
        if (!key || fieldErrors[key]) continue;
        if (key === "email") fieldErrors[key] = messages.emailInvalid;
        else if (key === "name") fieldErrors[key] = messages.nameRequired;
        else if (key === "subject") fieldErrors[key] = messages.subjectRequired;
        else if (key === "message") fieldErrors[key] = messages.messageTooShort;
        else fieldErrors[key] = messages.required;
      }

      return jsonError(messages.invalidForm, 400, { fieldErrors });
    }

    // Honeypot: pretend success for bots.
    if (parsed.data.website) {
      return NextResponse.json(
        { ok: true },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const forwarded = request.headers.get("x-forwarded-for") || "local";
    const ip = forwarded.split(",")[0]?.trim() || "local";
    const ipHash = createHash("sha256").update(ip).digest("hex");
    const rate = checkRateLimit(`contact:${ipHash}`, 5, 60_000);
    if (!rate.allowed) {
      return jsonError(messages.rateLimit, 429);
    }

    const sent = await sendContactEmail(parsed.data);
    if (!sent.ok) {
      // Never expose SMTP/config details to clients.
      return jsonError(messages.sendFailed, 500);
    }

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return jsonError(v(locale).sendFailed, 500);
  }
}

export function GET() {
  return jsonError("Method not allowed", 405);
}
