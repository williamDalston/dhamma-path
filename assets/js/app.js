/**
 * Main Application Module
 * Initializes and coordinates all app functionality
 */

class DhammaPathApp {
    constructor() {
        this.navigationManager = null;
        this.meditationTimer = null;
        this.performanceMonitor = null;
        this.animationSystem = null;
        this.analyticsSystem = null;
        this.isInitialized = false;
        this.init();
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

    initialize() {
        try {
            this.setupErrorHandling();
            this.initializePerformanceMonitoring();
            this.initializeAnimationSystem();
            this.initializeAnalytics();
            this.initializeNavigation();
            this.setupGlobalEventListeners();
            this.loadInitialPage();
            this.setupPremiumFeatures();
            
            this.isInitialized = true;
            console.log('✅ MorningFlow App initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
        }
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showErrorNotification('An unexpected error occurred');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showErrorNotification('An unexpected error occurred');
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
            console.log('📊 Analytics system initialized');
        }
    }

    initializeNavigation() {
        if (window.NavigationManager) {
            this.navigationManager = new window.NavigationManager();
        } else {
            console.error('❌ NavigationManager not found');
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
                    this.navigateToPage('interview');
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
                this.navigateToPage('interview');
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
        // Load home page by default
        this.navigateToPage('home');
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
