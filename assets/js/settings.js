document.addEventListener('DOMContentLoaded', function() {
  // Initialize UI elements
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleBtn');
  const themeToggle = document.getElementById('themeToggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const saveNotification = document.getElementById('saveNotification');
  
  // Initialize sidebar toggle button
  function updateToggleButton() {
    toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '☰' : '✕';
  }
  
  // Set initial state
  updateToggleButton();
  
  // Toggle sidebar
  toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    updateToggleButton();
  });
  
  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', function() {
    sidebar.classList.toggle('open');
  });
  
  // Theme toggle
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    this.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update theme options
    updateThemeOptions(newTheme);
  });
  
  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }
  
  // Update theme options to reflect current theme
  function updateThemeOptions(theme) {
    document.querySelectorAll('.theme-option').forEach(option => {
      option.classList.remove('active');
    });
    document.querySelector(`.theme-option[data-theme="${theme}"]`).classList.add('active');
  }
  
  // Initialize theme options
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  updateThemeOptions(currentTheme);
  
  // Theme options selection
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      
      if (theme !== 'auto') {
        document.body.setAttribute('data-theme', theme);
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
      } else {
        // Auto theme - use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark ? 'dark' : 'light';
        document.body.setAttribute('data-theme', systemTheme);
        themeToggle.textContent = systemTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', 'auto');
      }
      
      themeOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
    });
  });
  
  // Tab switching functionality
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all tabs
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Font size slider
  const fontSizeSlider = document.getElementById('fontSize');
  const fontSizeValue = document.getElementById('fontSizeValue');
  
  fontSizeSlider.addEventListener('input', function() {
    fontSizeValue.textContent = this.value + 'px';
    document.documentElement.style.setProperty('--base-font-size', this.value + 'px');
    localStorage.setItem('fontSize', this.value);
  });
  
  // Load saved font size
  const savedFontSize = localStorage.getItem('fontSize');
  if (savedFontSize) {
    fontSizeSlider.value = savedFontSize;
    fontSizeValue.textContent = savedFontSize + 'px';
    document.documentElement.style.setProperty('--base-font-size', savedFontSize + 'px');
  }
  
  // Density options
  const densityOptions = document.querySelectorAll('.density-option');
  densityOptions.forEach(option => {
    option.addEventListener('click', () => {
      densityOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      
      const density = option.getAttribute('data-density');
      document.body.setAttribute('data-density', density);
      localStorage.setItem('density', density);
    });
  });
  
  // Load saved density
  const savedDensity = localStorage.getItem('density') || 'comfortable';
  document.querySelector(`.density-option[data-density="${savedDensity}"]`).classList.add('active');
  document.body.setAttribute('data-density', savedDensity);
  
  // Account management buttons
  document.getElementById('deactivateAccount').addEventListener('click', function() {
    if (confirm('Are you sure you want to deactivate your account? You can reactivate within 30 days.')) {
      showNotification('Account deactivation initiated.');
    }
  });
  
  document.getElementById('deleteAccount').addEventListener('click', function() {
    if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      showNotification('Account deletion initiated.');
    }
  });
  
  // Animation preferences
  const animationRadios = document.querySelectorAll('input[name="animation"]');
  animationRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      document.body.setAttribute('data-animation', this.value);
      localStorage.setItem('animation', this.value);
    });
  });
  
  // Load saved animation preference
  const savedAnimation = localStorage.getItem('animation') || 'full';
  document.querySelector(`input[name="animation"][value="${savedAnimation}"]`).checked = true;
  document.body.setAttribute('data-animation', savedAnimation);
  
  // Initialize other settings from localStorage
  const settings = ['language', 'homePage', 'timezone', 'passwordStrength', 'sessionTimeout'];
  settings.forEach(setting => {
    const savedValue = localStorage.getItem(setting);
    if (savedValue && document.getElementById(setting)) {
      document.getElementById(setting).value = savedValue;
    }
  });
  
  // Save settings when changed
  settings.forEach(setting => {
    const element = document.getElementById(setting);
    if (element) {
      element.addEventListener('change', function() {
        localStorage.setItem(setting, this.value);
      });
    }
  });
  
  // Toggle switches
  const toggles = ['twoFactorToggle', 'emailToggle', 'securityToggle', 'updatesToggle', 'pushToggle'];
  toggles.forEach(toggleId => {
    const toggle = document.getElementById(toggleId);
    if (toggle) {
      // Load saved state
      const savedState = localStorage.getItem(toggleId);
      if (savedState !== null) {
        toggle.checked = savedState === 'true';
      }
      
      // Save state when changed
      toggle.addEventListener('change', function() {
        localStorage.setItem(toggleId, this.checked);
      });
    }
  });
  
  // Save buttons
  const saveButtons = [
    'saveGeneral', 'saveSecurity', 'saveNotifications', 'savePreferences'
  ];
  
  saveButtons.forEach(buttonId => {
    document.getElementById(buttonId).addEventListener('click', function() {
      showNotification('Settings saved successfully!');
    });
  });
  
  // Show notification function
  function showNotification(message) {
    saveNotification.querySelector('span').textContent = message;
    saveNotification.classList.add('show');
    
    setTimeout(() => {
      saveNotification.classList.remove('show');
    }, 3000);
  }
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(event) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnMobileMenu = mobileMenuBtn.contains(event.target);
    
    if (!isClickInsideSidebar && !isClickOnMobileMenu && window.innerWidth <= 992) {
      sidebar.classList.remove('open');
    }
  });
});