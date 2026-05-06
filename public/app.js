async function fetchJSON(url, opts) {
  const r = await fetch(url, opts);
  return r.json();
}

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return false;
  }
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Show admin link if user is admin
  if (user.role === 'admin') {
    const adminLink = document.getElementById('adminLink');
    if (adminLink) adminLink.style.display = 'block';
  }
  
  return true;
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

function createMetricCard(title, value) {
  return `<div class="col-12 col-sm-6 col-lg-3 mb-3"><div class="metric-card"><div class="text-muted">${title}</div><div class="h4">${value}</div></div></div>`;
}

async function loadMetrics() {
  const m = await fetchJSON('/api/metrics');
  const row = document.getElementById('metricsRow');
  row.innerHTML = '';
  row.innerHTML += createMetricCard('Envíos Activos', m.active);
  row.innerHTML += createMetricCard('Entregas Hoy', m.deliveredToday);
  row.innerHTML += createMetricCard('Vehículos', m.driversAvailable);
  row.innerHTML += createMetricCard('Alertas', m.alerts);
}

let chart;
function renderChart() {
  const ctx = document.getElementById('weeklyChart').getContext('2d');
  const labels = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const data = {
    labels,
    datasets: [{ 
      label: 'Flujo semanal (envíos)', 
      backgroundColor: 'rgba(0, 153, 204, 0.1)',
      borderColor: '#0099cc',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      data: [12,19,8,15,10,6,4],
      pointBackgroundColor: '#0099cc',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5
    }]
  };
  chart = new Chart(ctx, { 
    type: 'line', 
    data, 
    options: { 
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#0b2b45', font: { size: 13, weight: 'bold' } }
        }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
      }
    } 
  });
}

function getStatusBadge(status) {
  const statusMap = {
    'En Puerto': 'badge-en-puerto',
    'En Tránsito': 'badge-en-tránsito',
    'Entregado': 'badge-entregado'
  };
  const badgeClass = statusMap[status] || 'badge-en-puerto';
  return `<span class="badge-status ${badgeClass}"><i class="fas fa-circle"></i> ${status}</span>`;
}

async function loadShipments(q='') {
  const url = '/api/shipments' + (q ? '?q=' + encodeURIComponent(q) : '');
  const list = await fetchJSON(url);
  const tbody = document.querySelector('#shipmentsTable tbody');
  tbody.innerHTML = '';
  
  list.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${s.tracking_number}</strong></td>
      <td>${s.client_name || '-'}</td>
      <td>${s.driver_name || '-'}</td>
      <td>${getStatusBadge(s.status)}</td>
      <td>
        <div class="d-flex gap-2 flex-wrap">
          <select data-id="${s.id}" class="form-select form-select-sm status-select" style="width:120px;">
            <option ${s.status==='En Puerto'?'selected':''}>En Puerto</option>
            <option ${s.status==='En Tránsito'?'selected':''}>En Tránsito</option>
            <option ${s.status==='Entregado'?'selected':''}>Entregado</option>
          </select>
          <button class="btn btn-sm btn-success whatsapp-btn" data-id="${s.id}" data-client="${s.client_name || 'Cliente'}" data-track="${s.tracking_number}">
            <i class="fab fa-whatsapp"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.status-select').forEach(el => {
    el.addEventListener('change', async (e) => {
      const id = e.target.dataset.id;
      const status = e.target.value;
      const updated = await fetchJSON('/api/shipments/' + id + '/status', { 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify({ status }) 
      });
      alert('Estado actualizado: ' + updated.status + '\n(Se simuló envío de correo si corresponde)');
      loadMetrics();
      loadShipments(document.getElementById('searchInput').value);
    });
  });

  document.querySelectorAll('.whatsapp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const client = btn.dataset.client;
      const track = btn.dataset.track;
      const text = `Hola ${client}, su envío ${track} puede seguirse aquí: https://super-logis-ctg-dashboard.vercel.app/`;
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
    div.className = 'col-12 col-md-6 col-lg-4';
    div.innerHTML = `
      <div class="driver-card">
        <div class="d-flex align-items-center mb-3">
          <i class="fas fa-user-circle" style="font-size:32px;color:#0099cc;margin-right:10px;"></i>
          <div>
            <div class="fw-bold">${d.name}</div>
            <small class="text-muted">Conductor</small>
          </div>
        </div>
        <div class="text-muted small">
          <div><i class="fas fa-truck"></i> <strong>Placa:</strong> ${d.plate}</div>
          <div><i class="fas fa-map-marker-alt"></i> <strong>Ubicación:</strong> ${d.lat.toFixed(3)}, ${d.lng.toFixed(3)}</div>
        </div>
        <div class="mt-3" style="padding-top:10px;border-top:1px solid #e0e0e0;">
          <span class="badge" style="background-color:#d1e7dd;color:#0f5132;">En Ruta</span>
        </div>
      </div>
    `;
    root.appendChild(div);
  });
}

// Event listeners
document.getElementById('searchBtn').addEventListener('click', () => {
  const q = document.getElementById('searchInput').value;
  loadShipments(q);
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('searchBtn').click();
  }
});

document.getElementById('searchTrackingBtn').addEventListener('click', () => {
  const q = document.getElementById('searchTrackingInput').value;
  if (q.trim()) {
    document.getElementById('searchInput').value = q;
    document.getElementById('searchBtn').click();
    document.querySelector('#seguimiento').scrollIntoView({ behavior: 'smooth' });
  }
});

document.getElementById('searchTrackingInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('searchTrackingBtn').click();
});

window.addEventListener('load', () => {
  if (!checkAuth()) return;
  loadMetrics();
  renderChart();
  loadShipments();
  loadFleet();
});
