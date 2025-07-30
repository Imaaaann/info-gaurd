// Toggle sidebar
document.getElementById('toggleBtn').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('collapsed');
  });
  
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    this.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
  });
  
  // Initialize theme
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }
  
  // Sample user data
  const users = [
    { id: 1, name: "Kwame Johnson", email: "kwame@infoguard.com", role: "admin" },
    { id: 2, name: "Sarah Williams", email: "sarah@infoguard.com", role: "edit" },
    { id: 3, name: "Michael Chen", email: "michael@infoguard.com", role: "view" },
    { id: 4, name: "Aisha Mohammed", email: "aisha@infoguard.com", role: "admin" },
    { id: 5, name: "David Rodriguez", email: "david@infoguard.com", role: "edit" }
  ];
  
  // Sample activity data
  const activities = [
    { id: 1, action: "Kwame Johnson updated user permissions", info: "Sarah Williams - Changed from View Only to Edit Access", icon: "🔒", time: "10:24 AM" },
    { id: 2, action: "New user added", info: "David Rodriguez - Edit Access", icon: "👤", time: "Yesterday" },
    { id: 3, action: "Access audit completed", info: "System-wide security review", icon: "🔍", time: "2 days ago" },
    { id: 4, action: "Failed login attempt", info: "Blocked IP: 192.168.23.45", icon: "⚠️", time: "3 days ago" }
  ];
  
  // Render users
  function renderUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    
    users.forEach(user => {
      const userItem = document.createElement('div');
      userItem.className = 'user-item';
      userItem.innerHTML = `
        <div class="user-info">
          <div class="user-name"><i>👤</i> ${user.name}</div>
          <div class="user-email">${user.email}</div>
          <span class="user-role role-${user.role}">
            ${user.role === 'view' ? 'View Only' : 
              user.role === 'edit' ? 'Edit Access' : 'Admin'}
          </span>
        </div>
        <div class="user-actions">
          <button class="btn btn-primary edit-user" data-id="${user.id}"><i>✏️</i> Edit</button>
          <button class="btn btn-danger remove-user" data-id="${user.id}"><i>🗑️</i> Remove</button>
        </div>
      `;
      userList.appendChild(userItem);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.remove-user').forEach(button => {
      button.addEventListener('click', function() {
        const userId = parseInt(this.getAttribute('data-id'));
        removeUser(userId);
      });
    });
    
    document.querySelectorAll('.edit-user').forEach(button => {
      button.addEventListener('click', function() {
        const userId = parseInt(this.getAttribute('data-id'));
        editUser(userId);
      });
    });
  }
  
  // Render activity
  function renderActivity() {
    const activityList = document.getElementById('accessHistory');
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
      const activityItem = document.createElement('div');
      activityItem.className = 'history-item';
      activityItem.innerHTML = `
        <div class="history-icon">${activity.icon}</div>
        <div class="history-details">
          <div class="history-action">${activity.action}</div>
          <div class="history-info">${activity.info}</div>
        </div>
        <div class="history-time">${activity.time}</div>
      `;
      activityList.appendChild(activityItem);
    });
  }
  
  // Add user
  document.getElementById('addUserBtn').addEventListener('click', function() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const accessLevel = document.getElementById('accessLevel').value;
    
    if(name && email) {
      // Create new user object
      const newUser = {
        id: users.length + 1,
        name,
        email,
        role: accessLevel
      };
      
      // Add to users array
      users.unshift(newUser);
      
      // Re-render user list
      renderUsers();
      
      // Create activity
      const newActivity = {
        id: activities.length + 1,
        action: "New user added",
        info: `${name} - ${accessLevel === 'view' ? 'View Only' : 
          accessLevel === 'edit' ? 'Edit Access' : 'Admin'}`,
        icon: "👤",
        time: "Just now"
      };
      
      // Add to activities array
      activities.unshift(newActivity);
      
      // Re-render activity list
      renderActivity();
      
      // Clear form
      document.getElementById('userName').value = '';
      document.getElementById('userEmail').value = '';
      document.getElementById('accessLevel').value = 'view';
      
      // Reset checkboxes
      document.querySelectorAll('.permission-item input').forEach(checkbox => {
        checkbox.checked = false;
      });
      
      // Show success message
      showNotification(`User ${name} added successfully!`);
    } else {
      showNotification('Please fill in all required fields', 'error');
    }
  });
  
  // Remove user
  function removeUser(userId) {
    const user = users.find(u => u.id === userId);
    if(user) {
      if(confirm(`Are you sure you want to remove ${user.name}?`)) {
        // Remove user from array
        const index = users.findIndex(u => u.id === userId);
        if(index !== -1) {
          users.splice(index, 1);
          
          // Create activity
          const newActivity = {
            id: activities.length + 1,
            action: "User removed",
            info: `${user.name} (${user.email})`,
            icon: "❌",
            time: "Just now"
          };
          
          // Add to activities array
          activities.unshift(newActivity);
          
          // Re-render
          renderUsers();
          renderActivity();
          
          // Show success message
          showNotification(`User ${user.name} removed successfully!`);
        }
      }
    }
  }
  
  // Edit user
  function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if(user) {
      // For demo purposes, we'll just show an alert
      alert(`Editing user: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`);
      
      // In a real app, you would open a modal with the form pre-filled
    }
  }
  
  // Show notification
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Initialize the page
  function initPage() {
    initTheme();
    renderUsers();
    renderActivity();
  }
  
  // Initialize when page loads
  window.addEventListener('DOMContentLoaded', initPage);