/**
 * Loading States & Skeleton Screens
 * Provides better perceived performance and user feedback
 */

class LoadingStatesManager {
    constructor() {
        this.skeletonTemplates = this.createSkeletonTemplates();
        this.init();
    }

    init() {
        this.setupPageLoadingStates();
        this.setupContentLoadingStates();
        this.setupFormLoadingStates();
    }

    createSkeletonTemplates() {
        return {
            card: `
                <div class="card-premium animate-pulse">
                    <div class="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div class="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div class="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                    <div class="h-4 bg-gray-200 rounded mb-4 w-4/6"></div>
                    <div class="h-10 bg-gray-200 rounded w-1/3"></div>
                </div>
            `,
            timer: `
                <div class="card-premium animate-pulse">
                    <div class="w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-full mx-auto mb-6"></div>
                    <div class="h-6 bg-gray-200 rounded mb-4 w-1/2 mx-auto"></div>
                    <div class="h-12 bg-gray-200 rounded mb-4 w-full"></div>
                    <div class="flex gap-3">
                        <div class="h-10 bg-gray-200 rounded flex-1"></div>
                        <div class="h-10 bg-gray-200 rounded flex-1"></div>
                    </div>
                </div>
            `,
            exerciseList: `
                <div class="card-premium animate-pulse">
                    <div class="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="h-16 bg-gray-200 rounded"></div>
                        <div class="h-16 bg-gray-200 rounded"></div>
                        <div class="h-16 bg-gray-200 rounded"></div>
                        <div class="h-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            `,
            journalEntry: `
                <div class="card-premium animate-pulse">
                    <div class="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
                    <div class="h-32 bg-gray-200 rounded mb-4"></div>
                    <div class="h-10 bg-gray-200 rounded w-1/4"></div>
                </div>
            `
        };
    }

    setupPageLoadingStates() {
        // Show loading state during page transitions
        const originalNavigate = window.navigationManager?.navigateToPage;
        if (originalNavigate) {
            window.navigationManager.navigateToPage = async (pageName) => {
                this.showPageLoading(pageName);
                try {
                    await originalNavigate.call(window.navigationManager, pageName);
                } finally {
                    this.hidePageLoading();
                }
            };
        }
    }

    setupContentLoadingStates() {
        // Add loading states for dynamic content
        this.observeContentChanges();
    }

    setupFormLoadingStates() {
        // Add loading states for form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('needs-loading')) {
                this.showFormLoading(e.target);
            }
        });
    }

    showPageLoading(pageName) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'page-loading-overlay';
        loadingOverlay.className = 'fixed inset-0 bg-linen-white/90 backdrop-blur-sm z-40 flex items-center justify-center';
        
        loadingOverlay.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 border-4 border-forest-green/20 border-t-forest-green rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-charcoal/70 font-medium">Loading ${this.getPageDisplayName(pageName)}...</p>
            </div>
        `;

        document.body.appendChild(loadingOverlay);
        
        // Add fade-in animation
        setTimeout(() => {
            loadingOverlay.style.opacity = '1';
        }, 10);
    }

    hidePageLoading() {
        const loadingOverlay = document.getElementById('page-loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 300);
        }
    }

    showSkeletonContent(container, type) {
        if (!container || !this.skeletonTemplates[type]) return;

        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-content';
        skeleton.innerHTML = this.skeletonTemplates[type];
        
        container.appendChild(skeleton);
    }

    hideSkeletonContent(container) {
        const skeleton = container?.querySelector('.skeleton-content');
        if (skeleton) {
            skeleton.style.opacity = '0';
            setTimeout(() => {
                skeleton.remove();
            }, 300);
        }
    }

    showFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Processing...
            `;
        }
    }

    hideFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.originalText || 'Submit';
        }
    }

    showButtonLoading(button, text = 'Loading...') {
        if (!button) return;

        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = `
            <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
            ${text}
        `;
    }

    hideButtonLoading(button) {
        if (!button) return;

        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
        delete button.dataset.originalText;
    }

    observeContentChanges() {
        // Observe dynamic content changes and add loading states
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.handleNewContent(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    handleNewContent(element) {
        // Add loading states for specific content types
        if (element.classList?.contains('exercise-list')) {
            this.showSkeletonContent(element, 'exerciseList');
        } else if (element.classList?.contains('journal-entries')) {
            this.showSkeletonContent(element, 'journalEntry');
        } else if (element.classList?.contains('timer-content')) {
            this.showSkeletonContent(element, 'timer');
        }
    }

    getPageDisplayName(pageName) {
        const pageNames = {
            home: 'Home',
            timer: 'Meditation Timer',
            journal: 'Journal',
            workout: 'Workout',
            interview: 'Practice'
        };
        return pageNames[pageName] || 'Page';
    }

    // Utility method for showing toast notifications
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-forest-green text-white'
        }`;
        
        toast.textContent = message;
        toast.style.transform = 'translateX(100%)';
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }
}

// Initialize loading states manager
document.addEventListener('DOMContentLoaded', () => {
    window.loadingStatesManager = new LoadingStatesManager();
});

// Export for use in other modules
window.LoadingStatesManager = LoadingStatesManager;
