import { env } from "./env.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Splits "HomeCare <hello@homecare-online.com>" into Brevo's {name, email}
// sender shape. Falls back to treating the whole string as the email if
// there's no display name — same tolerance nodemailer's `from` string had.
function parseFromAddress(fromString) {
  const match = /^(.*)<(.+)>$/.exec(fromString || "");
  if (match) {
    return { name: match[1].trim() || undefined, email: match[2].trim() };
  }
  return { email: (fromString || "").trim() };
}

// Brevo's transactional email HTTP API — deliberately not the SMTP relay.
// SMTP auth on this account is gated by an IP-authorization allowlist that a
// rotating/CGNAT public IP (as seen in local dev) can never reliably
// satisfy; this HTTPS endpoint only checks the API key, no IP restriction.
export async function sendEmail({ to, subject, html, replyTo, attachments }) {
  // Brevo's `attachment` field wants base64 `content` + `name`, not a raw
  // Buffer — the caller (e.g. sendInvoiceEmailWithPdf) passes Node Buffers
  // the same way nodemailer's `attachments` option would, so that shape is
  // converted here rather than making every caller know Brevo's wire format.
  const brevoAttachments = (attachments || []).map((a) => ({
    name: a.filename || a.name,
    content: Buffer.isBuffer(a.content) ? a.content.toString("base64") : a.content,
  }));

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: parseFromAddress(env.MAIL_FROM),
      to: [{ email: to }],
      subject,
      htmlContent: html,
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
      ...(brevoAttachments.length ? { attachment: brevoAttachments } : {}),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.message || `Brevo API error: HTTP ${response.status}`);
  }

  return response.json();
}
