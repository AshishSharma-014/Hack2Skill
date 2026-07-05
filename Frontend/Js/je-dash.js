document.addEventListener('DOMContentLoaded', async () => {
  const API_BASE = window.JANAWAAZ_API_BASE || 'http://localhost:5000/api';
  const taskList = document.getElementById('taskList');

  let tasks = await loadTasks();
  renderTasks();
  window.addEventListener('janawaaz:languagechange', () => renderTasks());

  async function loadTasks() {
    try {
      const response = await fetch(`${API_BASE}/complaints`);
      if (!response.ok) throw new Error('Unable to load JE tasks');
      const complaints = await response.json();
      return complaints.filter(task => ['VERIFICATION_PENDING', 'VERIFIED', 'IN_PROGRESS'].includes(task.status));
    } catch (error) {
      return [
        {
          id: 'JA-DEMO-002',
          issueType: 'Water',
          locationText: 'Ward 7, Nehru Nagar',
          aiScore: 78,
          status: 'VERIFICATION_PENDING',
          budget: '',
          remarks: ''
        },
        {
          id: 'JA-DEMO-003',
          issueType: 'Street Lighting',
          locationText: 'Ward 3, Gandhi Chowk',
          aiScore: 45,
          status: 'VERIFIED',
          budget: '65000',
          remarks: 'Four poles required; wiring access available.'
        }
      ];
    }
  }

  function renderTasks() {
    if (!tasks.length) {
      taskList.innerHTML = `
        <div class="empty-state">
          <span>No active JE tasks</span>
          <p>Forward requests from the MP dashboard and they will appear here.</p>
        </div>
      `;
      window.JanAwaazI18n?.apply();
      return;
    }

    taskList.innerHTML = tasks.map(task => `
      <div class="task-card" id="task-${task.id}">
        <div class="card-header" data-task="${task.id}">
          <div class="header-left">
            <div class="issue-icon-badge">${getIcon(task.issueType)}</div>
            <div class="header-text">
              <h3>${task.issueType}</h3>
              <span class="location-text">Pin ${task.locationText || 'Location pending'}</span>
            </div>
          </div>
          <div class="header-right">
            <span class="priority-score ${getScoreClass(task.aiScore)}">AI: ${task.aiScore}</span>
            <span class="chevron">▼</span>
          </div>
        </div>

        <div class="action-area">
          <div class="action-inner">
            <div class="ticket-meta">
              <span>${task.id}</span>
              <strong>${formatStatus(task.status)}</strong>
            </div>

            <div class="upload-group">
              <label>Upload Field Photo (Before/After)</label>
              <label class="upload-box">
                <span>Photo</span>
                <span class="upload-text-${cssSafe(task.id)}">${task.beforePhotoName || task.afterPhotoName || 'Tap to upload photo'}</span>
                <input type="file" accept="image/*" data-task="${task.id}">
              </label>
            </div>

            <div>
              <label class="field-label">Estimated Budget (Rs)</label>
              <div class="budget-wrapper">
                <span class="budget-prefix">Rs</span>
                <input type="number" class="budget-input" data-field="budget" value="${task.budget || ''}" placeholder="Enter estimated amount" min="0">
              </div>
            </div>

            <div>
              <label class="field-label">Field Remarks</label>
              <textarea class="remarks-input" data-field="remarks" placeholder="Enter observations from the field visit...">${task.remarks || ''}</textarea>
            </div>

            <div class="btn-row">
              <button class="action-btn verify-btn" data-task="${task.id}">Submit Verification</button>
              <button class="action-btn complete-btn" data-task="${task.id}">Mark Completed</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    attachEventListeners();
    window.JanAwaazI18n?.apply();
  }

  function attachEventListeners() {
    document.querySelectorAll('.card-header').forEach(header => {
      header.addEventListener('click', () => {
        document.getElementById(`task-${header.dataset.task}`).classList.toggle('expanded');
      });
    });

    document.querySelectorAll('input[type="file"]').forEach(input => {
      input.addEventListener('click', event => event.stopPropagation());
      input.addEventListener('change', () => {
        const textEl = document.querySelector(`.upload-text-${cssSafe(input.dataset.task)}`);
        textEl.textContent = input.files.length ? input.files[0].name : (window.JanAwaazI18n?.t('Tap to upload photo') || 'Tap to upload photo');
      });
    });

    document.querySelectorAll('.action-inner').forEach(area => {
      area.addEventListener('click', event => event.stopPropagation());
    });

    document.querySelectorAll('.verify-btn').forEach(button => {
      button.addEventListener('click', () => updateTask(button, 'verify'));
    });

    document.querySelectorAll('.complete-btn').forEach(button => {
      button.addEventListener('click', () => updateTask(button, 'complete'));
    });
  }

  async function updateTask(button, action) {
    const id = button.dataset.task;
    const card = document.getElementById(`task-${id}`);
    const budget = card.querySelector('[data-field="budget"]').value;
    const remarks = card.querySelector('[data-field="remarks"]').value;
    const fileInput = card.querySelector('input[type="file"]');
    const uploadedName = fileInput.files[0]?.name || '';
    const originalText = button.textContent;

    button.textContent = action === 'verify'
      ? (window.JanAwaazI18n?.t('Submitting...') || 'Submitting...')
      : (window.JanAwaazI18n?.t('Completing...') || 'Completing...');
    button.disabled = true;

    try {
      const response = await fetch(`${API_BASE}/complaints/${id}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          remarks,
          beforePhotoName: action === 'verify' ? uploadedName : '',
          afterPhotoName: action === 'complete' ? uploadedName : ''
        })
      });
      if (!response.ok) throw new Error('Update failed');
      const updated = await response.json();
      tasks = action === 'complete'
        ? tasks.filter(task => task.id !== id)
        : tasks.map(task => task.id === id ? updated : task);
    } catch (error) {
      tasks = action === 'complete'
        ? tasks.filter(task => task.id !== id)
        : tasks.map(task => task.id === id ? { ...task, status: 'VERIFIED', budget, remarks, beforePhotoName: uploadedName } : task);
    }

    button.textContent = action === 'verify'
      ? (window.JanAwaazI18n?.t('Submitted') || 'Submitted')
      : (window.JanAwaazI18n?.t('Completed') || 'Completed');
    button.classList.add('success');
    setTimeout(renderTasks, 700);
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 900);
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

  function formatStatus(status) {
    return String(status || '').replace(/_/g, ' ');
  }

  function cssSafe(value) {
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '-');
  }
});
