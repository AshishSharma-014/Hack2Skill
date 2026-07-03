document.addEventListener('DOMContentLoaded', () => {

  const complaints = [
    {
      issueType: 'Road Damage',
      icon: '🛣️',
      location: 'Ward 12, MG Road',
      demand: 'Pothole Repair',
      aiScore: 92,
      status: 'New'
    },
    {
      issueType: 'Water Supply',
      icon: '💧',
      location: 'Ward 7, Nehru Nagar',
      demand: 'Pipeline Leakage Fix',
      aiScore: 78,
      status: 'Under Review'
    },
    {
      issueType: 'Street Lighting',
      icon: '💡',
      location: 'Ward 3, Gandhi Chowk',
      demand: 'Install New Poles',
      aiScore: 45,
      status: 'In Progress'
    }
  ];

  const tbody = document.getElementById('complaintsTableBody');
  const kpiTotal = document.getElementById('kpiTotal');
  const kpiCritical = document.getElementById('kpiCritical');
  const kpiPending = document.getElementById('kpiPending');

  function getScoreClass(score) {
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }

  function getStatusClass(status) {
    switch (status) {
      case 'New': return 'status-new';
      case 'Under Review': return 'status-review';
      case 'In Progress': return 'status-progress';
      default: return 'status-new';
    }
  }

  function renderTable() {
    tbody.innerHTML = complaints.map(item => `
      <tr>
        <td>
          <span class="issue-type">
            <span class="issue-icon">${item.icon}</span>
            ${item.issueType}
          </span>
        </td>
        <td class="location-cell">${item.location}</td>
        <td class="demand-cell">${item.demand}</td>
        <td><span class="ai-score ${getScoreClass(item.aiScore)}">${item.aiScore}</span></td>
        <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
        <td><button class="forward-btn" data-location="${item.location}">Forward to JE</button></td>
      </tr>
    `).join('');

    document.querySelectorAll('.forward-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const original = btn.textContent;
        btn.textContent = 'Forwarded ✓';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 1800);
      });
    });
  }

  function renderKPIs() {
    const total = complaints.length;
    const critical = complaints.filter(c => c.aiScore >= 80).length;
    const pending = complaints.filter(c => c.status === 'Under Review' || c.status === 'New').length;

    animateCount(kpiTotal, total);
    animateCount(kpiCritical, critical);
    animateCount(kpiPending, pending);
  }

  function animateCount(el, target) {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 20));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current;
    }, 40);
  }

  renderTable();
  renderKPIs();
});