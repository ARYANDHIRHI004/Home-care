import { BRAND_BLUE, INK, INK_MUTED, BORDER, BG } from "./shared.js";

// One base shell — brand header, a content slot, and a consistent footer —
// that every email in this app wraps its content in, so nothing looks like
// it came from a different sender than the rest. Template-string based on
// purpose: no separate templating engine for four email types.
export function emailLayout({ preheader = "", contentHtml }) {
  return `
  <!doctype html>
  <html>
    <body style="margin:0;padding:24px;background:${BG};font-family:Arial,Helvetica,sans-serif;">
      ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ""}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BORDER};">
        <tr>
          <td style="padding:32px;">

            <!-- Brand header -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="width:36px;height:36px;background:${BRAND_BLUE};border-radius:8px;text-align:center;vertical-align:middle;">
                  <span style="color:#ffffff;font-weight:bold;font-size:16px;">H</span>
                </td>
                <td style="padding-left:10px;">
                  <div style="font-weight:bold;color:${INK};font-size:15px;">HomeCare247</div>
                  <div style="color:${INK_MUTED};font-size:12px;">Bhilai-Durg, Chhattisgarh</div>
                </td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid ${BORDER};margin:0 0 24px;" />

            <!-- Content slot -->
            ${contentHtml}

            <!-- Footer -->
            <p style="color:#94A3B8;font-size:11px;line-height:1.6;margin:28px 0 0;border-top:1px solid ${BORDER};padding-top:16px;">
              HomeCare247 · This is an automated message — please don't reply directly to it.<br />
              Need help? Reach us on WhatsApp or call our support line from the app.
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}
