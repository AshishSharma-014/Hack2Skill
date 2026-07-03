document.addEventListener('DOMContentLoaded', async () => {
  const API_BASE = window.JANAWAAZ_API_BASE || 'http://localhost:5000/api';
  const grid = document.getElementById('worksGrid');

  try {
    const response = await fetch(`${API_BASE}/works`);
    if (!response.ok) throw new Error('Unable to load works');
    const works = await response.json();
    renderWorks(works);
  } catch (error) {
    renderWorks([]);
  }

  function renderWorks(works) {
    if (!works.length) {
      grid.innerHTML = `
        <article class="work-card">
          <div class="work-photo">Before / After</div>
          <h2>No completed works yet</h2>
          <p>Mark a JE task completed and it will publish here automatically.</p>
        </article>
      `;
      return;
    }

    grid.innerHTML = works.map(work => `
      <article class="work-card">
        <div class="work-photo">${work.issueType}</div>
        <h2>${work.demand}</h2>
        <p>${work.locationText || 'Constituency location'}</p>
        <div class="work-meta">
          <span>${work.id}</span>
          <strong>Completed</strong>
        </div>
      </article>
    `).join('');
  }
});
