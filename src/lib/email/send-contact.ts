import nodemailer from "nodemailer";
import { contactEmails } from "@/lib/data/content";
import type { ContactFormInput } from "@/lib/validation/schemas";

function getRecipients() {
  const fromEnv = process.env.CONTACT_TO_EMAIL?.trim();
  if (fromEnv) {
    return fromEnv
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
  }

  return contactEmails
    .filter((e) => e.email.includes("@"))
    .slice(0, 1)
    .map((e) => e.email);
}

function isEmailConfigured() {
  if (process.env.RESEND_API_KEY?.trim()) return true;
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

function buildEmailBody(data: ContactFormInput) {
  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "-"}`,
    `Locale: ${data.locale || "-"}`,
    `Subject: ${data.subject}`,
    "",
    "Message:",
    data.message,
  ];
  return lines.join("\n");
}

async function sendWithResend(data: ContactFormInput, recipients: string[]) {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Falcon Design <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      reply_to: data.email,
      subject: `[Falcon Design] ${data.subject}`,
      text: buildEmailBody(data),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend failed: ${response.status} ${detail}`);
  }
}

async function sendWithSmtp(data: ContactFormInput, recipients: string[]) {
  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    process.env.SMTP_USER ||
    "Falcon Design";

  await transporter.sendMail({
    from: `"Falcon Design" <${from}>`,
    to: recipients.join(", "),
    replyTo: data.email,
    subject: `[Falcon Design] ${data.subject}`,
    text: buildEmailBody(data),
  });
}

export async function sendContactEmail(data: ContactFormInput) {
  if (!isEmailConfigured()) {
    return { ok: false as const, reason: "not_configured" as const };
  }

  const recipients = getRecipients();
  if (!recipients.length) {
    return { ok: false as const, reason: "no_recipients" as const };
  }

  try {
    if (process.env.RESEND_API_KEY?.trim()) {
      await sendWithResend(data, recipients);
    } else {
      await sendWithSmtp(data, recipients);
    }
    return { ok: true as const };
  } catch (error) {
    console.error("[contact-email]", error);
    return { ok: false as const, reason: "send_failed" as const };
  }
}
