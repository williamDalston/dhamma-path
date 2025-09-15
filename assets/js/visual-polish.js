/**
 * Visual Polish - Micro-interactions and Visual Enhancements
 * 
 * Implements smooth animations, loading states, hover effects, and
 * delightful micro-interactions to create a premium user experience.
 */

class VisualPolish {
    constructor() {
        this.animations = new Map();
        this.loadingStates = new Map();
        this.hoverEffects = new Map();
        this.transitionQueue = [];
        this.animationFrameId = null;
        
        this.init();
    }
    
    init() {
        this.setupLoadingStates();
        this.setupMicroInteractions();
        this.setupSmoothTransitions();
        this.setupHoverEffects();
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupMagneticElements();
        this.setupRippleEffects();
        this.setupShimmerEffects();
        this.setupProgressIndicators();
        console.log('🎨 Visual Polish initialized');
    }
    
    setupLoadingStates() {
        // Global loading overlay
        this.createLoadingOverlay();
        
        // Component-specific loading states
        this.setupComponentLoadingStates();
        
        // Skeleton loading for content
        this.setupSkeletonLoading();
    }
    
    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'global-loading-overlay';
        overlay.className = 'fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center';
        overlay.innerHTML = `
            <div class="loading-content text-center">
                <div class="loading-logo mb-6">
                    <div class="logo-animation w-16 h-16 mx-auto bg-gradient-to-r from-sage-deep to-forest-deep rounded-2xl animate-pulse"></div>
                </div>
                <div class="loading-text text-lg font-medium text-forest-deep mb-4">Loading MorningFlow</div>
                <div class="loading-progress w-48 h-1 bg-sage-deep/20 rounded-full mx-auto overflow-hidden">
                    <div class="loading-progress-fill h-full bg-gradient-to-r from-sage-deep to-forest-deep rounded-full animate-progress"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Hide overlay when everything is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            }, 1000);
        });
    }
    
    setupComponentLoadingStates() {
        const loadingComponents = [
            { selector: '.timer-display', skeleton: 'timer-skeleton' },
            { selector: '.journal-content', skeleton: 'journal-skeleton' },
            { selector: '.gratitude-inputs', skeleton: 'gratitude-skeleton' }
        ];
        
        loadingComponents.forEach(component => {
            const elements = document.querySelectorAll(component.selector);
            elements.forEach(element => {
                this.addLoadingSkeleton(element, component.skeleton);
            });
        });
    }
    
    setupSkeletonLoading() {
        const skeletonStyles = `
            <style id="skeleton-styles">
                .skeleton {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                }
                
                .timer-skeleton {
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                }
                
                .journal-skeleton {
                    width: 100%;
                    height: 300px;
                    border-radius: 12px;
                }
                
                .gratitude-skeleton {
                    width: 100%;
                    height: 60px;
                    border-radius: 12px;
                    margin-bottom: 1rem;
                }
                
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                
                @keyframes animate-progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                
                .logo-animation {
                    animation: logo-float 3s ease-in-out infinite;
                }
                
