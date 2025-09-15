/**
 * Lifecycle Management System
 * Handles cleanup, teardown, and memory optimization
 */

class LifecycleManager {
    constructor() {
        this.teardownCallbacks = new Set();
        this.intervals = new Set();
        this.timeouts = new Set();
        this.observers = new Set();
        this.eventListeners = new Map();
        this.init();
    }

    init() {
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanupOnHidden();
            } else {
                this.restoreOnVisible();
            }
        });

        // Track page unload
        window.addEventListener('beforeunload', () => {
            this.teardownAll();
        });

        // Track memory usage
        this.startMemoryMonitoring();
    }

    // Register cleanup callbacks
    onTeardown(callback) {
        this.teardownCallbacks.add(callback);
        return () => this.teardownCallbacks.delete(callback);
    }

    // Track intervals for cleanup
    trackInterval(intervalId) {
        this.intervals.add(intervalId);
        return intervalId;
    }

    // Track timeouts for cleanup
    trackTimeout(timeoutId) {
        this.timeouts.add(timeoutId);
        return timeoutId;
    }

    // Track observers for cleanup
    trackObserver(observer) {
        this.observers.add(observer);
        return observer;
    }

    // Track event listeners for cleanup
    trackEventListener(element, event, handler, options) {
        const key = `${element.constructor.name}-${event}`;
        if (!this.eventListeners.has(key)) {
            this.eventListeners.set(key, []);
        }
        this.eventListeners.get(key).push({ element, event, handler, options });
        return { element, event, handler, options };
    }

    // Cleanup when page becomes hidden
    cleanupOnHidden() {
        console.log('🧹 Cleaning up on page hidden');
        
        // Clear all intervals
        this.intervals.forEach(id => clearInterval(id));
        this.intervals.clear();

        // Clear all timeouts
        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts.clear();

        // Disconnect all observers
        this.observers.forEach(observer => {
            if (observer.disconnect) observer.disconnect();
        });
        this.observers.clear();

        // Pause animations
        if (window.physicsAnimations?.pause) {
            window.physicsAnimations.pause();
        }

        // Throttle analytics
        if (window.analytics?.throttle) {
            window.analytics.throttle = true;
        }
    }

    // Restore when page becomes visible
    restoreOnVisible() {
        console.log('🔄 Restoring on page visible');
        
        // Resume animations
        if (window.physicsAnimations?.resume) {
            window.physicsAnimations.resume();
        }

        // Restore analytics
        if (window.analytics?.throttle) {
            window.analytics.throttle = false;
        }
    }

    // Full teardown
    teardownAll() {
        console.log('🧹 Full teardown initiated');
        
        // Run all teardown callbacks
        this.teardownCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Error in teardown callback:', error);
            }
        });
        this.teardownCallbacks.clear();

        // Clear all intervals
        this.intervals.forEach(id => clearInterval(id));
        this.intervals.clear();

        // Clear all timeouts
        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts.clear();

        // Disconnect all observers
        this.observers.forEach(observer => {
            if (observer.disconnect) observer.disconnect();
        });
        this.observers.clear();

        // Remove all tracked event listeners
        this.eventListeners.forEach((listeners, key) => {
            listeners.forEach(({ element, event, handler, options }) => {
                element.removeEventListener(event, handler, options);
            });
        });
        this.eventListeners.clear();

        // Clean up global objects
        this.cleanupGlobalObjects();
    }

    // Clean up global objects
    cleanupGlobalObjects() {
        // Clean up analytics
        if (window.analytics?.cleanup) {
            window.analytics.cleanup();
        }

        // Clean up physics animations
        if (window.physicsAnimations?.cleanupStaleAnimations) {
            window.physicsAnimations.cleanupStaleAnimations();
        }

        // Clean up haptic system
        if (window.hapticStorytelling?.cleanup) {
            window.hapticStorytelling.cleanup();
        }

        // Clean up motion system
        if (window.motionSystem?.cleanup) {
            window.motionSystem.cleanup();
        }
    }

    // Memory monitoring
    startMemoryMonitoring() {
        if (!('memory' in performance)) return;

        const checkMemory = () => {
            const memory = performance.memory;
            const usedMB = memory.usedJSHeapSize / 1024 / 1024;
            const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
            const usagePercent = (usedMB / limitMB) * 100;

            if (usagePercent > 70) { // Lowered threshold for earlier cleanup
                console.warn(`🧠 High memory usage: ${usedMB.toFixed(2)}MB (${usagePercent.toFixed(1)}%)`);
                this.aggressiveCleanup();
            }
        };

        // Check memory every 60 seconds (reduced frequency)
        this.trackInterval(setInterval(checkMemory, 60000));
    }

    // Aggressive cleanup when memory is high
    aggressiveCleanup() {
        console.log('🧹 Aggressive memory cleanup');
        
        // Clear old analytics data
        if (window.analytics?.clearOldData) {
            window.analytics.clearOldData();
        }

        // Clean up unused DOM elements
        this.cleanupUnusedElements();

        // Clear unused event listeners
        this.clearUnusedEventListeners();

        // Clear unused intervals and timeouts
        this.clearUnusedTimers();

        // Clear unused observers
        this.clearUnusedObservers();

        // Clear unused global objects
        this.clearUnusedGlobals();

        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    // Clear unused event listeners
    clearUnusedEventListeners() {
        // Remove event listeners from elements that are no longer in the DOM
        this.eventListeners.forEach((listeners, key) => {
            listeners.forEach(({ element, event, handler, options }) => {
                if (!document.contains(element)) {
                    element.removeEventListener(event, handler, options);
                }
            });
        });
    }

    // Clear unused timers
    clearUnusedTimers() {
        // Clear intervals that might be stale
        this.intervals.forEach(id => {
            try {
                clearInterval(id);
            } catch (e) {
                // Interval might already be cleared
            }
        });
        this.intervals.clear();

        // Clear timeouts that might be stale
        this.timeouts.forEach(id => {
            try {
                clearTimeout(id);
            } catch (e) {
                // Timeout might already be cleared
            }
        });
        this.timeouts.clear();
    }

    // Clear unused observers
    clearUnusedObservers() {
        this.observers.forEach(observer => {
            if (observer.disconnect) {
                try {
                    observer.disconnect();
                } catch (e) {
                    // Observer might already be disconnected
                }
            }
        });
        this.observers.clear();
    }

    // Clear unused global objects
    clearUnusedGlobals() {
        // Clear unused analytics data
        if (window.analytics?.clearCache) {
            window.analytics.clearCache();
        }

        // Clear unused physics animations
        if (window.physicsAnimations?.clearStaleAnimations) {
            window.physicsAnimations.clearStaleAnimations();
        }

        // Clear unused motion system data
        if (window.motionSystem?.clearCache) {
            window.motionSystem.clearCache();
        }

        // Clear unused haptic data
        if (window.hapticStorytelling?.clearCache) {
            window.hapticStorytelling.clearCache();
        }
    }

    // Clean up unused DOM elements
    cleanupUnusedElements() {
        // Remove elements with display: none that don't have data-preserve
        const hiddenElements = document.querySelectorAll('[style*="display: none"]:not([data-preserve])');
        hiddenElements.forEach(el => {
            if (!el.hasAttribute('data-preserve')) {
                el.remove();
            }
        });

        // Remove empty text nodes
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    return node.textContent.trim() === '' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const emptyTextNodes = [];
        let node;
        while (node = walker.nextNode()) {
            emptyTextNodes.push(node);
        }

        emptyTextNodes.forEach(node => node.remove());
    }

    // Preload routes once
    preloadRoutesOnce(routes) {
        const ns = (window.__app ??= {});
        if (!ns.preloaded) {
            ns.preloaded = true;
            this.preloadRoutes(routes);
        }
    }

    // Preload routes
    preloadRoutes(routes) {
        routes.forEach(route => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = `assets/templates/${route}.html`;
            document.head.appendChild(link);
        });
    }

    // Get memory stats
    getMemoryStats() {
        if (!('memory' in performance)) {
            return { available: false };
        }

        const memory = performance.memory;
        return {
            available: true,
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
            usedMB: memory.usedJSHeapSize / 1024 / 1024,
            totalMB: memory.totalJSHeapSize / 1024 / 1024,
            limitMB: memory.jsHeapSizeLimit / 1024 / 1024,
            usagePercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        };
    }

    // Get cleanup stats
    getCleanupStats() {
        return {
            teardownCallbacks: this.teardownCallbacks.size,
            intervals: this.intervals.size,
            timeouts: this.timeouts.size,
            observers: this.observers.size,
            eventListeners: Array.from(this.eventListeners.values()).reduce((total, listeners) => total + listeners.length, 0)
        };
    }
}

// Create global instance
window.lifecycleManager = new LifecycleManager();

// Export for use in other modules
window.LifecycleManager = LifecycleManager;

// Helper functions for easy use
window.onTeardown = (callback) => window.lifecycleManager.onTeardown(callback);
window.trackInterval = (id) => window.lifecycleManager.trackInterval(id);
window.trackTimeout = (id) => window.lifecycleManager.trackTimeout(id);
window.trackObserver = (observer) => window.lifecycleManager.trackObserver(observer);
window.trackEventListener = (element, event, handler, options) => 
    window.lifecycleManager.trackEventListener(element, event, handler, options);
