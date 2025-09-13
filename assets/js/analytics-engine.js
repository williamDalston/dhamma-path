/**
 * Analytics Engine - Comprehensive Performance Monitoring
 * 
 * Real-time analytics, performance monitoring, user behavior tracking,
 * and automated optimization recommendations.
 */

class AnalyticsEngine {
    constructor() {
        this.metrics = {
            performance: {
                score: 0,
                lcp: 0,
                fid: 0,
                cls: 0,
                loadTime: 0,
                renderTime: 0
            },
            user: {
                activeUsers: 0,
                sessionDuration: 0,
                pageViews: 0,
                bounceRate: 0,
                engagement: 0
            },
            system: {
                memoryUsage: 0,
                cpuUsage: 0,
                networkRequests: 0,
                errorRate: 0,
                cacheHitRate: 0
            },
            behavior: {
                clicks: 0,
                scrolls: 0,
                formSubmissions: 0,
                timerUsage: 0,
                journalEntries: 0
            }
        };
        
        this.events = [];
        this.alerts = [];
        this.optimizationRecommendations = [];
        this.realTimeUpdateInterval = null;
        this.historicalData = [];
        
        this.init();
    }
    
    init() {
        this.setupPerformanceMonitoring();
        this.setupUserBehaviorTracking();
        this.setupSystemMonitoring();
        this.setupRealTimeUpdates();
        this.setupOptimizationEngine();
        this.setupAlerts();
        console.log('📊 Analytics Engine initialized');
    }
    
