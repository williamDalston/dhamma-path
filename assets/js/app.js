/**
 * Main Application Module
 * Initializes and coordinates all app functionality
 */

class DhammaPathApp {
    constructor() {
        // Singleton guard for hot reload
        const ns = (window.__app ||= {});
        if (ns.appInitialized) return;
        ns.appInitialized = true;
        
        this.navigationManager = null;
        this.meditationTimer = null;
        this.performanceMonitor = null;
        this.animationSystem = null;
        this.analyticsSystem = null;
        this.isInitialized = false;
        this.init();
    }

    // Helper: Idle callback with fallback
    onIdle(callback) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback, { timeout: 2000 });
        } else {
            setTimeout(callback, 0);
        }
    }

    // Helper: Chunk heavy work to prevent long tasks
    chunked(items, fn, size = 200) {
        let i = 0;
        const loop = () => {
            const end = Math.min(i + size, items.length);
            for (; i < end; i++) fn(items[i]);
            if (i < items.length) setTimeout(loop, 0); // yield back to UI
        };
        loop();
    }

    // Phase 1: Critical initialization (blocking-critical only)
    initCritical() {
        console.log('🚀 Phase 1: Critical initialization');
        this.setupErrorHandling();
        this.initializePerformanceMonitoring();
    }

    // Phase 2: Interactive features (above-the-fold)
    async initInteractive() {
        console.log('🎯 Phase 2: Interactive features');
        requestAnimationFrame(async () => {
            await this.initializeNavigation();
            await this.initializeThemeManager();
            this.setupGlobalEventListeners();
        });
    }

    // Phase 3: Idle features (analytics, widgets, haptics)
    async initIdle() {
        console.log('⏳ Phase 3: Idle features');
        
        // Use existing global instances (already loaded)
        this.analyticsSystem = window.analytics;
        this.hapticSystem = window.hapticStorytelling;
        
        // Load other non-critical features
        await this.initializeNonCriticalFeatures();
    }

    // Phase 4: Heavy features (delayed further)
    async initHeavy() {
        console.log('⚡ Phase 4: Heavy features');
        await this.initializeHeavyFeatures();
    }

    init() {
        console.log('🚀 Initializing MorningFlow App...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    async initialize() {
        try {
            // Phase 1: Critical initialization (blocking-critical only)
            this.initCritical();
            
            // Phase 2: Interactive features (above-the-fold)
            this.initInteractive();
            
            // Phase 3: Idle features (analytics, widgets, haptics)
            this.onIdle(() => this.initIdle());
            
            // Phase 4: Heavy features (delayed further)
            setTimeout(() => this.initHeavy(), 1000);
            
            this.loadInitialPage();
            this.isInitialized = true;
            console.log('✅ MorningFlow App initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
        }
    }
    
    async initializeNonCriticalFeatures() {
        // Initialize non-critical features when browser is idle
        this.initializeAnimationSystem();
        this.initializeAnalytics();
        this.initializeGestureManager();
        this.initializePhysicsAnimations();
        this.initializeHapticStorytelling();
        this.initializeMotionSystem();
        this.initializeSeamlessFlow();
        this.initializeProdigalWelcome();
        this.initializeTemporalEcho();
        this.initializeContextualActions();
        this.initializeSmartRecommendations();
        this.initializeAdaptiveTiming();
        this.initializeHealthIntegration();
        await this.initializeWeatherIntegration();
        this.initializeLearningSystem();
        this.initializeMobileGestures();
        this.initializeMobilePerformance();
        this.setupPremiumFeatures();
    }

    initializeHeavyFeatures() {
        // Heavy features that can be delayed even further
        console.log('🔄 Initializing heavy features...');
        
        // Chunk heavy work to avoid long tasks
        this.chunkedInitialize(() => {
            this.initializeAnalytics();
            this.initializeWeatherIntegration();
        });
        
        this.chunkedInitialize(() => {
            this.initializeHapticStorytelling();
            this.initializeMotionSystem();
        });
        
        this.chunkedInitialize(() => {
            this.initializeLearningSystem();
            this.initializeSmartRecommendations();
        });
    }

    chunkedInitialize(fn) {
        // Use requestIdleCallback to chunk work and avoid long tasks
        if (window.requestIdleCallback) {
            requestIdleCallback(fn, { timeout: 1000 });
        } else {
            setTimeout(fn, 0);
        }
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showErrorNotification('A gentle pause in your flow');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showErrorNotification('A gentle pause in your flow');
        });
    }

    initializePerformanceMonitoring() {
        if (window.PerformanceMonitor) {
            this.performanceMonitor = new window.PerformanceMonitor();
            console.log('🎯 Performance monitoring initialized');
        }
    }

    initializeAnimationSystem() {
        if (window.AnimationSystem) {
            this.animationSystem = new window.AnimationSystem();
            console.log('✨ Animation system initialized');
        }
    }

    initializeAnalytics() {
        if (window.AnalyticsSystem) {
            this.analyticsSystem = new window.AnalyticsSystem();
            // Make it globally available
            window.analyticsSystem = this.analyticsSystem;
            console.log('📊 Analytics system initialized');
        }
    }

    async initializeNavigation() {
        try {
            await window.waitForGlobal('NavigationManager', 3000);
            this.navigationManager = new window.NavigationManager();
            console.log('✅ NavigationManager initialized');
        } catch (error) {
            console.error('❌ NavigationManager not found:', error.message);
        }
    }

    async initializeThemeManager() {
        try {
            await window.waitForGlobal('ThemeManager', 3000);
            this.themeManager = new window.ThemeManager();
            console.log('✅ ThemeManager initialized');
        } catch (error) {
            console.error('❌ ThemeManager not found:', error.message);
        }
    }

    async initializeGestureManager() {
        try {
            await window.waitForGlobal('GestureManager', 3000);
            this.gestureManager = new window.GestureManager();
            console.log('✅ GestureManager initialized');
        } catch (error) {
            console.error('❌ GestureManager not found:', error.message);
        }
    }

    initializePhysicsAnimations() {
        if (window.PhysicsAnimations) {
            this.physicsAnimations = new window.PhysicsAnimations();
        } else {
            console.error('❌ PhysicsAnimations not found');
        }
    }

    initializeHapticStorytelling() {
        if (window.HapticStorytelling) {
            this.hapticStorytelling = new window.HapticStorytelling();
        } else {
            console.error('❌ HapticStorytelling not found');
        }
    }

    initializeMotionSystem() {
        try {
            if (window.MotionSystem) {
                this.motionSystem = new window.MotionSystem();
                console.log('✅ Motion system initialized');
            } else {
                console.warn('⚠️ MotionSystem not found - continuing without motion coordination');
            }
        } catch (error) {
            console.error('❌ Motion system initialization failed:', error);
            // Continue without motion system
        }
    }

    initializeContextualActions() {
        if (window.ContextualActions) {
            this.contextualActions = new window.ContextualActions();
        } else {
            console.error('❌ ContextualActions not found');
        }
    }

    initializeSmartRecommendations() {
        if (window.SmartRecommendationEngine) {
            this.smartRecommendationEngine = new window.SmartRecommendationEngine();
        } else {
            console.error('❌ SmartRecommendationEngine not found');
        }
    }

    initializeAdaptiveTiming() {
        if (window.AdaptiveTimingSystem) {
            this.adaptiveTimingSystem = new window.AdaptiveTimingSystem();
        } else {
            console.error('❌ AdaptiveTimingSystem not found');
        }
    }

    initializeHealthIntegration() {
        if (window.HealthIntegrationSystem) {
            this.healthIntegrationSystem = new window.HealthIntegrationSystem();
        } else {
            console.error('❌ HealthIntegrationSystem not found');
        }
    }

    async initializeWeatherIntegration() {
        try {
            if (window.assetURL) {
                // Use dynamic import with correct URL
                const module = await import(window.assetURL('assets/js/weather-integration.js'));
                const WeatherIntegration = module.default || module.WeatherIntegration || window.WeatherIntegration;
                if (WeatherIntegration) {
                    this.weatherIntegration = new WeatherIntegration();
                    console.log('🌤️ Weather integration initialized');
                } else {
                    console.warn('WeatherIntegration not found in module');
                }
            } else {
                // Fallback to existing method
                const start = performance.now();
                while (!('WeatherIntegration' in window)) {
                    if (performance.now() - start > 5000) {
                        console.warn('WeatherIntegration still not available after 5s; skipping');
                        return;
                    }
                    await new Promise(r => setTimeout(r, 50));
                }
                this.weatherIntegration = new window.WeatherIntegration();
                console.log('🌤️ Weather integration initialized');
            }
        } catch (error) {
            console.warn('WeatherIntegration load failed:', error);
        }
    }

    initializeLearningSystem() {
        if (window.LearningSystem) {
            this.learningSystem = new window.LearningSystem();
        } else {
            console.error('❌ LearningSystem not found');
        }
    }

    initializeMobileGestures() {
        if (window.MobileGestures) {
            this.mobileGestures = new window.MobileGestures();
        } else {
            console.error('❌ MobileGestures not found');
        }
    }

    initializeMobilePerformance() {
        if (window.MobilePerformanceOptimizer) {
            this.mobilePerformanceOptimizer = new window.MobilePerformanceOptimizer();
        } else {
            console.error('❌ MobilePerformanceOptimizer not found');
        }
    }

    initializeSeamlessFlow() {
        if (window.SeamlessFlowEngine) {
            try {
                window.seamlessFlowEngine = new window.SeamlessFlowEngine();
                console.log('✅ Seamless flow engine initialized');
            } catch (error) {
                console.error('❌ Failed to initialize seamless flow engine:', error);
            }
        }
    }

    initializeProdigalWelcome() {
        if (window.ProdigalWelcome) {
            try {
                window.prodigalWelcome = new window.ProdigalWelcome();
                console.log('✅ Prodigal welcome system initialized');
            } catch (error) {
                console.error('❌ Failed to initialize prodigal welcome system:', error);
            }
        }
    }

    initializeTemporalEcho() {
        if (window.TemporalEcho) {
            try {
                window.temporalEcho = new window.TemporalEcho();
                console.log('✅ Temporal echo system initialized');
            } catch (error) {
                console.error('❌ Failed to initialize temporal echo system:', error);
            }
        }
    }

    setupPremiumFeatures() {
        // Setup dark mode toggle
        this.setupDarkMode();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Setup premium notifications
        this.setupPremiumNotifications();
        
        // Setup progress tracking
        this.setupProgressTracking();
    }

    setupDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const darkModeToggleMobile = document.getElementById('dark-mode-toggle-mobile-header');
        
        const toggleDarkMode = () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('darkMode', isDark);
            
            // Update icons
            const sunIcons = document.querySelectorAll('#sun-icon, #sun-icon-mobile');
            const moonIcons = document.querySelectorAll('#moon-icon, #moon-icon-mobile');
            
            sunIcons.forEach(icon => icon.style.display = isDark ? 'block' : 'none');
            moonIcons.forEach(icon => icon.style.display = isDark ? 'none' : 'block');
            
            // Track analytics
            if (this.analyticsSystem) {
                this.analyticsSystem.trackEvent('dark_mode_toggle', { enabled: isDark });
            }
        };

        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', toggleDarkMode);
        }
        
        if (darkModeToggleMobile) {
            darkModeToggleMobile.addEventListener('click', toggleDarkMode);
        }

        // Load saved preference
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key) {
                case '1':
                    this.navigateToPage('timer');
                    break;
                case '2':
                    this.navigateToPage('journal');
                    break;
                case '3':
                    this.navigateToPage('workout');
                    break;
                case '4':
                    this.navigateToPage('clarity');
                    break;
                case 'h':
                case 'H':
                    this.navigateToPage('home');
                    break;
                case 'd':
                case 'D':
                    // Toggle dark mode
                    document.getElementById('dark-mode-toggle')?.click();
                    break;
            }
        });
    }

    setupPremiumNotifications() {
        // Create notification container
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(notificationContainer);
    }

    setupProgressTracking() {
        // Track user progress and achievements
        const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        
        // Initialize progress if not exists
        if (!progress.meditationSessions) {
            progress.meditationSessions = 0;
            progress.totalMeditationTime = 0;
            progress.journalEntries = 0;
            progress.workoutSessions = 0;
            localStorage.setItem('userProgress', JSON.stringify(progress));
        }
    }

    setupGlobalEventListeners() {
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key) {
            case '1':
                this.navigateToPage('timer');
                break;
            case '2':
                this.navigateToPage('journal');
                break;
            case '3':
                this.navigateToPage('workout');
                break;
            case '4':
                this.navigateToPage('clarity');
                break;
            case 'h':
            case 'H':
                this.navigateToPage('home');
                break;
            case 'Escape':
                this.handleEscapeKey();
                break;
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause timers if needed
            this.pauseActiveTimers();
        } else {
            // Page is visible - resume timers if needed
            this.resumeActiveTimers();
        }
    }

    handleWindowResize() {
        // Handle responsive behavior
        this.updateMobileMenuState();
    }

    handleEscapeKey() {
        // Close mobile menu if open
        if (this.navigationManager && this.navigationManager.isMobileMenuOpen) {
            this.navigationManager.closeMobileMenu();
        }
    }

    pauseActiveTimers() {
        if (this.meditationTimer && this.meditationTimer.isRunning) {
            this.meditationTimer.pause();
        }
    }

    resumeActiveTimers() {
        // Timers remain paused when page becomes visible again
        // User needs to manually resume for better UX
    }

    updateMobileMenuState() {
        if (this.navigationManager) {
            // Check if we should close mobile menu on desktop
            if (window.innerWidth > 768 && this.navigationManager.isMobileMenuOpen) {
                this.navigationManager.closeMobileMenu();
            }
        }
    }

    loadInitialPage() {
        // Check if user is new or returning
        const isFirstVisit = !localStorage.getItem('morningFlowUser');
        
        if (isFirstVisit) {
            // Show welcome screen for new users
            this.navigateToPage('welcome');
            localStorage.setItem('morningFlowUser', 'true');
            localStorage.setItem('morningFlowFirstVisit', Date.now().toString());
        } else {
            // Show home page for returning users
            this.navigateToPage('home');
        }
    }

    navigateToPage(pageName) {
        if (this.navigationManager) {
            this.navigationManager.navigateToPage(pageName);
        } else {
            console.error('❌ Navigation manager not available');
        }
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 fade-in max-w-sm';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-xl">⚠️</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 fade-in max-w-sm';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-xl">✅</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Premium notification system
    showNotification(message, type = 'info') {
        const notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) return;

        const notification = document.createElement('div');
        const typeClasses = {
            info: 'notification-info',
            success: 'notification-success',
            warning: 'notification-warning',
            error: 'notification-error'
        };

        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        notification.className = `notification-premium ${typeClasses[type]} p-4 rounded-lg shadow-lg flex items-center space-x-3 transform translate-x-full transition-transform duration-300`;
        notification.innerHTML = `
            <span class="text-xl">${icons[type]}</span>
            <span>${message}</span>
            <button class="ml-auto text-lg opacity-70 hover:opacity-100" onclick="this.parentElement.remove()">×</button>
        `;

        notificationContainer.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 10);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Public API methods
    getCurrentPage() {
        return this.navigationManager ? this.navigationManager.currentPage : null;
    }

    getAppState() {
        return {
            isInitialized: this.isInitialized,
            currentPage: this.getCurrentPage(),
            hasNavigationManager: !!this.navigationManager,
            hasMeditationTimer: !!this.meditationTimer
        };
    }

    // Cleanup method
    destroy() {
        if (this.meditationTimer) {
            this.meditationTimer.destroy();
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboardShortcuts);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('resize', this.handleWindowResize);
    }
}

// Initialize the app when the script loads
window.DhammaPathApp = DhammaPathApp;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new DhammaPathApp();
        window.dhammaPathApp = window.app; // Make it globally accessible
    });
} else {
    window.app = new DhammaPathApp();
    window.dhammaPathApp = window.app; // Make it globally accessible
}
