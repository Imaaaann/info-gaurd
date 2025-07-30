document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const themeToggle = document.getElementById('themeToggle');
    const avatar = document.getElementById('avatar');
    const avatarEditBtn = document.getElementById('avatarEditBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const viewActivityBtn = document.getElementById('viewActivityBtn');
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    const emailToggle = document.getElementById('emailToggle');
    const securityToggle = document.getElementById('securityToggle');
    const updatesToggle = document.getElementById('updatesToggle');
  
    // Sidebar Toggle Functionality
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      
      // Update button text based on sidebar state
      if (sidebar.classList.contains('collapsed')) {
        toggleBtn.textContent = '☰';
      } else {
        toggleBtn.textContent = '✕';
      }
    });
  
    // Theme Toggle Functionality
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.body.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.body.setAttribute('data-theme', newTheme);
      themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      
      // Save theme preference to localStorage
      localStorage.setItem('theme', newTheme);
    });
  
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.setAttribute('data-theme', savedTheme);
      themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
  
    // Avatar Upload Functionality
    avatarEditBtn.addEventListener('click', function() {
      avatarUpload.click();
    });
  
    avatarUpload.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
          avatar.style.backgroundImage = `url(${event.target.result})`;
          avatar.style.backgroundSize = 'cover';
          avatar.style.backgroundPosition = 'center';
          avatar.textContent = ''; // Remove initial text
          
          // Save avatar to localStorage
          localStorage.setItem('avatar', event.target.result);
        }
        
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  
    // Initialize avatar from localStorage
    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
      avatar.style.backgroundImage = `url(${savedAvatar})`;
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
      avatar.textContent = '';
    }
  
    // Save Profile Button Functionality
    saveProfileBtn.addEventListener('click', function() {
      // Get form values
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const jobTitle = document.getElementById('jobTitle').value;
      const countryCode = document.getElementById('countryCode').value;
      const phone = document.getElementById('phone').value;
      const timezone = document.getElementById('timezone').value;
      
      // Create user profile object
      const userProfile = {
        fullName,
        email,
        jobTitle,
        phone: countryCode + phone,
        timezone
      };
      
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      // Show success message
      showNotification('Profile saved successfully!', 'success');
    });
  
    // Initialize form from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      document.getElementById('fullName').value = profile.fullName || 'Kwame Johnson';
      document.getElementById('email').value = profile.email || 'kwame@infoguard.com';
      document.getElementById('jobTitle').value = profile.jobTitle || 'Security Administrator';
      
      // Phone parsing
      if (profile.phone) {
        // Extract country code and phone number
        // This is simplified for demo purposes
        const phoneValue = profile.phone.substring(profile.phone.length - 9);
        document.getElementById('phone').value = phoneValue;
        
        // Set country code dropdown (simplified)
        document.getElementById('countryCode').value = '+233';
      }
      
      document.getElementById('timezone').value = profile.timezone || 'Africa/Accra';
    }
  
    // Change Password Button
    changePasswordBtn.addEventListener('click', function() {
      // In a real app, this would open a modal
      showNotification('Password change feature coming soon!', 'info');
    });
  
    // View Activity Button
    viewActivityBtn.addEventListener('click', function() {
      // In a real app, this would show login activity
      showNotification('Login activity feature coming soon!', 'info');
    });
  
    // Toggle Switches
    twoFactorToggle.addEventListener('change', function() {
      localStorage.setItem('twoFactorEnabled', this.checked);
      showNotification(`Two-factor authentication ${this.checked ? 'enabled' : 'disabled'}`, this.checked ? 'success' : 'warning');
    });
  
    emailToggle.addEventListener('change', function() {
      localStorage.setItem('emailNotifications', this.checked);
    });
  
    securityToggle.addEventListener('change', function() {
      localStorage.setItem('securityAlerts', this.checked);
    });
  
    updatesToggle.addEventListener('change', function() {
      localStorage.setItem('systemUpdates', this.checked);
    });
  
    // Initialize toggle states from localStorage
    twoFactorToggle.checked = localStorage.getItem('twoFactorEnabled') === 'true' || true;
    emailToggle.checked = localStorage.getItem('emailNotifications') !== 'false'; // Default true
    securityToggle.checked = localStorage.getItem('securityAlerts') !== 'false'; // Default true
    updatesToggle.checked = localStorage.getItem('systemUpdates') === 'true';
  
    // Helper function to show notifications
    function showNotification(message, type) {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      
      // Add to body
      document.body.appendChild(notification);
      
      // Remove after delay
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    }
    
    // Add CSS for notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
      .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        opacity: 1;
        transform: translateY(0);
        transition: all 0.3s ease;
      }
      
      .notification-success {
        background-color: #10b981;
      }
      
      .notification-info {
        background-color: #3b82f6;
      }
      
      .notification-warning {
        background-color: #f59e0b;
      }
      
      .fade-out {
        opacity: 0;
        transform: translateY(20px);
      }
    `;
    
    document.head.appendChild(notificationStyles);
  });