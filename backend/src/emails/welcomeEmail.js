import { emailLayout } from "./layout.js";
import { INK, INK_MUTED, escapeHtml, ctaButton } from "./shared.js";

export function buildWelcomeEmailHtml({ name, dashboardUrl }) {
  const contentHtml = `
    <p style="color:${INK};font-size:15px;margin:0 0 4px;">Hi ${escapeHtml(name || "there")},</p>
    <h2 style="color:${INK};font-size:18px;font-weight:bold;margin:12px 0 8px;">Welcome to HomeCare247!</h2>
    <p style="color:${INK_MUTED};font-size:14px;line-height:1.6;margin:0 0 20px;">
      Your account is ready. Here's what you can do from your dashboard:
    </p>
    <ul style="color:${INK_MUTED};font-size:14px;line-height:1.9;margin:0 0 20px;padding-left:20px;">
      <li>Book a service — cleaning, plumbing, electrical, and more</li>
      <li>Track requests and estimates in real time</li>
      <li>View invoices and payment status</li>
    </ul>
    ${ctaButton(dashboardUrl, "Go to Dashboard")}`;

  return emailLayout({ preheader: "Welcome to HomeCare247", contentHtml });
}
