// Carousel functionality - Fixed and optimized version
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Early exit if carousel elements don't exist
    if (!carousel || slides.length === 0) {
        console.warn('Carousel elements not found');
        return;
    }
    
    let currentSlide = 0;
    let isTransitioning = false;
    let autoSlideInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    let isInitialized = false;
    
    // Initialize carousel
    function initCarousel() {
        console.log('Initializing carousel with', slides.length, 'slides');
        
        // Ensure all slides are properly hidden initially
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.zIndex = '1';
        });
        
        // Show first slide
        showSlide(0);
        
        // Add event listeners
        setupEventListeners();
        
        // Setup accessibility
        setupAccessibility();
        
        // Preload images
        preloadImages();
        
        // Mark as initialized
        isInitialized = true;
        
        // Start auto-slide after a short delay
        setTimeout(() => {
            if (isCarouselVisible() && !document.hidden) {
                startAutoSlide();
            }
        }, 2000);
        
        console.log('Carousel initialized successfully');
    }
    
    // Setup all event listeners
    function setupEventListeners() {
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                changeSlide(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                changeSlide(1);
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                goToSlide(index);
            });
            
            // Keyboard support for dots
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(index);
                }
            });
        });
        
        // Touch/swipe support
        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Mouse events for pause/resume
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', () => {
            if (isInitialized) startAutoSlide();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
        
        // Visibility change handling
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Window focus/blur events
        window.addEventListener('focus', () => {
            if (isInitialized && !document.hidden) {
                setTimeout(startAutoSlide, 500);
            }
        });
        
        window.addEventListener('blur', stopAutoSlide);
    }
    
    // Show specific slide with proper transitions
    function showSlide(index) {
        if (index < 0 || index >= slides.length) {
            console.warn('Invalid slide index:', index);
            return;
        }
        
        console.log('Showing slide:', index);
        
        // Remove active class from all slides and dots
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.zIndex = i === index ? '2' : '1';
        });
        
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide with fade effect
        const currentSlideElement = slides[index];
        if (currentSlideElement) {
            currentSlideElement.classList.add('active');
            currentSlideElement.style.opacity = '1';
            
            // Animate content
            const content = currentSlideElement.querySelector('.carousel-content');
            if (content) {
                content.style.animation = 'none';
                content.offsetHeight; // Force reflow
                content.style.animation = 'slideInUp 0.8s ease-out';
            }
        }
        
        // Update active dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Change slide with direction
    function changeSlide(direction) {
        if (isTransitioning) {
            console.log('Transition in progress, skipping');
            return;
        }
        
        isTransitioning = true;
        
        let newSlide = currentSlide + direction;
        
        // Wrap around
        if (newSlide >= slides.length) {
            newSlide = 0;
        } else if (newSlide < 0) {
            newSlide = slides.length - 1;
        }
        
        console.log('Changing slide from', currentSlide, 'to', newSlide);
        
        showSlide(newSlide);
        
        // Reset transition flag
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
        
        // Restart auto-slide timer
        restartAutoSlide();
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (isTransitioning || index === currentSlide || index < 0 || index >= slides.length) {
            return;
        }
        
        console.log('Going to slide:', index);
        
        isTransitioning = true;
        showSlide(index);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
        
        restartAutoSlide();
    }
    
    // Auto-slide functionality
    function startAutoSlide() {
        if (!isInitialized) return;
        
        stopAutoSlide();
        
        // Only start if carousel is visible and page is active
        if (document.hidden || !isCarouselVisible()) {
            console.log('Carousel not visible or page hidden, not starting auto-slide');
            return;
        }
        
        console.log('Starting auto-slide');
        
        autoSlideInterval = setInterval(() => {
            if (!isTransitioning && !document.hidden && isCarouselVisible()) {
                changeSlide(1);
            }
        }, 5000); // 5 seconds interval
    }
    
    // Check if carousel is visible in viewport
    function isCarouselVisible() {
        if (!carousel) return false;
        
        const rect = carousel.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            console.log('Stopping auto-slide');
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    function restartAutoSlide() {
        stopAutoSlide();
        setTimeout(() => {
            if (isInitialized) startAutoSlide();
        }, 1000);
    }
    
    // Touch/swipe handlers
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                changeSlide(1);
            } else {
                // Swipe right - previous slide
                changeSlide(-1);
            }
        }
    }
    
    // Keyboard navigation
    function handleKeyDown(e) {
        // Only handle keyboard events when carousel is in focus or hovered
        if (!carousel.matches(':hover') && document.activeElement !== carousel) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                changeSlide(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                changeSlide(1);
                break;
            case ' ':
                e.preventDefault();
                // Toggle auto-slide
                if (autoSlideInterval) {
                    stopAutoSlide();
                } else {
                    startAutoSlide();
                }
                break;
        }
    }
    
    // Handle visibility change (pause when tab is hidden)
    function handleVisibilityChange() {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            // Delay restart when tab becomes visible
            setTimeout(() => {
                if (!document.hidden && isInitialized) {
                    startAutoSlide();
                }
            }, 1000);
        }
    }
    
    // Preload images for better performance
    function preloadImages() {
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img && img.src) {
                const preloadImg = new Image();
                preloadImg.onload = () => {
                    console.log('Preloaded image for slide', index);
                };
                preloadImg.onerror = () => {
                    console.warn('Failed to preload image for slide', index);
                };
                preloadImg.src = img.src;
            }
        });
    }
    
    // Accessibility improvements
    function setupAccessibility() {
        // Add ARIA labels
        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-label', 'Image carousel');
        carousel.setAttribute('tabindex', '0');
        
        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
        });
        
        // Add button labels
        if (prevBtn) {
            prevBtn.setAttribute('aria-label', 'Previous slide');
            prevBtn.setAttribute('type', 'button');
        }
        if (nextBtn) {
            nextBtn.setAttribute('aria-label', 'Next slide');
            nextBtn.setAttribute('type', 'button');
        }
        
        // Add dot labels
        dots.forEach((dot, index) => {
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.setAttribute('tabindex', '0');
        });
    }
    
    // Performance optimization with Intersection Observer
    function optimizePerformance() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (isInitialized) {
                        setTimeout(startAutoSlide, 500);
                    }
                } else {
                    stopAutoSlide();
                }
            });
        }, {
            threshold: 0.3
        });
        
        observer.observe(carousel);
        
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            stopAutoSlide();
            console.log('Reduced motion preferred, auto-slide disabled');
        }
    }
    
    // Error handling for images
    function handleImageErrors() {
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                img.addEventListener('error', () => {
                    console.warn(`Failed to load carousel image ${index + 1}:`, img.src);
                    // Add fallback styling
                    img.style.background = 'var(--neutral-200)';
                    img.style.display = 'flex';
                    img.style.alignItems = 'center';
                    img.style.justifyContent = 'center';
                    img.innerHTML = '<span style="color: var(--text-secondary);">Image unavailable</span>';
                });
                
                img.addEventListener('load', () => {
                    console.log(`Successfully loaded carousel image ${index + 1}`);
                });
            }
        });
    }
    
    // Initialize everything
    try {
        handleImageErrors();
        optimizePerformance();
        initCarousel();
        
        // Multiple initialization attempts to ensure carousel starts
        const ensureStart = () => {
            if (isCarouselVisible() && !document.hidden && isInitialized) {
                startAutoSlide();
            }
        };
        
        // Fallback initialization
        setTimeout(ensureStart, 3000);
        window.addEventListener('load', () => setTimeout(ensureStart, 1000));
        
    } catch (error) {
        console.error('Error initializing carousel:', error);
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopAutoSlide();
    });
    
    // Expose methods for debugging
    window.carouselDebug = {
        currentSlide: () => currentSlide,
        isTransitioning: () => isTransitioning,
        isAutoSliding: () => !!autoSlideInterval,
        goToSlide: goToSlide,
        startAutoSlide: startAutoSlide,
        stopAutoSlide: stopAutoSlide
    };
});