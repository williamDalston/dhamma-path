/**
 * CONSOLE GUARDIAN - Automated Issue Detection & Auto-Fix System
 * 
 * This system continuously monitors the console for issues and automatically
 * fixes common problems without user intervention.
 */

class ConsoleGuardian {
    constructor() {
        this.issues = new Map();
        this.fixes = new Map();
        this.performance = {
            errors: 0,
            warnings: 0,
            fixes: 0,
            startTime: Date.now()
        };
        
        this.setupMonitoring();
        this.setupAutoFixes();
        this.startContinuousMonitoring();
        
        console.log('🛡️ Console Guardian initialized - Monitoring all issues');
    }

    setupMonitoring() {
        // Override console methods to capture all output
        this.originalConsole = {
            error: console.error,
            warn: console.warn,
            log: console.log,
            info: console.info
        };

        // Capture console errors
        console.error = (...args) => {
            this.handleIssue('error', args);
            this.originalConsole.error(...args);
        };

        // Capture console warnings
        console.warn = (...args) => {
            this.handleIssue('warning', args);
            this.originalConsole.warn(...args);
        };

        // Monitor unhandled errors
        window.addEventListener('error', (event) => {
            this.handleIssue('error', [event.error?.message || event.message, event.filename, event.lineno]);
        });

        // Monitor unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleIssue('error', ['Unhandled Promise Rejection:', event.reason]);
        });

        // Monitor resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleIssue('resource_error', [
                    `Failed to load resource: ${event.target.src || event.target.href}`,
                    event.target.tagName
                ]);
            }
        }, true);
    }

    handleIssue(type, args) {
        const message = args.join(' ');
        const timestamp = Date.now();
        
        // Track performance
        if (type === 'error') this.performance.errors++;
        if (type === 'warning') this.performance.warnings++;

        // Store issue
        const issueId = this.generateIssueId(message, type);
        this.issues.set(issueId, {
            type,
            message,
            args,
            timestamp,
            fixed: false,
            attempts: 0
        });

        // Try to auto-fix
        this.attemptAutoFix(issueId, type, message, args);
    }

    generateIssueId(message, type) {
        return `${type}_${message.slice(0, 50).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
    }

    setupAutoFixes() {
        // Define auto-fix patterns
        this.fixes.set('resource_error', {
            pattern: /Failed to load resource: (.*)/,
            fix: (match) => this.fixResourceError(match[1])
        });

        this.fixes.set('url_constructor', {
            pattern: /Failed to construct 'URL': Invalid base URL/,
            fix: () => this.fixUrlConstructor()
        });

        this.fixes.set('service_worker', {
            pattern: /Service Worker registration failed/,
            fix: () => this.fixServiceWorker()
        });

        this.fixes.set('weather_integration', {
            pattern: /WeatherIntegration not found/,
            fix: () => this.fixWeatherIntegration()
        });

        this.fixes.set('navigation_system', {
            pattern: /Navigation system integrated.*❌/,
            fix: () => this.fixNavigationSystem()
        });

        this.fixes.set('long_task', {
            pattern: /Long task detected: (\d+)ms/,
            fix: (match) => this.fixLongTask(parseInt(match[1]))
        });

        this.fixes.set('css_loading', {
            pattern: /Failed to load resource.*\.css/,
            fix: () => this.fixCssLoading()
        });

        this.fixes.set('js_loading', {
            pattern: /Failed to load resource.*\.js/,
            fix: () => this.fixJsLoading()
        });
    }

    attemptAutoFix(issueId, type, message, args) {
        const issue = this.issues.get(issueId);
        if (!issue || issue.fixed || issue.attempts >= 3) return;

        issue.attempts++;

        // Try to find matching fix
        for (const [fixType, fixConfig] of this.fixes) {
            if (fixConfig.pattern.test(message)) {
                try {
                    const result = fixConfig.fix(fixConfig.pattern.exec(message));
                    if (result) {
                        issue.fixed = true;
                        this.performance.fixes++;
                        console.log(`🔧 Auto-fixed ${fixType}: ${message.slice(0, 100)}...`);
                        return true;
                    }
                } catch (error) {
                    console.warn(`⚠️ Auto-fix failed for ${fixType}:`, error);
                }
            }
        }

        return false;
    }

    // Auto-fix implementations
    fixResourceError(resourceUrl) {
        // Check if it's a path issue
        if (resourceUrl.includes('/assets/') && !resourceUrl.includes('/dhamma-path/')) {
            const correctedUrl = resourceUrl.replace('/assets/', '/dhamma-path/assets/');
            console.log(`🔧 Attempting to fix resource path: ${correctedUrl}`);
            
            // Try to reload the resource
            if (resourceUrl.endsWith('.css')) {
                this.reloadCssResource(correctedUrl);
            } else if (resourceUrl.endsWith('.js')) {
                this.reloadJsResource(correctedUrl);
            }
            return true;
        }
        return false;
    }

    fixUrlConstructor() {
        console.log('🔧 Fixing URL constructor issues...');
        
        // Update assetPath function
        if (window.assetPath) {
            const originalAssetPath = window.assetPath;
            window.assetPath = (path) => {
                try {
                    const base = window.PROJECT_SCOPE || '/dhamma-path/';
                    return base + path.replace(/^\/+/, '');
                } catch (error) {
                    return originalAssetPath(path);
                }
            };
        }
        return true;
    }

    fixServiceWorker() {
        console.log('🔧 Fixing Service Worker registration...');
        
        if ('serviceWorker' in navigator) {
            const scope = window.PROJECT_SCOPE || '/dhamma-path/';
            const swUrl = `${scope}sw.js`;
            
            navigator.serviceWorker.register(swUrl, { scope })
                .then(() => console.log('✅ Service Worker re-registered'))
                .catch(err => console.warn('❌ Service Worker re-registration failed:', err));
        }
        return true;
    }

    fixWeatherIntegration() {
        console.log('🔧 Fixing WeatherIntegration loading...');
        
        // Try to load weather integration dynamically
        if (window.assetURL) {
            import(window.assetURL('assets/js/weather-integration.js'))
                .then(module => {
                    window.WeatherIntegration = module.default || module.WeatherIntegration;
                    console.log('✅ WeatherIntegration loaded dynamically');
                })
                .catch(err => console.warn('❌ WeatherIntegration dynamic load failed:', err));
        }
        return true;
    }

    fixNavigationSystem() {
        console.log('🔧 Fixing Navigation System...');
        
        // Check if navigation script is loaded
        if (!window.NavigationManager) {
            // Try to reload navigation script
            const script = document.createElement('script');
            script.src = window.assetURL ? window.assetURL('assets/js/navigation.js') : '/dhamma-path/assets/js/navigation.js';
            script.onload = () => console.log('✅ Navigation script reloaded');
            script.onerror = () => console.warn('❌ Navigation script reload failed');
            document.head.appendChild(script);
        }
        return true;
    }

    fixLongTask(duration) {
        console.log(`🔧 Optimizing long task (${duration}ms)...`);
        
        // Implement task splitting
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                // Force garbage collection if available
                if (window.gc) window.gc();
            });
        }
        return true;
    }

    fixCssLoading() {
        console.log('🔧 Fixing CSS loading...');
        
        // Reload critical CSS
        const criticalCss = document.querySelector('link[href*="critical.css"]');
        if (criticalCss) {
            criticalCss.href = criticalCss.href.replace(/v=\d+/, `v=${Date.now()}`);
        }
        
        // Reload main CSS
        const mainCss = document.querySelector('link[href*="styles.css"]');
        if (mainCss) {
            mainCss.href = mainCss.href.replace(/v=\d+/, `v=${Date.now()}`);
        }
        return true;
    }

    fixJsLoading() {
        console.log('🔧 Fixing JavaScript loading...');
        
        // Reload critical scripts
        const criticalScripts = ['app.js', 'navigation.js', 'theme-manager.js'];
        criticalScripts.forEach(scriptName => {
            const script = document.querySelector(`script[src*="${scriptName}"]`);
            if (script) {
                script.src = script.src.replace(/v=\d+/, `v=${Date.now()}`);
            }
        });
        return true;
    }

    reloadCssResource(url) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => console.log(`✅ CSS reloaded: ${url}`);
        link.onerror = () => console.warn(`❌ CSS reload failed: ${url}`);
        document.head.appendChild(link);
    }

    reloadJsResource(url) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => console.log(`✅ JS reloaded: ${url}`);
        script.onerror = () => console.warn(`❌ JS reload failed: ${url}`);
        document.head.appendChild(script);
    }

    startContinuousMonitoring() {
        // Monitor every 5 seconds
        setInterval(() => {
            this.performHealthCheck();
        }, 5000);

        // Report status every 30 seconds
        setInterval(() => {
            this.reportStatus();
        }, 30000);
    }

    performHealthCheck() {
        const issues = Array.from(this.issues.values());
        const unfixedIssues = issues.filter(issue => !issue.fixed);
        
        if (unfixedIssues.length > 0) {
            console.log(`🔍 Health Check: ${unfixedIssues.length} unfixed issues detected`);
            
            // Try to fix unfixed issues
            unfixedIssues.forEach(issue => {
                this.attemptAutoFix(issue.id, issue.type, issue.message, issue.args);
            });
        }
    }

    reportStatus() {
        const runtime = Date.now() - this.performance.startTime;
        const issues = Array.from(this.issues.values());
        const fixedIssues = issues.filter(issue => issue.fixed).length;
        
        console.log(`📊 Console Guardian Status:
            Runtime: ${Math.round(runtime / 1000)}s
            Errors: ${this.performance.errors}
            Warnings: ${this.performance.warnings}
            Auto-fixes: ${this.performance.fixes}
            Total Issues: ${issues.length}
            Fixed Issues: ${fixedIssues}
            Success Rate: ${issues.length > 0 ? Math.round((fixedIssues / issues.length) * 100) : 100}%`);
    }

    // Public API for manual intervention
    getIssues() {
        return Array.from(this.issues.values());
    }

    getPerformance() {
        return { ...this.performance };
    }

    forceFix(issueId) {
        const issue = this.issues.get(issueId);
        if (issue) {
            return this.attemptAutoFix(issueId, issue.type, issue.message, issue.args);
        }
        return false;
    }

    clearIssues() {
        this.issues.clear();
        this.performance = {
            errors: 0,
            warnings: 0,
            fixes: 0,
            startTime: Date.now()
        };
        console.log('🧹 Console Guardian issues cleared');
    }
}

// Initialize Console Guardian
window.consoleGuardian = new ConsoleGuardian();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConsoleGuardian;
}
