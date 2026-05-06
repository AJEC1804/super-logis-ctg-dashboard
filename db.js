const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

function defaultData() {
  const now = new Date().toISOString();
  return {
    clients: [
      { id: 1, name: 'Empresa A', email: 'clienteA@example.com', phone: '+5600000001' },
      { id: 2, name: 'Empresa B', email: 'clienteB@example.com', phone: '+5600000002' }
    ],
    drivers: [
      { id: 1, name: 'Carlos Pérez', plate: 'ABC-123', lat: -33.45, lng: -70.66 },
      { id: 2, name: 'María Gómez', plate: 'XYZ-987', lat: -33.46, lng: -70.65 }
    ],
    shipments: [
      { id: 1, tracking_number: 'SLCTG-0001', client_id: 1, driver_id: 1, status: 'En Puerto', origin: 'Puerto de CTG', destination: 'Bodega Central', created_at: now },
      { id: 2, tracking_number: 'SLCTG-0002', client_id: 2, driver_id: 2, status: 'En Tránsito', origin: 'Bodega Central', destination: 'Cliente B', created_at: now },
      { id: 3, tracking_number: 'SLCTG-0003', client_id: 1, driver_id: 2, status: 'Entregado', origin: 'Puerto X', destination: 'Cliente A', created_at: now }
    ]
  };
}

function loadData() {
  if (!fs.existsSync(dataPath)) {
    const initial = defaultData();
    fs.writeFileSync(dataPath, JSON.stringify(initial, null, 2));
    return initial;
  }

  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function getMetrics() {
  const data = loadData();
  const active = data.shipments.filter((shipment) => shipment.status !== 'Entregado').length;
  const deliveredToday = data.shipments.filter((shipment) => shipment.status === 'Entregado').length;
  const driversAvailable = data.drivers.length;
  const alerts = data.shipments.some((shipment) => shipment.status === 'En Tránsito') ? 1 : 0;
  return { active, deliveredToday, driversAvailable, alerts };
}

function getShipments(q) {
  const data = loadData();
  const shipments = data.shipments.map((shipment) => {
    const client = data.clients.find((item) => item.id === shipment.client_id);
    const driver = data.drivers.find((item) => item.id === shipment.driver_id);
    return {
      ...shipment,
      client_name: client ? client.name : '',
      driver_name: driver ? driver.name : ''
    };
  });

  if (!q) {
    return shipments.sort((a, b) => b.id - a.id);
  }

  const query = q.toLowerCase();
  return shipments
    .filter((shipment) => shipment.tracking_number.toLowerCase().includes(query) || shipment.client_name.toLowerCase().includes(query))
    .sort((a, b) => b.id - a.id);
}

function getShipmentById(id) {
  const data = loadData();
  return data.shipments.find((shipment) => shipment.id === id) || null;
}

function updateShipmentStatus(id, status) {
  const data = loadData();
  const shipment = data.shipments.find((item) => item.id === id);
  if (!shipment) return null;

  shipment.status = status;
  saveData(data);

  const client = data.clients.find((item) => item.id === shipment.client_id);
  return {
    ...shipment,
    client_name: client ? client.name : ''
  };
}

function getDrivers() {
  return loadData().drivers;
}

function getClients() {
  return loadData().clients;
}

function getClientById(id) {
  return loadData().clients.find((client) => client.id === id) || null;
}

module.exports = { getMetrics, getShipments, updateShipmentStatus, getDrivers, getClients, getShipmentById, getClientById };
