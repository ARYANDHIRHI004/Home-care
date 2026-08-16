// Shared template for the three short confirmation emails — Booking
// Confirmed, Partner Assigned, Payment Verified. None of these are documents
// like the estimate/invoice ones, so they don't need their own layout: just
// a headline, one line of detail, and a link back to the dashboard.
import { emailLayout } from "./layout.js";
import { INK, INK_MUTED, escapeHtml, ctaButton } from "./shared.js";

export function buildStatusUpdateEmailHtml({ customerName, headline, detail, dashboardUrl, ctaLabel = "View on Dashboard" }) {
  const contentHtml = `
    <p style="color:${INK};font-size:15px;margin:0 0 4px;">Hi ${escapeHtml(customerName || "there")},</p>
    <h2 style="color:${INK};font-size:18px;font-weight:bold;margin:12px 0 8px;">${escapeHtml(headline)}</h2>
    <p style="color:${INK_MUTED};font-size:14px;line-height:1.6;margin:0 0 8px;">${escapeHtml(detail)}</p>
    ${ctaButton(dashboardUrl, ctaLabel)}`;

  return emailLayout({ preheader: headline, contentHtml });
}
