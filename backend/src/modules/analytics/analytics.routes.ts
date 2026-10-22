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

// Daily Appointments & Patient Serial Sheet (Print / PDF View API)
router.get('/daily-appointments-sheet', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const tenantId = tenant.id;
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];

    const dbOnline = await isDatabaseAvailable();
    if (dbOnline) {
      try {
        const bookings = await prisma.booking.findMany({
          where: {
            tenantId,
            bookingDate: date,
            status: { not: 'CANCELLED' },
          },
          include: {
            item: { select: { title: true, price: true } },
            order: { select: { orderNumber: true, paymentStatus: true, totalAmount: true } },
          },
          orderBy: [{ bookingTime: 'asc' }, { createdAt: 'asc' }],
        });

        res.json({
          success: true,
          data: {
            date,
            totalAppointments: bookings.length,
            appointments: bookings,
          },
        });
        return;
      } catch {}
    }

    // Partition fallback
    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    let matchedAppointments: any[] = [];

    if (fs.existsSync(partitionFile)) {
      try {
        const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        (pData.orders || []).forEach((o: any, idx: number) => {
          const oDate = o.appointmentDate || o.booking?.bookingDate;
          if (
            (o.orderType === 'SERVICE_APPOINTMENT' || o.orderType === 'BOOKING') &&
            o.orderStatus !== 'CANCELLED' &&
            oDate === date
          ) {
            matchedAppointments.push({
              id: o.id || `apt_${idx}`,
              serialNumber: o.serialNumber || idx + 1,
              bookingTime: o.appointmentTime || o.booking?.bookingTime || '10:00 AM',
              bookingDate: oDate,
              customerName: o.customerName,
              customerPhone: o.customerPhone,
              status: o.orderStatus === 'CONFIRMED' ? 'CONFIRMED' : 'PENDING',
              item: {
                title: o.serviceTitle || (o.items && o.items[0]?.itemTitle) || 'Specialized Service Consultation',
                price: o.totalAmount || 500,
              },
              order: {
                orderNumber: o.orderNumber,
                paymentStatus: o.paymentStatus || 'CASH_AT_CLINIC',
                totalAmount: o.totalAmount,
              },
            });
          }
        });
      } catch {}
    }

    res.json({
      success: true,
      data: {
        date,
        totalAppointments: matchedAppointments.length,
        appointments: matchedAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch daily sheet' });
  }
});

// Admin Dashboard Summary
router.get('/dashboard-summary', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const tenantId = tenant.id;

    const dbOnline = await isDatabaseAvailable();
    if (dbOnline) {
      try {
        const [ordersCount, pendingOrders, bookingsCount, totalRevenueResult, recentOrders] = await Promise.all([
          prisma.order.count({ where: { tenantId } }),
          prisma.order.count({ where: { tenantId, orderStatus: 'PENDING' } }),
          prisma.booking.count({ where: { tenantId } }),
          prisma.order.aggregate({
            where: { tenantId, paymentStatus: 'PAID' },
            _sum: { totalAmount: true },
          }),
          prisma.order.findMany({
            where: { tenantId },
            take: 5,
            orderBy: { createdAt: 'desc' },
          }),
        ]);

        res.json({
          success: true,
          data: {
            totalOrders: ordersCount,
            pendingOrders,
            totalBookings: bookingsCount,
            totalRevenue: totalRevenueResult._sum.totalAmount || 0,
            recentOrders,
          },
        });
        return;
      } catch {}
    }

    // Partition fallback
    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    let totalOrders = 0;
    let pendingOrders = 0;
    let totalBookings = 0;
    let totalRevenue = 0;
    let recentOrders: any[] = [];

    if (fs.existsSync(partitionFile)) {
      try {
        const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        const orders = pData.orders || [];
        totalOrders = orders.length;
        pendingOrders = orders.filter((o: any) => o.orderStatus === 'PENDING' || o.orderStatus === 'PROCESSING').length;
        totalBookings = orders.filter(
          (o: any) => o.orderType === 'SERVICE_APPOINTMENT' || o.orderType === 'BOOKING'
        ).length;
        totalRevenue = orders
          .filter((o: any) => o.orderStatus !== 'CANCELLED')
          .reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);
        recentOrders = orders.slice(0, 5);
      } catch {}
    }

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        totalBookings,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard summary' });
  }
});

export default router;

