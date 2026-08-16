// Mirrors the visual layout of frontend/src/components/customer/EstimateDocument.jsx
// (line items, totals) — wrapped in the shared brand layout so this looks like
// it came from the same place as the welcome/invoice/status emails.
import { emailLayout } from "./layout.js";
import { INK, INK_MUTED, BORDER, money, escapeHtml, ctaButton } from "./shared.js";

export function buildEstimateEmailHtml({ estimate, customer, dashboardUrl }) {
  const lineItems = estimate.lineItems || [];
  const subtotal = lineItems.reduce((sum, i) => sum + Number(i.qty || 0) * Number(i.price || 0), 0);
  const total = Number(estimate.total ?? (subtotal + Number(estimate.visitCharges || 0) - Number(estimate.discount || 0)));
  const validUntil = estimate.validUntil
    ? new Date(estimate.validUntil).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  const rows = lineItems
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};color:${INK};font-size:14px;">${escapeHtml(item.name)}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};color:${INK_MUTED};font-size:14px;text-align:center;">${item.qty}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};color:${INK_MUTED};font-size:14px;text-align:right;">${money(item.price)}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};color:${INK};font-size:14px;font-weight:600;text-align:right;">${money(item.qty * item.price)}</td>
        </tr>`
    )
    .join("");

  const contentHtml = `
    <p style="color:${INK};font-size:15px;margin:0 0 4px;">Hi ${escapeHtml(customer?.name || estimate.customerName || "there")},</p>
    <p style="color:${INK_MUTED};font-size:14px;line-height:1.6;margin:0 0 24px;">
      Here's your estimate <strong style="color:${INK};">${escapeHtml(estimate.estimateNumber || "")}</strong> for
      <strong style="color:${INK};">${escapeHtml(estimate.serviceName || lineItems[0]?.name || "your requested service")}</strong>${validUntil ? `, valid until ${validUntil}` : ""}.
      Review the details below or open it on your dashboard any time.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td style="padding-bottom:8px;border-bottom:1px solid ${BORDER};font-size:11px;font-weight:bold;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.05em;">Service</td>
        <td style="padding-bottom:8px;border-bottom:1px solid ${BORDER};font-size:11px;font-weight:bold;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.05em;text-align:center;">Qty</td>
        <td style="padding-bottom:8px;border-bottom:1px solid ${BORDER};font-size:11px;font-weight:bold;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.05em;text-align:right;">Price</td>
        <td style="padding-bottom:8px;border-bottom:1px solid ${BORDER};font-size:11px;font-weight:bold;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.05em;text-align:right;">Amount</td>
      </tr>
      ${rows}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      <tr>
        <td></td>
        <td style="width:220px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:3px 0;color:${INK_MUTED};font-size:13px;">Subtotal</td>
              <td style="padding:3px 0;color:${INK_MUTED};font-size:13px;text-align:right;">${money(subtotal)}</td>
            </tr>
            ${Number(estimate.visitCharges) > 0 ? `
            <tr>
              <td style="padding:3px 0;color:${INK_MUTED};font-size:13px;">Visit Charge</td>
              <td style="padding:3px 0;color:${INK_MUTED};font-size:13px;text-align:right;">${money(estimate.visitCharges)}</td>
            </tr>` : ""}
            ${Number(estimate.discount) > 0 ? `
            <tr>
              <td style="padding:3px 0;color:#059669;font-size:13px;">Discount</td>
              <td style="padding:3px 0;color:#059669;font-size:13px;text-align:right;">- ${money(estimate.discount)}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:10px 0 0;border-top:1px solid ${BORDER};color:${INK};font-size:15px;font-weight:bold;">Estimated Total</td>
              <td style="padding:10px 0 0;border-top:1px solid ${BORDER};color:${INK};font-size:15px;font-weight:bold;text-align:right;">${money(total)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${ctaButton(dashboardUrl, "View & Approve Estimate")}

    <p style="color:${INK_MUTED};font-size:12px;line-height:1.6;margin:0;">
      This is an estimate, not a bill — final charges may vary slightly based on work actually performed. GST will be added on the final invoice.
    </p>`;

  return emailLayout({
    preheader: `Your ${escapeHtml(estimate.serviceName || "service")} estimate — ${money(total)}`,
    contentHtml,
  });
}
