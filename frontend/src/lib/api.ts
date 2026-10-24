const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchWithTenant(endpoint: string, options: RequestInit = {}, tenantSlug: string = 'fashion') {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('x-tenant-slug', tenantSlug);

  // Automatically attach Authorization token if user is logged in
  if (typeof window !== 'undefined' && !headers.has('Authorization')) {
    try {
      const storedAuth = 
        localStorage.getItem(`admin_auth_${tenantSlug}`) || 
        localStorage.getItem('admin_auth') || 
        localStorage.getItem('superadmin_auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        const token = parsed?.token || parsed?.data?.token;
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
    } catch {}
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    // Graceful proxy retry if direct port connection failed in browser
    if (typeof window !== 'undefined' && API_BASE_URL.startsWith('http://localhost:5000')) {
      try {
        const proxyRes = await fetch(`/api${endpoint}`, {
          ...options,
          headers,
          cache: 'no-store',
        });
        return await proxyRes.json();
      } catch {}
    }
    console.error(`API Error for ${endpoint}:`, error);
    return { success: false, message: 'Failed to connect to server' };
  }
}

export const api = {
  getTenant: (slug = 'fashion') => fetchWithTenant('/tenant/current', {}, slug),
  getItems: (params?: { category?: string; type?: string; featured?: boolean; search?: string }, slug = 'fashion') => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.type) query.set('type', params.type);
    if (params?.featured) query.set('featured', 'true');
    if (params?.search) query.set('search', params.search);
    return fetchWithTenant(`/catalog/items?${query.toString()}`, {}, slug);
  },
  getItemBySlug: (itemSlug: string, slug = 'fashion') => fetchWithTenant(`/catalog/items/${itemSlug}`, {}, slug),
  getCategories: (slug = 'fashion') => fetchWithTenant('/catalog/categories', {}, slug),
  getCategorySchemas: () => fetchWithTenant('/catalog/schemas'),
  getCategorySchema: (categoryKey: string) => fetchWithTenant(`/catalog/schemas/${categoryKey}`),
  getAvailableSlots: (date: string, itemId: string, slug = 'medicare') => 
    fetchWithTenant(`/bookings/available-slots?date=${date}&itemId=${itemId}`, {}, slug),
  placeOrder: (orderData: any, slug = 'fashion') => 
    fetchWithTenant('/orders/place', { method: 'POST', body: JSON.stringify(orderData) }, slug),
  trackOrder: (orderNumber: string, slug = 'fashion') => 
    fetchWithTenant(`/orders/track/${orderNumber}`, {}, slug),
  getPolicy: (type: 'terms' | 'privacy' | 'refund-policy', slug = 'fashion') => 
    fetchWithTenant(`/compliance/policies/${type}`, {}, slug),
  submitDispute: (data: any, slug = 'fashion') => 
    fetchWithTenant('/compliance/disputes/submit', { method: 'POST', body: JSON.stringify(data) }, slug),
  submitReview: (itemSlug: string, data: any, slug = 'fashion') => 
    fetchWithTenant(`/compliance/items/${itemSlug}/reviews`, { method: 'POST', body: JSON.stringify(data) }, slug),
  getDashboardSummary: (slug = 'fashion') => fetchWithTenant('/analytics/dashboard-summary', {}, slug),
  getDailyAppointmentsSheet: (date: string, slug = 'medicare') => 
    fetchWithTenant(`/analytics/daily-appointments-sheet?date=${date}`, {}, slug),
  getSuperAdminOverview: () => fetchWithTenant('/super-admin/overview'),
  superAdminLogin: (data: { email: string; password: string }) => 
    fetchWithTenant('/super-admin/login', { method: 'POST', body: JSON.stringify(data) }),
  // Unified Admin & Merchant Auth
  login: (data: { email: string; password: string; tenantSlug?: string; role?: string }) => 
    fetchWithTenant('/auth/login', { method: 'POST', body: JSON.stringify(data) }, data.tenantSlug || 'fashion'),
  getMe: (slug = 'fashion') => 
    fetchWithTenant('/auth/me', {}, slug),
  changePassword: (data: { currentPassword?: string; newPassword: string }, slug = 'fashion') => 
    fetchWithTenant('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }, slug),
  logout: (slug = 'fashion') => 
    fetchWithTenant('/auth/logout', { method: 'POST' }, slug),
  createTenant: (data: any) => fetchWithTenant('/super-admin/tenants/create', { method: 'POST', body: JSON.stringify(data) }),
  toggleTenantStatus: (tenantId: string, isActive: boolean) => 
    fetchWithTenant(`/super-admin/tenants/${tenantId}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  registerTenant: (data: any) => fetchWithTenant('/tenant/register', { method: 'POST', body: JSON.stringify(data) }),
  getTenantCategories: (slug = 'fashion') => fetchWithTenant('/tenant/categories', {}, slug),
  addCategory: (data: string | { name: string; promoSlogan?: string; bannerImage?: string }, slug = 'fashion') => {
    const body = typeof data === 'string' ? { name: data } : data;
    return fetchWithTenant('/tenant/categories', { method: 'POST', body: JSON.stringify(body) }, slug);
  },
  deleteCategory: (id: string, slug = 'fashion') => 
    fetchWithTenant(`/tenant/categories/${id}`, { method: 'DELETE' }, slug),
  getBrands: (slug = 'fashion') => fetchWithTenant('/tenant/brands', {}, slug),
  addBrand: (data: { name: string; logo?: string }, slug = 'fashion') => 
    fetchWithTenant('/tenant/brands', { method: 'POST', body: JSON.stringify(data) }, slug),
  deleteBrand: (id: string, slug = 'fashion') => 
    fetchWithTenant(`/tenant/brands/${id}`, { method: 'DELETE' }, slug),
  updateStoreSettings: (data: any, slug = 'fashion') => 
    fetchWithTenant('/tenant/settings', { method: 'PUT', body: JSON.stringify(data) }, slug),
  getTenantDbStatus: (slug = 'fashion') => fetchWithTenant('/tenant/db-status', {}, slug),
  addItem: (data: any, slug = 'fashion') => 
    fetchWithTenant('/catalog/items', { method: 'POST', body: JSON.stringify(data) }, slug),
  updateItem: (id: string, data: any, slug = 'fashion') => 
    fetchWithTenant(`/catalog/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }, slug),
  deleteItem: (id: string, slug = 'fashion') => 
    fetchWithTenant(`/catalog/items/${id}`, { method: 'DELETE' }, slug),
  // Media & Video Showcase
  getMedia: (params?: { categoryId?: string; type?: string }, slug = 'fashion') => {
    const query = new URLSearchParams();
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    if (params?.type) query.set('type', params.type);
    return fetchWithTenant(`/tenant/media?${query.toString()}`, {}, slug);
  },
  addMedia: (data: any, slug = 'fashion') => 
    fetchWithTenant('/tenant/media', { method: 'POST', body: JSON.stringify(data) }, slug),
  deleteMedia: (id: string, slug = 'fashion') => 
    fetchWithTenant(`/tenant/media/${id}`, { method: 'DELETE' }, slug),
  // Order & Booking Management
  getOrders: (params?: { status?: string; category?: string; search?: string }, slug = 'fashion') => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    return fetchWithTenant(`/orders?${query.toString()}`, {}, slug);
  },
  updateOrderStatus: (orderId: string, data: any, slug = 'fashion') => 
    fetchWithTenant(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify(data) }, slug),
  createManualOrder: (data: any, slug = 'fashion') => 
    fetchWithTenant('/orders/manual', { method: 'POST', body: JSON.stringify(data) }, slug),
  // Fraud Prevention & Customer Intelligence System
  getBlacklist: (slug = 'fashion') => 
    fetchWithTenant('/orders/blacklist', {}, slug),
  blockCustomer: (data: { phone?: string; email?: string; ip?: string; reason?: string; customerName?: string }, slug = 'fashion') => 
    fetchWithTenant('/orders/blacklist/block', { method: 'POST', body: JSON.stringify(data) }, slug),
  unblockCustomer: (data: { phone?: string; email?: string; ip?: string }, slug = 'fashion') => 
    fetchWithTenant('/orders/blacklist/unblock', { method: 'POST', body: JSON.stringify(data) }, slug),
  getCustomerHistory: (phone: string, slug = 'fashion') => 
    fetchWithTenant(`/orders/customer-history/${encodeURIComponent(phone)}`, {}, slug),
  // Inventory Management System (Phase 1)
  getInventorySummary: (slug = 'fashion') => 
    fetchWithTenant('/inventory/summary', {}, slug),
  getStockLedger: (params?: { sku?: string; itemId?: string; movementType?: string }, slug = 'fashion') => {
    const query = new URLSearchParams();
    if (params?.sku) query.set('sku', params.sku);
    if (params?.itemId) query.set('itemId', params.itemId);
    if (params?.movementType) query.set('movementType', params.movementType);
    return fetchWithTenant(`/inventory/ledger?${query.toString()}`, {}, slug);
  },
  adjustStock: (data: any, slug = 'fashion') => 
    fetchWithTenant('/inventory/adjust', { method: 'POST', body: JSON.stringify(data) }, slug),
  getInventoryLocations: (slug = 'fashion') => 
    fetchWithTenant('/inventory/locations', {}, slug),
  createInventoryLocation: (data: any, slug = 'fashion') => 
    fetchWithTenant('/inventory/locations', { method: 'POST', body: JSON.stringify(data) }, slug),
  // Inventory Intelligence & Controls (Phase 3)
  getReorderSuggestions: (slug = 'fashion') => 
    fetchWithTenant('/inventory/reorder-suggestions', {}, slug),
  getInventoryAudits: (slug = 'fashion') => 
    fetchWithTenant('/inventory/audits', {}, slug),
  submitInventoryAudit: (data: any, slug = 'fashion') => 
    fetchWithTenant('/inventory/audits', { method: 'POST', body: JSON.stringify(data) }, slug),
  // Phase 4: Procurement, PO, GRN & ABC Analytics
  getSuppliers: (slug = 'fashion') => 
    fetchWithTenant('/inventory/suppliers', {}, slug),
  createSupplier: (data: any, slug = 'fashion') => 
    fetchWithTenant('/inventory/suppliers', { method: 'POST', body: JSON.stringify(data) }, slug),
  getPurchaseOrders: (slug = 'fashion') => 
    fetchWithTenant('/inventory/purchase-orders', {}, slug),
  createPurchaseOrder: (data: any, slug = 'fashion') => 
    fetchWithTenant('/inventory/purchase-orders', { method: 'POST', body: JSON.stringify(data) }, slug),
  updatePOStatus: (id: string, data: any, slug = 'fashion') => 
    fetchWithTenant(`/inventory/purchase-orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }, slug),
  receiveGoodsNote: (id: string, data: any, slug = 'fashion') => 
    fetchWithTenant(`/inventory/purchase-orders/${id}/receive`, { method: 'POST', body: JSON.stringify(data) }, slug),
  getGoodsReceiveNotes: (slug = 'fashion') => 
    fetchWithTenant('/inventory/goods-receive-notes', {}, slug),
  getABCAnalytics: (slug = 'fashion') => 
    fetchWithTenant('/inventory/analytics/abc', {}, slug),
  // Phase 5: Multi-Warehouse Transfers & Enterprise KPIs
  getStockTransfers: (slug = 'fashion') => 
    fetchWithTenant('/inventory/transfers', {}, slug),
  createStockTransfer: (data: any, slug = 'fashion') => 
    fetchWithTenant('/inventory/transfers', { method: 'POST', body: JSON.stringify(data) }, slug),
  receiveStockTransfer: (id: string, data: any, slug = 'fashion') => 
    fetchWithTenant(`/inventory/transfers/${id}/receive`, { method: 'POST', body: JSON.stringify(data) }, slug),
  getEnterpriseKPIs: (slug = 'fashion') => 
    fetchWithTenant('/inventory/analytics/kpis', {}, slug),
  verifyLedgerIntegrity: (slug = 'fashion') => 
    fetchWithTenant('/inventory/ledger/verify-integrity', {}, slug),
};



