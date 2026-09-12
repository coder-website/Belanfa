import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Persistent Data Storage for Orders and Reservations
interface StoredOrder {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number; notes?: string }[];
  total: number;
  diningType: 'livraison';
  deliveryDistrict?: string;
  deliveryDistanceKm?: number;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  status: 'en_attente' | 'en_preparation' | 'en_livraison' | 'livree' | 'annulee';
  createdAt: number;
}

interface StoredReservation {
  id: string;
  code: string;
  date: string;
  time: string;
  guests: number;
  seatingZone: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  specialRequests?: string;
  status: 'en_attente' | 'confirmee' | 'terminee' | 'annulee';
  createdAt: string;
}

// File persistence paths
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');

// Helper to filter out any old legacy mock IDs to ensure 0 fake information
const isMockOrderId = (id: string) => ['CMD-4091', 'CMD-4092', 'CMD-4093'].includes(id);
const isMockResId = (id: string, code?: string) => 
  ['res-101', 'res-102', 'res-103'].includes(id) || ['BLF-8821', 'BLF-7734', 'BLF-5590'].includes(code || '');

function loadOrders(): StoredOrder[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.filter((o) => !isMockOrderId(o.id));
      }
    }
  } catch (err) {
    console.error('Error reading orders file:', err);
  }
  return [];
}

function saveOrders(ordersList: StoredOrder[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(ordersList, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing orders file:', err);
  }
}

function loadReservations(): StoredReservation[] {
  try {
    if (fs.existsSync(RESERVATIONS_FILE)) {
      const content = fs.readFileSync(RESERVATIONS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.filter((r) => !isMockResId(r.id, r.code));
      }
    }
  } catch (err) {
    console.error('Error reading reservations file:', err);
  }
  return [];
}

function saveReservations(resList: StoredReservation[]) {
  try {
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(resList, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing reservations file:', err);
  }
}

// In-memory single source of truth across all devices
let orders: StoredOrder[] = loadOrders();
let reservations: StoredReservation[] = loadReservations();

// Immediately save cleaned data (0 fake info)
saveOrders(orders);
saveReservations(reservations);

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Admin Credentials
const ADMIN_EMAIL = 'admin@belanfa.ma';
const ADMIN_PASSWORD = 'BelanfaCasa2026!';

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', server: 'Restaurant Belanfa Backend' });
});

// 1. Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' });
  }

  if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: 'belanfa-jwt-token-authenticated-' + Date.now(),
      user: {
        email: ADMIN_EMAIL,
        name: 'Gérant Restaurant Belanfa',
        role: 'admin',
        restaurant: 'Restaurant Belanfa Casablanca',
        address: '26 Rue Driss Lahrizi'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Identifiants invalides. Vérifiez l’adresse e-mail ou le mot de passe.'
  });
});

// 2. Orders / Deliveries API
app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ success: true, orders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const newOrder: StoredOrder = {
    ...req.body,
    id: req.body.id || 'CMD-' + Math.floor(1000 + Math.random() * 9000),
    diningType: 'livraison',
    status: req.body.status || 'en_attente',
    createdAt: Date.now()
  };

  orders.unshift(newOrder);
  saveOrders(orders);
  console.log(`[Belanfa Server] Nouvelle commande reçue : ${newOrder.id} (${newOrder.customerName}, ${newOrder.total} MAD)`);
  res.status(201).json({ success: true, order: newOrder });
});

const handleUpdateOrderStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Commande non trouvée' });
  }

  if (status) {
    orders[orderIndex].status = status;
    saveOrders(orders);
  }

  res.json({ success: true, order: orders[orderIndex] });
};

app.patch('/api/orders/:id', handleUpdateOrderStatus);
app.patch('/api/orders/:id/status', handleUpdateOrderStatus);

app.delete('/api/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  orders = orders.filter((o) => o.id !== id);
  saveOrders(orders);
  res.json({ success: true, message: 'Commande supprimée avec succès' });
});

app.delete('/api/orders', (req: Request, res: Response) => {
  orders = [];
  saveOrders(orders);
  res.json({ success: true, message: 'Toutes les commandes ont été effacées' });
});

// 3. Reservations API
app.get('/api/reservations', (req: Request, res: Response) => {
  res.json({ success: true, reservations });
});

app.post('/api/reservations', (req: Request, res: Response) => {
  const newReservation: StoredReservation = {
    ...req.body,
    id: req.body.id || 'res-' + Date.now(),
    code: req.body.code || 'BLF-' + Math.floor(1000 + Math.random() * 9000),
    status: req.body.status || 'confirmee',
    createdAt: new Date().toISOString()
  };

  reservations.unshift(newReservation);
  saveReservations(reservations);
  console.log(`[Belanfa Server] Nouvelle réservation reçue : ${newReservation.code} (${newReservation.customerName})`);
  res.status(201).json({ success: true, reservation: newReservation });
});

const handleUpdateReservationStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const resIndex = reservations.findIndex((r) => r.id === id || r.code === id);
  if (resIndex === -1) {
    return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
  }

  if (status) {
    reservations[resIndex].status = status;
    saveReservations(reservations);
  }

  res.json({ success: true, reservation: reservations[resIndex] });
};

app.patch('/api/reservations/:id', handleUpdateReservationStatus);
app.patch('/api/reservations/:id/status', handleUpdateReservationStatus);

app.delete('/api/reservations/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  reservations = reservations.filter((r) => r.id !== id && r.code !== id);
  saveReservations(reservations);
  res.json({ success: true, message: 'Réservation supprimée' });
});

app.delete('/api/reservations', (req: Request, res: Response) => {
  reservations = [];
  saveReservations(reservations);
  res.json({ success: true, message: 'Toutes les réservations ont été effacées' });
});

// Reset endpoint for admin testing
app.post('/api/admin/reset-all', (req: Request, res: Response) => {
  orders = [];
  reservations = [];
  saveOrders(orders);
  saveReservations(reservations);
  res.json({ success: true, message: 'Base de données réinitialisée à 0 fausses informations' });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Restaurant Belanfa server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
