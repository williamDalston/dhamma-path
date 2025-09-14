/**
 * Mobile Performance Optimization System
 * Optimizes performance for mobile devices and slower connections
 */

class MobilePerformanceOptimizer {
    constructor() {
        this.isEnabled = true;
        this.connectionType = 'unknown';
        this.deviceCapabilities = {
            isMobile: false,
            isLowEnd: false,
            hasTouch: false,
            hasHaptic: false,
            memory: 0,
            cores: 0
        };
        
        this.performanceSettings = {
            animationQuality: 'high',
            imageQuality: 'high',
            preloadResources: true,
            enableHaptics: true,
            enableGestures: true,
            enablePhysics: true,
            enableAmbientEffects: true
        };
        
        this.optimizationStrategies = {
            lazyLoading: true,
            imageOptimization: true,
            animationThrottling: true,
            memoryManagement: true,
            networkOptimization: true,
            batteryOptimization: true
        };
        
        this.init();
    }

    init() {
        console.log('📱 Initializing Mobile Performance Optimizer...');
        this.detectDeviceCapabilities();
        this.detectConnectionType();
        this.setupPerformanceMonitoring();
        this.applyOptimizations();
        this.setupAdaptiveOptimization();
        console.log('✅ Mobile Performance Optimizer initialized');
    }

    detectDeviceCapabilities() {
        // Detect mobile device
        this.deviceCapabilities.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Detect touch capability
        this.deviceCapabilities.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Detect haptic capability
        this.deviceCapabilities.hasHaptic = 'vibrate' in navigator;
        
        // Detect device memory
        if ('deviceMemory' in navigator) {
            this.deviceCapabilities.memory = navigator.deviceMemory;
        }
        
        // Detect CPU cores
        if ('hardwareConcurrency' in navigator) {
            this.deviceCapabilities.cores = navigator.hardwareConcurrency;
        }
        
        // Determine if device is low-end
        this.deviceCapabilities.isLowEnd = this.isLowEndDevice();
        
        console.log('📱 Device capabilities detected:', this.deviceCapabilities);
    }

    detectConnectionType() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.connectionType = connection.effectiveType || connection.type || 'unknown';
            
