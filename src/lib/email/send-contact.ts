import nodemailer from "nodemailer";
import { contactEmails } from "@/lib/data/content";
import type { ContactFormInput } from "@/lib/validation/schemas";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeHeaderValue(value: string) {
  return value.replace(/[\0\r\n]+/g, " ").trim();
}

function extractEmailAddress(value: string) {
  const trimmed = value.trim();
  const angled = trimmed.match(/<([^>]+)>/);
  const candidate = (angled?.[1] || trimmed).trim();
  return EMAIL_RE.test(candidate) ? candidate : null;
}

function getRecipients() {
  const fromEnv = process.env.CONTACT_TO_EMAIL?.trim();
  if (fromEnv) {
    return fromEnv
      .split(",")
      .map((e) => extractEmailAddress(e))
      .filter((e): e is string => Boolean(e));
  }

  return contactEmails
    .map((e) => extractEmailAddress(e.email))
    .filter((e): e is string => Boolean(e))
    .slice(0, 1);
}

function resolveFromEmail() {
  const candidates = [
    process.env.CONTACT_FROM_EMAIL,
    process.env.SMTP_USER,
  ];

  for (const candidate of candidates) {
    const email = candidate ? extractEmailAddress(candidate) : null;
    if (email) return email;
  }

  return null;
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
    `Name: ${sanitizeHeaderValue(data.name)}`,
    `Email: ${sanitizeHeaderValue(data.email)}`,
    `Phone: ${data.phone ? sanitizeHeaderValue(data.phone) : "-"}`,
    `Locale: ${data.locale || "-"}`,
    `Subject: ${sanitizeHeaderValue(data.subject)}`,
    "",
    "Message:",
    sanitizeHeaderValue(data.message),
  ];
  return lines.join("\n");
}

async function sendWithResend(data: ContactFormInput, recipients: string[]) {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const fromEmail = resolveFromEmail() || "onboarding@resend.dev";
  const from = `Falcon Design <${fromEmail}>`;
  const subject = `[Falcon Design] ${sanitizeHeaderValue(data.subject)}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      reply_to: sanitizeHeaderValue(data.email),
      subject,
      text: buildEmailBody(data),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend failed: ${response.status}`);
  }
}

async function sendWithSmtp(data: ContactFormInput, recipients: string[]) {
  const port = Number(process.env.SMTP_PORT || 587);
  const fromEmail = resolveFromEmail();
  if (!fromEmail) {
    throw new Error("Invalid CONTACT_FROM_EMAIL / SMTP_USER");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: { name: "Falcon Design", address: fromEmail },
    to: recipients,
    replyTo: sanitizeHeaderValue(data.email),
    subject: `[Falcon Design] ${sanitizeHeaderValue(data.subject)}`,
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
    console.error("[contact-email]", error instanceof Error ? error.message : "send_failed");
    return { ok: false as const, reason: "send_failed" as const };
  }
}