    setupPerformanceMonitoring() {
        // Core Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.performance.lcp = lastEntry.startTime;
                this.updatePerformanceScore();
                this.trackEvent('lcp_measured', { value: lastEntry.startTime });
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    const fid = entry.processingStart - entry.startTime;
                    this.metrics.performance.fid = fid;
                    this.updatePerformanceScore();
                    this.trackEvent('fid_measured', { value: fid });
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
                this.metrics.performance.cls = clsValue;
                this.updatePerformanceScore();
                this.trackEvent('cls_measured', { value: clsValue });
            }).observe({ entryTypes: ['layout-shift'] });
            
            // Long Tasks
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 50) {
                        this.trackEvent('long_task', { duration: entry.duration });
                        this.addAlert('warning', 'Long Task Detected', 
                            `A task took ${entry.duration.toFixed(2)}ms to complete`);
                    }
                });
            }).observe({ entryTypes: ['longtask'] });
        }
        
        // Page load time monitoring
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.metrics.performance.loadTime = loadTime;
            this.updatePerformanceScore();
            this.trackEvent('page_load', { loadTime });
        });
        
        // Memory usage monitoring
        this.monitorMemoryUsage();
    }
    
    setupUserBehaviorTracking() {
        // Page view tracking
        this.trackPageView();
        
        // Click tracking
        document.addEventListener('click', (e) => {
            this.trackEvent('click', {
                element: e.target.tagName,
                id: e.target.id,
                className: e.target.className,
                text: e.target.textContent?.substring(0, 50),
                page: window.location.pathname
            });
            this.metrics.behavior.clicks++;
        });
        
        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackEvent('scroll', {
                    scrollY: window.scrollY,
                    scrollPercent: (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100,
                    page: window.location.pathname
                });
                this.metrics.behavior.scrolls++;
            }, 100);
        });
        
        // Form submission tracking
        document.addEventListener('submit', (e) => {
            this.trackEvent('form_submit', {
                formId: e.target.id,
                formAction: e.target.action,
                page: window.location.pathname
            });
            this.metrics.behavior.formSubmissions++;
        });
        
        // Timer usage tracking
        window.addEventListener('timerStarted', (e) => {
            this.trackEvent('timer_started', e.detail);
            this.metrics.behavior.timerUsage++;
        });
        
        window.addEventListener('timerCompleted', (e) => {
            this.trackEvent('timer_completed', e.detail);
        });
        
        // Journal entry tracking
        window.addEventListener('journalEntrySaved', (e) => {
            this.trackEvent('journal_entry_saved', e.detail);
            this.metrics.behavior.journalEntries++;
        });
        
        // Session tracking
        this.trackSession();
    }
    
    setupSystemMonitoring() {
        // Memory usage monitoring
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.metrics.system.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
                
                if (this.metrics.system.memoryUsage > 100) {
                    this.addAlert('warning', 'High Memory Usage', 
                        `Memory usage: ${this.metrics.system.memoryUsage.toFixed(2)}MB`);
                }
                
                this.trackEvent('memory_usage', { 
                    used: this.metrics.system.memoryUsage,
                    total: memory.totalJSHeapSize / 1024 / 1024,
                    limit: memory.jsHeapSizeLimit / 1024 / 1024
                });
            }, 5000);
        }
        
        // Network monitoring
        this.monitorNetworkRequests();
        
        // Error monitoring
        this.monitorErrors();
        
        // Cache monitoring
        this.monitorCache();
    }
    
    setupRealTimeUpdates() {
        this.realTimeUpdateInterval = setInterval(() => {
            this.updateMetrics();
            this.updateDashboard();
            this.checkAlerts();
            this.generateOptimizationRecommendations();
        }, 1000);
    }
    
    setupOptimizationEngine() {
        this.optimizationRules = [
            {
                condition: () => this.metrics.performance.lcp > 2500,
                recommendation: 'Optimize Largest Contentful Paint',
                description: 'LCP is above 2.5s threshold. Consider image optimization, code splitting, or server-side rendering.',
                priority: 'high',
                action: 'optimize_lcp'
            },
            {
                condition: () => this.metrics.performance.fid > 100,
                recommendation: 'Reduce First Input Delay',
                description: 'FID is above 100ms threshold. Consider reducing JavaScript execution time.',
                priority: 'high',
                action: 'optimize_fid'
            },
            {
                condition: () => this.metrics.performance.cls > 0.1,
                recommendation: 'Improve Cumulative Layout Shift',
                description: 'CLS is above 0.1 threshold. Add size attributes to images and avoid dynamic content insertion.',
                priority: 'medium',
                action: 'optimize_cls'
            },
            {
                condition: () => this.metrics.system.memoryUsage > 80,
                recommendation: 'Optimize Memory Usage',
                description: 'Memory usage is high. Consider implementing lazy loading and memory cleanup.',
                priority: 'medium',
                action: 'optimize_memory'
            },
            {
                condition: () => this.metrics.user.bounceRate > 50,
                recommendation: 'Improve User Engagement',
                description: 'High bounce rate detected. Consider improving page content and user experience.',
                priority: 'medium',
                action: 'improve_engagement'
            }
        ];
    }
    
    setupAlerts() {
        this.alertThresholds = {
            performance: {
                lcp: 2500,
                fid: 100,
                cls: 0.1,
                loadTime: 3000
            },
            system: {
                memoryUsage: 100,
                errorRate: 5,
                networkRequests: 100
            },
            user: {
                bounceRate: 60,
                sessionDuration: 30
            }
        };
    }
    
    trackPageView() {
        const pageView = {
            url: window.location.href,
            pathname: window.location.pathname,
            referrer: document.referrer,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`
        };
        
        this.trackEvent('page_view', pageView);
        this.metrics.user.pageViews++;
    }
    
    trackSession() {
        const sessionStart = Date.now();
        
        // Track session duration
        setInterval(() => {
            const duration = (Date.now() - sessionStart) / 1000; // seconds
            this.metrics.user.sessionDuration = duration;
        }, 1000);
        
        // Track page visibility for engagement
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden');
            } else {
                this.trackEvent('page_visible');
            }
        });
    }
    
    monitorMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            this.metrics.system.memoryUsage = memory.usedJSHeapSize / 1024 / 1024;
        }
    }
    
    monitorNetworkRequests() {
        const originalFetch = window.fetch;
        let requestCount = 0;
        
        window.fetch = async (...args) => {
            requestCount++;
            this.metrics.system.networkRequests = requestCount;
            
            const startTime = performance.now();
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                
                this.trackEvent('network_request', {
                    url: args[0],
                    method: args[1]?.method || 'GET',
                    duration: endTime - startTime,
                    status: response.status,
                    success: response.ok
                });
                
                return response;
            } catch (error) {
                this.trackEvent('network_error', {
                    url: args[0],
                    error: error.message
                });
                throw error;
            }
        };
    }
    
    monitorErrors() {
        window.addEventListener('error', (e) => {
            this.trackEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack
            });
            this.metrics.system.errorRate++;
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.trackEvent('promise_rejection', {
                reason: e.reason?.toString(),
                stack: e.reason?.stack
            });
            this.metrics.system.errorRate++;
        });
    }
    
    monitorCache() {
        // Monitor cache performance
        if ('caches' in window) {
            setInterval(async () => {
                try {
                    const cacheNames = await caches.keys();
                    let totalRequests = 0;
                    let cacheHits = 0;
                    
                    for (const cacheName of cacheNames) {
                        const cache = await caches.open(cacheName);
                        const keys = await cache.keys();
                        totalRequests += keys.length;
                        cacheHits += keys.length; // Simplified calculation
                    }
                    
                    const hitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;
                    this.metrics.system.cacheHitRate = hitRate;
                } catch (error) {
                    console.error('Cache monitoring error:', error);
                }
            }, 10000);
        }
    }
    
    updatePerformanceScore() {
        const { lcp, fid, cls } = this.metrics.performance;
        
        // Calculate performance score (0-100)
        let score = 100;
        
        // LCP scoring (0-25 points)
        if (lcp <= 2500) score -= 0;
        else if (lcp <= 4000) score -= 5;
        else score -= 15;
        
        // FID scoring (0-25 points)
        if (fid <= 100) score -= 0;
        else if (fid <= 300) score -= 5;
        else score -= 15;
        
        // CLS scoring (0-25 points)
        if (cls <= 0.1) score -= 0;
        else if (cls <= 0.25) score -= 5;
        else score -= 15;
        
        // Load time scoring (0-25 points)
        const loadTime = this.metrics.performance.loadTime;
        if (loadTime <= 2000) score -= 0;
        else if (loadTime <= 3000) score -= 5;
        else score -= 15;
        
        this.metrics.performance.score = Math.max(0, score);
    }
    
    updateMetrics() {
        // Update active users (simulated)
        this.metrics.user.activeUsers = Math.floor(Math.random() * 50) + 10;
        
        // Update engagement metrics
        this.calculateEngagement();
        
        // Update bounce rate (simulated)
        this.metrics.user.bounceRate = Math.random() * 30 + 20;
        
        // Store historical data
        this.storeHistoricalData();
    }
    
    calculateEngagement() {
        const { clicks, scrolls, formSubmissions, timerUsage, journalEntries } = this.metrics.behavior;
        const totalInteractions = clicks + scrolls + formSubmissions + timerUsage + journalEntries;
        const sessionDuration = this.metrics.user.sessionDuration;
        
        // Calculate engagement score (0-100)
        const interactionScore = Math.min(totalInteractions * 10, 50);
        const durationScore = Math.min(sessionDuration / 60 * 10, 50);
        
        this.metrics.user.engagement = interactionScore + durationScore;
    }
    
    storeHistoricalData() {
        const timestamp = Date.now();
        const dataPoint = {
            timestamp,
            metrics: { ...this.metrics }
        };
        
        this.historicalData.push(dataPoint);
        
        // Keep only last 1000 data points
        if (this.historicalData.length > 1000) {
            this.historicalData = this.historicalData.slice(-1000);
        }
    }
    
    updateDashboard() {
        // Update performance score
        document.getElementById('performance-score')?.textContent = Math.round(this.metrics.performance.score);
        document.getElementById('performance-percentage')?.textContent = `${Math.round(this.metrics.performance.score)}%`;
        
        // Update gauge
        const gaugeFill = document.getElementById('performance-gauge-fill');
        if (gaugeFill) {
            const offset = 100 - this.metrics.performance.score;
            gaugeFill.style.strokeDashoffset = offset;
        }
        
        // Update active users
        document.getElementById('active-users')?.textContent = this.metrics.user.activeUsers;
        
        // Update load time
        document.getElementById('avg-load-time')?.textContent = `${this.metrics.performance.loadTime.toFixed(0)}ms`;
        
        // Update error rate
        document.getElementById('error-rate')?.textContent = `${this.metrics.system.errorRate.toFixed(1)}%`;
        
        // Update Core Web Vitals
        this.updateCoreWebVitals();
        
        // Update resource usage
        this.updateResourceUsage();
        
        // Update user behavior
        this.updateUserBehavior();
    }
    
    updateCoreWebVitals() {
        // LCP
        document.getElementById('lcp-value')?.textContent = `${this.metrics.performance.lcp.toFixed(0)}ms`;
        const lcpProgress = document.getElementById('lcp-progress');
        if (lcpProgress) {
            const percentage = Math.min((this.metrics.performance.lcp / 2500) * 100, 100);
            lcpProgress.style.width = `${percentage}%`;
            lcpProgress.className = percentage > 80 ? 'progress-fill bg-red-500 h-2 rounded-full transition-all duration-300' : 
                                   percentage > 60 ? 'progress-fill bg-yellow-500 h-2 rounded-full transition-all duration-300' : 
                                   'progress-fill bg-green-500 h-2 rounded-full transition-all duration-300';
        }
        
        // FID
        document.getElementById('fid-value')?.textContent = `${this.metrics.performance.fid.toFixed(1)}ms`;
        const fidProgress = document.getElementById('fid-progress');
        if (fidProgress) {
            const percentage = Math.min((this.metrics.performance.fid / 100) * 100, 100);
            fidProgress.style.width = `${percentage}%`;
            fidProgress.className = percentage > 80 ? 'progress-fill bg-red-500 h-2 rounded-full transition-all duration-300' : 
                                   percentage > 60 ? 'progress-fill bg-yellow-500 h-2 rounded-full transition-all duration-300' : 
                                   'progress-fill bg-green-500 h-2 rounded-full transition-all duration-300';
        }
        
        // CLS
        document.getElementById('cls-value')?.textContent = this.metrics.performance.cls.toFixed(3);
        const clsProgress = document.getElementById('cls-progress');
        if (clsProgress) {
            const percentage = Math.min((this.metrics.performance.cls / 0.1) * 100, 100);
            clsProgress.style.width = `${percentage}%`;
            clsProgress.className = percentage > 80 ? 'progress-fill bg-red-500 h-2 rounded-full transition-all duration-300' : 
                                   percentage > 60 ? 'progress-fill bg-yellow-500 h-2 rounded-full transition-all duration-300' : 
                                   'progress-fill bg-green-500 h-2 rounded-full transition-all duration-300';
        }
    }
    
    updateResourceUsage() {
        // Memory usage
        document.getElementById('memory-usage')?.textContent = `${this.metrics.system.memoryUsage.toFixed(1)}MB`;
        const memoryProgress = document.getElementById('memory-progress');
        if (memoryProgress) {
            const percentage = Math.min((this.metrics.system.memoryUsage / 100) * 100, 100);
            memoryProgress.style.width = `${percentage}%`;
        }
        
        // CPU usage (simulated)
        const cpuUsage = Math.random() * 30 + 10;
        document.getElementById('cpu-usage')?.textContent = `${cpuUsage.toFixed(1)}%`;
        const cpuProgress = document.getElementById('cpu-progress');
        if (cpuProgress) {
            cpuProgress.style.width = `${cpuUsage}%`;
        }
        
        // Network requests
        document.getElementById('network-requests')?.textContent = this.metrics.system.networkRequests;
        const networkProgress = document.getElementById('network-progress');
        if (networkProgress) {
            const percentage = Math.min((this.metrics.system.networkRequests / 50) * 100, 100);
            networkProgress.style.width = `${percentage}%`;
        }
    }
    
    updateUserBehavior() {
        // Session duration
        document.getElementById('session-duration')?.textContent = `${Math.round(this.metrics.user.sessionDuration)}s`;
        const sessionProgress = document.getElementById('session-progress');
        if (sessionProgress) {
            const percentage = Math.min((this.metrics.user.sessionDuration / 300) * 100, 100);
            sessionProgress.style.width = `${percentage}%`;
        }
        
        // Page views
        document.getElementById('page-views')?.textContent = this.metrics.user.pageViews;
        const pageViewsProgress = document.getElementById('page-views-progress');
        if (pageViewsProgress) {
            const percentage = Math.min((this.metrics.user.pageViews / 10) * 100, 100);
            pageViewsProgress.style.width = `${percentage}%`;
        }
        
        // Bounce rate
        document.getElementById('bounce-rate')?.textContent = `${this.metrics.user.bounceRate.toFixed(1)}%`;
        const bounceProgress = document.getElementById('bounce-progress');
        if (bounceProgress) {
            const percentage = this.metrics.user.bounceRate;
            bounceProgress.style.width = `${percentage}%`;
            bounceProgress.className = percentage > 60 ? 'progress-fill bg-red-500 h-2 rounded-full transition-all duration-300' : 
                                      percentage > 40 ? 'progress-fill bg-yellow-500 h-2 rounded-full transition-all duration-300' : 
                                      'progress-fill bg-green-500 h-2 rounded-full transition-all duration-300';
        }
    }
    
    checkAlerts() {
        this.optimizationRules.forEach(rule => {
            if (rule.condition()) {
                this.addAlert(rule.priority, rule.recommendation, rule.description);
            }
        });
    }
    
    addAlert(type, title, description) {
        const alert = {
            id: Date.now(),
            type,
            title,
            description,
            timestamp: new Date().toLocaleTimeString(),
            acknowledged: false
        };
        
        this.alerts.unshift(alert);
        
        // Keep only last 50 alerts
        if (this.alerts.length > 50) {
            this.alerts = this.alerts.slice(0, 50);
        }
        
        this.updateAlertsDisplay();
    }
    
    updateAlertsDisplay() {
        const alertsList = document.getElementById('alerts-list');
        if (!alertsList) return;
        
        alertsList.innerHTML = '';
        
        this.alerts.slice(0, 10).forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = `alert-item p-4 border rounded-lg ${
                alert.type === 'high' ? 'bg-red-50 border-red-200' :
                alert.type === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
            }`;
            
            alertElement.innerHTML = `
                <div class="flex items-center">
                    <div class="alert-icon mr-3">
                        ${alert.type === 'high' ? '🚨' : alert.type === 'medium' ? '⚠️' : 'ℹ️'}
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium">${alert.title}</p>
                        <p class="text-xs opacity-75">${alert.description}</p>
                    </div>
                    <div class="alert-time text-xs opacity-60">${alert.timestamp}</div>
                </div>
            `;
            
            alertsList.appendChild(alertElement);
        });
    }
    
    generateOptimizationRecommendations() {
        this.optimizationRecommendations = [];
        
        this.optimizationRules.forEach(rule => {
            if (rule.condition()) {
                this.optimizationRecommendations.push({
                    ...rule,
                    impact: this.calculateOptimizationImpact(rule.action)
                });
            }
        });
    }
    
    calculateOptimizationImpact(action) {
        const impacts = {
            optimize_lcp: 15,
            optimize_fid: 10,
            optimize_cls: 8,
            optimize_memory: 12,
            improve_engagement: 20
        };
        
        return impacts[action] || 5;
    }
    
    trackEvent(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                sessionId: this.getSessionId(),
                userId: this.getUserId()
            }
        };
        
        this.events.push(event);
        
        // Keep only last 1000 events
        if (this.events.length > 1000) {
            this.events = this.events.slice(-1000);
        }
        
        // Send to analytics endpoint if available
        this.sendEvent(event);
    }
    
    sendEvent(event) {
        // In a real implementation, you'd send to your analytics endpoint
        console.log('📊 Analytics Event:', event);
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
    
    // Public methods
    getMetrics() {
        return this.metrics;
    }
    
    getAlerts() {
        return this.alerts;
    }
    
    getOptimizationRecommendations() {
        return this.optimizationRecommendations;
    }
    
    getHistoricalData() {
        return this.historicalData;
    }
    
    exportData() {
        return {
            metrics: this.metrics,
            events: this.events,
            alerts: this.alerts,
            recommendations: this.optimizationRecommendations,
            historical: this.historicalData
        };
    }
    
    clearData() {
        this.events = [];
        this.alerts = [];
        this.historicalData = [];
        this.optimizationRecommendations = [];
    }
    
    pauseMonitoring() {
        if (this.realTimeUpdateInterval) {
            clearInterval(this.realTimeUpdateInterval);
            this.realTimeUpdateInterval = null;
        }
    }
    
    resumeMonitoring() {
        if (!this.realTimeUpdateInterval) {
            this.setupRealTimeUpdates();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsEngine = new AnalyticsEngine();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsEngine;
}
