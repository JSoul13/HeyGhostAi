
// Main JavaScript file for Hey Ghost website

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize animations
    initAnimations();
});

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Form Validation
function initFormValidation() {
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous errors
            clearErrors();
            
            // Validate form
            const isValid = validateSignupForm();
            
            if (isValid) {
                // Show success modal
                showSuccessModal();
            }
        });
    }
}

function validateSignupForm() {
    let isValid = true;
    
    // Full Name validation
    const fullName = document.getElementById('fullName');
    if (!fullName.value.trim()) {
        showError('fullName', 'Full name is required');
        isValid = false;
    } else if (fullName.value.trim().length < 2) {
        showError('fullName', 'Full name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    const phone = document.getElementById('phone');
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phone.value.trim()) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!phoneRegex.test(phone.value.replace(/[\s\-\(\)]/g, ''))) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Address validation
    const address = document.getElementById('address');
    if (!address.value.trim()) {
        showError('address', 'Address is required');
        isValid = false;
    } else if (address.value.trim().length < 10) {
        showError('address', 'Please enter a complete address');
        isValid = false;
    }
    
    // Screen Name validation
    const screenName = document.getElementById('screenName');
    if (!screenName.value.trim()) {
        showError('screenName', 'Screen name is required');
        isValid = false;
    } else if (screenName.value.trim().length < 3) {
        showError('screenName', 'Screen name must be at least 3 characters');
        isValid = false;
    } else if (screenName.value.trim().length > 20) {
        showError('screenName', 'Screen name must be less than 20 characters');
        isValid = false;
    }
    
    // Password validation
    const password = document.getElementById('password');
    if (!password.value) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.value.length < 8) {
        showError('password', 'Password must be at least 8 characters');
        isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password.value)) {
        showError('password', 'Password must contain uppercase, lowercase, and number');
        isValid = false;
    }
    
    // Confirm Password validation
    const confirmPassword = document.getElementById('confirmPassword');
    if (!confirmPassword.value) {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password.value !== confirmPassword.value) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Terms validation
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        showError('terms', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#ff0000';
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    const fields = document.querySelectorAll('.form-group input, .form-group textarea');
    fields.forEach(field => {
        field.style.borderColor = '#8000ff';
    });
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('show');
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
}

// Scroll Effects
function initScrollEffects() {
    // Parallax effect for hero backgrounds
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-bg-img');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Fade in animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.feature-card, .app-card, .pricing-card, .location-card, .step-card, .case-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Animations
function initAnimations() {
    // Add CSS classes for animations
    const style = document.createElement('style');
    style.textContent = `
        .feature-card,
        .app-card,
        .pricing-card,
        .location-card,
        .step-card,
        .case-card,
        .feature-item,
        .capability-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card:nth-child(even) {
            animation-delay: 0.2s;
        }
        
        .feature-card:nth-child(3n) {
            animation-delay: 0.4s;
        }
    `;
    document.head.appendChild(style);
}

// Utility Functions
function createRippleEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        createRippleEffect(button);
    });
    
    // Add ripple CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            pointer-events: none;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Loading animations
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
    
    const originalText = element.textContent;
    element.textContent = 'Loading...';
    
    return function hideLoading() {
        element.classList.remove('loading');
        element.disabled = false;
        element.textContent = originalText;
    };
}

// Random glitch effect
function addRandomGlitch() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    setInterval(() => {
        glitchElements.forEach(element => {
            if (Math.random() < 0.1) { // 10% chance
                element.style.animation = 'none';
                setTimeout(() => {
                    element.style.animation = 'glitch-text 4s infinite';
                }, 50);
            }
        });
    }, 2000);
}

// Initialize random glitch on load
document.addEventListener('DOMContentLoaded', addRandomGlitch);

// Export functions for use in other files
window.HeyGhostUtils = {
    showLoading,
    showError,
    clearErrors,
    showSuccessModal
};
