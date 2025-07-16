 // Security animation controller
        function initSecurityAnimation() {
            const codes = ['SECURE', 'LOCKED', 'VAULT', 'SAFE', 'GUARD', 'PROTECTED'];
            const statusMessages = [
                'AUTHENTICATION SECURED',
                'VAULT LOCKED',
                'BIOMETRIC SCAN ACTIVE',
                'ENCRYPTION ENABLED',
                'SECURITY PROTOCOL ACTIVE',
                'ACCESS CONTROLLED'
            ];
            
            let codeIndex = 0;
            let statusIndex = 0;
            
            // Change digital lock code
            setInterval(() => {
                const digitalCode = document.getElementById('digitalCode');
                if (digitalCode) {
                    digitalCode.textContent = codes[codeIndex];
                    codeIndex = (codeIndex + 1) % codes.length;
                }
            }, 3000);
            
            // Change status message
            setInterval(() => {
                const statusText = document.getElementById('statusText');
                if (statusText) {
                    statusText.textContent = statusMessages[statusIndex];
                    statusIndex = (statusIndex + 1) % statusMessages.length;
                }
            }, 4000);
        }

        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleIcon = document.getElementById('toggle-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                toggleIcon.textContent = '👁️';
            }
        }

        function goBackToWebsite() {
            // Option 1: Go back to the previous page
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // Option 2: Redirect to your main website
                window.location.href = '/'; // Change this to your main website URL
            }
        }

        function handleLogin(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Add your login logic here
            console.log('Login attempt:', { email, password });
            
            // Example: Show loading state
            const button = event.target.querySelector('.login-button');
            button.textContent = 'Logging in...';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                button.textContent = 'Log In';
                button.disabled = false;
                // Handle successful login or show error
                alert('Login functionality would be implemented here');
            }, 2000);
        }

        function loginWithGoogle() {
            // Google OAuth 2.0 implementation
            const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID
            const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
            const scope = encodeURIComponent('openid email profile');
            const responseType = 'code';
            const state = generateRandomState(); // Generate a random state for security
            
            // Store state in sessionStorage for verification
            sessionStorage.setItem('google_auth_state', state);
            
            const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${clientId}&` +
                `redirect_uri=${redirectUri}&` +
                `response_type=${responseType}&` +
                `scope=${scope}&` +
                `state=${state}`;
            
            window.location.href = googleAuthUrl;
        }

        function loginWithFacebook() {
            // Facebook OAuth implementation
            const appId = 'YOUR_FACEBOOK_APP_ID'; // Replace with your actual Facebook App ID
            const redirectUri = encodeURIComponent(window.location.origin + '/auth/facebook/callback');
            const scope = encodeURIComponent('email,public_profile');
            const responseType = 'code';
            const state = generateRandomState(); // Generate a random state for security
            
            // Store state in sessionStorage for verification
            sessionStorage.setItem('facebook_auth_state', state);
            
            const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
                `client_id=${appId}&` +
                `redirect_uri=${redirectUri}&` +
                `response_type=${responseType}&` +
                `scope=${scope}&` +
                `state=${state}`;
            
            window.location.href = facebookAuthUrl;
        }

        function generateRandomState() {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        }

        // Handle OAuth callbacks (if this page is used as a callback handler)
        function handleOAuthCallback() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            const error = urlParams.get('error');
            
            if (error) {
                console.error('OAuth error:', error);
                alert('Authentication failed: ' + error);
                return;
            }
            
            if (code && state) {
                // Verify state parameter
                const storedState = sessionStorage.getItem('google_auth_state') || sessionStorage.getItem('facebook_auth_state');
                if (state !== storedState) {
                    console.error('State mismatch - possible CSRF attack');
                    alert('Authentication failed: Invalid state parameter');
                    return;
                }
                
                // Send code to your backend for token exchange
                exchangeCodeForToken(code, state);
            }
        }

        function exchangeCodeForToken(code, state) {
            // This should be handled by your backend
            fetch('/auth/exchange-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    state: state
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Handle successful authentication
                    localStorage.setItem('access_token', data.access_token);
                    window.location.href = '/dashboard'; // Redirect to dashboard
                } else {
                    alert('Authentication failed: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Authentication failed');
            });
        }

        // Auto-focus email field on page load
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('email').focus();
            
            // Initialize security animation
            initSecurityAnimation();
            
            // Handle OAuth callbacks if present
            if (window.location.search.includes('code=')) {
                handleOAuthCallback();
            }
        });
        window.addEventListener('DOMContentLoaded', () => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              document.body.classList.add('slide-in');
            });
          });
        });
      
        // Slide-out on page leave
       /* document.querySelectorAll('a[href$=".html"]').forEach(link => {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
      
            document.body.classList.remove('slide-in');
            document.body.classList.add('slide-out');
      
            setTimeout(() => {
              window.location.href = href;
            }, 500); // should match CSS transition
          });
        });*/