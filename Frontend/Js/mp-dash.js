document.addEventListener('DOMContentLoaded', async () => {
  const API_BASE = window.JANAWAAZ_API_BASE || 'http://localhost:5000/api';
  const tbody = document.getElementById('complaintsTableBody');
  const kpiTotal = document.getElementById('kpiTotal');
  const kpiCritical = document.getElementById('kpiCritical');
  const kpiPending = document.getElementById('kpiPending');

  let complaints = await loadComplaints();
  renderDashboard();

  async function loadComplaints() {
    try {
      const response = await fetch(`${API_BASE}/complaints`);
      if (!response.ok) throw new Error('Unable to load complaints');
      return await response.json();
    } catch (error) {
      return [
        {
          id: 'JA-DEMO-001',
          issueType: 'Roads',
          locationText: 'Ward 12, MG Road',
          demand: 'Repair broken main road and potholes',
          aiScore: 92,
          priorityScore: 454,
          status: 'NEW'
        },
        {
          id: 'JA-DEMO-002',
          issueType: 'Water',
          locationText: 'Ward 7, Nehru Nagar',
          demand: 'Fix leaking water pipeline',
          aiScore: 78,
          priorityScore: 285,
          status: 'VERIFICATION_PENDING'
        },
        {
          id: 'JA-DEMO-003',
          issueType: 'Street Lighting',
          locationText: 'Ward 3, Gandhi Chowk',
          demand: 'Install lights near Gandhi Chowk',
          aiScore: 45,
          priorityScore: 85,
          status: 'VERIFIED'
        }
      ];
    }
  }

  function renderDashboard() {
    renderTable();
    renderKPIs();
    renderHeatmapDots();
  }

  function renderTable() {
    tbody.innerHTML = complaints.map(item => `
      <tr>
        <td>
          <span class="issue-type">
            <span class="issue-icon">${getIcon(item.issueType)}</span>
            ${item.issueType}
          </span>
        </td>
        <td class="location-cell">${item.locationText || 'Location pending'}</td>
        <td class="demand-cell">${item.demand}</td>
        <td><span class="ai-score ${getScoreClass(item.aiScore)}">${item.aiScore}</span></td>
        <td><span class="status-badge ${getStatusClass(item.status)}">${formatStatus(item.status)}</span></td>
        <td>
          <button class="forward-btn" data-id="${item.id}" ${item.status !== 'NEW' ? 'disabled' : ''}>
            ${item.status === 'NEW' ? 'Forward to JE' : 'Forwarded'}
          </button>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.forward-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id;
        button.textContent = 'Forwarding...';
        button.disabled = true;

        try {
          const response = await fetch(`${API_BASE}/complaints/${id}/forward`, { method: 'PATCH' });
          if (!response.ok) throw new Error('Forward failed');
          const updated = await response.json();
          complaints = complaints.map(item => item.id === id ? updated : item);
          renderDashboard();
        } catch (error) {
          button.textContent = 'Forwarded';
          const item = complaints.find(row => row.id === id);
          if (item) item.status = 'VERIFICATION_PENDING';
          renderDashboard();
        }
      });
    });
  }

  function renderKPIs() {
    animateCount(kpiTotal, complaints.length);
    animateCount(kpiCritical, complaints.filter(item => item.aiScore >= 80).length);
    animateCount(kpiPending, complaints.filter(item => ['NEW', 'VERIFICATION_PENDING'].includes(item.status)).length);
  }

  function renderHeatmapDots() {
    const map = document.getElementById('heatmap-map');
    if (!map) return;

    map.querySelectorAll('.map-pin').forEach(pin => pin.remove());
    complaints.slice(0, 7).forEach((item, index) => {
      const pin = document.createElement('span');
      pin.className = 'map-pin dynamic-pin';
      pin.style.left = `${18 + ((index * 17) % 64)}%`;
      pin.style.top = `${24 + ((index * 23) % 52)}%`;
      pin.style.animationDelay = `${index * 0.25}s`;
      pin.title = `${item.issueType}: ${item.aiScore}`;
      map.appendChild(pin);
    });
  }

  function animateCount(element, target) {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 18));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      element.textContent = current;
    }, 35);
  }

  function getIcon(issueType) {
    const icons = {
      Roads: 'Road',
      Water: 'Water',
      Health: 'Health',
      Education: 'School',
      'Street Lighting': 'Light',
      Sanitation: 'Clean'
    };
    return icons[issueType] || 'Civic';
  }

  function getScoreClass(score) {
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }

  function getStatusClass(status) {
    if (status === 'NEW') return 'status-new';
    if (status === 'VERIFICATION_PENDING') return 'status-review';
    if (status === 'VERIFIED' || status === 'IN_PROGRESS') return 'status-progress';
    return 'status-completed';
  }

  function formatStatus(status) {
    return String(status || 'NEW').replace(/_/g, ' ');
  }
});
