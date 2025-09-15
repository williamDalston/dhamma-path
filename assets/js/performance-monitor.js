/**
 * PERFORMANCE MONITOR - Advanced Performance Tracking & Optimization
 * 
 * Monitors performance metrics and automatically optimizes the application
 * to prevent console issues and improve user experience.
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            longTasks: [],
            memoryUsage: 0,
            networkRequests: 0,
            errors: 0
        };
        
        this.thresholds = {
            loadTime: 3000,        // 3 seconds
            firstPaint: 1000,      // 1 second
            lcp: 2500,             // 2.5 seconds
            cls: 0.1,              // 0.1
            fid: 100,              // 100ms
            longTask: 50,          // 50ms
            memory: 50 * 1024 * 1024 // 50MB
        };
        
        this.optimizations = new Map();
        this.setupMonitoring();
        this.startOptimization();
        
        console.log('📊 Performance Monitor initialized');
    }

    setupMonitoring() {
        // Core Web Vitals monitoring
        this.observeWebVitals();
        
        // Long task monitoring
        this.observeLongTasks();
        
        // Memory monitoring
        this.observeMemory();
        
        // Network monitoring
        this.observeNetwork();
        
        // Error monitoring
        this.observeErrors();
        
        // Page load monitoring
        this.observePageLoad();
    }

    observeWebVitals() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.largestContentfulPaint = lastEntry.startTime;
                    this.checkThreshold('lcp', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP observer not supported');
            }

            // Cumulative Layout Shift
            try {
                const clsObserver = new PerformanceObserver((list) => {
                    let clsValue = 0;
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    this.metrics.cumulativeLayoutShift = clsValue;
                    this.checkThreshold('cls', clsValue);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('CLS observer not supported');
            }

            // First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                        this.checkThreshold('fid', this.metrics.firstInputDelay);
                    }
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('FID observer not supported');
            }
        }
    }

    observeLongTasks() {
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        const duration = entry.duration;
                        this.metrics.longTasks.push({
                            duration,
                            startTime: entry.startTime,
                            name: entry.name
                        });
                        
                        this.checkThreshold('longTask', duration);
                        this.optimizeLongTask(entry);
                    }
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                console.warn('Long task observer not supported');
            }
        }
    }

    observeMemory() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.metrics.memoryUsage = memory.usedJSHeapSize;
                this.checkThreshold('memory', memory.usedJSHeapSize);
                
                // Auto-optimize if memory usage is high
                if (memory.usedJSHeapSize > this.thresholds.memory) {
                    this.optimizeMemory();
                }
            }, 5000);
        }
    }

    observeNetwork() {
        if ('PerformanceObserver' in window) {
            try {
                const networkObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.metrics.networkRequests++;
                        
                        // Check for slow requests
                        if (entry.duration > 2000) {
                            this.optimizeSlowRequest(entry);
                        }
                    }
                });
                networkObserver.observe({ entryTypes: ['resource'] });
            } catch (e) {
                console.warn('Network observer not supported');
            }
        }
    }

    observeErrors() {
        window.addEventListener('error', () => {
            this.metrics.errors++;
            this.checkThreshold('errors', this.metrics.errors);
        });
        
        window.addEventListener('unhandledrejection', () => {
            this.metrics.errors++;
            this.checkThreshold('errors', this.metrics.errors);
        });
    }

    observePageLoad() {
        window.addEventListener('load', () => {
            // Measure load time
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                this.checkThreshold('loadTime', this.metrics.loadTime);
            }
            
            // Measure First Paint
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    this.metrics.firstPaint = entry.startTime;
                    this.checkThreshold('firstPaint', entry.startTime);
                }
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaint = entry.startTime;
                }
            });
        });
    }

    checkThreshold(metric, value) {
        const threshold = this.thresholds[metric];
        if (value > threshold) {
            console.warn(`⚠️ Performance threshold exceeded: ${metric} (${value} > ${threshold})`);
            this.triggerOptimization(metric, value);
        }
    }

    triggerOptimization(metric, value) {
        switch (metric) {
            case 'longTask':
                this.optimizeLongTask({ duration: value });
                break;
            case 'memory':
                this.optimizeMemory();
                break;
            case 'lcp':
                this.optimizeLCP();
                break;
            case 'cls':
                this.optimizeCLS();
                break;
            case 'fid':
                this.optimizeFID();
                break;
            case 'loadTime':
                this.optimizeLoadTime();
                break;
            case 'errors':
                this.optimizeErrors();
                break;
        }
    }

    optimizeLongTask(task) {
        console.log(`🔧 Optimizing long task (${task.duration}ms)`);
        
        // Force garbage collection
        if (window.gc) {
            window.gc();
        }
        
        // Defer non-critical work
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                // Clean up unused objects
                this.cleanupUnusedObjects();
            });
        }
        
        // Reduce animation quality
        if (window.physicsAnimations) {
            window.physicsAnimations.setQuality('low');
        }
    }

    optimizeMemory() {
        console.log('🔧 Optimizing memory usage');
        
        // Clear unused caches
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (name.includes('temp') || name.includes('cache')) {
                        caches.delete(name);
                    }
                });
            });
        }
        
        // Clear analytics data
        if (window.analytics && window.analytics.events) {
            const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
            window.analytics.events = window.analytics.events.filter(
                event => event.timestamp > twoMinutesAgo
            );
        }
        
        // Force garbage collection
        if (window.gc) {
            window.gc();
        }
    }

    optimizeLCP() {
        console.log('🔧 Optimizing Largest Contentful Paint');
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Optimize images
        this.optimizeImages();
        
        // Reduce JavaScript execution
        this.deferNonCriticalJS();
    }

    optimizeCLS() {
        console.log('🔧 Optimizing Cumulative Layout Shift');
        
        // Reserve space for dynamic content
        this.reserveSpaceForDynamicContent();
        
        // Optimize font loading
        this.optimizeFontLoading();
    }

    optimizeFID() {
        console.log('🔧 Optimizing First Input Delay');
        
        // Reduce JavaScript execution time
        this.splitHeavyTasks();
        
        // Optimize event handlers
        this.optimizeEventHandlers();
    }

    optimizeLoadTime() {
        console.log('🔧 Optimizing load time');
        
        // Enable compression
        this.enableCompression();
        
        // Optimize resource loading
        this.optimizeResourceLoading();
    }

    optimizeErrors() {
        console.log('🔧 Optimizing error handling');
        
        // Implement retry logic
        this.implementRetryLogic();
        
        // Add fallbacks
        this.addFallbacks();
    }

    // Optimization implementations
    preloadCriticalResources() {
        const criticalResources = [
            'assets/css/critical.css',
            'assets/css/styles.css',
            'assets/js/app.js',
            'assets/js/navigation.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = window.assetURL ? window.assetURL(resource) : `/dhamma-path/${resource}`;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
            if (!img.decoding) {
                img.decoding = 'async';
            }
        });
    }

    deferNonCriticalJS() {
        const nonCriticalScripts = document.querySelectorAll('script[src*="analytics"], script[src*="tracking"]');
        nonCriticalScripts.forEach(script => {
            script.defer = true;
        });
    }

    reserveSpaceForDynamicContent() {
        // Add skeleton loaders for dynamic content
        const dynamicElements = document.querySelectorAll('[data-dynamic]');
        dynamicElements.forEach(element => {
            if (!element.style.minHeight) {
                element.style.minHeight = '200px';
            }
        });
    }

    optimizeFontLoading() {
        // Add font-display: swap to all font faces
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }

    splitHeavyTasks() {
        // Use requestIdleCallback for heavy tasks
        if (window.requestIdleCallback) {
            const heavyTasks = window.__heavyTasks || [];
            heavyTasks.forEach(task => {
                requestIdleCallback(task, { timeout: 1000 });
            });
        }
    }

    optimizeEventHandlers() {
        // Use passive event listeners where possible
        const events = ['scroll', 'touchstart', 'touchmove'];
        events.forEach(eventType => {
            document.addEventListener(eventType, () => {}, { passive: true });
        });
    }

    enableCompression() {
        // Add compression headers via meta tags
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Encoding';
        meta.content = 'gzip';
        document.head.appendChild(meta);
    }

    optimizeResourceLoading() {
        // Add resource hints
        const hints = [
            { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
            { rel: 'prefetch', href: '/dhamma-path/assets/css/styles.css' }
        ];
        
        hints.forEach(hint => {
            const link = document.createElement('link');
            link.rel = hint.rel;
            link.href = hint.href;
            document.head.appendChild(link);
        });
    }

    implementRetryLogic() {
        // Add retry logic for failed requests
        const originalFetch = window.fetch;
        window.fetch = async (url, options = {}) => {
            let retries = 3;
            while (retries > 0) {
                try {
                    return await originalFetch(url, options);
                } catch (error) {
                    retries--;
                    if (retries === 0) throw error;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        };
    }

    addFallbacks() {
        // Add fallbacks for critical functionality
        if (!window.Promise) {
            window.Promise = require('es6-promise').Promise;
        }
        
        if (!window.fetch) {
            window.fetch = require('whatwg-fetch').fetch;
        }
    }

    cleanupUnusedObjects() {
        // Clean up unused event listeners
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            // Remove unused data attributes
            const dataAttrs = element.attributes;
            for (let i = dataAttrs.length - 1; i >= 0; i--) {
                const attr = dataAttrs[i];
                if (attr.name.startsWith('data-temp-')) {
                    element.removeAttribute(attr.name);
                }
            }
        });
    }

    startOptimization() {
        // Run optimizations every 2 minutes (reduced frequency)
        setInterval(() => {
            this.runPeriodicOptimizations();
        }, 120000);
    }

    runPeriodicOptimizations() {
        // Memory cleanup
        if (this.metrics.memoryUsage > this.thresholds.memory * 0.8) {
            this.optimizeMemory();
        }
        
        // Long task cleanup
        const recentLongTasks = this.metrics.longTasks.filter(
            task => Date.now() - task.startTime < 60000
        );
        if (recentLongTasks.length > 5) {
            this.optimizeLongTask({ duration: 0 });
        }
    }

    // Public API
    getMetrics() {
        return { ...this.metrics };
    }

    getReport() {
        const runtime = Date.now() - this.metrics.startTime;
        return {
            runtime: Math.round(runtime / 1000),
            metrics: this.metrics,
            thresholds: this.thresholds,
            performance: this.calculatePerformanceScore()
        };
    }

    calculatePerformanceScore() {
        let score = 100;
        
        // Deduct points for exceeded thresholds
        if (this.metrics.loadTime > this.thresholds.loadTime) score -= 20;
        if (this.metrics.largestContentfulPaint > this.thresholds.lcp) score -= 20;
        if (this.metrics.cumulativeLayoutShift > this.thresholds.cls) score -= 20;
        if (this.metrics.firstInputDelay > this.thresholds.fid) score -= 20;
        if (this.metrics.errors > 5) score -= 20;
        
        return Math.max(0, score);
    }
}

// Initialize Performance Monitor
window.performanceMonitor = new PerformanceMonitor();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}
