const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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
