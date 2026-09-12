import nodemailer from "nodemailer";
import { contactEmails } from "@/lib/data/content";
import type { ContactFormInput } from "@/lib/validation/schemas";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeHeaderValue(value: string) {
  return value.replace(/[\0\r\n]+/g, " ").trim();
}

function sanitizeBodyValue(value: string) {
  return value.replace(/\0/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
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

function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function isEmailConfigured() {
  return isSmtpConfigured() || isResendConfigured();
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
    sanitizeBodyValue(data.message),
  ];
  return lines.join("\n");
}

/**
 * Resend only allows verified domains. Consumer mailboxes (Gmail, etc.)
 * must use Resend's onboarding sender unless RESEND_FROM_EMAIL is set.
 */
function resolveResendFrom() {
  const configured =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.CONTACT_FROM_EMAIL?.trim();

  if (configured) {
    const email = extractEmailAddress(configured);
    if (
      email &&
      !/@(gmail|googlemail|yahoo|outlook|hotmail|live|icloud)\./i.test(email)
    ) {
      return `Falcon Design <${email}>`;
    }
  }

  return "Falcon Design <onboarding@resend.dev>";
}

async function sendWithResend(data: ContactFormInput, recipients: string[]) {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const subject = `[Falcon Design] ${sanitizeHeaderValue(data.subject)}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resolveResendFrom(),
      to: recipients,
      reply_to: sanitizeHeaderValue(data.email),
      subject,
      text: buildEmailBody(data),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Resend failed: ${response.status}${detail ? ` ${detail.slice(0, 200)}` : ""}`,
    );
  }
}

async function sendWithSmtp(data: ContactFormInput, recipients: string[]) {
  const port = Number(process.env.SMTP_PORT || 587);
  const fromEmail = resolveFromEmail();
  if (!fromEmail) {
    throw new Error("Invalid CONTACT_FROM_EMAIL / SMTP_USER");
  }

  // Gmail app passwords are often copied with spaces.
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
  if (!pass) {
    throw new Error("SMTP_PASS is empty");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 20_000,
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass,
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
    console.error("[contact-email] not_configured");
    return { ok: false as const, reason: "not_configured" as const };
  }

  const recipients = getRecipients();
  if (!recipients.length) {
    console.error("[contact-email] no_recipients");
    return { ok: false as const, reason: "no_recipients" as const };
  }

  const attempts: Array<"smtp" | "resend"> = [];
  // Prefer SMTP for Gmail/app-password setups used in production.
  if (isSmtpConfigured()) attempts.push("smtp");
  if (isResendConfigured()) attempts.push("resend");

  let lastError: unknown;

  for (const attempt of attempts) {
    try {
      if (attempt === "smtp") {
        await sendWithSmtp(data, recipients);
      } else {
        await sendWithResend(data, recipients);
      }
      return { ok: true as const };
    } catch (error) {
      lastError = error;
      console.error(
        `[contact-email] ${attempt}_failed`,
        error instanceof Error ? error.message : "send_failed",
      );
    }
  }

  console.error(
    "[contact-email] send_failed",
    lastError instanceof Error ? lastError.message : "send_failed",
  );
  return { ok: false as const, reason: "send_failed" as const };
}
