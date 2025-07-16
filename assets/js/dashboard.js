// Initial state
let users = [];
let dashboardData = { filesCount: 0, storageUsed: 0, totalStorage: 5, usersCount: 0 };

// Theme logic
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  body.setAttribute('data-theme', 'dark');
  themeToggle.textContent = '☀️';
}
themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', next);
});

// Sidebar toggle
document.getElementById('toggleBtn').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
  toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '☰' : '✕';
});

// Navigation toggle active
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// Dashboard simulation
async function fetchDashboardData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        filesCount: Math.floor(Math.random() * 100),
        storageUsed: (Math.random() * 4).toFixed(1),
        totalStorage: 5,
        usersCount: users.length
      });
    }, 1000);
  });
}

async function fetchRecentUploads() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { name: 'document1.pdf', date: '2024-01-15', size: '2.3MB' },
        { name: 'image.jpg', date: '2024-01-14', size: '1.8MB' }
      ]);
    }, 1500);
  });
}

async function saveUser(userData) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ success: true, id: Date.now() }), 500);
  });
}

async function deleteUser(userId) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ success: true }), 500);
  });
}

async function loadDashboardData() {
  const data = await fetchDashboardData();
  dashboardData = data;
  document.getElementById('filesCount').textContent = data.filesCount;
  document.getElementById('storageUsed').textContent = data.storageUsed;
  document.getElementById('totalStorage').textContent = data.totalStorage;
  document.getElementById('usersCount').textContent = data.usersCount;
}

async function loadRecentUploads() {
  const uploads = await fetchRecentUploads();
  const container = document.getElementById('recentUploads');
  container.innerHTML = uploads.map(u => `
    <div class="user-item">
      <div class="user-info">
        <div class="user-name">${u.name}</div>
        <div class="user-role">${u.date} • ${u.size}</div>
      </div>
    </div>`).join('');
}

function renderUsers() {
  const list = document.getElementById('userList');
  if (users.length === 0) {
    list.innerHTML = '<div class="empty-state">No users added yet</div>';
    return;
  }
  list.innerHTML = users.map(user => `
    <div class="user-item">
      <div class="user-info">
        <div class="user-name">${user.email}</div>
        <div class="user-role">${user.role}</div>
      </div>
      <div class="user-actions">
        <button class="btn btn-danger" onclick="removeUser(${user.id})">Remove</button>
      </div>
    </div>`).join('');
}

document.getElementById('addUserBtn').addEventListener('click', async () => {
  const email = document.getElementById('userEmail').value;
  const access = document.getElementById('accessLevel').value;
  if (!email) return alert('Please enter a user email');
  if (users.some(u => u.email === email)) return alert('User already exists');

  const userData = { email, role: access };
  const result = await saveUser(userData);
  if (result.success) {
    users.push({ id: result.id, ...userData });
    document.getElementById('userEmail').value = '';
    document.getElementById('accessLevel').value = 'view';
    renderUsers();
    document.getElementById('usersCount').textContent = users.length;
    alert('User added');
  }
});

async function removeUser(userId) {
  if (!confirm('Are you sure?')) return;
  const result = await deleteUser(userId);
  if (result.success) {
    users = users.filter(user => user.id !== userId);
    renderUsers();
    document.getElementById('usersCount').textContent = users.length;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
  loadRecentUploads();
  renderUsers();
});

setInterval(() => {
  loadDashboardData();
  loadRecentUploads();
}, 30000);
