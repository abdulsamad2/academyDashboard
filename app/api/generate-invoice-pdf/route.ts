import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { format } from 'date-fns';
import { db } from '@/db/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { invoiceData, studentId, month, year, parentId } = await req.json();
    
    if (!invoiceData || !studentId || month === undefined || year === undefined) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    // Get student data 
    const student = await db.student.findUnique({
      where: { id: studentId }
    });

    // Get parent data
    const parent = await db.user.findUnique({
      where: { id: parentId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        adminId: true
      }
    });

    if (!student || !parent) {
      return NextResponse.json(
        { error: 'Student or parent not found' },
        { status: 404 }
      );
    }

    // Read logo file from public folder
    let logoBase64 = '';
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo.jpg');
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,${logoBuffer.toString('base64')}`;
    } catch (err) {
      console.error('Error reading logo file:', err);
      // Fallback to a placeholder SVG if logo file isn't available
      logoBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHJ4PSIyNSIgZmlsbD0iIzRGNDZFNSIvPjxwYXRoIGQ9Ik0xNSAyNUgzNU0yNSAxNVYzNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
    }

    // Create invoice HTML
    const invoiceDate = new Date(year, month, 1);
    const monthName = format(invoiceDate, 'MMMM yyyy');
    const invoiceNumber = `INV-${format(invoiceDate, 'yyyyMM')}-${parent.adminId || ''}`;

    // Calculate financials
    const subtotal = invoiceData.reduce((acc: number, item: any) => {
      const totalHours = parseFloat((item.totalDuration / 60).toFixed(1));
      const totalAmount = totalHours * parseFloat(item.tutorhourly);
      return acc + totalAmount;
    }, 0);
    
    const sst = parseFloat((subtotal * 0.06).toFixed(2));
    const total = parseFloat((subtotal + sst).toFixed(2));

    // Create invoice HTML content with logo
    const html = generateInvoiceHTML({
      invoiceNumber,
      date: format(new Date(), 'MMMM dd, yyyy'),
      monthName,
      parent,
      student,
      items: invoiceData,
      subtotal,
      sst,
      total,
      logoBase64
    });

    // Launch browser and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport to match A4 dimensions for better rendering
    await page.setViewport({
      width: 794, // A4 width in pixels (roughly 210mm at 96dpi)
      height: 1123, // A4 height in pixels (roughly 297mm at 96dpi)
      deviceScaleFactor: 1.5, // Higher resolution for sharper text and images
    });
    
    // Set the content
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Generate PDF optimized for A4 paper
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '7mm',
        right: '7mm',
        bottom: '7mm',
        left: '7mm'
      },
      scale: 0.98, // Almost full scale but ensures content fits
      preferCSSPageSize: true,
    });

    await browser.close();

    // Prepare response with the PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoiceNumber}.pdf"`,
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