            // Adjust settings based on connection
            this.adjustSettingsForConnection();
        }
        
        console.log('📱 Connection type detected:', this.connectionType);
    }

    setupPerformanceMonitoring() {
        // Monitor performance metrics
        this.setupMemoryMonitoring();
        this.setupBatteryMonitoring();
        this.setupNetworkMonitoring();
        this.setupFrameRateMonitoring();
    }

    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize;
                
                if (memoryUsage > 0.8) {
                    this.triggerMemoryOptimization();
                }
            }, 5000);
        }
    }

    setupBatteryMonitoring() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                setInterval(() => {
                    if (battery.level < 0.2) {
                        this.triggerBatteryOptimization();
                    }
                }, 10000);
            });
        }
    }

    setupNetworkMonitoring() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            connection.addEventListener('change', () => {
                this.connectionType = connection.effectiveType || connection.type || 'unknown';
                this.adjustSettingsForConnection();
            });
        }
    }

    setupFrameRateMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFrameRate = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    this.triggerPerformanceOptimization();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFrameRate);
        };
        
        requestAnimationFrame(measureFrameRate);
    }

    setupAdaptiveOptimization() {
        // Adaptive optimization based on real-time performance
        setInterval(() => {
            this.performAdaptiveOptimization();
        }, 30000); // Every 30 seconds
    }

    applyOptimizations() {
        // Apply initial optimizations based on device capabilities
        if (this.deviceCapabilities.isLowEnd) {
            this.applyLowEndOptimizations();
        }
        
        if (this.deviceCapabilities.isMobile) {
            this.applyMobileOptimizations();
        }
        
        if (this.connectionType === 'slow-2g' || this.connectionType === '2g') {
            this.applySlowConnectionOptimizations();
        }
    }

    applyLowEndOptimizations() {
        console.log('📱 Applying low-end device optimizations...');
        
        // Reduce animation quality
        this.performanceSettings.animationQuality = 'low';
        
        // Disable heavy effects
        this.performanceSettings.enableAmbientEffects = false;
        this.performanceSettings.enablePhysics = false;
        
        // Reduce image quality
        this.performanceSettings.imageQuality = 'low';
        
        // Disable preloading
        this.performanceSettings.preloadResources = false;
        
        // Apply CSS optimizations
        this.applyCSSOptimizations('low-end');
        
        // Apply JavaScript optimizations
        this.applyJavaScriptOptimizations('low-end');
    }

    applyMobileOptimizations() {
        console.log('📱 Applying mobile device optimizations...');
        
        // Optimize for mobile
        this.performanceSettings.animationQuality = 'medium';
        this.performanceSettings.imageQuality = 'medium';
        
        // Apply CSS optimizations
        this.applyCSSOptimizations('mobile');
        
        // Apply JavaScript optimizations
        this.applyJavaScriptOptimizations('mobile');
    }

    applySlowConnectionOptimizations() {
        console.log('📱 Applying slow connection optimizations...');
        
        // Disable preloading
        this.performanceSettings.preloadResources = false;
        
        // Reduce image quality
        this.performanceSettings.imageQuality = 'low';
        
        // Disable heavy effects
        this.performanceSettings.enableAmbientEffects = false;
        
        // Apply network optimizations
        this.applyNetworkOptimizations();
    }

    applyCSSOptimizations(deviceType) {
        const style = document.createElement('style');
        style.id = 'mobile-performance-optimizations';
        
        let css = '';
        
        if (deviceType === 'low-end') {
            css = `
                /* Low-end device optimizations */
                * {
                    will-change: auto !important;
                }
                
                .animate-fade-up,
                .animate-fade-in,
                .animate-slide-up,
                .animate-bounce,
                .animate-pulse {
                    animation: none !important;
                }
                
                .glass,
                .glass-control,
                .glass-modal {
                    backdrop-filter: none !important;
                    background: rgba(255, 255, 255, 0.9) !important;
                }
                
                .ambient-feedback {
                    display: none !important;
                }
                
                .haptic-indicator {
                    display: none !important;
                }
            `;
        } else if (deviceType === 'mobile') {
            css = `
                /* Mobile device optimizations */
                .animate-fade-up,
                .animate-fade-in,
                .animate-slide-up {
                    animation-duration: 0.3s !important;
                }
                
                .glass,
                .glass-control,
                .glass-modal {
                    backdrop-filter: blur(5px) !important;
                }
                
                .ambient-feedback {
                    opacity: 0.7 !important;
                }
            `;
        }
        
        style.textContent = css;
        document.head.appendChild(style);
    }

    applyJavaScriptOptimizations(deviceType) {
        if (deviceType === 'low-end') {
            // Disable heavy JavaScript features
            if (window.physicsAnimations) {
                window.physicsAnimations.setEnabled(false);
            }
            
            if (window.hapticStorytelling) {
                window.hapticStorytelling.setEnabled(false);
            }
            
            if (window.motionSystem) {
                window.motionSystem.setEnabled(false);
            }
        } else if (deviceType === 'mobile') {
            // Optimize JavaScript for mobile
            if (window.physicsAnimations && typeof window.physicsAnimations.setQuality === 'function') {
                window.physicsAnimations.setQuality('medium');
            }
            
            if (window.hapticStorytelling) {
                window.hapticStorytelling.setIntensity('light');
            }
        }
    }

    applyNetworkOptimizations() {
        // Implement lazy loading
        if (this.optimizationStrategies.lazyLoading) {
            this.setupLazyLoading();
        }
        
        // Optimize images
        if (this.optimizationStrategies.imageOptimization) {
            this.optimizeImages();
        }
        
        // Implement service worker caching
        this.setupServiceWorkerCaching();
    }

    setupLazyLoading() {
        // Implement lazy loading for images and content
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    optimizeImages() {
        // Optimize images based on connection and device
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (this.connectionType === 'slow-2g' || this.connectionType === '2g') {
                // Use low-quality images for slow connections
                img.src = img.src.replace('.jpg', '_low.jpg').replace('.png', '_low.png');
            } else if (this.deviceCapabilities.isLowEnd) {
                // Use medium-quality images for low-end devices
                img.src = img.src.replace('.jpg', '_med.jpg').replace('.png', '_med.png');
            }
        });
    }

    setupServiceWorkerCaching() {
        // Setup service worker for caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/dhamma-path/sw.js', { scope: '/dhamma-path/' }).then(registration => {
                console.log('📱 Service Worker registered:', registration);
            }).catch(error => {
                console.log('📱 Service Worker registration failed:', error);
            });
        }
    }

    performAdaptiveOptimization() {
        // Perform adaptive optimization based on current performance
        const performanceMetrics = this.getPerformanceMetrics();
        
        if (performanceMetrics.memoryUsage > 0.8) {
            this.triggerMemoryOptimization();
        }
        
        if (performanceMetrics.frameRate < 30) {
            this.triggerPerformanceOptimization();
        }
        
        if (performanceMetrics.networkLatency > 1000) {
            this.triggerNetworkOptimization();
        }
    }

    getPerformanceMetrics() {
        const metrics = {
            memoryUsage: 0,
            frameRate: 0,
            networkLatency: 0
        };
        
        // Get memory usage
        if ('memory' in performance) {
            const memory = performance.memory;
            metrics.memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize;
        }
        
        // Get frame rate (simplified)
        metrics.frameRate = 60; // Placeholder
        
        // Get network latency (simplified)
        metrics.networkLatency = 100; // Placeholder
        
        return metrics;
    }

    triggerMemoryOptimization() {
        // Debounce memory optimization
        if (this._memoryOptimizationTimeout) {
            clearTimeout(this._memoryOptimizationTimeout);
        }
        
        this._memoryOptimizationTimeout = setTimeout(() => {
            console.log('🧠 Memory optimization applied');
            
            // Clear unused resources
            this.clearUnusedResources();
            
            // Reduce animation quality
            this.performanceSettings.animationQuality = 'low';
            
            // Disable ambient effects
            this.performanceSettings.enableAmbientEffects = false;
            
            // Apply optimizations
            this.applyOptimizations();
        }, 1500); // 1.5 second debounce
    }

    triggerBatteryOptimization() {
        console.log('📱 Triggering battery optimization...');
        
        // Disable haptics
        this.performanceSettings.enableHaptics = false;
        
        // Reduce animation quality
        this.performanceSettings.animationQuality = 'low';
        
        // Disable ambient effects
        this.performanceSettings.enableAmbientEffects = false;
        
        // Apply optimizations
        this.applyOptimizations();
    }

    triggerPerformanceOptimization() {
        console.log('📱 Triggering performance optimization...');
        
        // Reduce animation quality
        this.performanceSettings.animationQuality = 'low';
        
        // Disable physics
        this.performanceSettings.enablePhysics = false;
        
        // Disable ambient effects
        this.performanceSettings.enableAmbientEffects = false;
        
        // Apply optimizations
        this.applyOptimizations();
    }

    triggerNetworkOptimization() {
        console.log('📱 Triggering network optimization...');
        
        // Disable preloading
        this.performanceSettings.preloadResources = false;
        
        // Reduce image quality
        this.performanceSettings.imageQuality = 'low';
        
        // Apply optimizations
        this.applyOptimizations();
    }

    clearUnusedResources() {
        // Clear unused DOM elements
        const unusedElements = document.querySelectorAll('.unused, .hidden');
        unusedElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        
        // Clear unused event listeners
        // This would require more sophisticated tracking
        
        // Clear unused data
        if (window.localStorage) {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('temp_') || key.startsWith('cache_')) {
                    localStorage.removeItem(key);
                }
            });
        }
    }

    adjustSettingsForConnection() {
        switch (this.connectionType) {
            case 'slow-2g':
            case '2g':
                this.performanceSettings.preloadResources = false;
                this.performanceSettings.imageQuality = 'low';
                this.performanceSettings.enableAmbientEffects = false;
                break;
                
            case '3g':
                this.performanceSettings.preloadResources = false;
                this.performanceSettings.imageQuality = 'medium';
                this.performanceSettings.enableAmbientEffects = false;
                break;
                
            case '4g':
                this.performanceSettings.preloadResources = true;
                this.performanceSettings.imageQuality = 'high';
                this.performanceSettings.enableAmbientEffects = true;
                break;
                
            default:
                this.performanceSettings.preloadResources = true;
                this.performanceSettings.imageQuality = 'high';
                this.performanceSettings.enableAmbientEffects = true;
                break;
        }
        
        this.applyOptimizations();
    }

    isLowEndDevice() {
        // Determine if device is low-end based on capabilities
        let score = 0;
        
        // Memory check
        if (this.deviceCapabilities.memory < 2) score += 2;
        else if (this.deviceCapabilities.memory < 4) score += 1;
        
        // CPU cores check
        if (this.deviceCapabilities.cores < 4) score += 2;
        else if (this.deviceCapabilities.cores < 8) score += 1;
        
        // Mobile device check
        if (this.deviceCapabilities.isMobile) score += 1;
        
        // Connection check
        if (this.connectionType === 'slow-2g' || this.connectionType === '2g') score += 2;
        else if (this.connectionType === '3g') score += 1;
        
        return score >= 3;
    }

    // Public API
    getPerformanceSettings() {
        return { ...this.performanceSettings };
    }

    getDeviceCapabilities() {
        return { ...this.deviceCapabilities };
    }

    getConnectionType() {
        return this.connectionType;
    }

    setPerformanceSetting(setting, value) {
        if (this.performanceSettings.hasOwnProperty(setting)) {
            this.performanceSettings[setting] = value;
            this.applyOptimizations();
        }
    }

    setOptimizationStrategy(strategy, enabled) {
        if (this.optimizationStrategies.hasOwnProperty(strategy)) {
            this.optimizationStrategies[strategy] = enabled;
            this.applyOptimizations();
        }
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
    }

    // Cleanup
    destroy() {
        // Remove performance optimization styles
        const style = document.getElementById('mobile-performance-optimizations');
        if (style) {
            style.remove();
        }
    }
}

// Initialize mobile performance optimizer
window.MobilePerformanceOptimizer = MobilePerformanceOptimizer;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobilePerformanceOptimizer = new MobilePerformanceOptimizer();
    });
} else {
    window.mobilePerformanceOptimizer = new MobilePerformanceOptimizer();
}
