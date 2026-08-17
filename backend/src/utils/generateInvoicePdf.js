import puppeteer from 'puppeteer';
import { renderInvoiceHtml } from '../templates/invoiceTemplate.js';

export async function generateInvoicePdfBuffer(invoice) {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setContent(renderInvoiceHtml(invoice), { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', bottom: '20px' } });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}
