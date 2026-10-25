import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { tenantMiddleware } from './middlewares/tenant.middleware.js';

// Route imports
import tenantRoutes from './modules/tenants/tenant.routes.js';
import catalogRoutes from './modules/catalog/catalog.routes.js';
import bookingRoutes from './modules/bookings/booking.routes.js';
import orderRoutes from './modules/orders/order.routes.js';
import complianceRoutes from './modules/compliance/compliance.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import superAdminRoutes from './modules/super-admin/super-admin.routes.js';
import inventoryRoutes from './modules/inventory/inventory.routes.js';
import authRoutes from './modules/auth/auth.routes.js';

import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy (Nginx, Cloudflare, Traefik)
app.set('trust proxy', 1);

// Rate Limiting Policies
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' },
});

const orderRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // Limit each IP to 60 checkout requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Order submission rate limit reached, please try again later' },
});

// Security and utility middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use('/api', globalApiLimiter);

// Tenant Identification Middleware (Applied to all /api routes)
app.use('/api', tenantMiddleware);

// API Route Registration with Targeted Security Limits
app.use('/api/tenant', tenantRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRateLimiter, orderRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/auth', authRateLimiter, authRoutes);

// Welcome & API Status endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>SaaS Engine API (Port 5000)</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center; }
        .card { max-width: 600px; margin: 40px auto; background: #1e293b; padding: 32px; border-radius: 24px; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        .badge { background: #059669; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; }
        h1 { margin-top: 16px; font-size: 24px; }
        p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
        .btn { display: inline-block; background: #e11d48; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px; font-size: 15px; }
        .btn:hover { background: #be123c; }
        .endpoints { text-align: left; background: #0f172a; padding: 16px; border-radius: 12px; margin-top: 20px; font-family: monospace; font-size: 12px; color: #38bdf8; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">API ENGINE ACTIVE</span>
        <h1>🚀 Multi-Tenant SaaS Backend Engine (Port 5000)</h1>
        <p>This is the high-performance <strong>Node.js Express + TypeScript REST API</strong> service.</p>
        <p>To view the visual storefront or platform portal, click below:</p>
        <a href="http://localhost:3000" class="btn" target="_blank">🌐 Launch Next.js Storefront (Port 3000)</a>
        
        <div class="endpoints">
          <strong>Available API Endpoints:</strong><br>
          • GET /health (Server Health & Uptime)<br>
          • GET /api/tenant/current (Active Tenant Theme & Metadata)<br>
          • GET /api/tenant/categories (Tenant Category Taxonomy)<br>
          • POST /api/tenant/register (Multi-Industry Tenant Provisioning)<br>
          • GET /api/catalog/items (Catalog Products & Service Listings)<br>
          • GET /api/bookings/available-slots (1-Hour Slot Capacity)<br>
          • POST /api/orders/place (Order & Appointment Token Generation)
        </div>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Multi-Tenant SaaS E-commerce API Engine',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 [Server] Multi-Tenant SaaS Engine running on http://localhost:${PORT}`);
});

export default app;