// Helper function to generate invoice HTML
function generateInvoiceHTML({
  invoiceNumber,
  date,
  monthName,
  parent,
  student,
  items,
  subtotal,
  sst,
  total,
  logoBase64
}: {
  invoiceNumber: string;
  date: string;
  monthName: string;
  parent: any;
  student: any;
  items: any[];
  subtotal: number;
  sst: number;
  total: number;
  logoBase64: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoiceNumber}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        :root {
          --primary: #4F46E5;
          --primary-light: #818CF8;
          --secondary: #06B6D4;
          --accent: #F59E0B;
          --success: #10B981;
          --text-dark: #1F2937;
          --text-medium: #4B5563;
          --text-light: #9CA3AF;
          --bg-light: #F9FAFB;
          --bg-white: #FFFFFF;
          --border-light: #E5E7EB;
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --radius-sm: 6px;
          --radius-md: 8px;
          --radius-lg: 12px;
        }
        
        @page {
          size: A4;
          margin: 0;
        }
        
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: var(--text-dark);
          background-color: var(--bg-white);
          font-size: 12px;
          width: 100%;
          height: 100%;
          letter-spacing: -0.025em;
        }
        
        .invoice-container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          background-color: var(--bg-white);
          overflow: hidden;
        }
        
        .invoice-header {
          position: relative;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: white;
          padding: 32px 24px;
          overflow: hidden;
        }
        
        .invoice-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
          border-radius: 50%;
          transform: translate(30%, -50%);
          z-index: 1;
        }
        
        .header-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .branding {
          display: flex;
          align-items: center;
        }
        
        .logo-container {
          width: 56px;
          height: 56px;
          background-color: white;
          border-radius: 50%;
          padding: 2px;
          margin-right: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }
        
        .logo-container img {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }
        
        .brand-text h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.025em;
        }
        
        .brand-text p {
          font-size: 13px;
          font-weight: 300;
          opacity: 0.9;
          margin-top: 2px;
        }
        
        .invoice-info {
          text-align: right;
          background: rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          backdrop-filter: blur(4px);
        }
        
        .invoice-number {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        
        .invoice-meta {
          font-size: 12px;
          opacity: 0.9;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }
        
        .invoice-meta svg {
          width: 14px;
          height: 14px;
        }
        
        .invoice-body {
          padding: 32px 24px;
        }
        
        .entity-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 24px;
        }
        
        .entity-box {
          flex: 1;
          background-color: var(--bg-light);
          border-radius: var(--radius-md);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          border-top: 3px solid var(--primary);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .entity-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .entity-title svg {
          width: 16px;
          height: 16px;
        }
        
        .entity-content p {
          margin: 4px 0;
          font-size: 12px;
          color: var(--text-medium);
        }
        
        .entity-content p.entity-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 8px;
        }
        
        .student-details {
          background-color: #EFF6FF;
          border-radius: var(--radius-md);
          padding: 20px;
          margin-bottom: 24px;
          border-left: 4px solid var(--primary);
          box-shadow: var(--shadow-sm);
        }
        
        .student-details h2 {
          font-size: 14px;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .student-details h2 svg {
          width: 16px;
          height: 16px;
        }
        
        .student-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        
        .student-item {
          flex: 1;
          min-width: 100px;
        }
        
        .student-label {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--text-light);
          font-weight: 500;
          margin-bottom: 4px;
          letter-spacing: 0.05em;
        }
        
        .student-value {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-dark);
        }
        
        .items-table-container {
          margin-bottom: 24px;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .items-table thead {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          color: white;
        }
        
        .items-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        
        .items-table th:nth-child(2), 
        .items-table th:nth-child(3), 
        .items-table th:nth-child(4) {
          text-align: right;
        }
        
        .items-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-light);
          font-size: 13px;
          color: var(--text-medium);
        }
        
        .items-table td:nth-child(2), 
        .items-table td:nth-child(3), 
        .items-table td:nth-child(4) {
          text-align: right;
        }
        
        .items-table tr:nth-child(even) {
          background-color: #F8FAFC;
        }
        
        .items-table tr:last-child td {
          border-bottom: none;
        }
        
        .items-table tr:hover {
          background-color: #F1F5F9;
        }
        
        .totals-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 24px;
        }
        
        .totals-box {
          width: 280px;
          background-color: var(--bg-light);
          border-radius: var(--radius-md);
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }
        
        .totals-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
          color: var(--text-medium);
        }
        
        .totals-row.final {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-light);
          font-size: 16px;
          font-weight: 700;
          color: var(--text-dark);
        }
        
        .totals-row.final .amount {
          color: var(--success);
        }
        
        .note-box {
          background-color: #EFF6FF;
          border-radius: var(--radius-md);
          padding: 20px;
          font-size: 12px;
          color: var(--text-medium);
          margin-bottom: 24px;
          border-left: 4px solid var(--primary);
          position: relative;
          box-shadow: var(--shadow-sm);
        }
        
        .note-box::before {
          content: '\\201C';
          position: absolute;
          top: 8px;
          left: 12px;
          font-size: 32px;
          color: rgba(79, 70, 229, 0.2);
          font-family: serif;
        }
        
        .note-box p {
          position: relative;
          margin-left: 12px;
          line-height: 1.6;
        }
        
        .invoice-footer {
          text-align: center;
          padding: 20px 24px;
          background-color: var(--bg-light);
          border-top: 1px solid var(--border-light);
          color: var(--text-light);
          font-size: 11px;
        }
        
        .company-name {
          font-weight: 600;
          color: var(--text-medium);
          margin-bottom: 4px;
        }
        
        .footer-info {
          margin-top: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        
        .footer-info svg {
          width: 14px;
          height: 14px;
        }
        
        .item-highlight {
          font-weight: 500;
          color: var(--text-dark);
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="header-content">
            <div class="branding">
              <div class="logo-container">
                <img src="${logoBase64}" alt="Logo">
              </div>
              <div class="brand-text">
                <h1>INVOICE</h1>
                <p>UH Innovation Legacy Learning Academy</p>
              </div>
            </div>
            <div class="invoice-info">
              <div class="invoice-number">${invoiceNumber}</div>
              <div class="invoice-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Date: ${date}
              </div>
              <div class="invoice-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Period: ${monthName}
              </div>
            </div>
          </div>
        </div>
        
        <div class="invoice-body">
          <div class="entity-details">
            <div class="entity-box">
              <h2 class="entity-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Bill To
              </h2>
              <div class="entity-content">
                <p class="entity-name">${parent.name || 'N/A'}</p>
                <p>${parent.email || 'N/A'}</p>
                <p>${parent.phone || 'N/A'}</p>
              </div>
            </div>
            
            <div class="entity-box">
              <h2 class="entity-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                Pay To
              </h2>
              <div class="entity-content">
                <p class="entity-name">UH Innovation Legacy</p>
                <p>MAYBANK</p>
                <p>Acc: 562674258518</p>
              </div>
            </div>
          </div>
          
          <div class="student-details">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Student Details
            </h2>
            <div class="student-grid">
              <div class="student-item">
                <div class="student-label">Name</div>
                <div class="student-value">${student.name || 'N/A'}</div>
              </div>
              ${student.age ? `
              <div class="student-item">
                <div class="student-label">Age</div>
                <div class="student-value">${student.age}</div>
              </div>
              ` : ''}
              ${student.class ? `
              <div class="student-item">
                <div class="student-label">Level</div>
                <div class="student-value">${student.class}</div>
              </div>
              ` : ''}
            </div>
          </div>
          
          <div class="items-table-container">
            <table class="items-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Rate (RM/hr)</th>
                  <th>Hours</th>
                  <th>Amount (RM)</th>
                </tr>
              </thead>
              <tbody>
                ${items.length > 0 ? items.map((item: any, index: number) => {
                  const hours = parseFloat((item.totalDuration / 60).toFixed(1));
                  const amount = (hours * parseFloat(item.tutorhourly)).toFixed(2);
                  return `
                  <tr>
                    <td><span class="item-highlight">${item.subject}</span></td>
                    <td>${item.tutorhourly}</td>
                    <td>${hours}</td>
                    <td><span class="item-highlight">${amount}</span></td>
                  </tr>
                  `;
                }).join('') : `
                <tr>
                  <td colspan="4" style="text-align: center; padding: 24px; color: var(--text-light);">
                    No data available for ${monthName}
                  </td>
                </tr>
                `}
              </tbody>
            </table>
          </div>
          
          <div class="totals-container">
            <div class="totals-box">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span class="amount">RM ${subtotal.toFixed(2)}</span>
              </div>
              <div class="totals-row">
                <span>Service Charges (6%):</span>
                <span class="amount">RM ${sst.toFixed(2)}</span>
              </div>
              <div class="totals-row final">
                <span>Total:</span>
                <span class="amount">RM ${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div class="note-box">
            <p>
              Thank you for choosing UH Innovation Legacy Learning Academy. We
              appreciate your prompt payment by the 4th of each month, which
              enables us to maintain our high standards of education. Your
              partnership in your child's academic journey is invaluable to us.
            </p>
          </div>
        </div>
        
        <div class="invoice-footer">
          <div class="company-name">UH Innovation Legacy Learning Academy</div>
          <div>12th Floor, Sri Ampang Mas, Jalan Dagang B/5, Taman Dagang, 68000 Ampang, Selangor</div>
          <div class="footer-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Tel: +6016-4175134
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Email: info@uhilacademy.com
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
} 