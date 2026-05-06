async function fetchJSON(url, opts) {
  const r = await fetch(url, opts);
  return r.json();
}

function createMetricCard(title, value) {
  return `<div class="col-6 col-md-3 mb-2"><div class="p-3 metric-card"><div class="text-muted small">${title}</div><div class="h4">${value}</div></div></div>`;
}

async function loadMetrics() {
  const m = await fetchJSON('/api/metrics');
  const row = document.getElementById('metricsRow');
  row.innerHTML = '';
  row.innerHTML += createMetricCard('Envíos activos', m.active);
  row.innerHTML += createMetricCard('Entregas hoy', m.deliveredToday);
  row.innerHTML += createMetricCard('Vehículos', m.driversAvailable);
  row.innerHTML += createMetricCard('Alertas retrasos', m.alerts);
}

let chart;
function renderChart() {
  const ctx = document.getElementById('weeklyChart').getContext('2d');
  const labels = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const data = {
    labels,
    datasets: [{ label: 'Flujo semanal (envíos)', backgroundColor: '#0b2b45', borderColor: '#0b2b45', data: [12,19,8,15,10,6,4] }]
  };
  chart = new Chart(ctx, { type: 'line', data, options: { responsive:true } });
}

async function loadShipments(q='') {
  const url = '/api/shipments' + (q ? '?q=' + encodeURIComponent(q) : '');
  const list = await fetchJSON(url);
  const tbody = document.querySelector('#shipmentsTable tbody');
  tbody.innerHTML = '';
  list.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.tracking_number}</td>
      <td>${s.client_name || ''}</td>
      <td>${s.driver_name || ''}</td>
      <td>${s.status}</td>
      <td>
        <select data-id="${s.id}" class="form-select form-select-sm status-select" style="width:150px;display:inline-block">
          <option ${s.status==='En Puerto'?'selected':''}>En Puerto</option>
          <option ${s.status==='En Tránsito'?'selected':''}>En Tránsito</option>
          <option ${s.status==='Entregado'?'selected':''}>Entregado</option>
        </select>
        <button class="btn btn-sm btn-success ms-2 whatsapp-btn" data-id="${s.id}" data-client="${s.client_name || ''}" data-track="${s.tracking_number}">WhatsApp</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.status-select').forEach(el => {
    el.addEventListener('change', async (e) => {
      const id = e.target.dataset.id;
      const status = e.target.value;
      const updated = await fetchJSON('/api/shipments/' + id + '/status', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
      alert('Estado actualizado: ' + updated.status + '\n(Se simuló envío de correo si corresponde)');
      loadMetrics();
      loadShipments(document.getElementById('searchInput').value);
    });
  });

  document.querySelectorAll('.whatsapp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const client = btn.dataset.client;
      const track = btn.dataset.track;
      const text = `Hola ${client}, su envío ${track} puede seguirse aquí: http://localhost:3000/`;
      const url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text);
      window.open(url, '_blank');
    });
  });
}

async function loadFleet() {
  const list = await fetchJSON('/api/drivers');
  const root = document.getElementById('fleetList');
  root.innerHTML = '';
  list.forEach(d => {
    const div = document.createElement('div');
    div.className = 'col-md-4 mb-2';
    div.innerHTML = `
      <div class="p-2 driver-card">
        <div class="fw-bold">${d.name}</div>
        <div class="text-muted small">Placa: ${d.plate}</div>
        <div class="text-muted small">Ubicación simulada: ${d.lat.toFixed(3)}, ${d.lng.toFixed(3)}</div>
      </div>
    `;
    root.appendChild(div);
  });
}

document.getElementById('searchBtn').addEventListener('click', ()=>{
  const q = document.getElementById('searchInput').value;
  loadShipments(q);
});

window.addEventListener('load', () => {
  loadMetrics();
  renderChart();
  loadShipments();
  loadFleet();
});
