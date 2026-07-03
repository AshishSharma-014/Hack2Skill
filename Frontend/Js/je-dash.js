document.addEventListener('DOMContentLoaded', () => {

  const tasks = [
    {
      id: 1,
      issueType: 'Road Repair',
      icon: '🛣️',
      location: 'Ward 12, MG Road',
      priorityScore: 92
    },
    {
      id: 2,
      issueType: 'Water Leakage',
      icon: '💧',
      location: 'Ward 7, Nehru Nagar',
      priorityScore: 58
    }
  ];

  const taskList = document.getElementById('taskList');

  function getScoreClass(score) {
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }

  function renderTasks() {
    taskList.innerHTML = tasks.map(task => `
      <div class="task-card" id="task-${task.id}">
        <div class="card-header" data-task="${task.id}">
          <div class="header-left">
            <div class="issue-icon-badge">${task.icon}</div>
            <div class="header-text">
              <h3>${task.issueType}</h3>
              <span class="location-text">📍 ${task.location}</span>
            </div>
          </div>
          <div class="header-right">
            <span class="priority-score ${getScoreClass(task.priorityScore)}">
              AI: ${task.priorityScore}
            </span>
            <span class="chevron">▼</span>
          </div>
        </div>

        <div class="action-area">
          <div class="action-inner">

            <div class="upload-group">
              <label>Upload Field Photo (Before/After)</label>
              <label class="upload-box">
                <span>📷</span>
                <span class="upload-text-${task.id}">Tap to upload photo</span>
                <input type="file" accept="image/*" data-task="${task.id}">
              </label>
            </div>

            <div>
              <label class="field-label">Estimated Budget (₹)</label>
              <div class="budget-wrapper">
                <span class="budget-prefix">₹</span>
                <input type="number" class="budget-input" placeholder="Enter estimated amount" min="0">
              </div>
            </div>

            <div>
              <label class="field-label">Field Remarks</label>
              <textarea class="remarks-input" placeholder="Enter observations from the field visit..."></textarea>
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
  }

  function attachEventListeners() {
    // Toggle expand/collapse
    document.querySelectorAll('.card-header').forEach(header => {
      header.addEventListener('click', () => {
        const card = document.getElementById(`task-${header.dataset.task}`);
        card.classList.toggle('expanded');
      });
    });

    // File upload text update
    document.querySelectorAll('input[type="file"]').forEach(input => {
      input.addEventListener('click', (e) => e.stopPropagation());
      input.addEventListener('change', () => {
        const textEl = document.querySelector(`.upload-text-${input.dataset.task}`);
        if (input.files.length > 0) {
          textEl.textContent = input.files[0].name;
        } else {
          textEl.textContent = 'Tap to upload photo';
        }
      });
    });

    // Prevent card collapse when interacting with inputs
    document.querySelectorAll('.action-inner').forEach(area => {
      area.addEventListener('click', (e) => e.stopPropagation());
    });

    // Submit Verification button
    document.querySelectorAll('.verify-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const original = btn.textContent;
        btn.textContent = 'Submitted ✓';
        btn.classList.add('success');
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('success');
          btn.disabled = false;
        }, 1800);
      });
    });

    // Mark Completed button
    document.querySelectorAll('.complete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const original = btn.textContent;
        btn.textContent = 'Completed ✓';
        btn.classList.add('success');
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('success');
          btn.disabled = false;
        }, 1800);
      });
    });
  }

  renderTasks();
});