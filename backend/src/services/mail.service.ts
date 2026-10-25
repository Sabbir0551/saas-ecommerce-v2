export interface WelcomeEmailData {
  storeName: string;
  subdomain: string;
  businessType: string;
  adminName: string;
  email: string;
  tempPassword?: string;
  databaseName?: string;
  engine?: string;
}

export const mailService = {
  async sendTenantWelcomeEmail(data: WelcomeEmailData) {
    const storeUrl = `http://localhost:3000/?tenant=${data.subdomain}`;
    const adminUrl = `http://localhost:3000/admin/dashboard?tenant=${data.subdomain}`;
    const dbName = data.databaseName || `tenant_${data.subdomain}`;
    const dbEngine = data.engine || 'PostgreSQL Isolated DB';

    const emailPayload = {
      from: '"SaaS Platform Official" <no-reply@saasengine.com>',
      to: data.email,
      subject: `🎉 Welcome to ${data.storeName}! Store Credentials & Dedicated Database Assigned`,
      sentAt: new Date().toISOString(),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-block; padding: 8px 16px; background-color: #f1f5f9; border-radius: 9999px; font-size: 12px; font-weight: bold; color: #0284c7; margin-bottom: 12px;">
              🚀 MULTI-TENANT ISOLATED STORE ACTIVE
            </div>
            <h1 style="color: #0f172a; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Welcome to ${data.storeName}</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 6px;">Your digital storefront and admin control center have been fully provisioned</p>
          </div>

          <p>Dear <strong>${data.adminName}</strong>,</p>
          <p>Congratulations! Your multi-tenant store under the <strong>${data.businessType}</strong> archetype is live. A dedicated database has been provisioned exclusively for your business data.</p>

          <!-- Credentials Card -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="margin-top: 0; color: #0f172a; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">🔑 Official Admin Access & Database Details</h3>
            <div style="margin-top: 12px; font-size: 13px; line-height: 1.8;">
              <p style="margin: 4px 0;"><strong>Storefront URL:</strong> <a href="${storeUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">${storeUrl}</a></p>
              <p style="margin: 4px 0;"><strong>Admin Portal:</strong> <a href="${adminUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">${adminUrl}</a></p>
              <p style="margin: 4px 0;"><strong>Admin Login Email:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${data.email}</code></p>
              ${data.tempPassword ? `<p style="margin: 4px 0;"><strong>Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${data.tempPassword}</code></p>` : ''}
              <hr style="margin: 10px 0; border: 0; border-top: 1px solid #cbd5e1;" />
              <p style="margin: 4px 0; color: #0369a1;"><strong>Dedicated Database:</strong> <code style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${dbName}</code> (${dbEngine})</p>
            </div>
          </div>

          <!-- Admin Panel Features -->
          <div style="background-color: #f1f5f9; border-radius: 12px; padding: 18px; margin: 20px 0; font-size: 13px;">
            <strong style="color: #0f172a; display: block; margin-bottom: 6px;">⚡ What You Can Manage in Your Admin Panel:</strong>
            <ul style="margin: 0; padding-left: 20px; color: #475569;">
              <li><strong>Category Management:</strong> Add, edit, or remove product and service categories.</li>
              <li><strong>Brand Management:</strong> Add your brands, partner logos, and manufacturers.</li>
              <li><strong>Catalog & Pricing:</strong> Upload merchandise, manage variants, and set stock levels.</li>
              <li><strong>Store Customization:</strong> Customize banner slogans, contact info, and theme colors.</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 28px;">
            <a href="${adminUrl}" style="background-color: #0f172a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);">
              Launch Store Admin Dashboard &rarr;
            </a>
          </div>

          <hr style="margin-top: 36px; border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">
            This is an automated dispatch from your multi-tenant SaaS engine. © ${new Date().getFullYear()} SaaS Platform. All rights reserved.
          </p>
        </div>
      `,
    };

    console.log(`\n📧 [EMAIL DISPATCHER] Official Welcome Email Sent to ${data.email}:`);
    console.log(`   Subject: ${emailPayload.subject}`);
    console.log(`   Admin URL: ${adminUrl}`);
    console.log(`   Dedicated DB: ${dbName} (${dbEngine})\n`);

    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      recipient: data.email,
      preview: emailPayload,
    };
  },

  async sendOrderConfirmationEmail(data: {
    tenantName: string;
    subdomain: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderNumber: string;
    shippingAddress: string;
    totalAmount: number;
    deliveryCharge: number;
    items: Array<{ title: string; quantity: number; price: number; variant?: string }>;
    paymentMethod?: string;
  }) {
    const trackingUrl = `http://localhost:3000/order-success/${data.orderNumber}?tenant=${data.subdomain}`;
    const itemsHtml = data.items.map((it) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-size: 13px; color: #1e293b;">
          <strong>${it.title}</strong> ${it.variant ? `<span style="color:#64748b;">(${it.variant})</span>` : ''}
        </td>
        <td style="padding: 10px 0; text-align: center; font-size: 13px; color: #475569;">${it.quantity}</td>
        <td style="padding: 10px 0; text-align: right; font-size: 13px; font-weight: bold; color: #0f172a;">BDT ${(it.price * it.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const emailPayload = {
      from: `"${data.tenantName}" <orders@saasengine.com>`,
      to: data.customerEmail,
      subject: `✅ Order Confirmed: #${data.orderNumber} - ${data.tenantName}`,
      sentAt: new Date().toISOString(),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 6px 14px; background-color: #ecfdf5; border-radius: 9999px; font-size: 12px; font-weight: bold; color: #059669; margin-bottom: 10px;">
              ✓ ORDER RECEIVED & IN FULFILLMENT
            </div>
            <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">Thank You for Your Order!</h1>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Order Tracking Code: <strong>${data.orderNumber}</strong></p>
          </div>

          <p>Dear <strong>${data.customerName}</strong>,</p>
          <p>We have successfully registered your order at <strong>${data.tenantName}</strong>. Our fulfillment team is preparing your package for dispatch.</p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0f172a; font-size: 14px; font-weight: 700; text-transform: uppercase;">📦 Order Manifest Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
              <thead>
                <tr style="border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; color: #64748b; text-align: left;">
                  <th style="padding-bottom: 6px;">Item Description</th>
                  <th style="padding-bottom: 6px; text-align: center;">Qty</th>
                  <th style="padding-bottom: 6px; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 13px; text-align: right;">
              <p style="margin: 2px 0; color: #64748b;">Delivery Charge: <strong>BDT ${data.deliveryCharge || 60}</strong></p>
              <p style="margin: 4px 0; font-size: 16px; font-weight: 800; color: #e11d48;">Total Payable: BDT ${data.totalAmount.toLocaleString()}</p>
              <p style="margin: 2px 0; font-size: 11px; color: #64748b;">Payment Method: <strong>${data.paymentMethod || 'Cash on Delivery (COD)'}</strong></p>
            </div>
          </div>

          <div style="background-color: #f1f5f9; border-radius: 10px; padding: 14px; margin-bottom: 20px; font-size: 12px;">
            <strong style="color: #0f172a;">📍 Delivery Destination:</strong>
            <p style="margin: 4px 0; color: #475569;">${data.shippingAddress}</p>
            <p style="margin: 2px 0; color: #475569;">Contact Phone: <strong>${data.customerPhone}</strong></p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${trackingUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px; display: inline-block;">
              Track Live Order Status &rarr;
            </a>
          </div>

          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">
            Authorized Transaction Dispatch · ${data.tenantName} · All Rights Reserved
          </p>
        </div>
      `,
    };

    console.log(`\n📧 [EMAIL DISPATCHER] Order Confirmation Dispatched to ${data.customerEmail}:`);
    console.log(`   Order: #${data.orderNumber} | Total: BDT ${data.totalAmount}`);
    console.log(`   Tracking: ${trackingUrl}\n`);

    return {
      success: true,
      messageId: `ord_mail_${Date.now()}`,
      recipient: data.customerEmail,
      preview: emailPayload,
    };
  },
};
