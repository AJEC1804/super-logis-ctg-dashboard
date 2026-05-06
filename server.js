const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const auth = require('./auth');
const { sendBulkEmail } = require('./email');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware: verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  const decoded = auth.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = decoded;
  next();
}

// ===== AUTHENTICATION ROUTES =====

// Register - Step 1: Send verification code
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  const result = await auth.registerUser(email, password, name, role || 'user');
  res.json(result);
});

// Verify email code
app.post('/api/auth/verify-code', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code required' });
  }

  const result = await auth.verifyEmail(email, code);
  res.json(result);
});

// Complete registration - Step 2: After verification
app.post('/api/auth/complete-registration', async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  const result = await auth.completeRegistration(email, password, name, role || 'user');
  res.json(result);
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const result = await auth.loginUser(email, password);
  res.json(result);
});

// Get current user info
app.get('/api/auth/me', verifyToken, (req, res) => {
  res.json(req.user);
});

// ===== BULK EMAIL ROUTE =====

// Send bulk email (admin only)
app.post('/api/email/send-bulk', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { recipients, subject, htmlContent } = req.body;

  if (!recipients || !subject || !htmlContent) {
    return res.status(400).json({ error: 'Recipients, subject, and content required' });
  }

  const result = await sendBulkEmail(recipients, subject, htmlContent);
  if (result) {
    res.json({ success: true, message: 'Emails sent successfully' });
  } else {
    res.status(500).json({ error: 'Error sending emails' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const users = auth.getUsers();
  const sanitized = users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    verified: u.verified,
    createdAt: u.createdAt,
    status: u.status
  }));
  res.json(sanitized);
});

// ===== EXISTING LOGISTICS ROUTES =====

// API: metrics
app.get('/api/metrics', (req, res) => {
  res.json(db.getMetrics());
});

// API: shipments (optional search q)
app.get('/api/shipments', (req, res) => {
  const q = req.query.q || '';
  res.json(db.getShipments(q));
});

app.post('/api/shipments/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const updated = db.updateShipmentStatus(id, status);
  if (!updated) return res.status(404).json({ error: 'Shipment not found' });

  // Simulate email when status becomes 'En Tránsito'
  if (status === 'En Tránsito') {
    const shipment = db.getShipmentById(id);
    const client = db.getClientById(shipment.client_id);
    // Simulated send
    console.log(`Simulated email to ${client.email}: Su envío ${shipment.tracking_number} está En Tránsito.`);
  }

  res.json(updated);
});

app.get('/api/drivers', (req, res) => {
  res.json(db.getDrivers());
});

app.get('/api/clients', (req, res) => {
  res.json(db.getClients());
});

app.get('/api/shipments/:id', (req, res) => {
  const id = Number(req.params.id);
  const s = db.getShipmentById(id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SUPER LOGIS CTG server listening on http://localhost:${PORT}`);
});
