/**
 * Enhanced Interactions System
 * Adds thoughtful touches and micro-interactions
 */

class EnhancedInteractions {
    constructor() {
        this.initializeEnhancedInteractions();
    }

    initializeEnhancedInteractions() {
        // Add loading states to buttons
        this.setupButtonLoadingStates();
        
        // Add tooltip functionality
        this.setupTooltips();
        
        // Add keyboard navigation
        this.setupKeyboardNavigation();
        
        // Add success feedback
        this.setupSuccessFeedback();
        
        // Add auto-save functionality
        this.setupAutoSave();
    }

    setupButtonLoadingStates() {
        // Add loading state to form submissions
        document.addEventListener('submit', (e) => {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn) {
                this.showButtonLoading(submitBtn);
            }
        });

        // Add loading state to action buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-loading]')) {
                this.showButtonLoading(e.target);
            }
        });
    }

    showButtonLoading(button) {
        const originalText = button.textContent;
        button.classList.add('btn-loading');
        button.disabled = true;
        
        // Store original text for restoration
        button.dataset.originalText = originalText;
        
        // Auto-restore after 3 seconds (fallback)
        setTimeout(() => {
            this.hideButtonLoading(button);
        }, 3000);
    }

    hideButtonLoading(button) {
        button.classList.remove('btn-loading');
        button.disabled = false;
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
    }

    setupTooltips() {
        // Initialize tooltips for elements with data-tooltip attribute
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            const tooltipText = element.getAttribute('data-tooltip');
            element.classList.add('tooltip');
            
            const tooltipElement = document.createElement('span');
            tooltipElement.className = 'tooltiptext';
            tooltipElement.textContent = tooltipText;
            
            element.appendChild(tooltipElement);
        });
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // ESC key to close modals
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal:not(.hidden), #wisdom-modal:not(.hidden), #export-modal:not(.hidden), #prompts-modal:not(.hidden)');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
            
            // Enter key on focused buttons
            if (e.key === 'Enter' && e.target.matches('button:not(:disabled)')) {
                e.target.click();
            }
        });
        
        // Setup modal close handlers
        this.setupModalHandlers();
    }
    
    setupModalHandlers() {
        // Wisdom modal handlers
        const wisdomModal = document.getElementById('wisdom-modal');
        const addWisdomBtn = document.getElementById('add-wisdom-btn');
        const addFirstWisdomBtn = document.getElementById('add-first-wisdom-btn');
        const cancelWisdomBtn = document.getElementById('cancel-wisdom-btn');
        
        if (addWisdomBtn) {
            addWisdomBtn.addEventListener('click', () => {
                if (wisdomModal) wisdomModal.classList.remove('hidden');
            });
        }
        
        if (addFirstWisdomBtn) {
            addFirstWisdomBtn.addEventListener('click', () => {
                if (wisdomModal) wisdomModal.classList.remove('hidden');
            });
        }
        
        if (cancelWisdomBtn) {
            cancelWisdomBtn.addEventListener('click', () => {
                if (wisdomModal) wisdomModal.classList.add('hidden');
            });
        }
        
        // Export modal handlers
        const exportModal = document.getElementById('export-modal');
        const exportDataBtn = document.getElementById('export-data-btn');
        const cancelExportBtn = document.getElementById('cancel-export-btn');
        
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                if (exportModal) exportModal.classList.remove('hidden');
            });
        }
        
        if (cancelExportBtn) {
            cancelExportBtn.addEventListener('click', () => {
                if (exportModal) exportModal.classList.add('hidden');
            });
        }
        
        // Click outside to close modals
        document.addEventListener('click', (e) => {
            if (e.target.matches('#wisdom-modal, #export-modal')) {
                this.closeModal(e.target);
            }
        });
    }

    closeModal(modal) {
        modal.classList.add('hidden');
        // Remove focus trap
        document.body.style.overflow = '';
    }

    setupSuccessFeedback() {
        // Add success feedback to completed actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-success-feedback]')) {
                this.showSuccessFeedback(e.target);
            }
        });
    }

    showSuccessFeedback(element) {
        const feedback = document.createElement('div');
        feedback.className = 'success-feedback fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        feedback.textContent = '✓ Success!';
        
        document.body.appendChild(feedback);
        
        // Animate in
        setTimeout(() => {
            feedback.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            feedback.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 3000);
    }

    setupAutoSave() {
        // Auto-save for text inputs
        let autoSaveTimeout;
        
        document.addEventListener('input', (e) => {
            if (e.target.matches('[data-auto-save]')) {
                clearTimeout(autoSaveTimeout);
                autoSaveTimeout = setTimeout(() => {
                    this.autoSave(e.target);
                }, 1000); // Save after 1 second of inactivity
            }
        });
    }

    autoSave(element) {
        const key = element.getAttribute('data-auto-save');
        const value = element.value;
        
        if (key && value) {
            localStorage.setItem(`autosave_${key}`, value);
            this.showAutoSaveIndicator(element);
        }
    }

    showAutoSaveIndicator(element) {
        const indicator = document.createElement('span');
        indicator.className = 'autosave-indicator text-xs text-green-600 ml-2';
        indicator.textContent = 'Saved';
        
        // Remove existing indicator
        const existingIndicator = element.parentNode.querySelector('.autosave-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        element.parentNode.appendChild(indicator);
        
        // Fade out after 2 seconds
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }, 2000);
    }

    // Public methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize enhanced interactions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedInteractions = new EnhancedInteractions();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedInteractions;
}
