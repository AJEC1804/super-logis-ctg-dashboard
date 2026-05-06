const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'data.db'));

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT
    );
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      plate TEXT,
      lat REAL,
      lng REAL
    );
    CREATE TABLE IF NOT EXISTS shipments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_number TEXT,
      client_id INTEGER,
      driver_id INTEGER,
      status TEXT,
      origin TEXT,
      destination TEXT,
      created_at TEXT
    );
  `);

  // seed if empty
  const row = db.prepare('SELECT COUNT(*) as c FROM shipments').get();
  if (row.c === 0) seed();
}

function seed() {
  const insertClient = db.prepare('INSERT INTO clients (name,email,phone) VALUES (?,?,?)');
  const insertDriver = db.prepare('INSERT INTO drivers (name,plate,lat,lng) VALUES (?,?,?,?)');
  const insertShipment = db.prepare('INSERT INTO shipments (tracking_number,client_id,driver_id,status,origin,destination,created_at) VALUES (?,?,?,?,?,?,?)');

  const c1 = insertClient.run('Empresa A','clienteA@example.com','+5600000001').lastInsertRowid;
  const c2 = insertClient.run('Empresa B','clienteB@example.com','+5600000002').lastInsertRowid;

  const d1 = insertDriver.run('Carlos Pérez','ABC-123',-33.45,-70.66).lastInsertRowid;
  const d2 = insertDriver.run('María Gómez','XYZ-987',-33.46,-70.65).lastInsertRowid;

  const now = new Date().toISOString();
  insertShipment.run('SLCTG-0001', c1, d1, 'En Puerto', 'Puerto de CTG','Bodega Central', now);
  insertShipment.run('SLCTG-0002', c2, d2, 'En Tránsito', 'Bodega Central','Cliente B', now);
  insertShipment.run('SLCTG-0003', c1, d2, 'Entregado', 'Puerto X','Cliente A', now);
}

function getMetrics() {
  const active = db.prepare("SELECT COUNT(*) as c FROM shipments WHERE status != 'Entregado'").get().c;
  const deliveredToday = db.prepare("SELECT COUNT(*) as c FROM shipments WHERE status = 'Entregado' AND date(created_at) = date('now')").get().c;
  const driversAvailable = db.prepare("SELECT COUNT(*) as c FROM drivers").get().c;
  const alerts = db.prepare("SELECT COUNT(*) as c FROM shipments WHERE status = 'En Tránsito' AND julianday('now') - julianday(created_at) > 3").get().c;
  return { active, deliveredToday, driversAvailable, alerts };
}

function getShipments(q) {
  if (!q) return db.prepare('SELECT s.*, c.name as client_name, d.name as driver_name FROM shipments s LEFT JOIN clients c ON c.id=s.client_id LEFT JOIN drivers d ON d.id=s.driver_id ORDER BY s.id DESC').all();
  const like = `%${q}%`;
  return db.prepare("SELECT s.*, c.name as client_name, d.name as driver_name FROM shipments s LEFT JOIN clients c ON c.id=s.client_id LEFT JOIN drivers d ON d.id=s.driver_id WHERE s.tracking_number LIKE ? OR c.name LIKE ? ORDER BY s.id DESC").all(like, like);
}

function getShipmentById(id) {
  return db.prepare('SELECT * FROM shipments WHERE id = ?').get(id);
}

function updateShipmentStatus(id, status) {
  const s = getShipmentById(id);
  if (!s) return null;
  db.prepare('UPDATE shipments SET status = ? WHERE id = ?').run(status, id);
  return db.prepare('SELECT s.*, c.name as client_name FROM shipments s LEFT JOIN clients c ON c.id=s.client_id WHERE s.id = ?').get(id);
}

function getDrivers() {
  return db.prepare('SELECT * FROM drivers').all();
}

function getClients() {
  return db.prepare('SELECT * FROM clients').all();
}

function getClientById(id) {
  return db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
}

init();

module.exports = { getMetrics, getShipments, updateShipmentStatus, getDrivers, getClients, getShipmentById, getClientById };
