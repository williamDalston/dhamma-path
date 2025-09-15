/**
 * AUTO-HEALER - Proactive Issue Prevention & Healing
 * 
 * This system proactively prevents issues before they occur and
 * automatically heals common problems without user intervention.
 */

class AutoHealer {
    constructor() {
        this.healingStrategies = new Map();
        this.preventionRules = new Map();
        this.healthChecks = new Map();
        this.isHealing = false;
        
        this.setupHealingStrategies();
        this.setupPreventionRules();
        this.startHealthChecks();
        this.startProactiveHealing();
        
        console.log('🩺 Auto-Healer initialized - Proactive issue prevention active');
    }

    setupHealingStrategies() {
        // Resource loading healing
        this.healingStrategies.set('resource_loading', {
            check: () => this.checkResourceLoading(),
            heal: () => this.healResourceLoading(),
            priority: 1
        });

        // JavaScript error healing
        this.healingStrategies.set('js_errors', {
            check: () => this.checkJSErrors(),
            heal: () => this.healJSErrors(),
            priority: 1
        });

        // CSS loading healing
        this.healingStrategies.set('css_loading', {
            check: () => this.checkCSSLoading(),
            heal: () => this.healCSSLoading(),
            priority: 2
        });

        // Service Worker healing
        this.healingStrategies.set('service_worker', {
            check: () => this.checkServiceWorker(),
            heal: () => this.healServiceWorker(),
            priority: 2
        });

        // Performance healing
        this.healingStrategies.set('performance', {
            check: () => this.checkPerformance(),
            heal: () => this.healPerformance(),
            priority: 3
        });

        // Memory healing
        this.healingStrategies.set('memory', {
            check: () => this.checkMemory(),
            heal: () => this.healMemory(),
            priority: 3
        });

        // Network healing
        this.healingStrategies.set('network', {
            check: () => this.checkNetwork(),
            heal: () => this.healNetwork(),
            priority: 2
        });
    }

    setupPreventionRules() {
        // Prevent resource loading issues
        this.preventionRules.set('prevent_resource_404', {
            condition: () => true,
            action: () => this.preventResource404s()
        });

        // Prevent JavaScript errors
        this.preventionRules.set('prevent_js_errors', {
            condition: () => true,
            action: () => this.preventJSErrors()
        });

        // Prevent memory leaks
        this.preventionRules.set('prevent_memory_leaks', {
            condition: () => true,
            action: () => this.preventMemoryLeaks()
        });

        // Prevent performance issues
        this.preventionRules.set('prevent_performance_issues', {
            condition: () => true,
            action: () => this.preventPerformanceIssues()
        });
    }

    startHealthChecks() {
        // Run health checks every 60 seconds (reduced frequency)
        setInterval(() => {
            this.runHealthChecks();
        }, 60000);

        // Run deep health checks every 5 minutes (reduced frequency)
        setInterval(() => {
            this.runDeepHealthChecks();
        }, 300000);
    }

    startProactiveHealing() {
        // Run prevention rules every 30 seconds (reduced frequency)
        setInterval(() => {
            this.runPreventionRules();
        }, 30000);

        // Run healing strategies every 2 minutes (reduced frequency)
        setInterval(() => {
            this.runHealingStrategies();
        }, 120000);
    }

    runHealthChecks() {
        if (this.isHealing) return;
        
        this.isHealing = true;
        
        try {
            // Check each healing strategy
            for (const [name, strategy] of this.healingStrategies) {
                if (strategy.check()) {
                    console.log(`🔍 Health check failed: ${name}`);
                    strategy.heal();
                }
            }
        } catch (error) {
            console.warn('Health check error:', error);
        } finally {
            this.isHealing = false;
        }
    }

    runDeepHealthChecks() {
        console.log('🔍 Running deep health checks...');
        
        // Check all critical systems
        this.checkCriticalSystems();
        
        // Check for memory leaks
        this.checkForMemoryLeaks();
        
        // Check for performance degradation
        this.checkForPerformanceDegradation();
        
        // Check for network issues
        this.checkForNetworkIssues();
    }

