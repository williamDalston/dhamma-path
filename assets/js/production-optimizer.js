/**
 * Production Optimizer
 * Ferrari-level performance optimization for production deployment
 */

class ProductionOptimizer {
    constructor() {
        this.optimizations = {
            criticalPath: false,
            resourceHints: false,
            compression: false,
            caching: false,
            bundleOptimization: false
        };
        this.init();
    }

    init() {
        this.optimizeCriticalPath();
        this.setupResourceHints();
        this.optimizeImages();
        this.setupAdvancedCaching();
        this.optimizeAnimations();
        this.setupErrorBoundaries();
        this.implementRetryLogic();
        this.setupOfflineSupport();
    }

    optimizeCriticalPath() {
        // Inline critical CSS for above-the-fold content
        const criticalCSS = `
            * { box-sizing: border-box; }
            html { scroll-behavior: smooth; }
            body { 
                margin: 0; 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background-color: var(--linen-white, #FEFCF8);
                color: var(--charcoal, #1C1C1E);
                line-height: 1.6;
            }
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #2D5016 0%, #4A6C55 50%, #9CAF88 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.5s ease-out;
            }
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
        this.optimizations.criticalPath = true;
    }

    setupResourceHints() {
        const hints = [
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
            { rel: 'dns-prefetch', href: 'https://cdn.tailwindcss.com' },
            { rel: 'preload', href: '/assets/css/styles.css', as: 'style' },
            { rel: 'preload', href: '/assets/js/navigation.js', as: 'script' },
            { rel: 'preload', href: '/assets/js/meditation-timer.js', as: 'script' },
            { rel: 'prefetch', href: '/assets/templates/journal.html' },
            { rel: 'prefetch', href: '/assets/templates/workout.html' },
            { rel: 'prefetch', href: '/assets/templates/interview.html' }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            Object.assign(link, hint);
            document.head.appendChild(link);
        });
        this.optimizations.resourceHints = true;
    }

    optimizeImages() {
        // Lazy loading with intersection observer
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

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // WebP support detection
        const webpSupported = this.checkWebPSupport();
        if (webpSupported) {
            document.querySelectorAll('img').forEach(img => {
                if (img.src.includes('.jpg') || img.src.includes('.png')) {
                    img.src = img.src.replace(/\.(jpg|png)$/, '.webp');
                }
            });
        }
    }

    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    setupAdvancedCaching() {
        // Service Worker for aggressive caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none'
            }).then(registration => {
                console.log('🚀 Production Service Worker registered');
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            }).catch(error => {
                console.error('Service Worker registration failed:', error);
            });
        }

        // Local Storage optimization
        this.optimizeLocalStorage();
        this.optimizations.caching = true;
    }

    optimizeLocalStorage() {
        // Clean up old data
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('temp_') && Date.now() - parseInt(key.split('_')[1]) > 86400000) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Compress large data
        const compressData = (data) => {
            try {
                return LZString.compress(JSON.stringify(data));
            } catch (e) {
                return JSON.stringify(data);
            }
        };

        const decompressData = (compressed) => {
            try {
                return JSON.parse(LZString.decompress(compressed));
            } catch (e) {
                return JSON.parse(compressed);
            }
        };

        // Store compression utilities globally
        window.compressData = compressData;
        window.decompressData = decompressData;
    }

    optimizeAnimations() {
        // Reduce animations on low-end devices
        const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                              navigator.deviceMemory <= 2 ||
                              /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isLowEndDevice) {
            document.documentElement.classList.add('reduce-motion');
            const style = document.createElement('style');
            style.textContent = `
                .reduce-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
                .reduce-motion .float-premium,
                .reduce-motion .liquid-premium,
                .reduce-motion .morphing-premium {
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Optimize animation performance
        const style = document.createElement('style');
        style.textContent = `
            .gpu-accelerated {
                transform: translate3d(0, 0, 0);
                will-change: transform;
                backface-visibility: hidden;
            }
            .optimized-animation {
                will-change: transform, opacity;
                transform: translateZ(0);
            }
        `;
        document.head.appendChild(style);
    }

    setupErrorBoundaries() {
        // Global error boundary
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'JavaScript Error');
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection');
        });

        // Network error handling
        window.addEventListener('online', () => {
            this.showNotification('Your sacred space is reconnected', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Working in sacred solitude', 'warning');
        });
    }

    handleError(error, type) {
        console.error(`${type}:`, error);
        
        // Send to error tracking service
        this.reportError(error, type);
        
        // Show user-friendly error message
        this.showNotification('A gentle pause in your flow. Please try again.', 'error');
        
        // Fallback actions
        this.triggerFallbacks(error);
    }

    reportError(error, type) {
        // In production, send to error tracking service
        if (window.analyticsSystem && typeof window.analyticsSystem.trackEvent === 'function') {
            window.analyticsSystem.trackEvent('error', {
                type: type,
                message: error.message || error.toString(),
                stack: error.stack,
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: Date.now()
            });
        }
    }

    triggerFallbacks(error) {
        // Specific fallback strategies
        if (error.message && error.message.includes('fetch')) {
            this.enableOfflineMode();
        } else if (error.message && error.message.includes('timer')) {
            this.resetTimerState();
        }
    }

    implementRetryLogic() {
        // Exponential backoff retry for network requests
        window.retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    return await fn();
                } catch (error) {
                    if (i === maxRetries - 1) throw error;
                    
                    const delay = baseDelay * Math.pow(2, i);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        };
    }

    setupOfflineSupport() {
        // Offline indicator
        const offlineIndicator = document.createElement('div');
        offlineIndicator.id = 'offline-indicator';
        offlineIndicator.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 hidden';
        offlineIndicator.textContent = 'You are offline';
        document.body.appendChild(offlineIndicator);

        // Cache critical resources for offline use
        const criticalResources = [
            '/assets/css/styles.css',
            '/assets/js/navigation.js',
            '/assets/js/meditation-timer.js',
            '/assets/templates/timer.html'
        ];

        if ('caches' in window) {
            caches.open('critical-v1').then(cache => {
                return cache.addAll(criticalResources);
            });
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <span>🔄 New version available</span>
                <button onclick="window.location.reload()" class="bg-white text-blue-500 px-3 py-1 rounded text-sm font-semibold">
                    Update
                </button>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 10000);
    }

    showNotification(message, type = 'info') {
        if (window.dhammaPathApp && window.dhammaPathApp.showNotification) {
            window.dhammaPathApp.showNotification(message, type);
        }
    }

    enableOfflineMode() {
        document.body.classList.add('offline-mode');
        this.showNotification('Working in sacred solitude', 'info');
    }

    resetTimerState() {
        // Reset timer to safe state
        if (window.meditationTimer) {
            window.meditationTimer.reset();
        }
    }

    // Performance monitoring
    getOptimizationStatus() {
        return this.optimizations;
    }

    // Cleanup
    destroy() {
        // Clean up resources
        document.querySelectorAll('link[rel="prefetch"]').forEach(link => link.remove());
    }
}

// Initialize production optimizer
window.ProductionOptimizer = ProductionOptimizer;

// Auto-initialize in production
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        window.productionOptimizer = new ProductionOptimizer();
    });
}
