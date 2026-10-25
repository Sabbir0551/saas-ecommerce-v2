import fs from 'fs';
import path from 'path';

export function getTenantPartitionPath(tenantIdentifier: string): string {
  const cleanSub = tenantIdentifier.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const candidate = path.resolve(process.cwd(), `backend/data/tenants/tenant_${cleanSub}.json`);
  if (fs.existsSync(candidate)) return candidate;
  const rootCandidate = path.resolve(process.cwd(), `data/tenants/tenant_${cleanSub}.json`);
  if (fs.existsSync(rootCandidate)) return rootCandidate;
  return candidate;
}

export function loadTenantData(tenantIdentifier: string) {
  const filePath = getTenantPartitionPath(tenantIdentifier);
  if (!fs.existsSync(filePath)) {
    return { data: null, filePath };
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return { data: JSON.parse(raw), filePath };
  } catch (err) {
    console.error('Error loading tenant partition data:', err);
    return { data: null, filePath };
  }
}

export function saveTenantData(filePath: string, data: any) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving tenant partition data:', err);
    return false;
  }
}

export interface StockCheckResult {
  available: boolean;
  errors: string[];
}

/**
 * Checks if all requested items have enough Available to Sell (On-hand - Active Reservations)
 */
export function checkStockAvailability(subdomain: string, orderItems: any[]): StockCheckResult {
  const { data } = loadTenantData(subdomain);
  if (!data) return { available: true, errors: [] }; // fallback if no partition

  const items = data.items || [];
  const reservations = data.stockReservations || [];

  // Active reservations per item
  const activeReservedMap: Record<string, number> = {};
  reservations.forEach((r: any) => {
    if (r.status === 'ACTIVE') {
      activeReservedMap[r.itemId] = (activeReservedMap[r.itemId] || 0) + Number(r.quantity || 0);
    }
  });

  const errors: string[] = [];

  for (const oi of orderItems) {
    if (!oi.itemId) continue;
    const catalogItem = items.find((i: any) => i.id === oi.itemId || i.slug === oi.itemId);
    if (!catalogItem) continue; // service or virtual item

    const onHand = Number(catalogItem.stockQuantity || 0);
    const reserved = activeReservedMap[catalogItem.id] || 0;
    const available = Math.max(0, onHand - reserved);
    const requestedQty = Number(oi.quantity || 1);

    if (available < requestedQty) {
      errors.push(
        `Insufficient stock for "${catalogItem.title}" (On-hand: ${onHand}, Reserved: ${reserved}, Available: ${available}, Requested: ${requestedQty})`
      );
    }
  }

  return {
    available: errors.length === 0,
    errors,
  };
}

/**
 * Creates ACTIVE stock reservations for an order and logs RESERVATION_LOCK in the ledger
 */
export function createStockReservations(subdomain: string, orderId: string, orderNumber: string, orderItems: any[]): boolean {
  const { data, filePath } = loadTenantData(subdomain);
  if (!data) return false;

  if (!data.stockReservations) data.stockReservations = [];
  if (!data.stockLedger) data.stockLedger = [];

  const items = data.items || [];
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48-hour reservation window

  orderItems.forEach((oi: any) => {
    const catalogItem = items.find((i: any) => i.id === oi.itemId || i.slug === oi.itemId);
    const qty = Number(oi.quantity || 1);
    const itemId = catalogItem?.id || oi.itemId;
    const itemTitle = catalogItem?.title || oi.itemTitle || 'Physical Item';

    // 1. Add active reservation
    const reservationEntry = {
      id: `resv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderId,
      orderNumber,
      itemId,
      itemTitle,
      quantity: qty,
      status: 'ACTIVE',
      expiresAt,
      createdAt: now,
    };
    data.stockReservations.push(reservationEntry);

    // 2. Add RESERVATION_LOCK in immutable ledger
    if (catalogItem) {
      data.stockLedger.push({
        id: `ldg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        itemId,
        sku: catalogItem.sku || 'SKU-UNKNOWN',
        itemTitle,
        locationId: catalogItem.locationId || 'loc_main',
        locationName: 'WH-MAIN (Tejgaon Central)',
        bin: catalogItem.bin || 'A-01-01',
        movementType: 'RESERVATION_LOCK',
        qtyChange: 0, // Does not decrease on-hand yet, locks available to sell
        balanceAfter: Number(catalogItem.stockQuantity || 0),
        unitCost: Number(catalogItem.costPrice || 0),
        totalValue: 0,
        reference: orderNumber,
        notes: `Stock reserved: ${qty} units locked for Order #${orderNumber}`,
        performedBy: 'Checkout Reservation Engine',
        createdAt: now,
      });
    }
  });

  return saveTenantData(filePath, data);
}

/**
 * Fulfills order stock upon shipping or delivery:
 * Marks reservations FULFILLED, permanently deducts On-Hand stock, and writes SHIP_ORDER to ledger
 */