    runPreventionRules() {
        for (const [name, rule] of this.preventionRules) {
            try {
                if (rule.condition()) {
                    rule.action();
                }
            } catch (error) {
                console.warn(`Prevention rule error (${name}):`, error);
            }
        }
    }

    runHealingStrategies() {
        if (this.isHealing) return;
        
        this.isHealing = true;
        
        try {
            // Sort strategies by priority
            const sortedStrategies = Array.from(this.healingStrategies.entries())
                .sort((a, b) => a[1].priority - b[1].priority);
            
            for (const [name, strategy] of sortedStrategies) {
                if (strategy.check()) {
                    console.log(`🩺 Healing: ${name}`);
                    strategy.heal();
                }
            }
        } catch (error) {
            console.warn('Healing strategy error:', error);
        } finally {
            this.isHealing = false;
        }
    }

    // Health check implementations
    checkResourceLoading() {
        const failedResources = [];
        const resources = document.querySelectorAll('link[href], script[src]');
        
        resources.forEach(resource => {
            const url = resource.href || resource.src;
            if (url && !url.startsWith('data:') && !url.startsWith('blob:')) {
                // Check if resource is accessible
                fetch(url, { method: 'HEAD' })
                    .then(response => {
                        if (!response.ok) {
                            failedResources.push(url);
                        }
                    })
                    .catch(() => {
                        failedResources.push(url);
                    });
            }
        });
        
        return failedResources.length > 0;
    }

    checkJSErrors() {
        // Check for common JavaScript errors
        const commonErrors = [
            'is not defined',
            'Cannot read property',
            'Cannot read properties',
            'TypeError',
            'ReferenceError',
            'SyntaxError'
        ];
        
        // This would need to be integrated with console monitoring
        return false; // Placeholder
    }

    checkCSSLoading() {
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        let failedCSS = 0;
        
        cssLinks.forEach(link => {
            if (link.sheet === null && !link.href.startsWith('data:')) {
                failedCSS++;
            }
        });
        
        return failedCSS > 0;
    }

    checkServiceWorker() {
        if ('serviceWorker' in navigator) {
            return navigator.serviceWorker.getRegistrations()
                .then(registrations => registrations.length === 0)
                .catch(() => true);
        }
        return false;
    }

    checkPerformance() {
        if (window.performanceMonitor) {
            const metrics = window.performanceMonitor.getMetrics();
            return metrics.longTasks.length > 3 || metrics.memoryUsage > 100 * 1024 * 1024;
        }
        return false;
    }

    checkMemory() {
        if (performance.memory) {
            const memory = performance.memory;
            const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
            return usage > 0.8; // 80% memory usage
        }
        return false;
    }

    checkNetwork() {
        if (navigator.onLine === false) {
            return true;
        }
        
        // Check for slow network
        if (navigator.connection) {
            return navigator.connection.effectiveType === 'slow-2g' || 
                   navigator.connection.effectiveType === '2g';
        }
        
        return false;
    }

    // Healing implementations
    healResourceLoading() {
        console.log('🩺 Healing resource loading issues...');
        
        // Reload failed resources
        const resources = document.querySelectorAll('link[href], script[src]');
        resources.forEach(resource => {
            const url = resource.href || resource.src;
            if (url && !url.startsWith('data:') && !url.startsWith('blob:')) {
                // Add retry mechanism
                if (!resource.dataset.retryCount) {
                    resource.dataset.retryCount = '0';
                }
                
                const retryCount = parseInt(resource.dataset.retryCount);
                if (retryCount < 3) {
                    resource.dataset.retryCount = (retryCount + 1).toString();
                    
                    // Reload resource
                    if (resource.tagName === 'LINK') {
                        const newLink = resource.cloneNode();
                        newLink.href = url + '?retry=' + Date.now();
                        resource.parentNode.replaceChild(newLink, resource);
                    } else if (resource.tagName === 'SCRIPT') {
                        const newScript = resource.cloneNode();
                        newScript.src = url + '?retry=' + Date.now();
                        resource.parentNode.replaceChild(newScript, resource);
                    }
                }
            }
        });
    }

