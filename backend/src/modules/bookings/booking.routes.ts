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

// 1-Hour Schedule real-time capacity slot generator & checker
router.get('/available-slots', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const tenantId = tenant.id;
    const { date, itemId } = req.query;

    if (!date || !itemId) {
      res.status(400).json({ success: false, message: 'date (YYYY-MM-DD) and itemId are required' });
      return;
    }

    const targetDate = String(date);
    const serviceItemId = String(itemId);

    // Define 1-hour slots from 10:00 to 20:00
    const timeRanges = [
      { start: '10:00', end: '11:00', label: '10:00 AM - 11:00 AM' },
      { start: '11:00', end: '12:00', label: '11:00 AM - 12:00 PM' },
      { start: '12:00', end: '13:00', label: '12:00 PM - 01:00 PM' },
      { start: '14:00', end: '15:00', label: '02:00 PM - 03:00 PM' },
      { start: '15:00', end: '16:00', label: '03:00 PM - 04:00 PM' },
      { start: '16:00', end: '17:00', label: '04:00 PM - 05:00 PM' },
      { start: '17:00', end: '18:00', label: '05:00 PM - 06:00 PM' },
      { start: '18:00', end: '19:00', label: '06:00 PM - 07:00 PM' },
      { start: '19:00', end: '20:00', label: '07:00 PM - 08:00 PM' },
    ];

    let serviceItem: any = null;
    const slotCounts = new Map<string, number>();

    const dbOnline = await isDatabaseAvailable();
    if (dbOnline) {
      try {
        serviceItem = await prisma.item.findFirst({
          where: { id: serviceItemId, tenantId },
        });

        if (serviceItem) {
          const existingBookings = await prisma.booking.findMany({
            where: {
              tenantId,
              itemId: serviceItemId,
              bookingDate: targetDate,
              status: { not: 'CANCELLED' },
            },
          });
          existingBookings.forEach((b) => {
            slotCounts.set(b.bookingTime, (slotCounts.get(b.bookingTime) || 0) + 1);
          });
        }
      } catch {}
    }

    // Partition fallback
    if (!serviceItem) {
      const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
      if (fs.existsSync(partitionFile)) {
        try {
          const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
          const found = (pData.items || []).find(
            (i: any) => i.id === serviceItemId || i.slug === serviceItemId
          );
          if (found) {
            serviceItem = found;
          }

          // Count existing bookings from partition orders
          (pData.orders || []).forEach((o: any) => {
            if (
              (o.orderType === 'SERVICE_APPOINTMENT' || o.orderType === 'BOOKING') &&
              o.orderStatus !== 'CANCELLED'
            ) {
              const oDate = o.appointmentDate || o.booking?.bookingDate;
              const oTime = o.appointmentTime || o.booking?.bookingTime;
              if (oDate === targetDate && oTime) {
                // normalize e.g. "11:00 AM" or "11:00"
                const matchedRange = timeRanges.find(
                  (r) => r.label.includes(oTime) || oTime.includes(r.start)
                );
                const key = matchedRange ? matchedRange.start : oTime;
                slotCounts.set(key, (slotCounts.get(key) || 0) + 1);
              }
            }
          });
        } catch {}
      }
    }

    if (!serviceItem) {
      // General service appointment fallback
      serviceItem = {
        id: serviceItemId,
        title: 'Specialized Doctor Consultation & Screening',
        price: 500,
        maxCapacityPerSlot: 2,
      };
    }

    const defaultCapacity = serviceItem.maxCapacityPerSlot || 2;

    const slots = timeRanges.map((range) => {
      const booked = slotCounts.get(range.start) || 0;
      const isAvailable = booked < defaultCapacity;

      return {
        startTime: range.start,
        endTime: range.end,
        label: range.label,
        capacity: defaultCapacity,
        bookedCount: booked,
        availableSeats: Math.max(0, defaultCapacity - booked),
        isAvailable,
      };
    });

    res.json({
      success: true,
      data: {
        date: targetDate,
        service: {
          id: serviceItem.id,
          title: serviceItem.title,
          price: serviceItem.price,
        },
        slots,
      },
    });
  } catch (error) {
    console.error('Available slots error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch available booking slots' });
  }
});

export default router;

