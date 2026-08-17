import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let logoBase64 = '';
try {
    const logoPath = path.resolve(__dirname, '../../../frontend/public/logo.png');
    if (fs.existsSync(logoPath)) {
        const bitmap = fs.readFileSync(logoPath);
        logoBase64 = `data:image/png;base64,${bitmap.toString('base64')}`;
    }
} catch (e) {
    console.warn('Failed to load logo.png for PDF template', e);
}

export function renderInvoiceHtml(invoice) {
    const lineItems = invoice.lineItems || [];
    const subtotal = lineItems.reduce((sum, li) => sum + (li.qty || 0) * (li.price || 0), 0);
    const invoiceId = invoice.invoiceNumber || invoice._id || 'Draft';
    const date = invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
    
    // Attempt to resolve customer name and booking reference safely
    let customerName = 'Unknown Customer';
    if (invoice.customerName) {
        customerName = invoice.customerName;
    } else if (invoice.workOrderId) {
        if (invoice.workOrderId.customerName) customerName = invoice.workOrderId.customerName;
        else if (invoice.workOrderId.customerId?.name) customerName = invoice.workOrderId.customerId.name;
    }
    const bookingRef = invoice.workOrderId ? `WO-${String(invoice.workOrderId._id || invoice.workOrderId).slice(-4).toUpperCase()}` : (invoice.bookingReference || '—');
    
    // Status watermark
    let watermark = '';
    if (invoice.paymentStatus === 'paid') {
        watermark = '<div style="position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 8rem; font-weight: 900; color: rgba(16, 185, 129, 0.05); text-transform: uppercase; z-index: 0; pointer-events: none;">PAID</div>';
    } else if (invoice.paymentStatus === 'unpaid') {
        watermark = '<div style="position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 8rem; font-weight: 900; color: rgba(225, 29, 72, 0.05); text-transform: uppercase; z-index: 0; pointer-events: none;">UNPAID</div>';
    }

    const trs = lineItems.length === 0 
        ? '<tr><td colspan="5" style="padding: 1rem 0; text-align: center; color: #94a3b8;">No line items</td></tr>'
        : lineItems.map(li => `
        <tr>
            <td style="padding: 1rem 0;">
                <p style="margin: 0; font-weight: 600; color: #0f172a;">${li.name || li.description || ''}</p>
            </td>
            <td style="padding: 1rem 0; text-align: center; font-weight: 500; color: #334155;">${li.category || '—'}</td>
            <td style="padding: 1rem 0; text-align: center; font-weight: 500; color: #334155;">${li.qty || 0}</td>
            <td style="padding: 1rem 0; text-align: right; font-weight: 500; color: #334155;">₹${Number(li.price || 0).toLocaleString()}</td>
            <td style="padding: 1rem 0; text-align: right; font-weight: 700; color: #0f172a;">₹${((li.qty || 0) * (li.price || 0)).toLocaleString()}</td>
        </tr>
        `).join('');

    let discountHtml = '';
    if (invoice.discount > 0) {
        discountHtml = `
        <div style="display: flex; justify-content: space-between; color: #059669; margin-bottom: 0.75rem;">
            <span>Discount</span>
            <span style="font-weight: 500;">- ₹${(invoice.discount).toLocaleString()}</span>
        </div>`;
    }

    const logoImgTag = logoBase64 
        ? `<img src="${logoBase64}" style="width: 3rem; height: 3rem; object-fit: contain; margin-bottom: 0.25rem;" alt="Home care" />`
        : `<div class="logo-box">HC</div>`;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff; color: #0f172a; }
            * { box-sizing: border-box; }
            .container { max-width: 800px; margin: 0 auto; position: relative; }
            
            .header { padding: 2rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-start; background-color: #f8fafc; }
            .header-left h1 { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.05em; margin: 0 0 0.25rem 0; }
            .header-left p.invoice-id { font-size: 0.875rem; font-weight: 700; color: #64748b; margin: 0; }
            .header-left p.date { font-size: 0.75rem; color: #94a3b8; margin: 0.25rem 0 0 0; }
            
            .header-right { text-align: right; }
            .logo-box { width: auto; padding: 0.25rem 0.75rem; background-color: #2563eb; border-radius: 0.5rem; display: inline-flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 1.5rem; margin-bottom: 0.25rem; font-style: italic; }
            .header-right h3 { font-size: 1rem; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }
            .header-right p.tagline { font-size: 0.65rem; color: #2563eb; font-weight: 700; text-transform: uppercase; margin: 0 0 0.5rem 0; letter-spacing: 0.05em; }
            .header-right p { font-size: 0.65rem; color: #64748b; margin: 0.125rem 0 0 0; }
            
            .details { padding: 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; font-size: 0.875rem; }
            .details p.label { font-size: 0.625rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.5rem 0; }
            .details p.value { font-weight: 700; margin: 0; }
            .details-right { text-align: right; }
            
            .items { padding: 2rem; }
            table { width: 100%; font-size: 0.875rem; border-collapse: collapse; }
            th { border-bottom: 2px solid #0f172a; padding-bottom: 0.75rem; font-weight: 700; }
            th.text-left { text-align: left; }
            th.text-center { text-align: center; }
            th.text-right { text-align: right; }
            tbody tr { border-bottom: 1px solid #e2e8f0; }
            
            .summary { width: 50%; margin-left: auto; margin-top: 1.5rem; font-size: 0.875rem; }
            .summary-row { display: flex; justify-content: space-between; color: #475569; margin-bottom: 0.75rem; }
            .summary-row span:last-child { font-weight: 500; }
            .total-row { display: flex; justify-content: space-between; border-top: 1px solid #0f172a; padding-top: 0.75rem; font-size: 1.125rem; font-weight: 900; color: #0f172a; margin-top: 0.75rem; }
            
            .footer { padding: 2rem; text-align: center; border-top: 1px solid #e2e8f0; background-color: #f8fafc; margin-top: 2rem; }
            .footer p.thanks { font-size: 1.125rem; font-weight: 700; color: #0f172a; margin: 0 0 1rem 0; }
            .footer p.contact { font-size: 0.75rem; color: #64748b; margin: 0.25rem 0; }
        </style>
    </head>
    <body>
        <div class="container">
            ${watermark}
            <div class="header">
                <div class="header-left">
                    <h1>INVOICE</h1>
                    <p class="invoice-id">#${invoiceId}</p>
                    <p class="date">Date: ${date}</p>
                </div>
                <div class="header-right">
                    ${logoImgTag}
                    <h3>Home care</h3>
                    <p class="tagline">complete home solution</p>
                    <p>GSTIN: 22AYEPS4461M2Z3</p>
                    <p>hello@homecare-online.com | 9111466640, 9111466642</p>
                    <p style="max-width: 250px; margin-left: auto; line-height: 1.4; margin-top: 0.25rem;">Home care, Design consultant, krishna talkies road risali, bhilai, durg cg pin- 490006</p>
                </div>
            </div>
            
            <div class="details">
                <div>
                    <p class="label">Billed To</p>
                    <p class="value">${customerName}</p>
                </div>
                <div class="details-right">
                    <p class="label">Work Order Reference</p>
                    <p class="value">${bookingRef}</p>
                </div>
            </div>
            
            <div class="items">
                <table>
                    <thead>
                        <tr>
                            <th class="text-left">Service Description</th>
                            <th class="text-center">Category</th>
                            <th class="text-center">Qty</th>
                            <th class="text-right">Price</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${trs}
                    </tbody>
                </table>
                
                <div class="summary">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>₹${subtotal.toLocaleString()}</span>
                    </div>
                    ${discountHtml}
                    <div class="summary-row">
                        <span>18% GST</span>
                        <span>₹${(invoice.tax || 0).toLocaleString()}</span>
                    </div>
                    <div class="total-row">
                        <span>Total</span>
                        <span>₹${(invoice.total || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p class="thanks">Thank you for choosing Home care!</p>
                <p class="contact">If you have any questions about this invoice, please contact us.</p>
                <p class="contact">hello@homecare-online.com | 9111466640, 9111466642</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
