const nodemailer = require('nodemailer');

let transporter = null;

const initializeTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });
    console.log(`[Mailer] Configured SMTP Transport via ${host}:${port}`);
  } else {
    console.log('[Mailer] No active SMTP credentials found. Operating in local development log mode.');
  }
};

initializeTransporter();

/**
 * Dispatch engineering inquiry notification
 * @param {Object} inquiry
 * @param {string} inquiry.name
 * @param {string} [inquiry.company]
 * @param {string} inquiry.email
 * @param {string} inquiry.phone
 * @param {string} inquiry.service
 * @param {string} inquiry.message
 * @param {string} [inquiry.drawingNote]
 * @returns {Promise<boolean>}
 */
const sendInquiryNotification = async (inquiry) => {
  const recipient = process.env.ALERT_RECIPIENT_EMAIL || 'info@houseofengineers.pk';
  const fromEmail = process.env.ALERT_FROM_EMAIL || 'no-reply@houseofengineers.pk';
  const timestamp = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });

  const textBody = `
=== NEW ENGINEERING INQUIRY: HOUSE OF ENGINEERS PVT. LTD. ===
Submission Time: ${timestamp} (PKT)

Client Details:
- Name: ${inquiry.name}
- Company: ${inquiry.company || 'Not Specified (Direct / Residential)'}
- Email: ${inquiry.email}
- Phone / WhatsApp: ${inquiry.phone}

Project Details:
- Service Required: ${inquiry.service}
- Technical Scope & Specifications:
${inquiry.message}

${inquiry.drawingNote ? `Drawing / File Spec Note:\n${inquiry.drawingNote}` : ''}
=============================================================
`;

  const htmlBody = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #4b5156; }
      .container { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0; }
      .header { background-color: #23588f; color: #ffffff; padding: 24px; text-align: left; }
      .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
      .badge { display: inline-block; background-color: #e48738; color: #ffffff; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
      .content { padding: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; }
      th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
      th { background-color: #f8fafc; color: #1e293b; width: 35%; font-weight: 600; }
      td { color: #334155; }
      .message-box { background-color: #f8fafc; border-left: 4px solid #23588f; padding: 14px; margin-top: 12px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #1e293b; }
      .footer { background-color: #1e293b; color: #94a3b8; padding: 16px 24px; font-size: 12px; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <span class="badge">New Engineering RFQ / Lead</span>
        <h1>House of Engineers Pvt. Ltd.</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Inquiry dispatched from corporate web portal</p>
      </div>
      <div class="content">
        <p style="margin-top: 0;">An engineering inquiry has been received from the web portal. Details are provided below:</p>
        <table>
          <tr>
            <th>Client Full Name</th>
            <td><strong>${inquiry.name}</strong></td>
          </tr>
          <tr>
            <th>Company / Organization</th>
            <td>${inquiry.company || '<em>Direct / Residential</em>'}</td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td><a href="mailto:${inquiry.email}" style="color: #23588f; text-decoration: none;">${inquiry.email}</a></td>
          </tr>
          <tr>
            <th>Phone / WhatsApp</th>
            <td><a href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}" style="color: #23588f; text-decoration: none;">${inquiry.phone}</a></td>
          </tr>
          <tr>
            <th>Requested Service</th>
            <td><strong style="color: #e48738;">${inquiry.service}</strong></td>
          </tr>
          <tr>
            <th>Received At</th>
            <td>${timestamp} PKT</td>
          </tr>
        </table>

        <div style="font-weight: 600; color: #1e293b; font-size: 14px;">Scope of Work / Project Description:</div>
        <div class="message-box">${inquiry.message}</div>

        ${inquiry.drawingNote ? `
        <div style="margin-top: 16px; font-weight: 600; color: #1e293b; font-size: 14px;">CAD / Drawing Specification Note:</div>
        <div class="message-box" style="border-left-color: #e48738;">${inquiry.drawingNote}</div>
        ` : ''}
      </div>
      <div class="footer">
        House of Engineers Pvt. Ltd. &bull; Industrial Engineering & Custom Fabrication &bull; Lahore, Punjab, Pakistan
      </div>
    </div>
  </body>
  </html>
  `;

  if (!transporter) {
    console.log('\n[Development Mailer Dispatch Simulation]');
    console.log(`To: ${recipient}`);
    console.log(`Subject: New Inquiry: ${inquiry.service} - ${inquiry.name} (${inquiry.company || 'Direct'})`);
    console.log(textBody);
    return true;
  }

  const mailOptions = {
    from: `"House of Engineers Portal" <${fromEmail}>`,
    to: recipient,
    replyTo: inquiry.email,
    subject: `[New Inquiry] ${inquiry.service} - ${inquiry.name} (${inquiry.company || 'Direct'})`,
    text: textBody,
    html: htmlBody
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Mailer] Email dispatched successfully. Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('[Mailer] Error dispatching email notification:', error);
    // Return true even if transport fails so customer is acknowledged, but log the error
    return false;
  }
};

module.exports = {
  sendInquiryNotification
};
