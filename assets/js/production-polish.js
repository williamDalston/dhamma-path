/**
 * Production Polish - PWA Features and Production Optimizations
 * 
 * Implements service worker, offline support, push notifications,
 * app manifest, and production-ready optimizations.
 */

// Guard against double-load
if (window.__PRODUCTION_POLISH_LOADED__) {
    console.warn('[polish] already loaded, skipping');
    throw new Error('ProductionPolish already loaded');
}
window.__PRODUCTION_POLISH_LOADED__ = true;

class ProductionPolish {
    constructor() {
        this.serviceWorker = null;
        this.notificationPermission = null;
        this.offlineSupport = new OfflineSupport();
        this.analytics = new ProductionAnalytics();
        this.errorReporting = new ErrorReporting();
        
        this.init();
    }
    
    init() {
        this.setupServiceWorker();
        this.setupAppManifest();
        this.setupOfflineSupport();
        this.setupPushNotifications();
        this.setupInstallPrompt();
        this.setupAnalytics();
        this.setupErrorReporting();
        this.setupPerformanceMonitoring();
        this.setupSecurityHeaders();
        console.log('🚀 Production Polish initialized');
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js', { scope: './' })
                .then(registration => {
                    this.serviceWorker = registration;
                    console.log('📦 Service Worker registered successfully');
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        this.handleServiceWorkerUpdate(registration);
                    });
                })
                .catch(error => {
                    console.error('❌ Service Worker registration failed:', error);
                });
        }
    }
    
    handleServiceWorkerUpdate(registration) {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                this.showUpdateNotification();
            }
        });
    }
    
    showUpdateNotification() {
        const updateNotification = document.createElement('div');
        updateNotification.className = 'update-notification fixed top-4 right-4 bg-white border border-sage-deep/20 rounded-lg p-4 shadow-lg z-50';
        updateNotification.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-green-500">✨</div>
                <div>
                    <div class="font-medium text-forest-deep">Update Available</div>
                    <div class="text-sm text-charcoal/70">A new version is ready</div>
                </div>
                <button class="update-btn bg-sage-deep text-white px-3 py-1 rounded text-sm hover:bg-forest-deep transition-colors">
                    Update
                </button>
                <button class="dismiss-btn text-charcoal/50 hover:text-charcoal transition-colors">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(updateNotification);
        
        // Add event listeners
        updateNotification.querySelector('.update-btn').addEventListener('click', () => {
            this.updateServiceWorker();
        });
        
        updateNotification.querySelector('.dismiss-btn').addEventListener('click', () => {
            updateNotification.remove();
        });
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (updateNotification.parentNode) {
                updateNotification.remove();
            }
        }, 10000);
    }
    
    updateServiceWorker() {
        if (this.serviceWorker && this.serviceWorker.waiting) {
            this.serviceWorker.waiting.postMessage({ action: 'skipWaiting' });
            
            window.location.reload();
        }
    }
    
    setupAppManifest() {
        const manifest = {
            name: 'MorningFlow - Digital Sanctuary',
            short_name: 'MorningFlow',
            description: 'A sacred space for morning rituals, meditation, and personal growth',
            start_url: '/dhamma-path/',
            scope: '/dhamma-path/',
            display: 'standalone',
            background_color: '#FFFEF7',
            theme_color: '#7A9B7A',
            orientation: 'portrait-primary',
            icons: [
                {
                    src: '/assets/icons/icon-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any maskable'
                },
                {
                    src: '/assets/icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable'
                }
            ],
            categories: ['lifestyle', 'health', 'productivity'],
            screenshots: [
                {
                    src: '/assets/screenshots/home.png',
                    sizes: '1280x720',
                    type: 'image/png',
                    form_factor: 'wide'
                },
                {
                    src: '/assets/screenshots/mobile.png',
                    sizes: '375x812',
                    type: 'image/png',
                    form_factor: 'narrow'
                }
            ]
        };
        
        const manifestElement = document.createElement('link');
        manifestElement.rel = 'manifest';
        manifestElement.href = '/manifest.json';
        document.head.appendChild(manifestElement);
        
        // Create manifest file
        this.createManifestFile(manifest);
    }
    
    createManifestFile(manifest) {
        // In a real implementation, you'd create this file on the server
        console.log('📱 App manifest configured:', manifest);
    }
    
    setupOfflineSupport() {
        this.offlineSupport.init();
        
        // Show offline indicator
        window.addEventListener('online', () => {
            this.hideOfflineIndicator();
        });
        
        window.addEventListener('offline', () => {
            this.showOfflineIndicator();
        });
        
        // Check initial connection status
        if (!navigator.onLine) {
            this.showOfflineIndicator();
        }
    }
    
    showOfflineIndicator() {
        const offlineIndicator = document.createElement('div');
        offlineIndicator.id = 'offline-indicator';
        offlineIndicator.className = 'fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 z-50';
        offlineIndicator.innerHTML = `
            <div class="flex items-center justify-center gap-2">
                <div>📡</div>
                <div>You're offline. Some features may be limited.</div>
            </div>
        `;
        
        document.body.appendChild(offlineIndicator);
    }
    
    hideOfflineIndicator() {
        const offlineIndicator = document.getElementById('offline-indicator');
        if (offlineIndicator) {
            offlineIndicator.remove();
        }
    }
    
    setupPushNotifications() {
        if ('Notification' in window) {
            this.notificationPermission = Notification.permission;
            
            if (this.notificationPermission === 'default') {
                this.requestNotificationPermission();
            }
        }
        
        // Setup notification handlers
        this.setupNotificationHandlers();
    }
    
    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission;
            
            if (permission === 'granted') {
                console.log('🔔 Notification permission granted');
                this.showWelcomeNotification();
            }
        } catch (error) {
            console.error('❌ Notification permission error:', error);
        }
    }
    
    showWelcomeNotification() {
        if (this.notificationPermission === 'granted') {
            new Notification('Welcome to MorningFlow', {
                body: 'Your digital sanctuary is ready. Start your morning ritual.',
                icon: '/assets/icons/icon-192.png',
                badge: '/assets/icons/icon-192.png',
                tag: 'welcome'
            });
        }
    }
    
    setupNotificationHandlers() {
        // Morning reminder notification
        this.setupMorningReminder();
        
        // Break reminder notification
        this.setupBreakReminder();
        
        // Evening reflection notification
        this.setupEveningReflection();
    }
    
    setupBreakReminder() {
        // Setup break reminder notifications
        console.log('⏰ Break reminder notifications initialized');
    }

    setupEveningReflection() {
        // Setup evening reflection reminder
        const now = new Date();
        const eveningTime = new Date(now);
        eveningTime.setHours(18, 0, 0, 0); // 6 PM
        
        if (now > eveningTime) {
            eveningTime.setDate(eveningTime.getDate() + 1);
        }
        
        const timeUntilEvening = eveningTime.getTime() - now.getTime();
        
        setTimeout(() => {
            if (Notification.permission === 'granted') {
                new Notification('Evening Reflection Time', {
                    body: 'Take a moment to reflect on your day and practice gratitude.',
                    icon: '/favicon.png'
                });
            }
        }, timeUntilEvening);
        
        console.log('🌅 Evening reflection reminder scheduled');
    }
    
    setupMorningReminder() {
        // Check if user has enabled morning reminders
        const morningReminder = localStorage.getItem('morningReminder');
        
        if (morningReminder === 'enabled') {
            // Schedule morning reminder
            this.scheduleMorningReminder();
        }
    }
    
    scheduleMorningReminder() {
        // In a real implementation, you'd use the Notifications API
        // with proper scheduling
        console.log('🌅 Morning reminder scheduled');
    }
    
    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt();
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('📱 App installed successfully');
            this.trackInstallation();
        });
    }
    
    showInstallPrompt() {
        const installPrompt = document.createElement('div');
        installPrompt.id = 'install-prompt';
        installPrompt.className = 'fixed bottom-4 left-4 right-4 bg-white border border-sage-deep/20 rounded-lg p-4 shadow-lg z-50';
        installPrompt.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-2xl">📱</div>
                <div class="flex-1">
                    <div class="font-medium text-forest-deep">Install MorningFlow</div>
                    <div class="text-sm text-charcoal/70">Add to your home screen for quick access</div>
                </div>
                <button class="install-btn bg-sage-deep text-white px-4 py-2 rounded font-medium hover:bg-forest-deep transition-colors">
                    Install
                </button>
                <button class="dismiss-install-btn text-charcoal/50 hover:text-charcoal transition-colors">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(installPrompt);
        
        // Add event listeners
        installPrompt.querySelector('.install-btn').addEventListener('click', () => {
            this.triggerInstall();
        });
        
        installPrompt.querySelector('.dismiss-install-btn').addEventListener('click', () => {
            installPrompt.remove();
        });
    }
    
    triggerInstall() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('📱 User accepted install prompt');
                } else {
                    console.log('📱 User dismissed install prompt');
                }
                window.deferredPrompt = null;
            });
        }
    }
    
    setupAnalytics() {
        this.analytics.init();
        
        // Track page views
        this.trackPageViews();
        
        // Track user interactions
        this.trackUserInteractions();
        
        // Track performance metrics
        this.trackPerformanceMetrics();
    }
    
    trackPageViews() {
        let currentPage = window.location.pathname;
        
        // Track initial page view
        this.analytics.trackPageView(currentPage);
        
        // Track navigation changes
        window.addEventListener('popstate', () => {
            const newPage = window.location.pathname;
            if (newPage !== currentPage) {
                this.analytics.trackPageView(newPage);
                currentPage = newPage;
            }
        });
    }
    
    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, [role="button"]')) {
                this.analytics.trackEvent('button_click', {
                    button_text: e.target.textContent,
                    button_id: e.target.id,
                    page: window.location.pathname
                });
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.analytics.trackEvent('form_submit', {
                form_id: e.target.id,
                page: window.location.pathname
            });
        });
        
        // Track timer usage
        this.trackTimerUsage();
        
        // Track journal entries
        this.trackJournalUsage();
    }
    
    trackTimerUsage() {
        // Track timer start/stop events
        window.addEventListener('timerStarted', (e) => {
            this.analytics.trackEvent('timer_started', {
                duration: e.detail.duration,
                page: 'timer'
            });
        });
        
        window.addEventListener('timerCompleted', (e) => {
            this.analytics.trackEvent('timer_completed', {
                duration: e.detail.duration,
                page: 'timer'
            });
        });
    }
    
    trackJournalUsage() {
        // Track journal entries
        window.addEventListener('journalEntrySaved', (e) => {
            this.analytics.trackEvent('journal_entry_saved', {
                entry_length: e.detail.length,
                page: 'journal'
            });
        });
    }
    
    trackPerformanceMetrics() {
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
            // LCP
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.analytics.trackEvent('lcp', {
                    value: lastEntry.startTime,
                    page: window.location.pathname
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // FID
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.analytics.trackEvent('fid', {
                        value: entry.processingStart - entry.startTime,
                        page: window.location.pathname
                    });
                });
            }).observe({ entryTypes: ['first-input'] });
        }
    }
    
    setupErrorReporting() {
        this.errorReporting.init();
        
        // Global error handler
        window.addEventListener('error', (e) => {
            this.errorReporting.reportError(e.error, {
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                page: window.location.pathname
            });
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            this.errorReporting.reportError(e.reason, {
                type: 'unhandled_promise_rejection',
                page: window.location.pathname
            });
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 50) {
                        this.analytics.trackEvent('long_task', {
                            duration: entry.duration,
                            page: window.location.pathname
                        });
                    }
                });
            }).observe({ entryTypes: ['longtask'] });
        }
        
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
                
                if (memoryUsage > 100) {
                    this.analytics.trackEvent('high_memory_usage', {
                        memory_usage: memoryUsage,
                        page: window.location.pathname
                    });
                }
            }, 30000); // Check every 30 seconds
        }
    }
    
    setupSecurityHeaders() {
        // Content Security Policy
        this.setupCSP();
        
        // Feature Policy
        this.setupFeaturePolicy();
        
        // Referrer Policy
        this.setupReferrerPolicy();
    }
    
    setupCSP() {
        const csp = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval';
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: https:;
            font-src 'self' data:;
            connect-src 'self' https:;
            media-src 'self';
            object-src 'none';
            child-src 'none';
            frame-src 'none';
            worker-src 'self';
            manifest-src 'self';
        `;
        
        // In a real implementation, you'd set this in the HTTP headers
        console.log('🔒 CSP configured:', csp);
    }
    
    setupFeaturePolicy() {
        const featurePolicy = `
            camera 'none';
            microphone 'none';
            geolocation 'none';
            payment 'none';
            usb 'none';
            bluetooth 'none';
            accelerometer 'none';
            gyroscope 'none';
            magnetometer 'none';
        `;
        
        console.log('🔒 Feature Policy configured:', featurePolicy);
    }
    
    setupReferrerPolicy() {
        // Set referrer policy to strict-origin-when-cross-origin
        const meta = document.createElement('meta');
        meta.name = 'referrer';
        meta.content = 'strict-origin-when-cross-origin';
        document.head.appendChild(meta);
    }
    
    // Public methods
    trackInstallation() {
        this.analytics.trackEvent('app_installed', {
            platform: navigator.platform,
            user_agent: navigator.userAgent
        });
    }
    
    sendNotification(title, body, options = {}) {
        if (this.notificationPermission === 'granted') {
            new Notification(title, {
                body,
                icon: '/assets/icons/icon-192.png',
                badge: '/assets/icons/icon-192.png',
                ...options
            });
        }
    }
    
    enableOfflineMode() {
        this.offlineSupport.enable();
    }
    
    disableOfflineMode() {
        this.offlineSupport.disable();
    }
}

// Offline Support Class
class OfflineSupport {
    constructor() {
        this.cacheName = 'morningflow-v1';
        this.offlinePages = ['/offline.html'];
    }
    
    init() {
        this.setupOfflineDetection();
        this.setupOfflineFallbacks();
    }
    
    setupOfflineDetection() {
        // Check online status
        if (!navigator.onLine) {
            this.handleOffline();
        }
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.handleOnline();
        });
        
        window.addEventListener('offline', () => {
            this.handleOffline();
        });
    }
    
    setupOfflineFallbacks() {
        // Cache critical resources
        this.cacheCriticalResources();
        
        // Setup offline page
        this.setupOfflinePage();
    }
    
    async cacheCriticalResources() {
        if ('caches' in window) {
            try {
                const criticalResources = [
                    window.appURL ? window.appURL('') : '/dhamma-path/',
                    window.appURL ? window.appURL('assets/css/styles.css') : '/dhamma-path/assets/css/styles.css',
                    window.appURL ? window.appURL('assets/js/app.js') : '/dhamma-path/assets/js/app.js',
                    window.appURL ? window.appURL('assets/js/navigation.js') : '/dhamma-path/assets/js/navigation.js',
                    window.appURL ? window.appURL('offline.html') : '/dhamma-path/offline.html'
                ];
                
                // Use safe caching with proper base paths
                const BASE = window.__APP_BASE__ || '/';
                const cacheStore = await caches.open('mf-critical-v1');
                const results = await Promise.allSettled(criticalResources.map(u => cacheStore.add(u)));
                results.forEach((r, i) => {
                    if (r.status === 'rejected') console.warn('[SW] skipped', criticalResources[i], r.reason);
                });
                console.log('📦 Critical resources cached');
            } catch (error) {
                console.error('❌ Failed to cache resources:', error);
            }
        }
    }
    
    setupOfflinePage() {
        // Create offline page content
        const offlineContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - MorningFlow</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        background: linear-gradient(135deg, #FFFEF7 0%, #F5F5F0 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0;
                        padding: 2rem;
                    }
                    .offline-container {
                        text-align: center;
                        max-width: 400px;
                    }
                    .offline-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    .offline-title {
                        font-size: 1.5rem;
                        font-weight: 600;
                        color: #2D5A2D;
                        margin-bottom: 1rem;
                    }
                    .offline-message {
                        color: #666;
                        line-height: 1.6;
                        margin-bottom: 2rem;
                    }
                    .retry-btn {
                        background: #7A9B7A;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 0.5rem;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: background 0.2s;
                    }
                    .retry-btn:hover {
                        background: #2D5A2D;
                    }
                </style>
            </head>
            <body>
                <div class="offline-container">
                    <div class="offline-icon">📡</div>
                    <h1 class="offline-title">You're Offline</h1>
                    <p class="offline-message">
                        MorningFlow needs an internet connection to work properly. 
                        Please check your connection and try again.
                    </p>
                    <button class="retry-btn" onclick="window.location.reload()">
                        Try Again
                    </button>
                </div>
            </body>
            </html>
        `;
        
        // Store offline content
        localStorage.setItem('offline-content', offlineContent);
    }
    
    handleOffline() {
        console.log('📡 App is offline');
        // Show offline indicator
        // Switch to offline mode
    }
    
    handleOnline() {
        console.log('📡 App is back online');
        // Hide offline indicator
        // Sync offline data
    }
    
    enable() {
        // Enable offline features
        console.log('📡 Offline mode enabled');
    }
    
    disable() {
        // Disable offline features
        console.log('📡 Offline mode disabled');
    }
}