                @keyframes logo-float {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-10px) scale(1.05); }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', skeletonStyles);
    }
    
    addLoadingSkeleton(element, skeletonType) {
        if (element.dataset.loadingState === 'loaded') return;
        
        element.dataset.loadingState = 'loading';
        const originalContent = element.innerHTML;
        element.innerHTML = `<div class="skeleton ${skeletonType}"></div>`;
        
        // Simulate loading
        setTimeout(() => {
            element.dataset.loadingState = 'loaded';
            element.innerHTML = originalContent;
            this.animateContentIn(element);
        }, 1500);
    }
    
    setupMicroInteractions() {
        // Button micro-interactions
        this.setupButtonInteractions();
        
        // Input micro-interactions
        this.setupInputInteractions();
        
        // Card micro-interactions
        this.setupCardInteractions();
        
        // Icon micro-interactions
        this.setupIconInteractions();
    }
    
    setupButtonInteractions() {
        const buttons = document.querySelectorAll('button, .btn, [role="button"]');
        
        buttons.forEach(button => {
            // Add ripple effect
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
            
            // Add magnetic effect
            button.addEventListener('mousemove', (e) => {
                this.createMagneticEffect(e, button);
            });
            
            // Add hover glow
            button.addEventListener('mouseenter', () => {
                this.addHoverGlow(button);
            });
            
            button.addEventListener('mouseleave', () => {
                this.removeHoverGlow(button);
            });
        });
    }
    
    setupInputInteractions() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Floating label effect
            this.setupFloatingLabel(input);
            
            // Focus glow effect
            input.addEventListener('focus', () => {
                this.addFocusGlow(input);
            });
            
            input.addEventListener('blur', () => {
                this.removeFocusGlow(input);
            });
            
            // Character count animation
            if (input.hasAttribute('maxlength')) {
                this.setupCharacterCount(input);
            }
        });
    }
    
    setupCardInteractions() {
        const cards = document.querySelectorAll('.card, .glass-card, .wisdom-card');
        
        cards.forEach(card => {
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                this.createTiltEffect(e, card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetTiltEffect(card);
            });
            
            // Hover scale effect
            card.addEventListener('mouseenter', () => {
                this.addScaleEffect(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeScaleEffect(card);
            });
        });
    }
    
    setupIconInteractions() {
        const icons = document.querySelectorAll('.icon, [data-icon]');
        
        icons.forEach(icon => {
            // Bounce animation on click
            icon.addEventListener('click', () => {
                this.addBounceAnimation(icon);
            });
            
            // Hover rotation
            icon.addEventListener('mouseenter', () => {
                this.addRotationEffect(icon);
            });
            
            icon.addEventListener('mouseleave', () => {
                this.removeRotationEffect(icon);
            });
        });
    }
    
    setupSmoothTransitions() {
        // Page transitions
        this.setupPageTransitions();
        
        // Element transitions
        this.setupElementTransitions();
        
        // State transitions
        if (typeof this.setupStateTransitions === 'function') {
            this.setupStateTransitions();
        } else {
            console.warn('setupStateTransitions not available yet, retrying...');
            setTimeout(() => this.setupStateTransitions(), 100);
        }
    }
    
    setupStateTransitions() {
        // Setup smooth state transitions
        console.log('✨ State transitions initialized');
    }
    
    setupPageTransitions() {
        // Fade in animation for page content
        const pageContent = document.querySelector('.page-content, main, .content');
        
        if (pageContent) {
            pageContent.style.opacity = '0';
            pageContent.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                pageContent.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                pageContent.style.opacity = '1';
                pageContent.style.transform = 'translateY(0)';
            });
        }
    }
    
    setupElementTransitions() {
        // Staggered animation for lists
        const lists = document.querySelectorAll('ul, ol, .list');
        
        lists.forEach(list => {
            const items = list.children;
            Array.from(items).forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    }
    
    setupHoverEffects() {
        // Text hover effects
        this.setupTextHoverEffects();
        
        // Image hover effects
        this.setupImageHoverEffects();
        
        // Background hover effects
        this.setupBackgroundHoverEffects();
    }
    
    setupBackgroundHoverEffects() {
        // Add subtle background hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('button, .btn, .card, .interactive');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transition = 'background-color 0.2s ease';
                element.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            });
            element.addEventListener('mouseleave', () => {
                element.style.backgroundColor = '';
            });
        });
    }

    setupTextHoverEffects() {
        const textElements = document.querySelectorAll('h1, h2, h3, .title, .heading');
        
        textElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addTextGlow(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.removeTextGlow(element);
            });
        });
    }
    
    setupImageHoverEffects() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('mouseenter', () => {
                this.addImageZoom(img);
            });
            
            img.addEventListener('mouseleave', () => {
                this.removeImageZoom(img);
            });
        });
    }
    
    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElementOnScroll(entry.target);
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements with scroll animation data attributes
        const scrollElements = document.querySelectorAll('[data-scroll-animate]');
        scrollElements.forEach(element => scrollObserver.observe(element));
    }
    
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', () => {
                this.updateParallaxElements(parallaxElements);
            });
        }
    }
    
    setupMagneticElements() {
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.createMagneticEffect(e, element);
            });
        });
    }
    
    setupRippleEffects() {
        // Ripple effect styles
        const rippleStyles = `
            <style id="ripple-styles">
                .ripple-container {
                    position: relative;
                    overflow: hidden;
                }
                
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                }
                
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', rippleStyles);
    }
    
    setupShimmerEffects() {
        // Shimmer effect styles
        const shimmerStyles = `
            <style id="shimmer-styles">
                .shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }
                
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', shimmerStyles);
    }
    
    setupProgressIndicators() {
        // Progress bar animations
        const progressBars = document.querySelectorAll('.progress-bar, [data-progress]');
        
        progressBars.forEach(bar => {
            const progress = bar.dataset.progress || 0;
            this.animateProgressBar(bar, progress);
        });
    }
    
    // Animation methods
    createRippleEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.classList.add('ripple-container');
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    createMagneticEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < 100) {
            const strength = (100 - distance) / 100;
            const moveX = deltaX * strength * 0.1;
            const moveY = deltaY * strength * 0.1;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
            element.style.transform = 'translate(0, 0)';
        }
    }
    
    addHoverGlow(element) {
        element.style.boxShadow = '0 0 20px rgba(122, 155, 122, 0.3)';
        element.style.transform = 'translateY(-2px)';
    }
    
    removeHoverGlow(element) {
        element.style.boxShadow = '';
        element.style.transform = '';
    }
    
    setupFloatingLabel(input) {
        const label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            input.addEventListener('focus', () => {
                label.classList.add('floating');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.classList.remove('floating');
                }
            });
            
            if (input.value) {
                label.classList.add('floating');
            }
        }
    }
    
    addFocusGlow(input) {
        input.style.boxShadow = '0 0 0 3px rgba(122, 155, 122, 0.2)';
        input.style.borderColor = 'var(--sage-deep)';
    }
    
    removeFocusGlow(input) {
        input.style.boxShadow = '';
        input.style.borderColor = '';
    }
    
    setupCharacterCount(input) {
        const maxLength = parseInt(input.getAttribute('maxlength'));
        const counter = document.createElement('div');
        counter.className = 'character-count';
        counter.style.cssText = `
            position: absolute;
            bottom: -20px;
            right: 0;
            font-size: 12px;
            color: #666;
            transition: color 0.3s ease;
        `;
        
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(counter);
        
        input.addEventListener('input', () => {
            const count = input.value.length;
            counter.textContent = `${count}/${maxLength}`;
            
            if (count > maxLength * 0.9) {
                counter.style.color = '#e74c3c';
            } else {
                counter.style.color = '#666';
            }
        });
    }
    
    createTiltEffect(event, card) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;
        
        const rotateX = (deltaY / rect.height) * 10;
        const rotateY = (deltaX / rect.width) * -10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }
    
    resetTiltEffect(card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
    
    addScaleEffect(element) {
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.3s ease';
    }
    
    removeScaleEffect(element) {
        element.style.transform = 'scale(1)';
    }
    
    addBounceAnimation(element) {
        element.style.animation = 'bounce 0.6s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }
    
    addRotationEffect(element) {
        element.style.transform = 'rotate(10deg)';
        element.style.transition = 'transform 0.3s ease';
    }
    
    removeRotationEffect(element) {
        element.style.transform = 'rotate(0deg)';
    }
    
    addTextGlow(element) {
        element.style.textShadow = '0 0 10px rgba(122, 155, 122, 0.5)';
        element.style.transition = 'text-shadow 0.3s ease';
    }
    
    removeTextGlow(element) {
        element.style.textShadow = '';
    }
    
    addImageZoom(img) {
        img.style.transform = 'scale(1.1)';
        img.style.transition = 'transform 0.3s ease';
    }
    
    removeImageZoom(img) {
        img.style.transform = 'scale(1)';
    }
    
    animateElementOnScroll(element) {
        const animationType = element.dataset.scrollAnimate || 'fade-up';
        
        switch (animationType) {
            case 'fade-up':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
            case 'fade-left':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
            case 'fade-right':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
            case 'scale':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                break;
        }
    }
    
    updateParallaxElements(elements) {
        const scrollY = window.scrollY;
        
        elements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    animateProgressBar(bar, progress) {
        const fill = bar.querySelector('.progress-fill') || bar;
        const targetWidth = progress + '%';
        
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, 500);
    }
    
    animateContentIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    // Public methods
    addShimmerEffect(element) {
        element.classList.add('shimmer');
    }
    
    removeShimmerEffect(element) {
        element.classList.remove('shimmer');
    }
    
    animateElement(element, animationType) {
        const animations = {
            'fade-in': { opacity: '1', transform: 'translateY(0)' },
            'slide-in-left': { opacity: '1', transform: 'translateX(0)' },
            'slide-in-right': { opacity: '1', transform: 'translateX(0)' },
            'scale-in': { opacity: '1', transform: 'scale(1)' },
            'bounce': { animation: 'bounce 0.6s ease' }
        };
        
        const animation = animations[animationType];
        if (animation) {
            Object.assign(element.style, animation);
        }
    }
    
    createCustomAnimation(element, keyframes, duration = 1000) {
        const animation = element.animate(keyframes, {
            duration: duration,
            easing: 'ease-out',
            fill: 'forwards'
        });
        
        return animation;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.visualPolish = new VisualPolish();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualPolish;
}
