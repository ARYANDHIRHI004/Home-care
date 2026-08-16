// Mirrors the visual layout of the customer invoice preview page
// (frontend/src/app/customer/invoices/[invoiceId]/preview/page.js) — line
// items and totals — wrapped in the shared brand layout. No "Pay Now" button:
// payment is QR-via-WhatsApp for now, so this just points at the dashboard.
import { emailLayout } from "./layout.js";
import { INK, INK_MUTED, BORDER, money, escapeHtml, ctaButton } from "./shared.js";

export function buildInvoiceEmailHtml({ invoice, customer, dashboardUrl }) {
  const lineItems = invoice.lineItems || [];
  const subtotal = lineItems.reduce((sum, i) => sum + Number(i.qty || 0) * Number(i.price || 0), 0);
  const total = Number(invoice.total ?? (subtotal + Number(invoice.tax || 0) - Number(invoice.discount || 0)));

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
    <p style="color:${INK};font-size:15px;margin:0 0 4px;">Hi ${escapeHtml(customer?.name || "there")},</p>
    <p style="color:${INK_MUTED};font-size:14px;line-height:1.6;margin:0 0 24px;">
      Your invoice <strong style="color:${INK};">${escapeHtml(invoice.invoiceNumber || "")}</strong> is ready — total due
      <strong style="color:${INK};">${money(total)}</strong>.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td style="padding-bottom:8px;border-bottom:1px solid ${BORDER};font-size:11px;font-weight:bold;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.05em;">Item</td>
        <td style="padding-bottom:8px;border-bottom:1px solid ${BORDER};font-size:11px;font-weight:bold;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.05em;text-align:center;">Qty</td>
        <td style="padding-bottom:8px;border-bottom:1px solid ${BORDER};font-size:11px;font-weight:bold;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.05em;text-align:right;">Price</td>
        <td style="padding-bottom:8px;border-bottom:1px solid ${BORDER};font-size:11px;font-weight:bold;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.05em;text-align:right;">Amount</td>
      </tr>
      ${rows}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td></td>
        <td style="width:220px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:3px 0;color:${INK_MUTED};font-size:13px;">Subtotal</td>
              <td style="padding:3px 0;color:${INK_MUTED};font-size:13px;text-align:right;">${money(subtotal)}</td>
            </tr>
            ${Number(invoice.discount) > 0 ? `
            <tr>
              <td style="padding:3px 0;color:#059669;font-size:13px;">Discount</td>
              <td style="padding:3px 0;color:#059669;font-size:13px;text-align:right;">- ${money(invoice.discount)}</td>
            </tr>` : ""}
            ${Number(invoice.tax) > 0 ? `
            <tr>
              <td style="padding:3px 0;color:${INK_MUTED};font-size:13px;">GST</td>
              <td style="padding:3px 0;color:${INK_MUTED};font-size:13px;text-align:right;">${money(invoice.tax)}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:10px 0 0;border-top:1px solid ${BORDER};color:${INK};font-size:15px;font-weight:bold;">Total Due</td>
              <td style="padding:10px 0 0;border-top:1px solid ${BORDER};color:${INK};font-size:15px;font-weight:bold;text-align:right;">${money(total)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="background:#F8FAFC;border:1px solid ${BORDER};border-radius:10px;padding:14px 16px;margin-bottom:8px;">
      <p style="color:${INK};font-size:13px;line-height:1.6;margin:0;">
        A payment QR code will follow separately over WhatsApp — scan it to pay. You can check payment status on your dashboard any time.
      </p>
    </div>

    ${ctaButton(dashboardUrl, "View Invoice on Dashboard")}`;

  return emailLayout({
    preheader: `Invoice ${escapeHtml(invoice.invoiceNumber || "")} — ${money(total)} due`,
    contentHtml,
  });
}
