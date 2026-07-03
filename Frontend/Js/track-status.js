document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = window.JANAWAAZ_API_BASE || 'http://localhost:5000/api';
  const form = document.getElementById('trackForm');
  const input = document.getElementById('ticketInput');
  const result = document.getElementById('ticketResult');

  input.value = localStorage.getItem('last-janawaaz-ticket') || '';

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const id = input.value.trim();
    if (!id) return;

    result.innerHTML = '<p>Loading ticket...</p>';

    try {
      const response = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error('Ticket not found');
      renderTicket(await response.json());
    } catch (error) {
      result.innerHTML = '<p class="muted">Ticket not found. Try a freshly submitted ID or JA-260703-001.</p>';
    }
  });

  function renderTicket(ticket) {
    const steps = ['NEW', 'VERIFICATION_PENDING', 'VERIFIED', 'IN_PROGRESS', 'COMPLETED'];
    const activeIndex = Math.max(0, steps.indexOf(ticket.status));

    result.innerHTML = `
      <div class="ticket-summary">
        <strong>${ticket.id}</strong>
        <span>${ticket.issueType}</span>
        <span>AI Score ${ticket.aiScore}</span>
      </div>
      <div class="timeline">
        ${steps.map((step, index) => `
          <div class="timeline-step ${index <= activeIndex ? 'active' : ''}">
            <span></span>
            <p>${step.replace(/_/g, ' ')}</p>
          </div>
        `).join('')}
      </div>
      <p class="muted">${ticket.demand}</p>
    `;
  }
});