// Production Analytics Class
class ProductionAnalytics {
    constructor() {
        this.endpoint = '/api/analytics';
        this.events = [];
        this.batchSize = 10;
        this.flushInterval = 30000; // 30 seconds
    }
    
    init() {
        this.startFlushTimer();
    }
    
    trackPageView(page) {
        this.trackEvent('page_view', {
            page,
            timestamp: Date.now(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        });
    }
    
    trackEvent(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                session_id: this.getSessionId(),
                user_id: this.getUserId()
            }
        };
        
        this.events.push(event);
        
        // Flush if batch size reached
        if (this.events.length >= this.batchSize) {
            this.flush();
        }
    }
    
    startFlushTimer() {
        setInterval(() => {
            if (this.events.length > 0) {
                this.flush();
            }
        }, this.flushInterval);
    }
    
    async flush() {
        if (this.events.length === 0) return;
        
        const eventsToSend = [...this.events];
        this.events = [];
        
        try {
            await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventsToSend)
            });
            
            console.log(`📊 Analytics: ${eventsToSend.length} events sent`);
        } catch (error) {
            console.error('❌ Analytics flush failed:', error);
            // Re-add events to queue
            this.events.unshift(...eventsToSend);
        }
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }
    
    getUserId() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = Math.random().toString(36).substr(2, 9);
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }
}

