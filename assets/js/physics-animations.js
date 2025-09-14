/**
 * Physics-Based Animation System
 * Implements spring animations with overshoot, settle, and natural physics
 */

class PhysicsAnimations {
    constructor() {
        this.animations = new Map();
        this.springConfigs = {
            gentle: { tension: 120, friction: 14 },
            medium: { tension: 200, friction: 20 },
            strong: { tension: 300, friction: 25 },
            bouncy: { tension: 400, friction: 30 },
            wobbly: { tension: 180, friction: 12 }
        };
        
        this.easingFunctions = {
            spring: this.createSpringEasing.bind(this),
            bounce: this.createBounceEasing.bind(this),
            elastic: this.createElasticEasing.bind(this),
            back: this.createBackEasing.bind(this)
        };
        
        this.init();
    }

    init() {
        console.log('🌊 Initializing Physics Animation System...');
        this.setupSpringAnimations();
        this.setupPhysicsElements();
        this.setupIntersectionObserver();
        console.log('✅ Physics Animation System initialized');
    }
    
    setQuality(quality) {
        this.quality = quality;
        console.log(`🎨 Physics animation quality set to: ${quality}`);
        // Apply quality settings
        if (quality === 'low') {
            this.disableComplexAnimations();
        } else if (quality === 'high') {
            this.enableComplexAnimations();
        }
    }
    
    disableComplexAnimations() {
        document.body.classList.add('reduce-physics');
    }
    
    enableComplexAnimations() {
        document.body.classList.remove('reduce-physics');
    }

    setupSpringAnimations() {
        // Add spring animation CSS classes
        const style = document.createElement('style');
        style.textContent = `
            .spring-animation {
                transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .spring-gentle {
                transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .spring-medium {
                transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .spring-strong {
                transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .spring-bouncy {
                transition: transform 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .spring-wobbly {
                transition: transform 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .physics-hover:hover {
                transform: translateY(-4px) scale(1.02);
            }
            
            .physics-active:active {
                transform: translateY(2px) scale(0.98);
            }
            
            .physics-magnetic {
                transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .physics-magnetic:hover {
                transform: translateY(-2px) scale(1.05);
            }
        `;
        document.head.appendChild(style);
    }

    setupPhysicsElements() {
        // Add physics classes to interactive elements
        this.addPhysicsToElements();
        
        // Setup magnetic effects
        this.setupMagneticEffects();
        
        // Setup parallax effects
        this.setupParallaxEffects();
    }

    addPhysicsToElements() {
        // Add physics classes to buttons
        const buttons = document.querySelectorAll('button, .btn-primary, .btn-ghost, .btn-secondary');
        buttons.forEach(button => {
            button.classList.add('spring-medium', 'physics-hover', 'physics-active');
        });

        // Add physics classes to cards
        const cards = document.querySelectorAll('.card, .glass-card, .activity-card');
        cards.forEach(card => {
            card.classList.add('spring-gentle', 'physics-magnetic');
        });

        // Add physics classes to navigation items
        const navItems = document.querySelectorAll('.nav-item, .main-nav-link');
        navItems.forEach(item => {
            item.classList.add('spring-gentle', 'physics-magnetic');
        });
    }

    setupMagneticEffects() {
        const magneticElements = document.querySelectorAll('.physics-magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.applyMagneticEffect(element, e);
            });
            
