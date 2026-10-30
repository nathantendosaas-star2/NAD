import express from 'express';
import { createServer as createViteServer } from 'vite';
import { timingSafeEqual } from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS } from './src/data/products.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory persistent stores
interface SavedCartItem {
  id: string;
  product: any;
  size: string;
  color: any;
  quantity: number;
}

interface CartRecord {
  deviceId: string;
  ip: string;
  items: SavedCartItem[];
  updatedAt: string;
}

interface VisitorLog {
  ip: string;
  deviceId: string;
  path: string;
  timestamp: string;
  userAgent: string;
}

const savedCartsMap = new Map<string, CartRecord>();
const visitorLogs: VisitorLog[] = [];
const pageBreakdown: Record<string, number> = {
  home: 0,
  shop: 0,
  collection: 0,
  product: 0,
  cart: 0,
  checkout: 0,
  admin: 0,
  about: 0,
  contact: 0,
};

// In-memory Inventory Store initialized from PRODUCTS
let inventoryStore = [...PRODUCTS];

async function createServer() {
  const app = express();
  const port = Number(process.env.PORT || 3000);
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));
  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  // Fail closed: administrative APIs and the admin screen are unavailable
  // until Render has both credentials configured.
  const adminAuth: express.RequestHandler = (req, res, next) => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    if (!username || !password) {
      return res.status(503).json({ error: 'Admin access is not configured.' });
    }
    const header = req.headers.authorization || '';
    const [scheme, encoded] = header.split(' ');
    if (scheme !== 'Basic' || !encoded) {
      res.setHeader('WWW-Authenticate', 'Basic realm="NAD Admin", charset="UTF-8"');
      return res.status(401).send('Authentication required');
    }
    let supplied = '';
    try { supplied = Buffer.from(encoded, 'base64').toString('utf8'); } catch { /* invalid header */ }
    const separator = supplied.indexOf(':');
    const suppliedUser = separator >= 0 ? supplied.slice(0, separator) : '';
    const suppliedPass = separator >= 0 ? supplied.slice(separator + 1) : '';
    const safeEqual = (a: string, b: string) => {
      const left = Buffer.from(a);
      const right = Buffer.from(b);
      return left.length === right.length && timingSafeEqual(left, right);
    };
    if (!safeEqual(suppliedUser, username) || !safeEqual(suppliedPass, password)) {
      res.setHeader('WWW-Authenticate', 'Basic realm="NAD Admin", charset="UTF-8"');
      return res.status(401).send('Invalid credentials');
    }
    next();
  };

  app.use('/admin', adminAuth);
  app.use('/api/admin', adminAuth);

  // Telemetry Middleware
  app.use((req, res, next) => {
    const rawPath = req.originalUrl.split('?')[0];
    // Skip static assets
    if (
      !rawPath.startsWith('/src') &&
      !rawPath.startsWith('/node_modules') &&
      !rawPath.startsWith('/@') &&
      !rawPath.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|map)$/)
    ) {
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
      const deviceId = (req.headers['x-device-id'] as string) || 'anonymous';
      const userAgent = (req.headers['user-agent'] as string) || 'unknown';

      // Categorize path
      let category = 'home';
      if (rawPath.startsWith('/api')) {
        category = 'api';
      } else if (rawPath.includes('shop')) {
        category = 'shop';
      } else if (rawPath.includes('collection') || rawPath.includes('lookbook')) {
        category = 'collection';
      } else if (rawPath.includes('product')) {
        category = 'product';
      } else if (rawPath.includes('cart')) {
        category = 'cart';
      } else if (rawPath.includes('checkout')) {
        category = 'checkout';
      } else if (rawPath.includes('admin')) {
        category = 'admin';
      } else if (rawPath.includes('about')) {
        category = 'about';
      } else if (rawPath.includes('contact')) {
        category = 'contact';
      }

      if (category !== 'api') {
        pageBreakdown[category] = (pageBreakdown[category] || 0) + 1;
        visitorLogs.unshift({
          ip: clientIp.split(',')[0].trim(),
          deviceId,
          path: rawPath,
          timestamp: new Date().toISOString(),
          userAgent,
        });
        // Limit log array to 500 entries
        if (visitorLogs.length > 500) {
          visitorLogs.pop();
        }
      }
    }
    next();
  });

  // Development uses Vite middleware; Render serves the compiled Vite bundle.
  const vite = isProduction ? null : await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  if (vite) {
    app.use(vite.middlewares);
  }

  // API: Location & Currency Detection
  app.get('/api/location', async (req, res) => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Failed to fetch from ipapi.co');
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Server-side location fetch error:', error);
      res.json({
        currency: 'KES',
        country_code: 'KE',
        city: 'Nairobi',
      });
    }
  });

  // API: Backend Persistent Cart for Devices / IP
  app.get('/api/cart', (req, res) => {
    const deviceId = (req.headers['x-device-id'] as string) || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'anonymous';
    const record = savedCartsMap.get(deviceId);
    res.json({
      deviceId,
      items: record ? record.items : [],
    });
  });

  app.post('/api/cart', (req, res) => {
    const deviceId = (req.headers['x-device-id'] as string) || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'anonymous';
    const clientIp = ((req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const { items } = req.body;

    savedCartsMap.set(deviceId, {
      deviceId,
      ip: clientIp,
      items: Array.isArray(items) ? items : [],
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, deviceId, itemsCount: Array.isArray(items) ? items.length : 0 });
  });

  app.delete('/api/cart', (req, res) => {
    const deviceId = (req.headers['x-device-id'] as string) || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'anonymous';
    savedCartsMap.delete(deviceId);
    res.json({ success: true });
  });

  // API: Inventory Management
  app.get('/api/admin/inventory', (req, res) => {
    res.json(inventoryStore);
  });

  app.put('/api/admin/inventory/:id', (req, res) => {
    const productId = req.params.id;
    const updates = req.body;

    const idx = inventoryStore.findIndex((p) => p.id === productId);
    if (idx > -1) {
      inventoryStore[idx] = {
        ...inventoryStore[idx],
        ...updates,
      };
      res.json({ success: true, product: inventoryStore[idx] });
    } else {
      res.status(404).json({ error: 'Garment not found in inventory' });
    }
  });

  app.post('/api/admin/inventory', (req, res) => {
    const newProduct = req.body;
    if (!newProduct.id || !newProduct.name) {
      return res.status(400).json({ error: 'Product name is required' });
    }
    inventoryStore.unshift(newProduct);
    res.json({ success: true, product: newProduct });
  });

  app.delete('/api/admin/inventory/:id', (req, res) => {
    const productId = req.params.id;
    inventoryStore = inventoryStore.filter((p) => p.id !== productId);
    res.json({ success: true });
  });

  // API: Admin Metrics & Telemetry
  app.get('/api/admin/metrics', (req, res) => {
    const uniqueDeviceSet = new Set<string>();
    visitorLogs.forEach((v) => {
      if (v.deviceId && v.deviceId !== 'anonymous') {
        uniqueDeviceSet.add(v.deviceId);
      } else {
        uniqueDeviceSet.add(v.ip);
      }
    });

    // Active carts summary
    const activeCarts: Array<{
      deviceId: string;
      ip: string;
      itemsCount: number;
      totalValue: number;
      items: Array<{
        id: string;
        productName: string;
        size: string;
        color: string;
        price: number;
        quantity: number;
      }>;
      updatedAt: string;
    }> = [];

    let totalCartsValue = 0;

    savedCartsMap.forEach((record, dId) => {
      if (record.items && record.items.length > 0) {
        const itemsSummary = record.items.map((it) => ({
          id: it.id,
          productName: it.product?.name || 'Garment',
          size: it.size,
          color: it.color?.name || 'Standard',
          price: it.product?.price || 0,
          quantity: it.quantity,
        }));

        const cartValue = itemsSummary.reduce((acc, it) => acc + it.price * it.quantity, 0);
        totalCartsValue += cartValue;

        activeCarts.push({
          deviceId: dId,
          ip: record.ip,
          itemsCount: itemsSummary.reduce((acc, it) => acc + it.quantity, 0),
          totalValue: cartValue,
          items: itemsSummary,
          updatedAt: record.updatedAt,
        });
      }
    });

    const lowStockCount = inventoryStore.filter((p) => p.stockCount > 0 && p.stockCount <= 5).length;
    const outOfStockCount = inventoryStore.filter((p) => p.stockCount === 0 || !p.inStock).length;

    res.json({
      totalVisitors: visitorLogs.length,
      uniqueDevices: uniqueDeviceSet.size,
      totalPageviews: Object.values(pageBreakdown).reduce((a, b) => a + b, 0),
      pageBreakdown,
      activeCartsCount: activeCarts.length,
      activeCartsTotalValue: totalCartsValue,
      inventoryCount: inventoryStore.length,
      lowStockCount,
      outOfStockCount,
      recentVisitors: visitorLogs.slice(0, 30),
      activeCarts,
    });
  });

  // Production static assets and SPA fallback.
  if (isProduction) {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath, { index: false, maxAge: '1d' }));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  } else {
    app.use('*', async (req, res, next) => {
      try {
        const template = await vite!.transformIndexHtml(req.originalUrl, `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Nairobi Apparel District</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/src/main.tsx"></script>
            </body>
          </html>
        `);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite!.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`NAD server listening on port ${port} (${isProduction ? 'production' : 'development'})`);
  });
}

createServer();
