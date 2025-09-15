/**
 * Premium Analytics System
 * Ferrari-level user tracking and insights
 */

class AnalyticsSystem {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.userJourney = [];
        this.performanceMetrics = {};
        this.init();
    }

    init() {
        this.trackPageView();
        this.setupEventTracking();
        this.trackUserInteractions();
        this.trackPerformanceMetrics();
        this.setupGoalTracking();
        this.trackUserEngagement();
        this.exportData();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    trackPageView() {
        // Prevent duplicate page_view on the same URL
        const seen = (window.__mf ||= {});
        if (seen.lastPV && seen.lastPV === location.href) return;
        seen.lastPV = location.href;
        
        const pageView = {
            type: 'page_view',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            screen: {
                width: screen.width,
                height: screen.height
            }
        };

        this.events.push(pageView);
        this.userJourney.push({
            action: 'page_view',
            timestamp: Date.now(),
            page: window.location.pathname
        });

        console.log('📊 Page View Tracked: %o', pageView);
    }

    setupEventTracking() {
        // Track navigation events
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-page]');
            if (target) {
                this.trackEvent('navigation', {
                    page: target.dataset.page,
                    element: target.tagName,
                    text: target.textContent.trim()
                });
            }
        });

        // Track timer events
        document.addEventListener('timer-start', (e) => {
            this.trackEvent('timer_start', {
                duration: e.detail?.duration || 'unknown',
                type: e.detail?.type || 'meditation'
            });
        });

        document.addEventListener('timer-complete', (e) => {
            this.trackEvent('timer_complete', {
                duration: e.detail?.duration || 'unknown',
                type: e.detail?.type || 'meditation'
            });
        });

        // Track form interactions
        document.addEventListener('submit', (e) => {
            this.trackEvent('form_submit', {
                formId: e.target.id,
                formAction: e.target.action
            });
        });
    }

    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, [role="button"]')) {
                this.trackEvent('button_click', {
                    buttonText: e.target.textContent.trim(),
                    buttonId: e.target.id,
                    buttonClass: e.target.className
                });
            }
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', this.throttle(() => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                this.trackEvent('scroll_depth', {
                    depth: scrollDepth,
                    maxDepth: maxScrollDepth
                });
            }
        }, 1000));

        // Track time on page
        setInterval(() => {
            const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
            this.trackEvent('time_on_page', {
                seconds: timeOnPage,
                minutes: Math.round(timeOnPage / 60)
            });
        }, 30000); // Every 30 seconds
    }

    trackPerformanceMetrics() {
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.trackEvent('performance_lcp', {
                    value: lastEntry.startTime,
                    rating: this.getLCPRating(lastEntry.startTime)
                });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            const fidObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    const fid = entry.processingStart - entry.startTime;
                    this.trackEvent('performance_fid', {
                        value: fid,
                        rating: this.getFIDRating(fid)
                    });
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((entryList) => {
                let clsValue = 0;
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.trackEvent('performance_cls', {
                    value: clsValue,
                    rating: this.getCLSRating(clsValue)
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    getLCPRating(value) {
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs_improvement';
        return 'poor';
    }

    getFIDRating(value) {
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs_improvement';
        return 'poor';
    }

    getCLSRating(value) {
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs_improvement';
        return 'poor';
    }

    setupGoalTracking() {
        // Track meditation goals
        this.goals = {
            meditation_sessions: 0,
            total_meditation_time: 0,
            journal_entries: 0,
            workout_sessions: 0,
            total_workout_time: 0
        };

        // Track goal completions
        document.addEventListener('goal-complete', (e) => {
            const goal = e.detail.goal;
            this.goals[goal] = (this.goals[goal] || 0) + 1;
            
            this.trackEvent('goal_complete', {
                goal: goal,
                total: this.goals[goal]
            });

            // Check for milestone achievements
            this.checkMilestones(goal);
        });
    }

    checkMilestones(goal) {
        const milestones = {
            meditation_sessions: [1, 7, 30, 100],
            total_meditation_time: [300, 1800, 3600, 7200], // 5min, 30min, 1hr, 2hr
            journal_entries: [1, 7, 30, 100],
            workout_sessions: [1, 7, 30, 100]
        };

        const goalMilestones = milestones[goal] || [];
        const currentValue = this.goals[goal] || 0;

        goalMilestones.forEach(milestone => {
            if (currentValue === milestone) {
                this.trackEvent('milestone_achieved', {
                    goal: goal,
                    milestone: milestone,
                    achievement: this.getAchievementName(goal, milestone)
                });

                // Trigger celebration
                this.triggerCelebration(goal, milestone);
            }
        });
    }

    getAchievementName(goal, milestone) {
        const achievements = {
            meditation_sessions: {
                1: 'First Steps',
                7: 'Week Warrior',
                30: 'Monthly Master',
                100: 'Century Sage'
            },
            total_meditation_time: {
                300: 'Five Minute Focus',
                1800: 'Half Hour Hero',
                3600: 'Hour of Zen',
                7200: 'Two Hour Titan'
            },
            journal_entries: {
                1: 'First Entry',
                7: 'Weekly Writer',
                30: 'Monthly Muse',
                100: 'Century Scribe'
            },
            workout_sessions: {
                1: 'First Rep',
                7: 'Weekly Warrior',
                30: 'Monthly Mover',
                100: 'Century Strong'
            }
        };

        return achievements[goal]?.[milestone] || 'Achievement Unlocked!';
    }

    triggerCelebration(goal, milestone) {
        // Create celebration notification
        const celebration = document.createElement('div');
        celebration.className = 'celebration-notification fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-xl z-50 animate-bounce';
        celebration.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-2xl">🎉</span>
                <div>
                    <div class="font-bold">Achievement Unlocked!</div>
                    <div class="text-sm">${this.getAchievementName(goal, milestone)}</div>
                </div>
            </div>
        `;

        document.body.appendChild(celebration);

        setTimeout(() => {
            celebration.remove();
        }, 5000);
    }

    trackUserEngagement() {
        // Track active time
        let activeTime = 0;
        let lastActivity = Date.now();
        const activityThreshold = 30000; // 30 seconds

        const updateActivity = () => {
            const now = Date.now();
            if (now - lastActivity < activityThreshold) {
                activeTime += now - lastActivity;
            }
            lastActivity = now;
        };

        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, updateActivity, true);
        });

        // Track engagement every minute
        setInterval(() => {
            this.trackEvent('engagement', {
                activeTime: Math.round(activeTime / 1000),
                engagementScore: this.calculateEngagementScore()
            });
        }, 60000);
    }

    calculateEngagementScore() {
        const timeOnPage = (Date.now() - this.startTime) / 1000;
        const eventCount = this.events.length;
        const scrollDepth = this.getMaxScrollDepth();
        
        // Simple engagement scoring algorithm
        let score = 0;
        score += Math.min(timeOnPage / 60, 10); // Up to 10 points for time
        score += Math.min(eventCount / 5, 10); // Up to 10 points for interactions
        score += Math.min(scrollDepth / 10, 5); // Up to 5 points for scroll depth
        
        return Math.round(score);
    }

    getMaxScrollDepth() {
        // This would be calculated from scroll events
        return 50; // Placeholder
    }

    trackEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            data: data
        };

        this.events.push(event);
        
        // Only log important events to reduce console spam
        const importantEvents = ['navigation', 'timer_start', 'timer_complete', 'error', 'performance_metrics'];
        if (importantEvents.includes(eventType)) {
            console.log('📊 Event Tracked: %o', event);
        }

        // Update user journey
        this.userJourney.push({
            action: eventType,
            timestamp: Date.now(),
            data: data
        });
    }

    exportData() {
        // Export analytics data every 5 minutes
        setInterval(() => {
            const analyticsData = {
                sessionId: this.sessionId,
                startTime: this.startTime,
                endTime: Date.now(),
                events: this.events,
                userJourney: this.userJourney,
                goals: this.goals,
                performance: this.performanceMetrics
            };

            // Store in localStorage for persistence
            localStorage.setItem('analytics_data', JSON.stringify(analyticsData));

            // In a real app, you'd send this to your analytics service
            console.log('📊 Analytics Data Exported:', analyticsData);
        }, 300000); // 5 minutes
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public API
    getAnalyticsSummary() {
        return {
            sessionId: this.sessionId,
            duration: Date.now() - this.startTime,
            eventCount: this.events.length,
            goals: this.goals,
            engagementScore: this.calculateEngagementScore()
        };
    }
}

// Export for global use
window.AnalyticsSystem = AnalyticsSystem;

// Auto-initialize analytics system
document.addEventListener('DOMContentLoaded', () => {
    if (!window.analyticsSystem) {
        window.analyticsSystem = new AnalyticsSystem();
    }
});