            element.addEventListener('mouseleave', () => {
                this.resetMagneticEffect(element);
            });
        });
    }

    applyMagneticEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (event.clientX - centerX) * 0.1;
        const deltaY = (event.clientY - centerY) * 0.1;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    }

    resetMagneticEffect(element) {
        element.style.transform = 'translate(0px, 0px) scale(1)';
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', () => {
                this.updateParallaxElements(parallaxElements);
            });
        }
    }

    updateParallaxElements(elements) {
        const scrollTop = window.pageYOffset;
        
        elements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnIntersection(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.animate-fade-up, .animate-slide-in, .animate-scale-in, .animate-spring'
        );
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    animateOnIntersection(element) {
        if (element.classList.contains('animate-fade-up')) {
            this.springFadeUp(element);
        } else if (element.classList.contains('animate-slide-in')) {
            this.springSlideIn(element);
        } else if (element.classList.contains('animate-scale-in')) {
            this.springScaleIn(element);
        } else if (element.classList.contains('animate-spring')) {
            this.springBounce(element);
        }
    }

    // Spring Animation Methods
    springFadeUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    springSlideIn(element) {
        const direction = element.dataset.direction || 'left';
        const translateX = direction === 'left' ? '-30px' : '30px';
        
        element.style.opacity = '0';
        element.style.transform = `translateX(${translateX})`;
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    springScaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    springBounce(element) {
        element.style.transform = 'scale(0.9)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'transform 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            element.style.transform = 'scale(1)';
        });
    }

    // Advanced Spring Animations
    createSpringEasing(config = 'medium') {
        const springConfig = this.springConfigs[config] || this.springConfigs.medium;
        
        return (t) => {
            // Simplified spring easing function
            const tension = springConfig.tension / 100;
            const friction = springConfig.friction / 100;
            
            return 1 - Math.pow(2, -10 * t) * Math.cos((t * 10 - 0.75) * Math.PI * friction);
        };
    }

    createBounceEasing() {
        return (t) => {
            if (t < 1 / 2.75) {
                return 7.5625 * t * t;
            } else if (t < 2 / 2.75) {
                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            } else if (t < 2.5 / 2.75) {
                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            } else {
                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
        };
    }

    createElasticEasing() {
        return (t) => {
            if (t === 0 || t === 1) return t;
            
            const p = 0.3;
            const s = p / 4;
            
            return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
        };
    }

    createBackEasing() {
        return (t) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            
            return c3 * t * t * t - c1 * t * t;
        };
    }

    // Physics-based Page Transitions
    animatePageTransition(fromPage, toPage, direction = 'right') {
        const fromElement = document.querySelector(`[data-page="${fromPage}"]`);
        const toElement = document.querySelector(`[data-page="${toPage}"]`);
        
        if (!fromElement || !toElement) return;

        const translateX = direction === 'right' ? '-100%' : '100%';
        
        // Animate out current page
        fromElement.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        fromElement.style.transform = `translateX(${translateX})`;
        
        // Animate in new page
        toElement.style.transform = 'translateX(0)';
        toElement.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Clean up after animation
        setTimeout(() => {
            fromElement.style.transition = '';
            fromElement.style.transform = '';
            toElement.style.transition = '';
        }, 600);
    }

    // Physics-based Element Interactions
    animateButtonPress(button) {
        button.style.transition = 'transform 0.1s ease';
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            button.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        }, 100);
    }

    animateCardHover(card, isHovering) {
        if (isHovering) {
            card.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.transform = 'translateY(-8px) scale(1.02)';
        } else {
            card.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.transform = 'translateY(0) scale(1)';
        }
    }

    // Physics-based Loading Animations
    animateLoadingSpinner(spinner) {
        spinner.style.animation = 'spin-spring 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite';
    }

    animateProgressBar(progressBar, targetValue) {
        const currentValue = parseInt(progressBar.style.width) || 0;
        const duration = Math.abs(targetValue - currentValue) * 10; // 10ms per percentage
        
        progressBar.style.transition = `width ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        progressBar.style.width = `${targetValue}%`;
    }

    // Physics-based Notification Animations
    animateNotification(notification, type = 'slide') {
        if (type === 'slide') {
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
            });
        } else if (type === 'bounce') {
            notification.style.transform = 'scale(0)';
            notification.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            requestAnimationFrame(() => {
                notification.style.transform = 'scale(1)';
            });
        }
    }

    // Utility Methods
    getSpringConfig(name) {
        return this.springConfigs[name] || this.springConfigs.medium;
    }

    createCustomSpring(tension, friction) {
        return { tension, friction };
    }

    // Public API
    animate(element, properties, options = {}) {
        const config = options.spring || 'medium';
        const duration = options.duration || 600;
        const easing = options.easing || 'spring';
        
        const easingFunction = this.easingFunctions[easing](config);
        
        // Apply animation
        element.style.transition = `all ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
        
        Object.keys(properties).forEach(property => {
            element.style[property] = properties[property];
        });
        
        // Return promise for animation completion
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    // Cleanup
    destroy() {
        this.animations.clear();
        // Remove event listeners and cleanup
    }
}

// Initialize physics animations
window.PhysicsAnimations = PhysicsAnimations;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.physicsAnimations = new PhysicsAnimations();
    });
} else {
    window.physicsAnimations = new PhysicsAnimations();
}
