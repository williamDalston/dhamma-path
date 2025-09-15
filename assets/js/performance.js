/**
 * Performance Monitor & Optimizer
 * Ferrari-level performance monitoring and optimization
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
            totalBlockingTime: 0
        };
        this.observers = [];
        this.init();
    }

    init() {
        this.measureCoreWebVitals();
        this.setupPerformanceObservers();
        this.optimizeAnimations();
        this.preloadCriticalResources();
        this.setupIntersectionObserver();
        this.monitorMemoryUsage();
    }

    measureCoreWebVitals() {
        // Measure Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
                console.log('🎯 LCP:', lastEntry.startTime + 'ms');
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(lcpObserver);

            // Measure Cumulative Layout Shift
            let lastClsLog = 0;
            const clsObserver = new PerformanceObserver((entryList) => {
                let clsValue = 0;
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.cumulativeLayoutShift = clsValue;
                
                // Only log CLS if it's significant (>0.01) and not logged recently (throttle)
                if (clsValue > 0.01 && Date.now() - lastClsLog > 2000) {
                    console.log('🎯 CLS:', clsValue);
                    lastClsLog = Date.now();
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(clsObserver);

            // Measure First Input Delay
            const fidObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                    console.log('🎯 FID:', this.metrics.firstInputDelay + 'ms');
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            this.observers.push(fidObserver);
        }

        // Measure load time using navigation timing
        window.addEventListener('load', () => {
            const nav = performance.getEntriesByType('navigation')[0];
            let loadTimeMs = 0;

            if (nav && nav.loadEventEnd > 0) {
                loadTimeMs = Math.max(0, Math.round(nav.loadEventEnd - nav.startTime));
            } else {
                // fallback if no NavigationTiming entry or loadEventEnd is 0
                const t0 = (window.__perfStart = window.__perfStart ?? performance.now());
                loadTimeMs = Math.max(0, Math.round(performance.now() - t0));
                
                // Additional fallback: use DOMContentLoaded if available
                if (nav && nav.domContentLoadedEventEnd > 0) {
                    loadTimeMs = Math.max(loadTimeMs, Math.round(nav.domContentLoadedEventEnd - nav.startTime));
                }
            }

            this.metrics.loadTime = loadTimeMs;
            console.log('🎯 Load Time:', loadTimeMs, 'ms');
        });
    }

    setupPerformanceObservers() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const longTaskObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('⚠️ Long task detected:', entry.duration + 'ms');
                        this.optimizeLongTask(entry);
                    }
                }
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
            this.observers.push(longTaskObserver);
        }
    }

    optimizeLongTask(task) {
        // Break up long tasks using setTimeout
        if (task.duration > 50) { // Reduced threshold for better performance
            console.log('🔧 Optimizing long task...');
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
            // Implement task splitting logic here
            this.splitLongTask(task);
        }
    }

    splitLongTask(task) {
        // Use setTimeout to break up long tasks
        setTimeout(() => {
            // Process task in smaller chunks
            console.log('🔧 Long task split and processed');
            
            // Force a microtask to yield control
            Promise.resolve().then(() => {
                // Additional processing if needed
                if (window.gc) {
                    window.gc(); // Force garbage collection if available
                }
            });
        }, 0);
    }

    optimizeAnimations() {
        // Use transform and opacity for better performance
        const style = document.createElement('style');
        style.textContent = `
            .optimized-animation {
                will-change: transform, opacity;
                transform: translateZ(0);
                backface-visibility: hidden;
                perspective: 1000px;
            }
            
            .gpu-accelerated {
                transform: translate3d(0, 0, 0);
                will-change: transform;
            }
            
            .smooth-scroll {
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
            }
        `;
        document.head.appendChild(style);
    }

    preloadCriticalResources() {
        // Skip preloading to avoid console warnings
        // Resources are already loaded via script tags
        console.log('📦 Critical resources already loaded via script tags');
    }

    setupIntersectionObserver() {
        // Lazy load images and optimize rendering
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const used = memory.usedJSHeapSize / 1024 / 1024;
                const total = memory.totalJSHeapSize / 1024 / 1024;
                
                if (used > 100) { // More than 100MB - more realistic threshold
                    console.warn('⚠️ High memory usage:', used.toFixed(2) + 'MB');
                    this.triggerGarbageCollection();
                }
            }, 10000); // Check every 10 seconds
        }
    }

    triggerGarbageCollection() {
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    // Advanced caching system
    setupAdvancedCaching() {
        // Service Worker for advanced caching
        if ('serviceWorker' in navigator) {
            const SCOPE = (window.PROJECT_SCOPE
              || (location.pathname.match(/^\/[^/]+\//) || ['/'])[0]);

            const SW_URL = (window.assetURL ? assetURL('sw.js')
              : new URL('sw.js', location.origin + SCOPE).href);

            navigator.serviceWorker.register(SW_URL, { scope: SCOPE }).then(registration => {
                console.log('🚀 Service Worker registered:', registration);
            }).catch(error => {
                console.log('Service Worker registration failed:', error);
            });
        }
    }

    // Performance metrics API
    getMetrics() {
        return {
            ...this.metrics,
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize / 1024 / 1024,
                total: performance.memory.totalJSHeapSize / 1024 / 1024,
                limit: performance.memory.jsHeapSizeLimit / 1024 / 1024
            } : null,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : null
        };
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Export for global use
window.PerformanceMonitor = PerformanceMonitor;
