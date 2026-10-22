import { Router, Request, Response } from 'express';
import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { requireTenant } from '../../middlewares/tenant.middleware.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  checkStockAvailability,
  createStockReservations,
  fulfillOrderStock,
  cancelOrderStock,
} from '../inventory/inventory.service.js';

const router = Router();

function getTenantPartitionFilePath(subdomain: string): string {
  const clean = subdomain.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const candidates = [
    path.resolve(process.cwd(), `data/tenants/tenant_${clean}.json`),
    path.resolve(process.cwd(), `backend/data/tenants/tenant_${clean}.json`),
    fileURLToPath(new URL(`../../../data/tenants/tenant_${clean}.json`, import.meta.url)),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

function getInitialSeedOrders(tenant: any): any[] {
  const sub = (tenant.subdomain || tenant.id || '').toLowerCase();
  const isMed = tenant.businessType === 'healthcare_service' || sub === 'medicare';
  const isEstate = tenant.businessType === 'real_estate' || sub === 'aebanproperty';
  const isLeather = sub === 'arbanleather';

  if (isMed) {
    return [
      {
        id: `ord_${Date.now()}_1`,
        orderNumber: 'MED-771024-01',
        customerName: 'Nasir Uddin Chowdhury',
        customerPhone: '+880 1711-234567',
        customerEmail: 'nasir.c@gmail.com',
        shippingAddress: 'Gulshan 2, Dhaka',
        city: 'Dhaka',
        businessCategory: 'healthcare_service',
        orderType: 'SERVICE_APPOINTMENT',
        serviceTitle: 'Senior Dental Consultation & Full OPG Screening',
        appointmentDate: '2026-10-24',
        appointmentTime: '11:00 AM',
        serialNumber: 1,
        totalAmount: 500,
        paymentMethod: 'CASH_AT_CLINIC',
        orderStatus: 'CONFIRMED',
        consultationStatus: 'SCHEDULED',
        doctorName: 'Dr. Shahriar Kabir (FCPS, BDS)',
        notes: 'Complaining of sensitivity on upper right molar',
        createdAt: new Date().toISOString(),
      },
      {
        id: `ord_${Date.now()}_2`,
        orderNumber: 'MED-771024-02',
        customerName: 'Farhana Yasmin',
        customerPhone: '+880 1819-876543',
        customerEmail: 'farhana.y@yahoo.com',
        shippingAddress: 'Banani, Dhaka',
        city: 'Dhaka',
        businessCategory: 'healthcare_service',
        orderType: 'SERVICE_APPOINTMENT',
        serviceTitle: 'Laser Teeth Whitening & Ultrasonic Scaling',
        appointmentDate: '2026-10-25',
        appointmentTime: '03:00 PM',
        serialNumber: 2,
        totalAmount: 2500,
        paymentMethod: 'ONLINE_BKASH',
        orderStatus: 'PENDING',
        consultationStatus: 'PENDING_CONFIRMATION',
        doctorName: 'Dr. Nadia Sultana (BDS, PGT)',
        notes: 'Pre-wedding whitening package appointment',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  if (isEstate) {
    return [
      {
        id: `ord_${Date.now()}_1`,
        orderNumber: 'PROP-992011',
        customerName: 'Barrister Rafiqul Islam',
        customerPhone: '+880 1713-998877',
        customerEmail: 'rafiqul.law@chamber.com',
        shippingAddress: 'Baridhara Diplomatic Zone, Dhaka',
        city: 'Dhaka',
        businessCategory: 'real_estate',
        orderType: 'LEAD_GEN_REAL_ESTATE',
        propertyTitle: 'The Grand Regal Country Estate (10,000 sq ft)',
        budget: '৳ 45,000,000',
        siteVisitDate: '2026-10-26',
        totalAmount: 0,
        paymentMethod: 'INQUIRY_ONLY',
        orderStatus: 'SITE_VISIT_SCHEDULED',
        leadStatus: 'QUALIFIED_BUYER',
        assignedAgent: 'Tariq Anam (Senior VP Sales)',
        notes: 'Interested in private 3-acre gated perimeter villa',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  // Physical Goods (Leather, Fashion, Tech)
  return [
    {
      id: `ord_${Date.now()}_1`,
      orderNumber: 'ORD-892110',
      customerName: 'Tanvir Ahmed',
      customerPhone: '+880 1711-554433',
      customerEmail: 'tanvir.ahmed@gmail.com',
      shippingAddress: 'House 34, Road 11, Banani',
      city: 'Dhaka',
      businessCategory: isLeather ? 'leather_goods' : 'fashion_clothing',
      orderType: 'PHYSICAL_PRODUCT',
      items: [
        {
          itemTitle: isLeather ? 'Executive Full-Grain Leather Briefcase' : 'Handcrafted Royal Dhakai Jamdani Saree',
          variantTitle: isLeather ? 'Cognac Tan' : 'Gold Zari Cream',
          quantity: 1,
          price: isLeather ? 5200 : 6500,
          subtotal: isLeather ? 5200 : 6500,
        },
      ],
      deliveryCharge: 60,
      totalAmount: isLeather ? 5260 : 6560,
      paymentMethod: 'COD',
      orderStatus: 'SHIPPED',
      courier: 'Steadfast Courier',
      trackingCode: 'STEAD-892110-BD',
      notes: 'Please deliver after 2:00 PM',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: `ord_${Date.now()}_2`,
      orderNumber: 'ORD-892111',
      customerName: 'Nusrat Jahan',
      customerPhone: '+880 1819-332211',
      customerEmail: 'nusrat.jahan@hotmail.com',
      shippingAddress: 'East Nasirabad, GEC Circle',
      city: 'Chattogram',
      businessCategory: isLeather ? 'leather_goods' : 'fashion_clothing',
      orderType: 'PHYSICAL_PRODUCT',
      items: [
        {
          itemTitle: isLeather ? 'Executive Full-Grain Leather Briefcase' : 'Platinum Cotton Exclusive Semi-Long Panjabi',
          variantTitle: isLeather ? 'Vintage Brown' : 'Navy Blue (Size 42)',
          quantity: 1,
          price: isLeather ? 5200 : 2850,
          subtotal: isLeather ? 5200 : 2850,
        },
      ],
      deliveryCharge: 120,
      totalAmount: isLeather ? 5320 : 2970,
      paymentMethod: 'COD',
      orderStatus: 'PROCESSING',
      courier: 'Pathao Courier',
      trackingCode: 'PATH-441098-CTG',
      notes: 'Call before dispatching',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: `ord_${Date.now()}_3`,
      orderNumber: 'ORD-892112',
      customerName: 'Mahmudul Hasan',
      customerPhone: '+880 1912-778899',
      customerEmail: 'mahmud.h@gmail.com',
      shippingAddress: 'Sector 4, Uttara Model Town',
      city: 'Dhaka',
      businessCategory: isLeather ? 'leather_goods' : 'fashion_clothing',
      orderType: 'PHYSICAL_PRODUCT',
      items: [
        {
          itemTitle: isLeather ? 'Executive Full-Grain Leather Briefcase' : 'Handcrafted Royal Dhakai Jamdani Saree',
          variantTitle: isLeather ? 'Ebony Black' : 'Deep Crimson',
          quantity: 1,
          price: isLeather ? 5200 : 6500,
          subtotal: isLeather ? 5200 : 6500,
        },
      ],
      deliveryCharge: 60,
      totalAmount: isLeather ? 5260 : 6560,
      paymentMethod: 'COD',
      orderStatus: 'PENDING',
      courier: 'Pending Assignment',
      trackingCode: '',
      notes: 'Urgent delivery requested',
      createdAt: new Date().toISOString(),
    },
  ];
}

// List Orders / Appointments for Tenant Admin
router.get('/', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const { status, category, search } = req.query;

    // 1. Try fetching from Database
    try {
      const dbOnline = await isDatabaseAvailable();
      if (dbOnline) {
        const where: any = { tenantId: tenant.id };
        if (status && status !== 'all') {
          where.status = status;
        }
        const dbOrders = await prisma.order.findMany({
          where,
          include: {
            items: true,
            booking: true,
            statusHistory: { orderBy: { createdAt: 'desc' } },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (dbOrders.length > 0) {
          res.json({ success: true, data: dbOrders });
          return;
        }
      }
    } catch {}

    // 2. Dedicated partition file lookup & auto-seeding
    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    let partitionOrders: any[] = [];
    let pData: any = null;

    if (fs.existsSync(partitionFile)) {
      try {
        pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        if (pData.orders && Array.isArray(pData.orders)) {
          partitionOrders = pData.orders;
        }
      } catch {}
    }

    if (partitionOrders.length === 0) {
      partitionOrders = getInitialSeedOrders(tenant);
      if (!pData) {
        pData = {
          tenantId: tenant.id,
          subdomain: tenant.subdomain,
          categories: [],
          brands: [],
          items: [],
          orders: [],
        };
      }
      pData.orders = partitionOrders;
      try {
        const pDir = path.dirname(partitionFile);
        if (!fs.existsSync(pDir)) fs.mkdirSync(pDir, { recursive: true });
        fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
      } catch {}
    }

    // Apply filters
    let filtered = [...partitionOrders];
    if (status && status !== 'all') {
      filtered = filtered.filter(
        (o) => o.orderStatus?.toLowerCase() === (status as string).toLowerCase()
      );
    }
    if (category && category !== 'all') {
      filtered = filtered.filter(
        (o) =>
          o.businessCategory?.toLowerCase() === (category as string).toLowerCase() ||
          o.orderType?.toLowerCase() === (category as string).toLowerCase()
      );
    }
    if (search) {
      const s = (search as string).toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.customerName?.toLowerCase().includes(s) ||
          o.customerPhone?.toLowerCase().includes(s) ||
          o.orderNumber?.toLowerCase().includes(s)
      );
    }

    res.json({ success: true, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Place Order / Submit Appointment
router.post('/place', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenant!.id;
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      city = 'Dhaka',
      notes,
      paymentMethod = 'COD',
      orderType = 'STANDARD',
      customAttributes = {},
      items, // array of { itemId, variantId, quantity, customAttributes }
      // Booking specific params
      bookingDate,
      bookingTime,
      serviceItemId,
    } = req.body;

    if (!customerName || !customerPhone || !shippingAddress) {
      res.status(400).json({
        success: false,
        message: 'Name, phone number, and delivery address are mandatory.',
      });
      return;
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const deliveryCharge = city.toLowerCase().includes('dhaka') ? 60 : 120;
    let subtotal = 0;
    const orderItemsToCreate: any[] = [];

    // Process physical items if provided
    if (items && Array.isArray(items) && items.length > 0) {
      for (const itemInput of items) {
        let dbItem: any = null;
        try {
          dbItem = await prisma.item.findFirst({
            where: { id: itemInput.itemId, tenantId },
            include: { variants: true },
          });
        } catch {}

        if (!dbItem) {
          const partitionFile = getTenantPartitionFilePath(req.tenant!.subdomain);
          if (fs.existsSync(partitionFile)) {
            try {
              const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
              dbItem = pData.items?.find((i: any) => i.id === itemInput.itemId || i.slug === itemInput.itemId);
            } catch {}
          }
        }

        let itemPrice = Number(itemInput.price || dbItem?.price || 0);
        let variantTitle: string | null = itemInput.variantTitle || null;

        if (dbItem && itemInput.variantId && dbItem.variants) {
          const variant = dbItem.variants.find((v: any) => v.id === itemInput.variantId);
          if (variant) {
            itemPrice = variant.price;
            variantTitle = variant.title;
          }
        }

        const quantity = itemInput.quantity || 1;
        const lineTotal = itemPrice * quantity;
        subtotal += lineTotal;

        orderItemsToCreate.push({
          itemId: dbItem?.id || itemInput.itemId || `item_${Date.now()}`,
          variantId: itemInput.variantId || null,
          itemTitle: dbItem?.title || itemInput.title || 'Catalog Item',
          variantTitle,
          price: itemPrice,
          quantity,
          subtotal: lineTotal,
          customAttributes: itemInput.customAttributes || {},
        });
      }
    }

    // Phase 2 Stock Availability Validation
    if (orderItemsToCreate.length > 0 && !serviceItemId) {
      const stockCheck = checkStockAvailability(req.tenant!.subdomain, orderItemsToCreate);
      if (!stockCheck.available) {
        res.status(400).json({
          success: false,
          message: stockCheck.errors.join('; '),
        });
        return;
      }
    }

    // Process Service / Appointment if selected
    let serviceItem: any = null;
    if (serviceItemId && bookingDate && bookingTime) {
      try {
        serviceItem = await prisma.item.findFirst({
          where: { id: serviceItemId, tenantId },
        });
      } catch {}

      if (!serviceItem) {
        const partitionFile = getTenantPartitionFilePath(req.tenant!.subdomain);
        if (fs.existsSync(partitionFile)) {
          try {
            const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
            serviceItem = pData.items?.find((i: any) => i.id === serviceItemId || i.slug === serviceItemId);
          } catch {}
        }
      }

      const servicePrice = Number(serviceItem?.price || 500);
      subtotal += servicePrice;
      orderItemsToCreate.push({
        itemId: serviceItem?.id || serviceItemId,
        itemTitle: serviceItem?.title || 'Service Appointment',
        variantTitle: `Date: ${bookingDate}, Time: ${bookingTime}`,
        price: servicePrice,
        quantity: 1,
        subtotal: servicePrice,
      });
    }

    const totalAmount = subtotal + (serviceItemId ? 0 : deliveryCharge);

    const cleanOrderType = serviceItemId ? 'BOOKING' : (orderType || 'STANDARD');
    const cleanCustomAttributes = typeof customAttributes === 'object' && customAttributes !== null ? customAttributes : {};

    let orderRecord: any = null;

    // Try DB transaction if reachable
    try {
      orderRecord = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            tenantId,
            orderNumber,
            customerName,
            customerPhone,
            customerEmail,
            shippingAddress,
            city,
            notes,
            orderType: cleanOrderType,
            customAttributes: cleanCustomAttributes,
            subtotal,
            deliveryCharge: serviceItemId ? 0 : deliveryCharge,
            totalAmount,
            paymentMethod,
            bookingDate: bookingDate || null,
            bookingTime: bookingTime || null,
            items: {
              create: orderItemsToCreate.map((oi) => ({
                itemId: oi.itemId,
                variantId: oi.variantId,
                itemTitle: oi.itemTitle,
                variantTitle: oi.variantTitle,
                price: oi.price,
                quantity: oi.quantity,
                subtotal: oi.subtotal,
              })),
            },
            statusHistory: {
              create: {
                status: 'PENDING',
                notes: 'Customer placed new order or appointment slot',
              },
            },
          },
        });

        // If Service Appointment, create appointment booking record
        if (serviceItemId && bookingDate && bookingTime) {
          const count = await tx.booking.count({
            where: { tenantId, bookingDate },
          });

          await tx.booking.create({
            data: {
              tenantId,
              itemId: serviceItemId,
              orderId: order.id,
              customerName,
              customerPhone,
              customerEmail,
              bookingDate,
              bookingTime,
              serialNumber: count + 1,
              notes,
            },
          });
        }

        return order;
      });
    } catch (dbErr) {
      // Prisma offline: create standalone record for partition storage
      orderRecord = {
        id: `ord_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
        orderNumber,
        totalAmount,
      };
    }

    // Always persist order to tenant partition file
    try {
      const partitionFile = getTenantPartitionFilePath(req.tenant!.subdomain);
      let pData: any = null;
      if (fs.existsSync(partitionFile)) {
        pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
      } else {
        pData = { tenantId, subdomain: req.tenant!.subdomain, categories: [], brands: [], items: [], orders: [] };
      }
      if (!pData.orders) pData.orders = [];

      const newPartitionOrder = {
        id: orderRecord.id,
        orderNumber: orderRecord.orderNumber || orderNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || '',
        shippingAddress,
        city,
        businessCategory: req.tenant!.businessType || 'fashion_clothing',
        orderType: cleanOrderType,
        customAttributes: cleanCustomAttributes,
        items: orderItemsToCreate,
        subtotal,
        deliveryCharge: serviceItemId ? 0 : deliveryCharge,
        totalAmount,
        paymentMethod,
        orderStatus: 'PENDING',
        courier: 'Pending Assignment',
        trackingCode: '',
        appointmentDate: bookingDate || null,
        appointmentTime: bookingTime || null,
        serviceTitle: serviceItem?.title || null,
        notes: notes || '',
        createdAt: new Date().toISOString(),
      };
      pData.orders.unshift(newPartitionOrder);
      fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));

      // Phase 2 Movement Engine: Lock stock reservation
      if (orderItemsToCreate.length > 0 && !serviceItemId) {
        createStockReservations(
          req.tenant!.subdomain,
          newPartitionOrder.id,
          newPartitionOrder.orderNumber,
          orderItemsToCreate
        );
      }
    } catch (syncErr) {
      console.error('Failed to sync order to partition:', syncErr);
    }

    res.status(201).json({
      success: true,
      message: 'Your order has been placed successfully!',
      data: {
        orderId: orderRecord.id,
        orderNumber: orderRecord.orderNumber || orderNumber,
        totalAmount: orderRecord.totalAmount || totalAmount,
      },
    });
  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ success: false, message: 'Failed to process order' });
  }
  });

  // Update Order / Appointment Status (Tenant Admin)
  router.patch('/:orderId/status', requireTenant, async (req: Request, res: Response) => {
    try {
      const tenant = req.tenant!;
      const { orderId } = req.params;
      const { orderStatus, courier, trackingCode, consultationStatus, leadStatus, adminNotes } = req.body;

      // 1. Try DB update
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            orderStatus: orderStatus as any,
          },
        });
      } catch {}

      // 2. Partition update
      const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
      let updatedOrder = null;
      if (fs.existsSync(partitionFile)) {
        try {
          const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
          if (pData.orders && Array.isArray(pData.orders)) {
            const idx = pData.orders.findIndex(
              (o: any) => o.id === orderId || o.orderNumber === orderId
            );
            if (idx !== -1) {
              const prevStatus = pData.orders[idx].orderStatus;
              const targetOrderNumber = pData.orders[idx].orderNumber || orderId;

              if (orderStatus) pData.orders[idx].orderStatus = orderStatus;
              if (courier) pData.orders[idx].courier = courier;
              if (trackingCode !== undefined) pData.orders[idx].trackingCode = trackingCode;
              if (consultationStatus) pData.orders[idx].consultationStatus = consultationStatus;
              if (leadStatus) pData.orders[idx].leadStatus = leadStatus;
              if (adminNotes !== undefined) pData.orders[idx].adminNotes = adminNotes;
              pData.orders[idx].updatedAt = new Date().toISOString();
              updatedOrder = pData.orders[idx];
              fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));

              // Phase 2 Movement Engine: Fulfill on SHIPPED/DELIVERED, Unlock on CANCELLED
              if (orderStatus && orderStatus !== prevStatus) {
                if (orderStatus === 'SHIPPED' || orderStatus === 'DELIVERED') {
                  fulfillOrderStock(tenant.subdomain, orderId, targetOrderNumber, courier, 'Admin Dispatch');
                } else if (orderStatus === 'CANCELLED' || orderStatus === 'FAILED') {
                  cancelOrderStock(tenant.subdomain, orderId, targetOrderNumber, 'Admin Cancel');
                }
              }
            }
          }
        } catch {}
      }

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
  });

  // Order & Revenue Statistics (Tenant Admin)
  router.get('/stats', requireTenant, async (req: Request, res: Response) => {
    try {
      const tenant = req.tenant!;
      const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
      let orders: any[] = [];

      try {
        orders = await prisma.order.findMany({
          where: { tenantId: tenant.id },
          include: { items: true },
        });
      } catch {}

      if (orders.length === 0 && fs.existsSync(partitionFile)) {
        try {
          const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
          if (pData.orders && Array.isArray(pData.orders)) {
            orders = pData.orders;
          }
        } catch {}
      }

      const totalOrders = orders.length;
      let totalRevenue = 0;
      const statusCounts: Record<string, number> = {};
      const orderTypeCounts: Record<string, number> = {};

      for (const o of orders) {
        const amt = Number(o.totalAmount || 0);
        const st = (o.orderStatus || o.status || 'PENDING').toUpperCase();
        const ot = (o.orderType || 'STANDARD').toUpperCase();

        if (st !== 'CANCELLED' && st !== 'FAILED') {
          totalRevenue += amt;
        }
        statusCounts[st] = (statusCounts[st] || 0) + 1;
        orderTypeCounts[ot] = (orderTypeCounts[ot] || 0) + 1;
      }

      res.json({
        success: true,
        data: {
          totalOrders,
          totalRevenue,
          statusCounts,
          orderTypeCounts,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch order statistics' });
    }
  });

  // Bulk Status Update (Tenant Admin)
  router.post('/bulk-status', requireTenant, async (req: Request, res: Response) => {
    try {
      const tenant = req.tenant!;
      const { orderIds, orderStatus, courier, trackingCode } = req.body;

      if (!Array.isArray(orderIds) || orderIds.length === 0 || !orderStatus) {
        res.status(400).json({
          success: false,
          message: 'orderIds array and orderStatus are required',
        });
        return;
      }

      try {
        await prisma.order.updateMany({
          where: {
            tenantId: tenant.id,
            id: { in: orderIds },
          },
          data: {
            orderStatus: orderStatus as any,
          },
        });
      } catch {}

      const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
      let updatedCount = 0;
      if (fs.existsSync(partitionFile)) {
        try {
          const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
          if (pData.orders && Array.isArray(pData.orders)) {
            for (const ord of pData.orders) {
              if (orderIds.includes(ord.id) || orderIds.includes(ord.orderNumber)) {
                const prevStatus = ord.orderStatus;
                ord.orderStatus = orderStatus;
                if (courier) ord.courier = courier;
                if (trackingCode !== undefined) ord.trackingCode = trackingCode;
                ord.updatedAt = new Date().toISOString();
                updatedCount++;

                // Phase 2 Movement Engine: Bulk Dispatch / Cancel
                if (orderStatus !== prevStatus) {
                  if (orderStatus === 'SHIPPED' || orderStatus === 'DELIVERED') {
                    fulfillOrderStock(tenant.subdomain, ord.id, ord.orderNumber, courier, 'Admin Bulk Dispatch');
                  } else if (orderStatus === 'CANCELLED' || orderStatus === 'FAILED') {
                    cancelOrderStock(tenant.subdomain, ord.id, ord.orderNumber, 'Admin Bulk Cancel');
                  }
                }
              }
            }
            fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
          }
        } catch {}
      }

      res.json({
        success: true,
        message: `Successfully updated ${updatedCount} orders to ${orderStatus}`,
        data: { updatedCount, orderStatus },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to bulk update orders' });
    }
  });

  // Edit Order Before Delivery (Tenant Admin)
  router.patch('/:orderId/edit', requireTenant, async (req: Request, res: Response) => {
    try {
      const tenant = req.tenant!;
      const { orderId } = req.params;
      const {
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        city,
        deliveryCharge,
        notes,
        customAttributes,
      } = req.body;

      try {
        const updateData: any = {};
        if (customerName) updateData.customerName = customerName;
        if (customerPhone) updateData.customerPhone = customerPhone;
        if (customerEmail !== undefined) updateData.customerEmail = customerEmail;
        if (shippingAddress) updateData.shippingAddress = shippingAddress;
        if (city) updateData.city = city;
        if (deliveryCharge !== undefined) updateData.deliveryCharge = Number(deliveryCharge);
        if (notes !== undefined) updateData.notes = notes;
        if (customAttributes) updateData.customAttributes = customAttributes;

        await prisma.order.update({
          where: { id: orderId },
          data: updateData,
        });
      } catch {}

      const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
      let editedOrder = null;
      if (fs.existsSync(partitionFile)) {
        try {
          const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
          if (pData.orders && Array.isArray(pData.orders)) {
            const idx = pData.orders.findIndex(
              (o: any) => o.id === orderId || o.orderNumber === orderId
            );
            if (idx !== -1) {
              const ord = pData.orders[idx];
              if (customerName) ord.customerName = customerName;
              if (customerPhone) ord.customerPhone = customerPhone;
              if (customerEmail !== undefined) ord.customerEmail = customerEmail;
              if (shippingAddress) ord.shippingAddress = shippingAddress;
              if (city) ord.city = city;
              if (deliveryCharge !== undefined) {
                const diff = Number(deliveryCharge) - Number(ord.deliveryCharge || 0);
                ord.deliveryCharge = Number(deliveryCharge);
                ord.totalAmount = Number(ord.totalAmount || 0) + diff;
              }
              if (notes !== undefined) ord.notes = notes;
              if (customAttributes && typeof customAttributes === 'object') {
                ord.customAttributes = { ...(ord.customAttributes || {}), ...customAttributes };
              }
              ord.updatedAt = new Date().toISOString();
              editedOrder = ord;
              fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
            }
          }
        } catch {}
      }

      if (!editedOrder) {
        res.status(404).json({ success: false, message: 'Order not found to edit' });
        return;
      }

      res.json({
        success: true,
        message: 'Order updated successfully',
        data: editedOrder,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to edit order' });
    }
  });

  // Add Internal / Customer Note & Audit Log
  router.post('/:orderId/notes', requireTenant, async (req: Request, res: Response) => {
    try {
      const tenant = req.tenant!;
      const { orderId } = req.params;
      const { note, author = 'Admin', visibility = 'internal' } = req.body;

      if (!note) {
        res.status(400).json({ success: false, message: 'Note text is required' });
        return;
      }

      const noteEntry = {
        id: `note_${Date.now()}`,
        note,
        author,
        visibility,
        createdAt: new Date().toISOString(),
      };

      const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
      let orderFound = null;
      if (fs.existsSync(partitionFile)) {
        try {
          const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
          if (pData.orders && Array.isArray(pData.orders)) {
            const idx = pData.orders.findIndex(
              (o: any) => o.id === orderId || o.orderNumber === orderId
            );
            if (idx !== -1) {
              if (!pData.orders[idx].notesHistory) pData.orders[idx].notesHistory = [];
              pData.orders[idx].notesHistory.push(noteEntry);
              pData.orders[idx].updatedAt = new Date().toISOString();
              orderFound = pData.orders[idx];
              fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
            }
          }
        } catch {}
      }

      res.json({
        success: true,
        message: 'Note added successfully',
        data: noteEntry,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to add note' });
    }
  });

  // Create Manual Order / Booking (Tenant Admin)
  router.post('/manual', requireTenant, async (req: Request, res: Response) => {
    try {
      const tenant = req.tenant!;
      const {
        customerName,
        customerPhone,
        customerEmail = '',
        shippingAddress,
        city = 'Dhaka',
        itemTitle,
        variantTitle,
        price,
        quantity = 1,
        courier = 'Steadfast Courier',
        trackingCode = '',
        orderStatus = 'PROCESSING',
        orderType = 'STANDARD',
        source = 'PHONE_OR_MANUAL',
        customAttributes = {},
        appointmentDate,
        appointmentTime,
        propertyTitle,
        budget,
        notes = '',
      } = req.body;

      if (!customerName || !customerPhone) {
        res.status(400).json({ success: false, message: 'Customer name and phone are required' });
        return;
      }

      const orderNumber = `ORD-MAN-${Date.now().toString().slice(-5)}`;
      const numPrice = parseFloat(price) || 0;
      const numQty = parseInt(quantity, 10) || 1;
      const deliveryCharge = city.toLowerCase().includes('dhaka') ? 60 : 120;
      const totalAmount = numPrice * numQty + (orderType === 'BOOKING' || orderType === 'SERVICE_APPOINTMENT' ? 0 : deliveryCharge);
      const cleanCustomAttributes = typeof customAttributes === 'object' && customAttributes !== null ? customAttributes : {};

      const newOrder = {
        id: `ord_${Date.now()}`,
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress: shippingAddress || 'Store Pickup / Counter',
        city,
        businessCategory: tenant.businessType || 'general',
        orderType,
        source,
        customAttributes: cleanCustomAttributes,
        items: [
          {
            itemTitle: itemTitle || 'Manual Item',
            variantTitle: variantTitle || null,
            quantity: numQty,
            price: numPrice,
            subtotal: numPrice * numQty,
            customAttributes: cleanCustomAttributes,
          },
        ],
        deliveryCharge: orderType === 'BOOKING' || orderType === 'SERVICE_APPOINTMENT' ? 0 : deliveryCharge,
        totalAmount,
        paymentMethod: 'COD',
        orderStatus,
        courier,
        trackingCode,
        appointmentDate: appointmentDate || null,
        appointmentTime: appointmentTime || null,
        serviceTitle: (orderType === 'BOOKING' || orderType === 'SERVICE_APPOINTMENT') ? itemTitle : null,
        propertyTitle: orderType === 'LEAD_GEN_REAL_ESTATE' ? propertyTitle : null,
        budget: budget || null,
        notes,
        createdAt: new Date().toISOString(),
      };

      const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
      let pData: any = null;
      if (fs.existsSync(partitionFile)) {
        pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
      } else {
        pData = { tenantId: tenant.id, subdomain: tenant.subdomain, categories: [], brands: [], items: [], orders: [] };
      }
      if (!pData.orders) pData.orders = [];
      pData.orders.unshift(newOrder);
      fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));

      // Phase 2 Movement Engine: Process manual order stock
      if (orderType !== 'BOOKING' && orderType !== 'SERVICE_APPOINTMENT' && orderType !== 'LEAD_GEN_REAL_ESTATE') {
        const catalogItem = (pData.items || []).find(
          (i: any) => i.id === req.body.itemId || i.title === itemTitle
        );
        const resolvedItemId = catalogItem?.id || req.body.itemId || `item_manual_${Date.now()}`;

        if (orderStatus === 'SHIPPED' || orderStatus === 'DELIVERED') {
          fulfillOrderStock(tenant.subdomain, newOrder.id, newOrder.orderNumber, courier, 'Counter Direct Dispatch');
        } else if (orderStatus !== 'CANCELLED') {
          createStockReservations(tenant.subdomain, newOrder.id, newOrder.orderNumber, [
            {
              itemId: resolvedItemId,
              itemTitle: itemTitle || 'Manual Product Item',
              quantity: numQty,
            },
          ]);
        }
      }

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: newOrder,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create manual order' });
    }
  });

// Get Order Details / Success Page Lookup
router.get('/track/:orderNumber', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const { orderNumber } = req.params;

    let order: any = null;
    try {
      const dbOnline = await isDatabaseAvailable();
      if (dbOnline) {
        order = await prisma.order.findFirst({
          where: { tenantId: tenant.id, orderNumber },
          include: {
            items: true,
            booking: true,
            statusHistory: { orderBy: { createdAt: 'desc' } },
          },
        });
      }
    } catch {}

    if (!order) {
      const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
      if (fs.existsSync(partitionFile)) {
        try {
          const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
          order = pData.orders?.find(
            (o: any) => o.orderNumber === orderNumber || o.id === orderNumber
          );
        } catch {}
      }
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order tracking record not found' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
});

// Printable Invoice Data
router.get('/:orderId/invoice', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const { orderId } = req.params;

    let order: any = null;
    try {
      const dbOnline = await isDatabaseAvailable();
      if (dbOnline) {
        order = await prisma.order.findFirst({
          where: {
            tenantId: tenant.id,
            OR: [{ id: orderId }, { orderNumber: orderId }],
          },
          include: {
            items: true,
            tenant: true,
            booking: true,
          },
        });
      }
    } catch {}

    if (!order) {
      const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
      if (fs.existsSync(partitionFile)) {
        try {
          const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
          const found = pData.orders?.find(
            (o: any) => o.id === orderId || o.orderNumber === orderId
          );
          if (found) {
            order = {
              ...found,
              tenant: {
                name: tenant.name,
                subdomain: tenant.subdomain,
                phone: tenant.phone,
                email: tenant.email,
                address: tenant.address,
                currency: tenant.currency,
              },
            };
          }
        } catch {}
      }
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch invoice' });
  }
});

export default router;
