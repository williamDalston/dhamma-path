/**
 * Flow Navigation System
 * Handles progress tracking, back navigation, and flow management
 */

class FlowNavigation {
    constructor() {
        this.currentFlow = ['meditation', 'journal', 'workout'];
        this.currentStepIndex = 0;
        this.flowHistory = [];
        this.initializeFlowNavigation();
    }

    initializeFlowNavigation() {
        // Initialize flow progress indicator
        this.setupFlowProgressIndicator();
        
        // Setup back to home button
        this.setupBackToHomeButton();
        
        // Setup skip current button
        this.setupSkipCurrentButton();
        
        // Track page changes
        this.trackPageChanges();
    }

    setupFlowProgressIndicator() {
        const flowProgress = document.getElementById('flow-progress');
        if (!flowProgress) return;

        // Show progress indicator for flow pages
        const flowPages = ['timer', 'journal', 'workout'];
        const currentPage = this.getCurrentPage();
        
        if (flowPages.includes(currentPage)) {
            flowProgress.classList.remove('hidden');
            this.updateProgressIndicator(currentPage);
        } else {
            flowProgress.classList.add('hidden');
        }
    }

    setupBackToHomeButton() {
        const backToHomeBtn = document.getElementById('back-to-home-btn');
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', () => {
                this.navigateToPage('home');
            });
        }
    }

    setupSkipCurrentButton() {
        const skipCurrentBtn = document.getElementById('skip-current-btn');
        if (skipCurrentBtn) {
            skipCurrentBtn.addEventListener('click', () => {
                this.skipCurrentStep();
            });
        }
    }

    trackPageChanges() {
        // Listen for navigation events
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                const targetPage = e.target.getAttribute('data-page');
                this.navigateToPage(targetPage);
            }
        });
    }

    navigateToPage(pageName) {
        // Add current page to history
        const currentPage = this.getCurrentPage();
        if (currentPage && currentPage !== pageName) {
            this.flowHistory.push(currentPage);
        }

        // Navigate to new page
        if (window.navigationManager) {
            window.navigationManager.navigateToPage(pageName);
        }

        // Update progress indicator
        this.setupFlowProgressIndicator();
    }

    skipCurrentStep() {
        const currentPage = this.getCurrentPage();
        const currentIndex = this.currentFlow.indexOf(currentPage);
        
        if (currentIndex >= 0 && currentIndex < this.currentFlow.length - 1) {
            // Skip to next step
            const nextStep = this.currentFlow[currentIndex + 1];
            this.navigateToPage(nextStep);
        } else if (currentIndex >= 0) {
            // Last step - go to home
            this.navigateToPage('home');
        }
    }

    updateProgressIndicator(currentPage) {
        const indicators = document.querySelectorAll('.flow-step-indicator');
        
        indicators.forEach((indicator, index) => {
            const step = indicator.getAttribute('data-step');
            
            // Reset all indicators
            indicator.classList.remove('active', 'completed');
            
            // Set current step as active
            if (step === currentPage) {
                indicator.classList.add('active');
            }
            
            // Set completed steps
            const currentIndex = this.currentFlow.indexOf(currentPage);
            if (this.currentFlow.indexOf(step) < currentIndex) {
                indicator.classList.add('completed');
            }
        });
    }

    getCurrentPage() {
        // Get current page from navigation manager or URL
        if (window.navigationManager && window.navigationManager.currentPage) {
            return window.navigationManager.currentPage;
        }
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('page') || 'home';
    }

    // Public methods for external use
    startFlow() {
        this.currentStepIndex = 0;
        this.flowHistory = [];
        this.navigateToPage(this.currentFlow[0]);
    }

    getFlowProgress() {
        const currentPage = this.getCurrentPage();
        const currentIndex = this.currentFlow.indexOf(currentPage);
        return {
            currentStep: currentPage,
            currentIndex: currentIndex,
            totalSteps: this.currentFlow.length,
            progress: currentIndex >= 0 ? (currentIndex + 1) / this.currentFlow.length : 0
        };
    }

    setCustomFlow(flowSteps) {
        this.currentFlow = flowSteps;
        this.currentStepIndex = 0;
    }
}

// Initialize flow navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.flowNavigation = new FlowNavigation();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowNavigation;
}
