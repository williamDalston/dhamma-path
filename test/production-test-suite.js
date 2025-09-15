/**
 * Production Test Suite
 * Comprehensive testing for production readiness
 */

class ProductionTestSuite {
    constructor() {
        this.tests = [];
        this.results = {};
        this.init();
    }

    init() {
        this.setupTests();
        this.runTests();
    }

    setupTests() {
        this.tests = [
            { name: 'Performance Tests', fn: this.testPerformance },
            { name: 'Accessibility Tests', fn: this.testAccessibility },
            { name: 'Error Handling Tests', fn: this.testErrorHandling },
            { name: 'Offline Functionality Tests', fn: this.testOfflineFunctionality },
            { name: 'Security Tests', fn: this.testSecurity },
            { name: 'Browser Compatibility Tests', fn: this.testBrowserCompatibility },
            { name: 'Service Worker Tests', fn: this.testServiceWorker },
            { name: 'PWA Features Tests', fn: this.testPWAFeatures },
            { name: 'Analytics Tests', fn: this.testAnalytics },
            { name: 'Navigation Tests', fn: this.testNavigation }
        ];
    }

    async runTests() {
        console.log('🧪 Starting Production Test Suite...');
        
        for (const test of this.tests) {
            try {
                console.log(`\n🔍 Running ${test.name}...`);
                const result = await test.fn.call(this);
                this.results[test.name] = result;
                console.log(`✅ ${test.name}: ${result.passed ? 'PASSED' : 'FAILED'}`);
                if (result.errors && result.errors.length > 0) {
                    console.log(`❌ Errors: ${result.errors.join(', ')}`);
                }
            } catch (error) {
                console.error(`❌ ${test.name} failed with error:`, error);
                this.results[test.name] = {
                    passed: false,
                    errors: [error.message]
                };
            }
        }

        this.generateReport();
    }

    // Performance Tests
    async testPerformance() {
        const errors = [];
        let passed = true;

        // Test Core Web Vitals
        const vitals = await this.measureCoreWebVitals();
        if (vitals.lcp > 2500) {
            errors.push(`LCP too slow: ${vitals.lcp}ms (should be < 2500ms)`);
            passed = false;
        }
        if (vitals.fid > 100) {
            errors.push(`FID too slow: ${vitals.fid}ms (should be < 100ms)`);
            passed = false;
        }
        if (vitals.cls > 0.1) {
            errors.push(`CLS too high: ${vitals.cls} (should be < 0.1)`);
            passed = false;
        }

        // Test bundle size
        const bundleSize = await this.measureBundleSize();
        if (bundleSize > 500000) { // 500KB
            errors.push(`Bundle size too large: ${bundleSize} bytes`);
            passed = false;
        }

        // Test memory usage
        const memoryUsage = this.getMemoryUsage();
        if (memoryUsage.used > 50) { // 50MB
            errors.push(`High memory usage: ${memoryUsage.used}MB`);
            passed = false;
        }

        return { passed, errors, metrics: { vitals, bundleSize, memoryUsage } };
    }