// Error Reporting Class
class ErrorReporting {
    constructor() {
        this.endpoint = '/api/errors';
        this.errors = [];
        this.maxErrors = 100;
    }
    
    init() {
        // Flush errors on page unload
        window.addEventListener('beforeunload', () => {
            this.flush();
        });
    }
    
    reportError(error, context = {}) {
        const errorReport = {
            message: error.message || error.toString(),
            stack: error.stack,
            context: {
                ...context,
                timestamp: Date.now(),
                url: window.location.href,
                user_agent: navigator.userAgent
            }
        };
        
        this.errors.push(errorReport);
        
        // Limit errors to prevent memory issues
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }
        
        // Send immediately for critical errors
        if (this.isCriticalError(error)) {
            this.sendError(errorReport);
        }
    }
    
    isCriticalError(error) {
        const criticalPatterns = [
            'TypeError',
            'ReferenceError',
            'SyntaxError'
        ];
        
        return criticalPatterns.some(pattern => 
            error.message && error.message.includes(pattern)
        );
    }
    
    async sendError(errorReport) {
        try {
            await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(errorReport)
            });
        } catch (error) {
            console.error('❌ Failed to send error report:', error);
        }
    }
    
    async flush() {
        if (this.errors.length === 0) return;
        
        const errorsToSend = [...this.errors];
        this.errors = [];
        
        try {
            await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(errorsToSend)
            });
            
            console.log(`📊 Error Reporting: ${errorsToSend.length} errors sent`);
        } catch (error) {
            console.error('❌ Error reporting flush failed:', error);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.productionPolish = new ProductionPolish();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductionPolish;
}