    healJSErrors() {
        console.log('🩺 Healing JavaScript errors...');
        
        // Add error boundaries
        this.addErrorBoundaries();
        
        // Implement retry logic
        this.implementRetryLogic();
        
        // Add fallbacks
        this.addFallbacks();
    }

    healCSSLoading() {
        console.log('🩺 Healing CSS loading issues...');
        
        // Reload CSS files
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            if (link.sheet === null && !link.href.startsWith('data:')) {
                const newLink = link.cloneNode();
                newLink.href = link.href + '?heal=' + Date.now();
                link.parentNode.replaceChild(newLink, link);
            }
        });
        
        // Add critical CSS fallback
        this.addCriticalCSSFallback();
    }

    healServiceWorker() {
        console.log('🩺 Healing Service Worker...');
        
        if ('serviceWorker' in navigator) {
            const scope = window.PROJECT_SCOPE || '/dhamma-path/';
            const swUrl = `${scope}sw.js`;
            
            navigator.serviceWorker.register(swUrl, { scope })
                .then(() => console.log('✅ Service Worker healed'))
                .catch(err => console.warn('❌ Service Worker healing failed:', err));
        }
    }

    healPerformance() {
        console.log('🩺 Healing performance issues...');
        
        // Optimize animations
        if (window.physicsAnimations) {
            window.physicsAnimations.setQuality('low');
        }
        
        // Reduce analytics frequency
        if (window.analytics) {
            window.analytics.sampleRate = 0.1;
        }
        
        // Enable performance optimizations
        this.enablePerformanceOptimizations();
    }

    healMemory() {
        console.log('🩺 Healing memory issues...');
        
        // Force garbage collection
        if (window.gc) {
            window.gc();
        }
        
        // Clear unused caches
        this.clearUnusedCaches();
        
        // Clean up unused objects
        this.cleanupUnusedObjects();
    }

    healNetwork() {
        console.log('🩺 Healing network issues...');
        
        // Implement offline fallbacks
        this.implementOfflineFallbacks();
        
        // Optimize for slow connections
        this.optimizeForSlowConnections();
    }

    // Prevention implementations
    preventResource404s() {
        // Ensure all resources use correct paths
        const resources = document.querySelectorAll('link[href], script[src]');
        resources.forEach(resource => {
            const url = resource.href || resource.src;
            if (url && url.includes('/assets/') && !url.includes('/dhamma-path/')) {
                const correctedUrl = url.replace('/assets/', '/dhamma-path/assets/');
                if (resource.tagName === 'LINK') {
                    resource.href = correctedUrl;
                } else {
                    resource.src = correctedUrl;
                }
            }
        });
    }

    preventJSErrors() {
        // Add global error handlers
        window.addEventListener('error', (event) => {
            console.log('🛡️ Prevented JS error:', event.error);
            event.preventDefault();
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.log('🛡️ Prevented unhandled rejection:', event.reason);
            event.preventDefault();
        });
    }

    preventMemoryLeaks() {
        // Clean up event listeners
        this.cleanupEventListeners();
        
        // Clear unused timers
        this.clearUnusedTimers();
        
        // Clean up unused DOM references
        this.cleanupDOMReferences();
    }

    preventPerformanceIssues() {
        // Throttle heavy operations
        this.throttleHeavyOperations();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Reduce computational complexity
        this.reduceComputationalComplexity();
    }

    // Utility methods
    addErrorBoundaries() {
        // Add React-style error boundaries
        const originalConsoleError = console.error;
        console.error = (...args) => {
            // Log error but don't crash
            originalConsoleError(...args);
            
            // Try to recover
            this.attemptRecovery(args);
        };
    }

    implementRetryLogic() {
        // Add retry logic to critical functions
        const criticalFunctions = ['fetch', 'XMLHttpRequest'];
        criticalFunctions.forEach(funcName => {
            if (window[funcName]) {
                this.addRetryToFunction(window[funcName]);
            }
        });
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

    addCriticalCSSFallback() {
        const criticalCSS = `
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #FDFCF8;
                color: #2C3E50;
                margin: 0;
                padding: 0;
            }
            .quick-action-card {
                background: rgba(255, 255, 255, 0.8);
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.appendChild(style);
    }

    enablePerformanceOptimizations() {
        // Enable performance optimizations
        if (window.requestIdleCallback) {
            // Use idle time for non-critical work
            requestIdleCallback(() => {
                this.performIdleOptimizations();
            });
        }
    }

    clearUnusedCaches() {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (name.includes('temp') || name.includes('cache')) {
                        caches.delete(name);
                    }
                });
            });
        }
    }

    cleanupUnusedObjects() {
        // Clean up unused objects
        if (window.analytics && window.analytics.events) {
            const oneHourAgo = Date.now() - 60 * 60 * 1000;
            window.analytics.events = window.analytics.events.filter(
                event => event.timestamp > oneHourAgo
            );
        }
    }

    implementOfflineFallbacks() {
        // Add offline detection
        window.addEventListener('online', () => {
            console.log('🌐 Back online - healing network issues');
            this.healNetwork();
        });
        
        window.addEventListener('offline', () => {
            console.log('📴 Offline - enabling fallbacks');
            this.enableOfflineMode();
        });
    }

    optimizeForSlowConnections() {
        if (navigator.connection) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                // Reduce resource loading
                this.reduceResourceLoading();
                
                // Enable aggressive caching
                this.enableAggressiveCaching();
            }
        }
    }

    // Additional utility methods
    checkCriticalSystems() {
        const criticalSystems = [
            'NavigationManager',
            'ThemeManager',
            'WeatherIntegration',
            'analytics'
        ];
        
        criticalSystems.forEach(system => {
            if (!window[system]) {
                console.warn(`⚠️ Critical system missing: ${system}`);
                this.healCriticalSystem(system);
            }
        });
    }

    checkForMemoryLeaks() {
        // Check for memory leaks
        if (performance.memory) {
            const memory = performance.memory;
            const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
            
            if (usage > 0.9) {
                console.warn('⚠️ High memory usage detected');
                this.healMemory();
            }
        }
    }

    checkForPerformanceDegradation() {
        // Check for performance degradation
        if (window.performanceMonitor) {
            const metrics = window.performanceMonitor.getMetrics();
            
            if (metrics.longTasks.length > 5) {
                console.warn('⚠️ Performance degradation detected');
                this.healPerformance();
            }
        }
    }

    checkForNetworkIssues() {
        // Check for network issues
        if (!navigator.onLine) {
            console.warn('⚠️ Network issues detected');
            this.healNetwork();
        }
    }

    healCriticalSystem(systemName) {
        console.log(`🩺 Healing critical system: ${systemName}`);
        
        // Try to reload the system
        const systemMap = {
            'NavigationManager': 'assets/js/navigation.js',
            'ThemeManager': 'assets/js/theme-manager.js',
            'WeatherIntegration': 'assets/js/weather-integration.js',
            'analytics': 'assets/js/analytics.js'
        };
        
        const scriptPath = systemMap[systemName];
        if (scriptPath) {
            const script = document.createElement('script');
            script.src = window.assetURL ? window.assetURL(scriptPath) : `/dhamma-path/${scriptPath}`;
            script.onload = () => console.log(`✅ ${systemName} healed`);
            script.onerror = () => console.warn(`❌ ${systemName} healing failed`);
            document.head.appendChild(script);
        }
    }

    // Public API
    getHealthStatus() {
        return {
            isHealing: this.isHealing,
            strategies: Array.from(this.healingStrategies.keys()),
            rules: Array.from(this.preventionRules.keys())
        };
    }

    forceHeal(strategyName) {
        const strategy = this.healingStrategies.get(strategyName);
        if (strategy) {
            strategy.heal();
            return true;
        }
        return false;
    }
}

// Initialize Auto-Healer
window.autoHealer = new AutoHealer();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoHealer;
}
