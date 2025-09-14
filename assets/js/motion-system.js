/**
 * Comprehensive Motion System
 * Coordinates all animations, gestures, and interactions with advanced easing and timing
 */

class MotionSystem {
    constructor() {
        this.isEnabled = true;
        this.performanceMode = 'auto';
        this.motionPreferences = {
            reducedMotion: false,
            highPerformance: false,
            batteryOptimized: false
        };
        
        this.animationQueue = [];
        this.activeAnimations = new Map();
        this.motionHistory = [];
        this.maxHistoryLength = 50;
        
        this.easingFunctions = {
            // Spring-based easing
            spring: this.createSpringEasing.bind(this),
            springGentle: this.createSpringEasing.bind(this, 'gentle'),
            springMedium: this.createSpringEasing.bind(this, 'medium'),
            springStrong: this.createSpringEasing.bind(this, 'strong'),
            
            // Bezier-based easing
            easeInOut: this.createBezierEasing.bind(this, [0.4, 0.0, 0.2, 1]),
            easeOut: this.createBezierEasing.bind(this, [0.0, 0.0, 0.2, 1]),
            easeIn: this.createBezierEasing.bind(this, [0.4, 0.0, 1.0, 1]),
            
            // Custom easing
            bounce: this.createBounceEasing.bind(this),
            elastic: this.createElasticEasing.bind(this),
            back: this.createBackEasing.bind(this),
            
            // Physics-based easing
            physics: this.createPhysicsEasing.bind(this),
            magnetic: this.createMagneticEasing.bind(this),
            fluid: this.createFluidEasing.bind(this)
        };
        
        this.timingFunctions = {
            linear: (t) => t,
            ease: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeIn: (t) => t * t,
            easeOut: (t) => t * (2 - t),
            easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        };
        
        this.init();
    }

    init() {
        console.log('🌊 Initializing Comprehensive Motion System...');
        this.setupMotionPreferences();
        this.setupPerformanceMonitoring();
        this.setupMotionCoordination();
        this.setupMotionEvents();
        this.setupMotionControls();
        console.log('✅ Motion System initialized');
    }

    setupMotionPreferences() {
        // Detect user preferences
        this.motionPreferences.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.motionPreferences.highPerformance = this.detectHighPerformanceDevice();
        this.motionPreferences.batteryOptimized = this.detectBatteryOptimization();
        
        // Load saved preferences
        this.loadMotionPreferences();
        
        // Apply preferences
        this.applyMotionPreferences();
    }

    setupPerformanceMonitoring() {
        this.performanceMonitor = {
            frameRate: 0,
            lastFrameTime: 0,
            frameCount: 0,
            averageFrameTime: 0,
            isLowPerformance: false
        };
        
        this.startPerformanceMonitoring();
    }

    setupMotionCoordination() {
        // Coordinate with other motion systems
        this.coordinateWithGestureManager();
        this.coordinateWithPhysicsAnimations();
        this.coordinateWithHapticStorytelling();
        this.coordinateWithThemeManager();
    }

    setupMotionEvents() {
        // Listen for motion events
        window.addEventListener('motionStart', (event) => {
            this.onMotionStart(event.detail);
        });
        
        window.addEventListener('motionComplete', (event) => {
            this.onMotionComplete(event.detail);
        });
        
        window.addEventListener('motionCancel', (event) => {
            this.onMotionCancel(event.detail);
        });
        
        // Listen for system events
        window.addEventListener('visibilitychange', () => {
            this.onVisibilityChange();
        });
        
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }

    setupMotionControls() {
        // Create motion control interface
        this.createMotionControls();
    }

    // Performance Detection
    detectHighPerformanceDevice() {
        // Simple heuristic for high-performance devices
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const hasWebGL = !!gl;
        const hasHighDPI = window.devicePixelRatio > 1.5;
        const hasTouch = 'ontouchstart' in window;
        
        return hasWebGL && (hasHighDPI || hasTouch);
    }

