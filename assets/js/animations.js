/**
 * Premium Animation System
 * Ferrari-level smooth animations and micro-interactions
 */

class AnimationSystem {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupPageTransitions();
        this.setupMicroInteractions();
        this.setupParallaxEffects();
        this.setupLoadingAnimations();
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with scroll animation classes
        document.querySelectorAll('[data-animate]').forEach(el => {
            scrollObserver.observe(el);
        });

        this.observers.set('scroll', scrollObserver);
    }

    animateOnScroll(element) {
        const animationType = element.dataset.animate;
        const delay = parseInt(element.dataset.delay) || 0;

        setTimeout(() => {
            element.classList.add('animate-in');
            
            // Add specific animation classes
            switch (animationType) {
                case 'fade-up':
                    element.classList.add('animate-fade-up');
                    break;
                case 'fade-in':
                    element.classList.add('animate-fade-in');
                    break;
                case 'slide-left':
                    element.classList.add('animate-slide-left');
                    break;
                case 'slide-right':
                    element.classList.add('animate-slide-right');
                    break;
                case 'scale-in':
                    element.classList.add('animate-scale-in');
                    break;
                case 'rotate-in':
                    element.classList.add('animate-rotate-in');
                    break;
            }
        }, delay);
    }

    setupHoverAnimations() {
        // Enhanced hover effects with spring physics
        document.querySelectorAll('.hover-lift').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.springAnimation(element, 'hover-enter');
            });
            
            element.addEventListener('mouseleave', () => {
                this.springAnimation(element, 'hover-leave');
            });
        });

        // Magnetic effect for buttons
        document.querySelectorAll('.magnetic').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.magneticEffect(element, e);
            });
        });
    }

    springAnimation(element, type) {
        const animation = element.animate([
            { transform: 'translateY(0px) scale(1)', easing: 'ease-out' },
            { transform: 'translateY(-8px) scale(1.02)', easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
            { transform: 'translateY(-4px) scale(1.01)', easing: 'ease-in' }
        ], {
            duration: type === 'hover-enter' ? 300 : 200,
            fill: 'forwards'
        });

        this.animations.set(element, animation);
    }

    magneticEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        
        const strength = 0.3;
        const moveX = x * strength;
        const moveY = y * strength;

        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    setupPageTransitions() {
        // Smooth page transitions with morphing
        this.pageTransitionDuration = 400;
        
        // Add transition classes to main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.classList.add('page-transition-container');
        }
    }

    animatePageTransition(direction = 'forward') {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        return new Promise((resolve) => {
            // Out animation
            mainContent.style.transform = direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)';
            mainContent.style.opacity = '0';

            setTimeout(() => {
                // In animation
                mainContent.style.transform = 'translateX(0)';
                mainContent.style.opacity = '1';
                resolve();
            }, this.pageTransitionDuration / 2);
        });
    }

    setupMicroInteractions() {
        // Button press animations
        document.querySelectorAll('button, .btn').forEach(button => {
            button.addEventListener('mousedown', () => {
                this.buttonPressAnimation(button);
            });
            
            button.addEventListener('mouseup', () => {
                this.buttonReleaseAnimation(button);
            });
        });

        // Ripple effect for buttons
        document.querySelectorAll('.ripple').forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRippleEffect(element, e);
            });
        });
    }

    buttonPressAnimation(button) {
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.1s ease';
    }

    buttonReleaseAnimation(button) {
        button.style.transform = 'scale(1)';
        button.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupParallaxEffects() {
        // Smooth parallax scrolling
        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            
            document.querySelectorAll('.parallax-slow').forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
            
            document.querySelectorAll('.parallax-medium').forEach(element => {
                const rate = scrolled * -0.3;
                element.style.transform = `translateY(${rate}px)`;
            });
            
            document.querySelectorAll('.parallax-fast').forEach(element => {
                const rate = scrolled * -0.1;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16)); // 60fps
    }

    setupLoadingAnimations() {
        // Skeleton loading animations
        this.createSkeletonLoader = (element) => {
            element.classList.add('skeleton-loading');
            element.innerHTML = `
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
            `;
        };

        // Progress bar animation
        this.animateProgressBar = (element, targetValue, duration = 1000) => {
            const startValue = 0;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = startValue + (targetValue - startValue) * this.easeOutCubic(progress);
                
                element.style.width = currentValue + '%';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        };
    }

    // Advanced easing functions
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.animations.forEach(animation => animation.cancel());
        this.observers.clear();
        this.animations.clear();
    }
}

// Export for global use
window.AnimationSystem = AnimationSystem;
