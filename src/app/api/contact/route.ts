import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import {
  checkRateLimit,
  contactFormSchema,
} from "@/lib/validation/schemas";
import { resolveLocale, v } from "@/lib/i18n/validation";

export async function POST(request: Request) {
  let locale = resolveLocale(null);

  try {
    const body = await request.json();
    locale = resolveLocale(
      typeof body?.locale === "string" ? body.locale : null,
    );
    const messages = v(locale);

    const parsed = contactFormSchema.safeParse(body);
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

      return NextResponse.json(
        { error: messages.invalidForm, fieldErrors },
        { status: 400 },
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const forwarded = request.headers.get("x-forwarded-for") || "local";
    const ipHash = createHash("sha256").update(forwarded).digest("hex");
    const rate = checkRateLimit(`contact:${ipHash}`, 5, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: messages.rateLimit }, { status: 429 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        ok: true,
        persisted: false,
        message:
          locale === "ar"
            ? "تم الاستلام. اربط Supabase لحفظ الرسائل."
            : "Received. Connect Supabase to persist messages.",
      });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
      locale: parsed.data.locale || locale,
      ip_hash: ipHash,
      status: "new",
    });

    if (error) {
      return NextResponse.json({ error: messages.sendFailed }, { status: 500 });
    }

    return NextResponse.json({ ok: true, persisted: true });
  } catch {
    return NextResponse.json(
      { error: v(locale).sendFailed },
      { status: 500 },
    );
  }
}
