/**
 * Performance Polish - Comprehensive Optimization System
 * 
 * Implements lazy loading, code splitting, caching, and performance monitoring
 * to ensure MorningFlow runs smoothly on all devices.
 */

class PerformancePolish {
    constructor() {
        this.observers = new Map();
        this.cache = new Map();
        this.loadingStates = new Set();
        this.performanceMetrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0,
            memoryUsage: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupPerformanceMonitoring();
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupCodeSplitting();
        this.setupCaching();
        this.setupPreloading();
        this.setupIntersectionObserver();
        console.log('⚡ Performance Polish initialized');
    }
    
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics.lcp = lastEntry.startTime;
                console.log(`📊 LCP: ${lastEntry.startTime}ms`);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                    console.log(`📊 FID: ${this.performanceMetrics.fid}ms`);
                });
            }).observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift
            new PerformanceObserver((list) => {
                let clsValue = 0;
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.performanceMetrics.cls = clsValue;
                console.log(`📊 CLS: ${clsValue}`);
            }).observe({ entryTypes: ['layout-shift'] });
        }
        
        // Monitor memory usage
        this.monitorMemoryUsage();
        
        // Monitor long tasks
        this.monitorLongTasks();
    }
    
    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.performanceMetrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
                
                if (this.performanceMetrics.memoryUsage > 100) {
                    console.warn(`⚠️ High memory usage: ${this.performanceMetrics.memoryUsage.toFixed(2)}MB`);
                    this.triggerGarbageCollection();
                }
            }, 10000); // Check every 10 seconds
        }
    }
    
    monitorLongTasks() {
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 50) {
                        console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
                        this.optimizeLongTask(entry);
                    }
                });
            }).observe({ entryTypes: ['longtask'] });
        }
    }
    
    triggerGarbageCollection() {
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Clear caches
        this.clearOldCacheEntries();
        
        // Optimize DOM
        this.optimizeDOM();
    }
    
    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        if (images.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
        
        // Lazy load components
        const lazyComponents = document.querySelectorAll('[data-lazy-component]');
        if (lazyComponents.length > 0) {
            const componentObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadLazyComponent(entry.target);
                        componentObserver.unobserve(entry.target);
                    }
                });
            });
            
            lazyComponents.forEach(component => componentObserver.observe(component));
        }
    }
    
    setupImageOptimization() {
        // WebP support detection and fallback
        this.detectWebPSupport().then(supportsWebP => {
            if (supportsWebP) {
                document.documentElement.classList.add('webp');
            } else {
                document.documentElement.classList.add('no-webp');
            }
        });
        
        // Responsive images
        this.setupResponsiveImages();
    }
    
    async detectWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    setupResponsiveImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add blur placeholder
            if (!img.style.backgroundImage) {
                img.style.backgroundImage = 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)';
                img.style.backgroundSize = '20px 20px';
                img.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
            }
        });
    }
    
    setupCodeSplitting() {
        // Dynamic imports for heavy components
        this.setupDynamicImports();
        
        // Route-based code splitting
        this.setupRouteSplitting();
    }
    
    setupDynamicImports() {
        // Lazy load heavy components when needed
        const lazyLoaders = {
            'meditation-timer': () => import('./meditation-timer.js'),
            'workout-timer': () => import('./workout-timer.js'),
            'analytics': () => import('./analytics.js')
        };
        
        Object.entries(lazyLoaders).forEach(([key, loader]) => {
            window.addEventListener(`load-${key}`, async () => {
                try {
                    await loader();
                    console.log(`📦 Loaded ${key} dynamically`);
                } catch (error) {
                    console.error(`❌ Failed to load ${key}:`, error);
                }
            });
        });
    }
    
    setupRouteSplitting() {
        // Preload next likely route
        const routes = ['timer', 'journal', 'workout', 'gratitude', 'clarity'];
        const currentRoute = this.getCurrentRoute();
        
        routes.forEach(route => {
            if (route !== currentRoute) {
                this.preloadRoute(route);
            }
        });
    }
    
    setupCaching() {
        // Service Worker caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js', { scope: './' }).then(registration => {
                console.log('📦 Service Worker registered');
            }).catch(error => {
                console.error('❌ Service Worker registration failed:', error);
            });
        }
        
        // Memory caching for frequently accessed data
        this.setupMemoryCache();
    }
    
    setupMemoryCache() {
        const cacheConfig = {
            maxSize: 50, // Maximum number of entries
            maxAge: 5 * 60 * 1000, // 5 minutes
            cleanupInterval: 60 * 1000 // 1 minute
        };
        
        setInterval(() => {
            this.cleanupCache(cacheConfig);
        }, cacheConfig.cleanupInterval);
    }
    
    setupPreloading() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Preload next likely interactions
        this.preloadNextInteractions();
    }
    
    preloadCriticalResources() {
        const criticalResources = [
            '/assets/css/styles.css',
            '/assets/js/app.js',
            '/assets/js/navigation.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
    
    preloadNextInteractions() {
        // Preload likely next pages based on user behavior
        const likelyNextPages = ['timer', 'journal'];
        
        likelyNextPages.forEach(page => {
            this.preloadRoute(page);
        });
    }
    
    setupIntersectionObserver() {
        // Optimize animations based on visibility
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        if (animatedElements.length > 0) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            animatedElements.forEach(element => animationObserver.observe(element));
        }
    }
    
    loadLazyComponent(element) {
        const componentName = element.dataset.lazyComponent;
        const loadingState = element.dataset.loadingState || 'loading';
        
        this.setLoadingState(element, loadingState);
        
        // Simulate component loading
        setTimeout(() => {
            this.setLoadingState(element, 'loaded');
        }, 500);
    }
    
    setLoadingState(element, state) {
        element.setAttribute('data-loading-state', state);
        
        switch (state) {
            case 'loading':
                element.innerHTML = '<div class="loading-spinner"></div>';
                break;
            case 'loaded':
                element.classList.add('loaded');
                break;
            case 'error':
                element.innerHTML = '<div class="error-state">Failed to load</div>';
                break;
        }
    }
    
    preloadRoute(route) {
        const routeUrl = `assets/templates/${route}.html`;
        
        if (!this.cache.has(routeUrl)) {
            fetch(routeUrl)
                .then(response => response.text())
                .then(html => {
                    this.cache.set(routeUrl, html);
                    console.log(`📦 Preloaded route: ${route}`);
                })
                .catch(error => {
                    console.error(`❌ Failed to preload route ${route}:`, error);
                });
        }
    }
    
    getCurrentRoute() {
        const path = window.location.pathname;
        return path.split('/').pop().replace('.html', '') || 'home';
    }
    
    optimizeLongTask(entry) {
        // Split long tasks using setTimeout
        const tasks = this.identifyLongTasks(entry);
        
        tasks.forEach((task, index) => {
            setTimeout(() => {
                this.executeTask(task);
            }, index * 10); // Stagger execution
        });
    }
    
    identifyLongTasks(entry) {
        // Identify specific tasks causing long execution
        const tasks = [];
        
        // Example: Split DOM updates
        if (entry.name.includes('DOM')) {
            tasks.push('optimizeDOM');
        }
        
        // Example: Split data processing
        if (entry.name.includes('data')) {
            tasks.push('processData');
        }
        
        return tasks;
    }
    
    executeTask(taskName) {
        switch (taskName) {
            case 'optimizeDOM':
                this.optimizeDOM();
                break;
            case 'processData':
                this.processData();
                break;
        }
    }
    
    optimizeDOM() {
        // Remove unused DOM nodes
        const unusedNodes = document.querySelectorAll('[data-unused]');
        unusedNodes.forEach(node => node.remove());
        
        // Optimize event listeners
        this.optimizeEventListeners();
        
        // Optimize CSS
        this.optimizeCSS();
    }
    
    optimizeEventListeners() {
        // Use event delegation where possible
        const delegatedEvents = ['click', 'touchstart', 'touchend'];
        
        delegatedEvents.forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                const target = e.target.closest('[data-delegated]');
                if (target) {
                    this.handleDelegatedEvent(eventType, target, e);
                }
            });
        });
    }
    
    optimizeCSS() {
        // Remove unused CSS classes
        const usedClasses = new Set();
        document.querySelectorAll('*').forEach(element => {
            element.classList.forEach(className => usedClasses.add(className));
        });
        
        // Note: In a real implementation, you'd compare with CSS file
        console.log(`📊 Used CSS classes: ${usedClasses.size}`);
    }
    
    cleanupCache(config) {
        const now = Date.now();
        const entries = Array.from(this.cache.entries());
        
        entries.forEach(([key, value]) => {
            if (value.timestamp && (now - value.timestamp) > config.maxAge) {
                this.cache.delete(key);
            }
        });
        
        // Limit cache size
        if (this.cache.size > config.maxSize) {
            const oldestEntries = entries.slice(0, this.cache.size - config.maxSize);
            oldestEntries.forEach(([key]) => this.cache.delete(key));
        }
    }
    
    clearOldCacheEntries() {
        const maxAge = 10 * 60 * 1000; // 10 minutes
        const now = Date.now();
        
        this.cache.forEach((value, key) => {
            if (value.timestamp && (now - value.timestamp) > maxAge) {
                this.cache.delete(key);
            }
        });
    }
    
    processData() {
        // Process data in chunks to avoid blocking
        const data = this.getDataToProcess();
        const chunkSize = 100;
        
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            setTimeout(() => {
                this.processChunk(chunk);
            }, 0);
        }
    }
    
    getDataToProcess() {
        // Return data that needs processing
        return [];
    }
    
    processChunk(chunk) {
        // Process a chunk of data
        chunk.forEach(item => {
            // Process item
        });
    }
    
    handleDelegatedEvent(eventType, target, event) {
        // Handle delegated events
        const action = target.dataset.action;
        
        switch (action) {
            case 'navigate':
                this.handleNavigation(target, event);
                break;
            case 'toggle':
                this.handleToggle(target, event);
                break;
        }
    }
    
    handleNavigation(target, event) {
        const route = target.dataset.route;
        if (route) {
            window.navigationManager?.navigateToPage(route);
        }
    }
    
    handleToggle(target, event) {
        const toggleState = target.dataset.toggleState;
        target.dataset.toggleState = toggleState === 'on' ? 'off' : 'on';
    }
    
    // Public methods
    getPerformanceMetrics() {
        return this.performanceMetrics;
    }
    
    preloadComponent(componentName) {
        window.dispatchEvent(new CustomEvent(`load-${componentName}`));
    }
    
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }
    
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.performancePolish = new PerformancePolish();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformancePolish;
}
