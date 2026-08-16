import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
});

export const env = {
    PORT: process.env.PORT ?? 5000,
    MONGO_URI: process.env.MONGO_URI,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    // Brevo's transactional email HTTP API (v3/smtp/email) — deliberately
    // not the SMTP relay. SMTP auth on this account is gated by an
    // IP-authorization allowlist that a rotating/CGNAT public IP (as seen in
    // local dev here) can never reliably satisfy; the HTTPS API has no such
    // restriction. Generated in the dashboard under SMTP & API → API keys & MCP.
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    // Must be a sender verified in Brevo (Senders, Domains & Dedicated IPs →
    // Senders) — unlike Resend there's no shared test address, so this can't
    // default to a placeholder domain that will actually send.
    MAIL_FROM: process.env.MAIL_FROM,

    // Base URL of the customer-facing app, used to build shareable dashboard
    // links (estimate emails, copy-link button) — not the API's own URL.
    CUSTOMER_APP_URL: process.env.CUSTOMER_APP_URL || "http://localhost:3000",
}