export function fulfillOrderStock(
  subdomain: string,
  orderId: string,
  orderNumber: string,
  courier?: string,
  performedBy: string = 'Dispatch Officer'
): boolean {
  const { data, filePath } = loadTenantData(subdomain);
  if (!data) return false;

  if (!data.stockReservations) data.stockReservations = [];
  if (!data.stockLedger) data.stockLedger = [];
  if (!data.items) data.items = [];

  const now = new Date().toISOString();
  let dirty = false;

  // Find order in partition to get item details if reservations are missing
  const order = (data.orders || []).find((o: any) => o.id === orderId || o.orderNumber === orderNumber);
  const orderItems = order?.items || [];

  // Check if already fulfilled to avoid double-deduction
  const alreadyShipped = data.stockLedger.some(
    (l: any) => l.movementType === 'SHIP_ORDER' && (l.reference === orderNumber || l.reference === orderId)
  );
  if (alreadyShipped) {
    return false; // Already shipped, no duplicate deduction
  }

  // 1. Mark reservations as FULFILLED
  const matchedReservations = data.stockReservations.filter(
    (r: any) => (r.orderId === orderId || r.orderNumber === orderNumber) && r.status === 'ACTIVE'
  );

  matchedReservations.forEach((r: any) => {
    r.status = 'FULFILLED';
    r.fulfilledAt = now;
    dirty = true;
  });

  // 2. Deduct physical On-Hand stock and append SHIP_ORDER to ledger
  orderItems.forEach((oi: any) => {
    const catalogItem = data.items.find((i: any) => i.id === oi.itemId || i.slug === oi.itemId);
    if (!catalogItem) return;

    const qty = Number(oi.quantity || 1);
    const currentOnHand = Number(catalogItem.stockQuantity || 0);
    const newOnHand = Math.max(0, currentOnHand - qty);
    catalogItem.stockQuantity = newOnHand;

    data.stockLedger.push({
      id: `ldg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      itemId: catalogItem.id,
      sku: catalogItem.sku || 'SKU-UNKNOWN',
      itemTitle: catalogItem.title,
      locationId: catalogItem.locationId || 'loc_main',
      locationName: 'Main Central Warehouse (Dhaka Central WH)',
      bin: catalogItem.bin || 'A-01-01',
      movementType: 'SHIP_ORDER',
      qtyChange: -qty,
      balanceAfter: newOnHand,
      unitCost: Number(catalogItem.costPrice || 0),
      totalValue: qty * Number(catalogItem.costPrice || 0),
      reference: orderNumber,
      notes: `Order #${orderNumber} dispatched via courier (${courier || 'Steadfast'})`,
      performedBy,
      createdAt: now,
    });

    dirty = true;
  });

  if (dirty) {
    return saveTenantData(filePath, data);
  }
  return false;
}

/**
 * Cancels an order:
 * If not yet shipped, unlocks active reservations (RESERVATION_FREE).
 * If already shipped, restocks items back to available inventory (RETURN_RESTOCK).
 */
export function cancelOrderStock(
  subdomain: string,
  orderId: string,
  orderNumber: string,
  performedBy: string = 'Order Admin'
): boolean {
  const { data, filePath } = loadTenantData(subdomain);
  if (!data) return false;

  if (!data.stockReservations) data.stockReservations = [];
  if (!data.stockLedger) data.stockLedger = [];
  if (!data.items) data.items = [];

  const now = new Date().toISOString();
  let dirty = false;

  // Check if order was already shipped
  const wasShipped = data.stockLedger.some(
    (l: any) => l.movementType === 'SHIP_ORDER' && (l.reference === orderNumber || l.reference === orderId)
  );

  const order = (data.orders || []).find((o: any) => o.id === orderId || o.orderNumber === orderNumber);
  const orderItems = order?.items || [];

  if (wasShipped) {
    // Already shipped: restock items back to inventory (RETURN_RESTOCK)
    orderItems.forEach((oi: any) => {
      const catalogItem = data.items.find((i: any) => i.id === oi.itemId || i.slug === oi.itemId);
      if (!catalogItem) return;

      const qty = Number(oi.quantity || 1);
      const currentOnHand = Number(catalogItem.stockQuantity || 0);
      const newOnHand = currentOnHand + qty;
      catalogItem.stockQuantity = newOnHand;

      data.stockLedger.push({
        id: `ldg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        itemId: catalogItem.id,
        sku: catalogItem.sku || 'SKU-UNKNOWN',
        itemTitle: catalogItem.title,
        locationId: catalogItem.locationId || 'loc_main',
        locationName: 'Main Central Warehouse (Dhaka Central WH)',
        bin: catalogItem.bin || 'A-01-01',
        movementType: 'RETURN_RESTOCK',
        qtyChange: qty,
        balanceAfter: newOnHand,
        unitCost: Number(catalogItem.costPrice || 0),
        totalValue: qty * Number(catalogItem.costPrice || 0),
        reference: orderNumber,
        notes: `Order #${orderNumber} cancelled/returned: stock restocked into warehouse`,
        performedBy,
        createdAt: now,
      });

      dirty = true;
    });
  } else {
    // Not shipped yet: unlock active reservations
    const matchedReservations = data.stockReservations.filter(
      (r: any) => (r.orderId === orderId || r.orderNumber === orderNumber) && r.status === 'ACTIVE'
    );

    matchedReservations.forEach((r: any) => {
      r.status = 'CANCELLED';
      r.cancelledAt = now;
      dirty = true;

      const catalogItem = data.items.find((i: any) => i.id === r.itemId);
      if (catalogItem) {
        data.stockLedger.push({
          id: `ldg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          itemId: catalogItem.id,
          sku: catalogItem.sku || 'SKU-UNKNOWN',
          itemTitle: catalogItem.title,
          locationId: catalogItem.locationId || 'loc_main',
          locationName: 'WH-MAIN (Tejgaon Central)',
          bin: catalogItem.bin || 'A-01-01',
          movementType: 'RESERVATION_FREE',
          qtyChange: 0,
          balanceAfter: Number(catalogItem.stockQuantity || 0),
          unitCost: Number(catalogItem.costPrice || 0),
          totalValue: 0,
          reference: orderNumber,
          notes: `Order #${orderNumber} cancelled: unlocked ${r.quantity} reserved units`,
          performedBy,
          createdAt: now,
        });
      }
    });
  }

  if (dirty) {
    return saveTenantData(filePath, data);
  }
  return false;
}
