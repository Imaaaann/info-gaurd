document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signup-email').focus();
    document.getElementById('signup-password').addEventListener('input', checkPasswordMatch);
    document.getElementById('confirm-password').addEventListener('input', checkPasswordMatch);
  });
  
  function handleSignup(event) {
    event.preventDefault();
  
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    if (password !== confirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }
  
    // Simulate signup success
    alert(`✅ Account created for ${email}`);
    event.target.reset(); // Clear the form
  }window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('slide-in');
  });

  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');

      document.body.classList.remove('slide-in');
      document.body.classList.add('slide-out');

      setTimeout(() => {
        window.location.href = href;
      }, 500); // match transition duration
    });
  });
  function toggleConfirmPassword() {
    const input = document.getElementById('confirm-password');
    const icon = document.getElementById('toggle-confirm-icon');
  
    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = '🙈';
    } else {
      input.type = 'password';
      icon.textContent = '👁️';
    }
  }
  function checkPasswordMatch() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const confirmInput = document.getElementById('confirm-password');
  
    if (confirmPassword && password !== confirmPassword) {
      confirmInput.setCustomValidity("Passwords do not match.");
      confirmInput.reportValidity(); // Show warning message
    } else {
      confirmInput.setCustomValidity("");
    }
  }
  
  