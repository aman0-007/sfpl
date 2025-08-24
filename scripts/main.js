// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownItems = document.querySelectorAll('.dropdown');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Close all mobile dropdowns when hamburger menu is toggled
            dropdownItems.forEach(dropdown => {
                dropdown.classList.remove('mobile-active');
            });
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                // Only close menu if it's not a dropdown toggle
                if (!link.parentElement.classList.contains('dropdown')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    dropdownItems.forEach(dropdown => {
                        dropdown.classList.remove('mobile-active');
                    });
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                dropdownItems.forEach(dropdown => {
                    dropdown.classList.remove('mobile-active');
                });
            }
        });
    }
    
    // Mobile dropdown toggle functionality
    function setupMobileDropdowns() {
        dropdownItems.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('.nav-link');
            const dropdownArrow = dropdown.querySelector('.dropdown-arrow');
            
            // Handle dropdown arrow clicks (mobile only)
            if (dropdownArrow) {
                dropdownArrow.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Only handle dropdown toggle on mobile
                    if (window.innerWidth <= 768) {
                        // Close other dropdowns
                        dropdownItems.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('mobile-active');
                            }
                        });
                        
                        // Toggle current dropdown
                        dropdown.classList.toggle('mobile-active');
                    }
                });
            }
            
            // Handle dropdown link clicks
            if (dropdownLink) {
                dropdownLink.addEventListener('click', function(e) {
                    // On mobile, allow navigation to services page
                    if (window.innerWidth <= 768) {
                        // Don't prevent default - allow navigation
                        // Close mobile menu after navigation
                        setTimeout(() => {
                            hamburger.classList.remove('active');
                            navMenu.classList.remove('active');
                            dropdownItems.forEach(dropdown => {
                                dropdown.classList.remove('mobile-active');
                            });
                        }, 100);
                    }
                });
            }
        });
        
        // Handle dropdown menu item clicks
        dropdownItems.forEach(dropdown => {
            const dropdownLinks = dropdown.querySelectorAll('.dropdown-link');
            dropdownLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    // On mobile, close menu after selecting an option
                    if (window.innerWidth <= 768) {
                        setTimeout(() => {
                            hamburger.classList.remove('active');
                            navMenu.classList.remove('active');
                            dropdownItems.forEach(dropdown => {
                                dropdown.classList.remove('mobile-active');
                            });
                        }, 100);
                    }
                });
            });
        });
    }
    
    // Initialize mobile dropdowns
    setupMobileDropdowns();
    
    // Handle window resize to reset dropdown states
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset mobile dropdown states on desktop
            dropdownItems.forEach(dropdown => {
                dropdown.classList.remove('mobile-active');
            });
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .value-card, .team-member, .testimonial-card, .case-study, .industry-card, .office-card, .faq-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Loading animation for buttons
    function addLoadingState(button) {
        const originalText = button.textContent;
        button.innerHTML = '<span class="loading"></span> Processing...';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }

    // Add loading state to CTA buttons
    document.querySelectorAll('.cta-button, .btn-primary').forEach(button => {
        if (button.getAttribute('href') === 'contact.html' || button.getAttribute('href') === '#contact') {
            button.addEventListener('click', function(e) {
                if (this.tagName === 'BUTTON') {
                    e.preventDefault();
                    addLoadingState(this);
                }
            });
        }
    });

    // Initialize partners carousel if it exists
    const partnersCarousel = document.querySelector('.partners-carousel');
    if (partnersCarousel) {
        initPartnersCarousel();
    }

    function initPartnersCarousel() {
        const track = document.querySelector('.partners-track');
        if (!track) return;

        // Pause animation on hover
        partnersCarousel.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });

        partnersCarousel.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });

        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                track.style.animationPlayState = 'paused';
            } else {
                track.style.animationPlayState = 'running';
            }
        });

        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            track.style.animation = 'none';
        }
    }
    // Image lazy loading fallback
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Handle image loading errors
                img.addEventListener('error', function() {
                    console.warn('Failed to load image:', this.src);
                    // Set a placeholder or fallback
                    this.style.background = 'var(--neutral-200)';
                    this.style.display = 'flex';
                    this.style.alignItems = 'center';
                    this.style.justifyContent = 'center';
                    this.innerHTML = '<span style="color: var(--text-secondary);">Image</span>';
                });
                
                // Ensure images are visible
                img.style.opacity = '1';
                img.style.transition = 'opacity 0.3s ease';
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    images.forEach(img => {
        // Set initial opacity
        img.style.opacity = '1';
        imageObserver.observe(img);
    });

    // Dropdown menu accessibility
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        dropdown.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dropdownMenu.style.opacity = dropdownMenu.style.opacity === '1' ? '0' : '1';
                dropdownMenu.style.visibility = dropdownMenu.style.visibility === 'visible' ? 'hidden' : 'visible';
            }
        });
    });

    // Statistics counter animation
    const stats = document.querySelectorAll('.stat-item h3');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/[\d,]/g, '');
                
                let currentValue = 0;
                const increment = numericValue / 50;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        target.textContent = finalValue;
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(currentValue).toLocaleString() + suffix;
                    }
                }, 50);
                
                statsObserver.unobserve(target);
            }
        });
    });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Form validation enhancement
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
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
    });

    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        // Remove existing error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate required fields
        if (isRequired && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Validate email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Validate phone
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorDiv);
    }

    // Add error styles
    const style = document.createElement('style');
    style.textContent = `
        /* Partners carousel responsive styles */
        @media (max-width: 768px) {
            .partners-track {
                animation-duration: 20s;
            }
            
            .partner-logo {
                width: 150px;
                height: 80px;
                padding: 1rem;
            }
            
            .partner-logo img {
                height: 60px;
            }
        }
        
        @media (max-width: 480px) {
            .partners-carousel {
                height: 100px;
            }
            
            .partners-track {
                animation-duration: 15s;
            }
            
            .partner-logo {
                width: 120px;
                height: 70px;
                padding: 0.5rem;
            }
            
            .partner-logo img {
                height: 50px;
            }
        }
        
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: var(--error-color);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
    `;
    document.head.appendChild(style);

    // Performance optimization: Debounce scroll events
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

    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
        }
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    console.log('Global Freight Solutions website loaded successfully!');
});
