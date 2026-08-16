// Shared brand tokens and helpers for every email template in backend/src/emails/.
// Keeping these in one place is what makes the welcome/estimate/invoice/status
// emails read as one system instead of four ad-hoc designs.

export const BRAND_BLUE = "#2554F0";
export const INK = "#0F172A";
export const INK_MUTED = "#64748B";
export const BORDER = "#E2E8F0";
export const BG = "#F1F5F9";

export const money = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`;

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

export function ctaButton(url, label) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td align="center">
          <a href="${url}" style="display:inline-block;background:${BRAND_BLUE};color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:10px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}