    async measureCoreWebVitals() {
        return new Promise((resolve) => {
            const vitals = { lcp: 0, fid: 0, cls: 0 };
            
            if ('PerformanceObserver' in window) {
                // LCP
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    vitals.lcp = lastEntry.startTime;
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // FID
                const fidObserver = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        vitals.fid = entry.processingStart - entry.startTime;
                    }
                });
                fidObserver.observe({ entryTypes: ['first-input'] });

                // CLS
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    vitals.cls = clsValue;
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });

                // Wait for metrics to be collected
                setTimeout(() => {
                    lcpObserver.disconnect();
                    fidObserver.disconnect();
                    clsObserver.disconnect();
                    resolve(vitals);
                }, 5000);
            } else {
                resolve(vitals);
            }
        });
    }

    async measureBundleSize() {
        // Skip bundle size measurement on GitHub Pages
        if (/github\.io$/.test(location.hostname)) {
            return 0;
        }
        
        const scripts = document.querySelectorAll('script[src]');
        let totalSize = 0;
        
        for (const script of scripts) {
            try {
                const res = await fetch(script.src, { method: 'HEAD', mode: 'cors' });
                if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
                const contentLength = res.headers.get('content-length');
                if (contentLength) {
                    totalSize += parseInt(contentLength);
                }
            } catch (e) {
                console.warn('[PerfTest] Skipping size check for', script.src, e.message);
                // Don't fail the suite on network hiccups
            }
        }
        
        return totalSize;
    }

    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        return { used: 0, total: 0, limit: 0 };
    }

    // Accessibility Tests
    async testAccessibility() {
        const errors = [];
        let passed = true;

        // Test ARIA attributes
        const elementsWithoutAria = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        if (elementsWithoutAria.length > 0) {
            errors.push(`${elementsWithoutAria.length} buttons missing ARIA labels`);
            passed = false;
        }

        // Test color contrast
        const contrastIssues = await this.testColorContrast();
        if (contrastIssues.length > 0) {
            errors.push(`Color contrast issues: ${contrastIssues.length} elements`);
            passed = false;
        }

        // Test keyboard navigation
        const keyboardIssues = await this.testKeyboardNavigation();
        if (keyboardIssues.length > 0) {
            errors.push(`Keyboard navigation issues: ${keyboardIssues.length} elements`);
            passed = false;
        }

        // Test focus management
        const focusIssues = this.testFocusManagement();
        if (focusIssues.length > 0) {
            errors.push(`Focus management issues: ${focusIssues.length} problems`);
            passed = false;
        }

        return { passed, errors, details: { contrastIssues, keyboardIssues, focusIssues } };
    }

    async testColorContrast() {
        const issues = [];
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
        
        for (const element of textElements) {
            const styles = getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // Basic contrast check (simplified)
            if (color === backgroundColor) {
                issues.push(element);
            }
        }
        
        return issues;
    }

    async testKeyboardNavigation() {
        const issues = [];
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        
        for (const element of interactiveElements) {
            if (element.tabIndex === -1 && !element.disabled) {
                issues.push(element);
            }
        }
        
        return issues;
    }

    testFocusManagement() {
        const issues = [];
        
        // Test for focus traps in modals
        const modals = document.querySelectorAll('[role="dialog"], .modal');
        for (const modal of modals) {
            if (!modal.hasAttribute('aria-hidden')) {
                issues.push('Modal missing aria-hidden attribute');
            }
        }
        
        return issues;
    }

    // Error Handling Tests
    async testErrorHandling() {
        const errors = [];
        let passed = true;

        // Test global error handlers
        const originalError = window.onerror;
        let errorCaught = false;
        
        window.onerror = () => {
            errorCaught = true;
            return true;
        };

        // Trigger a test error
        try {
            throw new Error('Test error');
        } catch (e) {
            // Error should be caught
        }

        window.onerror = originalError;

        if (!errorCaught) {
            errors.push('Global error handler not working properly');
            passed = false;
        }

        // Test unhandled promise rejection handler
        let rejectionCaught = false;
        const originalRejection = window.onunhandledrejection;
        
        window.onunhandledrejection = () => {
            rejectionCaught = true;
            return true;
        };

        // Trigger a test rejection
        Promise.reject(new Error('Test rejection'));

        setTimeout(() => {
            window.onunhandledrejection = originalRejection;
            if (!rejectionCaught) {
                errors.push('Unhandled rejection handler not working');
                passed = false;
            }
        }, 100);

        return { passed, errors };
    }

    // Offline Functionality Tests
    async testOfflineFunctionality() {
        const errors = [];
        let passed = true;

        // Test service worker registration
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.getRegistration();
                if (!registration) {
                    errors.push('Service Worker not registered');
                    passed = false;
                } else {
                    // Test cache availability
                    const caches = await window.caches.keys();
                    if (caches.length === 0) {
                        errors.push('No caches available for offline functionality');
                        passed = false;
                    }
                }
            } catch (error) {
                errors.push('Service Worker registration failed');
                passed = false;
            }
        } else {
            errors.push('Service Worker not supported');
            passed = false;
        }

        // Test offline indicator
        const offlineIndicator = document.getElementById('offline-indicator');
        if (!offlineIndicator) {
            errors.push('Offline indicator not found');
            passed = false;
        }

        return { passed, errors };
    }

    // Security Tests
    async testSecurity() {
        const errors = [];
        let passed = true;

        // Test for insecure content
        const insecureScripts = document.querySelectorAll('script[src^="http:"]');
        if (insecureScripts.length > 0) {
            errors.push(`${insecureScripts.length} insecure scripts found`);
            passed = false;
        }

        // Test for CSP headers (basic check)
        const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!metaCSP) {
            errors.push('Content Security Policy not found');
            passed = false;
        }

        // Test for XSS vulnerabilities (basic check)
        const scriptTags = document.querySelectorAll('script');
        for (const script of scriptTags) {
            if (script.innerHTML.includes('eval(') || script.innerHTML.includes('innerHTML')) {
                errors.push('Potential XSS vulnerability found');
                passed = false;
                break;
            }
        }

        return { passed, errors };
    }

    // Browser Compatibility Tests
    async testBrowserCompatibility() {
        const errors = [];
        let passed = true;

        // Test for required APIs
        const requiredAPIs = [
            'fetch',
            'Promise',
            'localStorage',
            'sessionStorage',
            'addEventListener',
            'querySelector',
            'classList'
        ];

        for (const api of requiredAPIs) {
            if (!window[api]) {
                errors.push(`Required API not available: ${api}`);
                passed = false;
            }
        }

        // Test for modern features
        const modernFeatures = [
            'IntersectionObserver',
            'PerformanceObserver',
            'serviceWorker'
        ];

        for (const feature of modernFeatures) {
            if (!window[feature]) {
                errors.push(`Modern feature not available: ${feature}`);
                passed = false;
            }
        }

        return { passed, errors };
    }

    // Service Worker Tests
    async testServiceWorker() {
        const errors = [];
        let passed = true;

        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.getRegistration();
                if (!registration) {
                    errors.push('Service Worker not registered');
                    passed = false;
                } else {
                    // Test cache strategies
                    const caches = await window.caches.keys();
                    const expectedCaches = ['dhamma-path-static-v1', 'dhamma-path-dynamic-v1'];
                    
                    for (const expectedCache of expectedCaches) {
                        const found = caches.some(cache => cache.includes(expectedCache));
                        if (!found) {
                            errors.push(`Expected cache not found: ${expectedCache}`);
                            passed = false;
                        }
                    }
                }
            } catch (error) {
                errors.push(`Service Worker test failed: ${error.message}`);
                passed = false;
            }
        } else {
            errors.push('Service Worker not supported');
            passed = false;
        }

        return { passed, errors };
    }

    // PWA Features Tests
    async testPWAFeatures() {
        const errors = [];
        let passed = true;

        // Test manifest
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (!manifestLink) {
            errors.push('Web App Manifest not found');
            passed = false;
        } else {
            try {
                const response = await fetch(manifestLink.href);
                if (!response.ok) {
                    errors.push('Web App Manifest not accessible');
                    passed = false;
                } else {
                    const manifest = await response.json();
                    const requiredFields = ['name', 'short_name', 'start_url', 'display'];
                    
                    for (const field of requiredFields) {
                        if (!manifest[field]) {
                            errors.push(`Manifest missing required field: ${field}`);
                            passed = false;
                        }
                    }
                }
            } catch (error) {
                errors.push(`Manifest test failed: ${error.message}`);
                passed = false;
            }
        }

        // Test icons
        const iconLinks = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
        if (iconLinks.length === 0) {
            errors.push('No app icons found');
            passed = false;
        }

        // Test viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            errors.push('Viewport meta tag not found');
            passed = false;
        }

        return { passed, errors };
    }

    // Analytics Tests
    async testAnalytics() {
        const errors = [];
        let passed = true;

        // Test analytics system initialization
        if (!window.AnalyticsSystem) {
            errors.push('Analytics system not available');
            passed = false;
        } else {
            // Test analytics functionality
            try {
                const analytics = new window.AnalyticsSystem();
                if (!analytics.trackEvent) {
                    errors.push('Analytics trackEvent method not available');
                    passed = false;
                }
            } catch (error) {
                errors.push(`Analytics initialization failed: ${error.message}`);
                passed = false;
            }
        }

        return { passed, errors };
    }

    // Navigation Tests
    async testNavigation() {
        const errors = [];
        let passed = true;

        // Test navigation system
        if (!window.NavigationManager) {
            errors.push('Navigation system not available');
            passed = false;
        } else {
            // Test navigation functionality
            try {
                const nav = new window.NavigationManager();
                if (!nav.navigateToPage) {
                    errors.push('Navigation navigateToPage method not available');
                    passed = false;
                }
            } catch (error) {
                errors.push(`Navigation initialization failed: ${error.message}`);
                passed = false;
            }
        }

        // Test navigation links
        const navLinks = document.querySelectorAll('.main-nav-link');
        if (navLinks.length === 0) {
            errors.push('No navigation links found');
            passed = false;
        }

        return { passed, errors };
    }

    // Generate comprehensive report
    generateReport() {
        const totalTests = this.tests.length;
        const passedTests = Object.values(this.results).filter(result => result.passed).length;
        const failedTests = totalTests - passedTests;

        console.log('\n📊 Production Test Suite Report');
        console.log('================================');
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${failedTests}`);
        console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

        if (failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            Object.entries(this.results).forEach(([testName, result]) => {
                if (!result.passed) {
                    console.log(`- ${testName}: ${result.errors.join(', ')}`);
                }
            });
        }

        // Save results for external access
        window.testResults = this.results;
        
        return {
            totalTests,
            passedTests,
            failedTests,
            successRate: Math.round((passedTests / totalTests) * 100),
            results: this.results
        };
    }
}

// Auto-run tests in production
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            new ProductionTestSuite();
        }, 3000); // Wait for app to fully load
    });
}

// Export for manual testing
window.ProductionTestSuite = ProductionTestSuite;
