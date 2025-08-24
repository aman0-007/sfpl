// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, textarea, select');
    
    formFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    // Form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Clear previous errors
        clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, `${getFieldLabel(field)} is required`);
            return false;
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Name validation
        if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
            const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
            if (!nameRegex.test(value)) {
                showFieldError(field, 'Please enter a valid name (2-50 characters, letters only)');
                return false;
            }
        }
        
        // Message length validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                showFieldError(field, 'Please provide more details (minimum 10 characters)');
                return false;
            }
            if (value.length > 1000) {
                showFieldError(field, 'Message is too long (maximum 1000 characters)');
                return false;
            }
        }
        
        return true;
    }
    
    function getFieldLabel(field) {
        const label = field.parentNode.querySelector('label');
        return label ? label.textContent.replace(' *', '') : field.name;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        
        // Focus on first error field
        if (!document.querySelector('.form-group input.error:focus')) {
            field.focus();
        }
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    // Form submission
    function submitForm() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            try {
                // Here you would typically send the data to your server
                console.log('Form data:', data);
                
                // Show success message
                showSuccessMessage();
                
                // Reset form
                contactForm.reset();
                
                // Send confirmation email simulation
                sendConfirmationEmail(data.email);
                
            } catch (error) {
                console.error('Form submission error:', error);
                showErrorMessage('There was an error sending your message. Please try again.');
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 2000);
    }
    
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="
                background: var(--success-color);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                margin: 1rem 0;
                text-align: center;
                animation: slideInUp 0.5s ease-out;
            ">
                <strong>Thank you!</strong> Your inquiry has been sent successfully. 
                We'll get back to you within 24 hours.
            </div>
        `;
        
        contactForm.insertBefore(successDiv, contactForm.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-global';
        errorDiv.innerHTML = `
            <div style="
                background: var(--error-color);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                margin: 1rem 0;
                text-align: center;
                animation: slideInUp 0.5s ease-out;
            ">
                <strong>Error:</strong> ${message}
            </div>
        `;
        
        contactForm.insertBefore(errorDiv, contactForm.firstChild);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    function sendConfirmationEmail(email) {
        // Simulate sending confirmation email
        console.log(`Confirmation email sent to: ${email}`);
        
        // You could show a notification about the confirmation email
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
        `;
        notification.textContent = 'Confirmation email sent!';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    // Character counter for message field
    const messageField = contactForm.querySelector('#message');
    if (messageField) {
        const maxLength = 1000;
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
        `;
        
        messageField.parentNode.appendChild(counter);
        
        // Update counter
        function updateCounter() {
            const remaining = maxLength - messageField.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 100) {
                counter.style.color = 'var(--warning-color)';
            } else if (remaining < 0) {
                counter.style.color = 'var(--error-color)';
            } else {
                counter.style.color = 'var(--text-secondary)';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
    }
    
    // Auto-save form data to localStorage
    function saveFormData() {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('contactFormData', JSON.stringify(data));
    }
    
    function loadFormData() {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = contactForm.querySelector(`[name="${key}"]`);
                    if (field && data[key]) {
                        field.value = data[key];
                    }
                });
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    }
    
    function clearSavedData() {
        localStorage.removeItem('contactFormData');
    }
    
    // Auto-save on input
    formFields.forEach(field => {
        field.addEventListener('input', debounce(saveFormData, 1000));
    });
    
    // Load saved data on page load
    loadFormData();
    
    // Clear saved data on successful submission
    contactForm.addEventListener('submit', () => {
        setTimeout(clearSavedData, 3000); // Clear after success message
    });
    
    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
        
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: var(--error-color);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .error-message {
            color: var(--error-color);
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: slideInUp 0.3s ease-out;
        }
        
        .loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Contact form initialized successfully');
});