    detectBatteryOptimization() {
        // Check if device is likely on battery power
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.motionPreferences.batteryOptimized = !battery.charging && battery.level < 0.2;
            });
        }
        
        // Fallback: assume battery optimization on mobile devices
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    startPerformanceMonitoring() {
        const monitor = () => {
            const now = performance.now();
            const deltaTime = now - this.performanceMonitor.lastFrameTime;
            
            if (this.performanceMonitor.lastFrameTime > 0) {
                this.performanceMonitor.frameCount++;
                this.performanceMonitor.averageFrameTime = 
                    (this.performanceMonitor.averageFrameTime * (this.performanceMonitor.frameCount - 1) + deltaTime) / 
                    this.performanceMonitor.frameCount;
                
                // Check for low performance
                if (this.performanceMonitor.averageFrameTime > 16.67) { // 60fps threshold
                    this.performanceMonitor.isLowPerformance = true;
                    this.adjustPerformanceMode();
                } else {
                    this.performanceMonitor.isLowPerformance = false;
                }
            }
            
            this.performanceMonitor.lastFrameTime = now;
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }

    // Motion Coordination
    coordinateWithGestureManager() {
        if (window.gestureManager) {
            window.gestureManager.addEventListener('gestureExecuted', (event) => {
                this.coordinateGestureMotion(event.detail);
            });
        }
    }

    coordinateWithPhysicsAnimations() {
        if (window.physicsAnimations) {
            // Coordinate physics animations with motion system
            this.physicsAnimations = window.physicsAnimations;
        }
    }

    coordinateWithHapticStorytelling() {
        if (window.hapticStorytelling) {
            // Coordinate haptic feedback with motion
            this.hapticStorytelling = window.hapticStorytelling;
        }
    }

    coordinateWithThemeManager() {
        if (window.themeManager) {
            // Coordinate theme transitions with motion
            this.themeManager = window.themeManager;
        }
    }

    // Easing Functions
    createSpringEasing(type = 'medium') {
        const configs = {
            gentle: { tension: 120, friction: 14 },
            medium: { tension: 200, friction: 20 },
            strong: { tension: 300, friction: 25 }
        };
        
        const config = configs[type] || configs.medium;
        
        return (t) => {
            // Simplified spring easing
            const tension = config.tension / 100;
            const friction = config.friction / 100;
            
            return 1 - Math.pow(2, -10 * t) * Math.cos((t * 10 - 0.75) * Math.PI * friction);
        };
    }

    createBezierEasing(bezier) {
        const [x1, y1, x2, y2] = bezier;
        
        return (t) => {
            // Cubic Bezier easing
            const cx = 3 * x1;
            const bx = 3 * (x2 - x1) - cx;
            const ax = 1 - cx - bx;
            
            const cy = 3 * y1;
            const by = 3 * (y2 - y1) - cy;
            const ay = 1 - cy - by;
            
            const solve = (x) => {
                let t2 = x;
                for (let i = 0; i < 8; i++) {
                    const x2 = ((ax * t2 + bx) * t2 + cx) * t2;
                    if (Math.abs(x2 - x) < 0.001) return t2;
                    t2 = t2 - (x2 - x) / (3 * ax * t2 * t2 + 2 * bx * t2 + cx);
                }
                return t2;
            };
            
            return ((ay * solve(t) + by) * solve(t) + cy) * solve(t);
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

    createPhysicsEasing() {
        return (t) => {
            // Physics-based easing with momentum
            const velocity = 0.5;
            const acceleration = -0.8;
            
            return velocity * t + 0.5 * acceleration * t * t;
        };
    }

    createMagneticEasing() {
        return (t) => {
            // Magnetic easing with attraction
            const attraction = 0.3;
            return t + attraction * Math.sin(t * Math.PI);
        };
    }

    createFluidEasing() {
        return (t) => {
            // Fluid easing with smooth transitions
            return t * t * (3 - 2 * t);
        };
    }

    // Animation Methods
    animate(element, properties, options = {}) {
        const animation = {
            element,
            properties,
            options: {
                duration: 600,
                easing: 'springMedium',
                delay: 0,
                fill: 'both',
                ...options
            },
            startTime: 0,
            id: this.generateAnimationId()
        };
        
        // Add to queue
        this.animationQueue.push(animation);
        
        // Start animation if not already running
        if (!this.isAnimating) {
            this.startAnimationLoop();
        }
        
        return animation.id;
    }

    animateSequence(animations, options = {}) {
        const sequence = {
            animations,
            options: {
                stagger: 100,
                ...options
            },
            currentIndex: 0,
            id: this.generateAnimationId()
        };
        
        this.executeSequence(sequence);
        return sequence.id;
    }

    animateStagger(elements, properties, options = {}) {
        const stagger = options.stagger || 100;
        const animations = elements.map((element, index) => ({
            element,
            properties,
            options: {
                ...options,
                delay: options.delay + (index * stagger)
            }
        }));
        
        return this.animateSequence(animations, options);
    }

    // Motion Coordination
    coordinateGestureMotion(gesture) {
        const motion = this.createGestureMotion(gesture);
        this.executeMotion(motion);
    }

    createGestureMotion(gesture) {
        switch (gesture.type) {
            case 'swipe':
                return this.createSwipeMotion(gesture);
            case 'circular':
                return this.createCircularMotion(gesture);
            case 'longPress':
                return this.createLongPressMotion(gesture);
            default:
                return null;
        }
    }

    createSwipeMotion(gesture) {
        return {
            type: 'swipe',
            direction: gesture.direction,
            intensity: gesture.confidence,
            duration: 600,
            easing: 'springMedium'
        };
    }

    createCircularMotion(gesture) {
        return {
            type: 'circular',
            direction: gesture.direction,
            intensity: gesture.confidence,
            duration: 800,
            easing: 'springStrong'
        };
    }

    createLongPressMotion(gesture) {
        return {
            type: 'longPress',
            duration: gesture.duration,
            intensity: gesture.confidence,
            easing: 'springGentle'
        };
    }

    // Motion Execution
    executeMotion(motion) {
        if (!motion) return;
        
        // Execute motion based on type
        switch (motion.type) {
            case 'swipe':
                this.executeSwipeMotion(motion);
                break;
            case 'circular':
                this.executeCircularMotion(motion);
                break;
            case 'longPress':
                this.executeLongPressMotion(motion);
                break;
        }
        
        // Add to motion history
        this.addToMotionHistory(motion);
        
        // Dispatch motion event
        window.dispatchEvent(new CustomEvent('motionExecuted', {
            detail: motion
        }));
    }

    executeSwipeMotion(motion) {
        const elements = document.querySelectorAll('.swipeable');
        elements.forEach(element => {
            this.animate(element, {
                transform: `translateX(${motion.direction === 'left' ? '-100%' : '100%'})`
            }, {
                duration: motion.duration,
                easing: motion.easing
            });
        });
    }

    executeCircularMotion(motion) {
        const elements = document.querySelectorAll('.circular-gesture');
        elements.forEach(element => {
            this.animate(element, {
                transform: `rotate(${motion.direction === 'clockwise' ? '360deg' : '-360deg'})`
            }, {
                duration: motion.duration,
                easing: motion.easing
            });
        });
    }

    executeLongPressMotion(motion) {
        const elements = document.querySelectorAll('.long-press-target');
        elements.forEach(element => {
            this.animate(element, {
                transform: 'scale(0.95)'
            }, {
                duration: motion.duration,
                easing: motion.easing
            });
        });
    }

    // Animation Loop
    startAnimationLoop() {
        this.isAnimating = true;
        this.animationLoop();
    }

    animationLoop() {
        const now = performance.now();
        
        // Process animation queue
        this.processAnimationQueue(now);
        
        // Update active animations
        this.updateActiveAnimations(now);
        
        // Continue loop if there are active animations
        if (this.activeAnimations.size > 0 || this.animationQueue.length > 0) {
            requestAnimationFrame(() => this.animationLoop());
        } else {
            this.isAnimating = false;
        }
    }

    processAnimationQueue(now) {
        const readyAnimations = this.animationQueue.filter(animation => {
            return now >= animation.startTime + (animation.options.delay || 0);
        });
        
        readyAnimations.forEach(animation => {
            this.startAnimation(animation, now);
        });
        
        // Remove started animations from queue
        this.animationQueue = this.animationQueue.filter(animation => {
            return now < animation.startTime + (animation.options.delay || 0);
        });
    }

    startAnimation(animation, now) {
        animation.startTime = now;
        animation.initialValues = this.getInitialValues(animation.element, animation.properties);
        animation.targetValues = animation.properties;
        
        this.activeAnimations.set(animation.id, animation);
    }

    updateActiveAnimations(now) {
        for (const [id, animation] of this.activeAnimations) {
            const elapsed = now - animation.startTime;
            const progress = Math.min(elapsed / animation.options.duration, 1);
            
            if (progress >= 1) {
                this.completeAnimation(animation);
                this.activeAnimations.delete(id);
            } else {
                this.updateAnimation(animation, progress);
            }
        }
    }

    updateAnimation(animation, progress) {
        const easing = this.easingFunctions[animation.options.easing] || this.easingFunctions.springMedium;
        const easedProgress = easing(progress);
        
        Object.keys(animation.targetValues).forEach(property => {
            const initialValue = animation.initialValues[property];
            const targetValue = animation.targetValues[property];
            const currentValue = this.interpolateValue(initialValue, targetValue, easedProgress);
            
            this.setProperty(animation.element, property, currentValue);
        });
    }

    completeAnimation(animation) {
        // Set final values
        Object.keys(animation.targetValues).forEach(property => {
            this.setProperty(animation.element, property, animation.targetValues[property]);
        });
        
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('motionComplete', {
            detail: { id: animation.id, element: animation.element }
        }));
    }

    // Utility Methods
    getInitialValues(element, properties) {
        const initialValues = {};
        const computedStyle = getComputedStyle(element);
        
        Object.keys(properties).forEach(property => {
            initialValues[property] = computedStyle.getPropertyValue(property);
        });
        
        return initialValues;
    }

    interpolateValue(initial, target, progress) {
        // Simple interpolation - in a real implementation, this would be more sophisticated
        if (typeof initial === 'number' && typeof target === 'number') {
            return initial + (target - initial) * progress;
        }
        
        // For string values, assume they're CSS values
        return target;
    }

    setProperty(element, property, value) {
        if (property.startsWith('--')) {
            element.style.setProperty(property, value);
        } else {
            element.style[property] = value;
        }
    }

    generateAnimationId() {
        return `motion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    addToMotionHistory(motion) {
        this.motionHistory.push({
            ...motion,
            timestamp: Date.now()
        });
        
        if (this.motionHistory.length > this.maxHistoryLength) {
            this.motionHistory.shift();
        }
    }

    // Performance Management
    adjustPerformanceMode() {
        if (this.performanceMonitor.isLowPerformance) {
            this.performanceMode = 'low';
            this.reduceMotionComplexity();
        } else {
            this.performanceMode = 'auto';
            this.restoreMotionComplexity();
        }
    }

    reduceMotionComplexity() {
        // Reduce animation complexity for better performance
        this.animationQueue = [];
        this.activeAnimations.clear();
        
        // Disable complex animations
        document.body.classList.add('reduced-motion');
    }

    restoreMotionComplexity() {
        // Restore full motion complexity
        document.body.classList.remove('reduced-motion');
    }

    // Motion Controls
    createMotionControls() {
        const controls = document.createElement('div');
        controls.className = 'motion-controls';
        controls.innerHTML = `
            <div class="motion-control-button" id="motion-toggle">
                <span>🌊</span>
            </div>
            <div class="motion-control-button" id="motion-settings">
                <span>⚙️</span>
            </div>
        `;
        
        document.body.appendChild(controls);
        
        // Add event listeners
        controls.querySelector('#motion-toggle').addEventListener('click', () => {
            this.toggleMotion();
        });
        
        controls.querySelector('#motion-settings').addEventListener('click', () => {
            this.showMotionSettings();
        });
    }

    // Event Handlers
    onMotionStart(detail) {
        console.log('🌊 Motion started:', detail);
    }

    onMotionComplete(detail) {
        console.log('🌊 Motion completed:', detail);
    }

    onMotionCancel(detail) {
        console.log('🌊 Motion cancelled:', detail);
    }

    onVisibilityChange() {
        if (document.hidden) {
            this.pauseAnimations();
        } else {
            this.resumeAnimations();
        }
    }

    onResize() {
        // Adjust animations for new screen size
        this.updateMotionSettings();
    }

    updateMotionSettings() {
        // Update motion settings based on current screen size and performance
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Adjust animation complexity based on screen size
        if (width < 768) {
            this.animationComplexity = 'low';
        } else if (width < 1200) {
            this.animationComplexity = 'medium';
        } else {
            this.animationComplexity = 'high';
        }
        
        // Update CSS custom properties for responsive animations
        document.documentElement.style.setProperty('--animation-duration', 
            this.animationComplexity === 'low' ? '0.3s' : 
            this.animationComplexity === 'medium' ? '0.5s' : '0.7s');
        
        console.log(`🎬 Motion settings updated for ${width}x${height} (${this.animationComplexity})`);
    }

    // Public API
    toggleMotion() {
        this.isEnabled = !this.isEnabled;
        if (!this.isEnabled) {
            this.pauseAnimations();
        } else {
            this.resumeAnimations();
        }
    }

    pauseAnimations() {
        this.animationQueue = [];
        this.activeAnimations.clear();
    }

    resumeAnimations() {
        // Resume animations if enabled
        if (this.isEnabled) {
            this.startAnimationLoop();
        }
    }

    showMotionSettings() {
        // Show motion settings modal
        console.log('⚙️ Showing motion settings');
    }

    loadMotionPreferences() {
        const saved = localStorage.getItem('motionPreferences');
        if (saved) {
            const preferences = JSON.parse(saved);
            this.motionPreferences = { ...this.motionPreferences, ...preferences };
        }
    }

    saveMotionPreferences() {
        localStorage.setItem('motionPreferences', JSON.stringify(this.motionPreferences));
    }

    applyMotionPreferences() {
        if (this.motionPreferences.reducedMotion) {
            this.reduceMotionComplexity();
        }
    }

    // Cleanup
    destroy() {
        this.pauseAnimations();
        this.animationQueue = [];
        this.activeAnimations.clear();
        this.motionHistory = [];
    }
}

// Initialize motion system
window.MotionSystem = MotionSystem;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.motionSystem = new MotionSystem();
    });
} else {
    window.motionSystem = new MotionSystem();
}
