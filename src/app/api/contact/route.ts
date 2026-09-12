import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import {
  checkRateLimit,
  contactFormSchema,
} from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form submission." },
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
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    if (!isSupabaseConfigured()) {
      // Graceful degradation for local demo without Supabase
      return NextResponse.json({
        ok: true,
        persisted: false,
        message: "Received. Connect Supabase to persist messages.",
      });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
      locale: parsed.data.locale || null,
      ip_hash: ipHash,
      status: "new",
    });

    if (error) {
      return NextResponse.json(
        { error: "Unable to send your message right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, persisted: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to send your message right now." },
      { status: 500 },
    );
  }
}
