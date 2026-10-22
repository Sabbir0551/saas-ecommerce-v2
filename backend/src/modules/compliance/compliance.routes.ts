import { Router, Request, Response } from 'express';
import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { requireTenant } from '../../middlewares/tenant.middleware.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function getTenantPartitionFilePath(subdomain: string): string {
  const clean = subdomain.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const candidates = [
    path.resolve(process.cwd(), `backend/data/tenants/tenant_${clean}.json`),
    path.resolve(process.cwd(), `data/tenants/tenant_${clean}.json`),
    fileURLToPath(new URL(`../../../data/tenants/tenant_${clean}.json`, import.meta.url)),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

const router = Router();

// Policies generator (compliant with Bangladesh Digital Commerce Guidelines)
router.get('/policies/:type', requireTenant, async (req: Request, res: Response) => {
  const tenant = req.tenant!;
  const { type } = req.params;

  const storeName = tenant.name;
  const storePhone = tenant.phone || '01700-000000';
  const storeEmail = tenant.email || 'support@example.com';
  const storeAddress = tenant.address || 'Dhaka, Bangladesh';

  if (type === 'terms') {
    res.json({
      success: true,
      data: {
        title: 'Terms & Conditions of Service',
        content: `
### 1. General Terms
Welcome to ${storeName}. By accessing our platform, purchasing merchandise, or booking service appointments, you agree to comply with our commercial terms and operational guidelines.

### 2. Pricing & Inventory Availability
All catalog items are quoted in Bangladeshi Taka (BDT). Prices include applicable duties and processing fees. If any product is out of stock, we reserve the right to cancel the order and provide a prompt refund.

### 3. Delivery Schedule & Logistics
In accordance with Digital Commerce guidelines, deliveries inside the Dhaka Metropolitan Area take 2-3 business days, while nationwide shipments take 3-5 business days.

### 4. Merchant Contact
For customer service inquiries, contact us via phone at ${storePhone} or email at ${storeEmail}.
        `.trim(),
      },
    });
    return;
  }

  if (type === 'refund-policy') {
    res.json({
      success: true,
      data: {
        title: 'Return & Refund Policy',
        content: `
### 1. Return Window
Customers must inspect goods upon delivery. Any defect, shipment damage, incorrect size, or missing part must be reported within 72 (seventy-two) hours of physical receipt.

### 2. Refund Execution
Upon receipt and quality inspection at our fulfillment warehouse, approved refunds will be remitted to the original payment method (bKash/Nagad/Bank/COD credit) within 7-10 business days.

### 3. Returns Helpdesk
Return Address: ${storeAddress} | Hotline: ${storePhone}
        `.trim(),
      },
    });
    return;
  }

  if (type === 'privacy') {
    res.json({
      success: true,
      data: {
        title: 'Privacy & Data Protection Policy',
        content: `
${storeName} is dedicated to protecting your personal information. Your contact numbers, physical addresses, and order details are handled strictly for transaction execution and order delivery.
        `.trim(),
      },
    });
    return;
  }

  res.status(404).json({ success: false, message: 'Policy document not found' });
});

// Submit Customer Dispute (72-hour window)
router.post('/disputes/submit', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const tenantId = tenant.id;
    const { orderNumber, customerName, customerPhone, customerEmail, reason, description, evidenceImages } = req.body;

    if (!orderNumber || !customerName || !customerPhone || !reason || !description) {
      res.status(400).json({
        success: false,
        message: 'Order number, your name, phone number, and reason for dispute are required.',
      });
      return;
    }

    const newDispute = {
      id: `disp_${Date.now()}`,
      tenantId,
      orderNumber,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      reason,
      description,
      evidenceImages: evidenceImages || [],
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };

    const dbOnline = await isDatabaseAvailable();
    if (dbOnline) {
      try {
        await prisma.dispute.create({
          data: {
            tenantId,
            orderNumber,
            customerName,
            customerPhone,
            customerEmail: customerEmail || '',
            reason,
            description,
            evidenceImages: JSON.stringify(evidenceImages || []),
            status: 'SUBMITTED',
          },
        });
      } catch {}
    }

    // Persist to partition file
    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    if (fs.existsSync(partitionFile)) {
      try {
        const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        if (!pData.disputes) pData.disputes = [];
        pData.disputes.unshift(newDispute);
        fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
      } catch {}
    }

    res.status(201).json({
      success: true,
      message: 'Your dispute has been logged successfully. Our resolution team will respond within 72 hours.',
      data: newDispute,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit dispute' });
  }
});

// Submit Product / Service Review
router.post('/items/:slug/reviews', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const tenantId = tenant.id;
    const { slug } = req.params;
    const { customerName, rating, comment } = req.body;

    const newReview = {
      id: `rev_${Date.now()}`,
      customerName: customerName || 'Valued Customer',
      rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
      comment: comment || '',
      isApproved: true,
      createdAt: new Date().toISOString(),
    };

    const dbOnline = await isDatabaseAvailable();
    if (dbOnline) {
      try {
        const item = await prisma.item.findUnique({
          where: { tenantId_slug: { tenantId, slug } },
        });

        if (item) {
          await prisma.review.create({
            data: {
              tenantId,
              itemId: item.id,
              customerName: newReview.customerName,
              rating: newReview.rating,
              comment: newReview.comment,
              isApproved: true,
            },
          });
        }
      } catch {}
    }

    // Partition fallback
    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    if (fs.existsSync(partitionFile)) {
      try {
        const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        const item = (pData.items || []).find((i: any) => i.slug === slug || i.id === slug);
        if (item) {
          if (!item.reviews) item.reviews = [];
          item.reviews.unshift(newReview);
          fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
        }
      } catch {}
    }

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record review' });
  }
});

export default router;

