// Admin Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    const alertModal = document.getElementById('alertModal');
    const alertIcon = document.getElementById('alertIcon');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const alertBtn = document.getElementById('alertBtn');

    // Demo credentials
    const DEMO_CREDENTIALS = {
        username: 'admin',
        password: 'admin123'
    };

    // Password toggle functionality
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const toggleIcon = passwordToggle.querySelector('.toggle-icon');
            toggleIcon.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Handle login process
    function handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Validation
        if (!username || !password) {
            showAlert('error', 'Validation Error', 'Please enter both username and password.');
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            // Check credentials
            if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
                // Successful login
                handleSuccessfulLogin(username, rememberMe);
            } else {
                // Failed login
                handleFailedLogin();
            }

            // Reset button state
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }, 1500);
    }

    // Handle successful login
    function handleSuccessfulLogin(username, rememberMe) {
        // Store session data
        const sessionData = {
            username: username,
            loginTime: new Date().toISOString(),
            isAuthenticated: true
        };

        if (rememberMe) {
            localStorage.setItem('adminSession', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
        }

        // Show success message
        showAlert('success', 'Login Successful', 'Welcome back! Redirecting to dashboard...', () => {
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }

    // Handle failed login
    function handleFailedLogin() {
        // Track failed attempts
        let failedAttempts = parseInt(localStorage.getItem('failedLoginAttempts') || '0');
        failedAttempts++;
        localStorage.setItem('failedLoginAttempts', failedAttempts.toString());

        // Show error message
        let message = 'Invalid username or password. Please try again.';
        
        if (failedAttempts >= 3) {
            message += '\n\nToo many failed attempts. Please contact support if you continue to have issues.';
        }

        showAlert('error', 'Login Failed', message);

        // Clear password field
        document.getElementById('password').value = '';
        
        // Add shake animation to form
        loginForm.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginForm.style.animation = '';
        }, 500);
    }

    // Show alert modal
    function showAlert(type, title, message, callback = null) {
        // Set alert content
        alertTitle.textContent = title;
        alertMessage.textContent = message;
        
        // Set alert icon and styling based on type
        switch(type) {
            case 'success':
                alertIcon.textContent = '✅';
                alertBtn.style.background = 'var(--admin-success)';
                break;
            case 'error':
                alertIcon.textContent = '❌';
                alertBtn.style.background = 'var(--admin-error)';
                break;
            case 'warning':
                alertIcon.textContent = '⚠️';
                alertBtn.style.background = 'var(--admin-warning)';
                break;
            default:
                alertIcon.textContent = 'ℹ️';
                alertBtn.style.background = 'var(--admin-primary)';
        }

        // Show modal
        alertModal.style.display = 'flex';
        
        // Handle alert button click
        alertBtn.onclick = function() {
            hideAlert();
            if (callback) callback();
        };

        // Handle click outside modal
        alertModal.onclick = function(e) {
            if (e.target === alertModal) {
                hideAlert();
                if (callback) callback();
            }
        };

        // Handle escape key
        document.addEventListener('keydown', handleEscapeKey);
    }

    // Hide alert modal
    function hideAlert() {
        alertModal.style.display = 'none';
        document.removeEventListener('keydown', handleEscapeKey);
    }

    // Handle escape key press
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            hideAlert();
        }
    }

    // Check if user is already logged in
    function checkExistingSession() {
        const sessionData = JSON.parse(localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession') || 'null');
        
        if (sessionData && sessionData.isAuthenticated) {
            // Check if session is still valid (within 24 hours for localStorage, session for sessionStorage)
            const loginTime = new Date(sessionData.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
                // Session is still valid, redirect to dashboard
                showAlert('info', 'Already Logged In', 'You are already logged in. Redirecting to dashboard...', () => {
                    window.location.href = 'dashboard.html';
                });
                return;
            } else {
                // Session expired, clear it
                localStorage.removeItem('adminSession');
                sessionStorage.removeItem('adminSession');
            }
        }
    }

    // Auto-fill demo credentials (for demo purposes)
    function setupDemoMode() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        // Add click handler to demo credentials
        const loginHelp = document.querySelector('.login-help');
        if (loginHelp) {
            loginHelp.addEventListener('click', function() {
                usernameInput.value = DEMO_CREDENTIALS.username;
                passwordInput.value = DEMO_CREDENTIALS.password;
                
                // Add visual feedback
                usernameInput.style.background = 'rgba(16, 185, 129, 0.1)';
                passwordInput.style.background = 'rgba(16, 185, 129, 0.1)';
                
                setTimeout(() => {
                    usernameInput.style.background = '';
                    passwordInput.style.background = '';
                }, 1000);
            });
        }
    }

    // Form validation
    function setupFormValidation() {
        const inputs = loginForm.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    // Validate individual field
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Clear previous error
        clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, `${getFieldLabel(field)} is required`);
            return false;
        }
        
        // Username validation
        if (fieldName === 'username' && value) {
            if (value.length < 3) {
                showFieldError(field, 'Username must be at least 3 characters');
                return false;
            }
        }
        
        // Password validation
        if (fieldName === 'password' && value) {
            if (value.length < 6) {
                showFieldError(field, 'Password must be at least 6 characters');
                return false;
            }
        }
        
        return true;
    }

    // Show field error
    function showFieldError(field, message) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--admin-error);
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: slideInUp 0.3s ease-out;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }

    // Clear field error
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Get field label
    function getFieldLabel(field) {
        const label = field.parentNode.querySelector('label');
        return label ? label.textContent : field.name;
    }

    // Add CSS for error states
    function addErrorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .form-group input.error {
                border-color: var(--admin-error);
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Keyboard shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Enter key to submit form
            if (e.key === 'Enter' && !alertModal.style.display) {
                const activeElement = document.activeElement;
                if (activeElement.tagName === 'INPUT') {
                    e.preventDefault();
                    handleLogin();
                }
            }
            
            // Ctrl+L to focus username field
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                document.getElementById('username').focus();
            }
        });
    }

    // Initialize everything
    function init() {
        checkExistingSession();
        setupDemoMode();
        setupFormValidation();
        addErrorStyles();
        setupKeyboardShortcuts();
        
        // Focus username field
        document.getElementById('username').focus();
        
        console.log('Admin login system initialized');
        console.log('Demo credentials - Username: admin, Password: admin123');
    }

    // Start initialization
    init();
});