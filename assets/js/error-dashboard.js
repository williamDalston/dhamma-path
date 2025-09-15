/**
 * Error Recovery Dashboard
 * Comprehensive monitoring and management of all error handlers
 */

class ErrorDashboard {
    constructor() {
        this.handlers = {};
        this.errorStats = {};
        this.recoveryHistory = [];
        this.isVisible = false;
        this.init();
    }

    init() {
        // Only show in development/debug mode
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.__DEBUG__) {
            this.setupDashboard();
            this.registerHandlers();
            this.startMonitoring();
            this.setupKeyboardShortcuts();
        }
    }

    setupDashboard() {
        // Create dashboard container
        const dashboard = document.createElement('div');
        dashboard.id = 'error-dashboard';
        dashboard.className = 'fixed top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 transform translate-x-full transition-transform duration-300';
        dashboard.innerHTML = `
            <div class="h-full flex flex-col">
                <!-- Header -->
                <div class="bg-gray-800 text-white p-4 flex items-center justify-between">
                    <h2 class="text-lg font-semibold">🛡️ Error Recovery Dashboard</h2>
                    <button id="close-dashboard" class="text-white hover:text-gray-300">
                        ✕
                    </button>
                </div>
                
                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-4 space-y-6">
                    <!-- System Status -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="font-semibold mb-3">System Status</h3>
                        <div id="system-status" class="space-y-2">
                            <!-- Status items will be populated here -->
                        </div>
                    </div>
                    
                    <!-- Error Statistics -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="font-semibold mb-3">Error Statistics</h3>
                        <div id="error-stats" class="space-y-2">
                            <!-- Error stats will be populated here -->
                        </div>
                    </div>
                    
                    <!-- Recovery Actions -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="font-semibold mb-3">Recovery Actions</h3>
                        <div id="recovery-actions" class="space-y-2">
                            <!-- Recovery actions will be populated here -->
                        </div>
                    </div>
                    
                    <!-- Recent Errors -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="font-semibold mb-3">Recent Errors</h3>
                        <div id="recent-errors" class="space-y-2">
                            <!-- Recent errors will be populated here -->
                        </div>
                    </div>
                    
                    <!-- Manual Controls -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="font-semibold mb-3">Manual Controls</h3>
                        <div class="space-y-2">
                            <button onclick="window.errorDashboard.resetAllHandlers()" 
                                    class="w-full btn-premium btn-warning btn-sm">
                                🔄 Reset All Handlers
                            </button>
                            <button onclick="window.errorDashboard.clearErrorHistory()" 
                                    class="w-full btn-premium btn-secondary btn-sm">
                                🗑️ Clear Error History
                            </button>
                            <button onclick="window.errorDashboard.exportErrorLog()" 
                                    class="w-full btn-premium btn-outline btn-sm">
                                📤 Export Error Log
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="bg-gray-100 p-4 text-center text-sm text-gray-600">
                    Press Ctrl+Shift+E to toggle dashboard
                </div>
            </div>
        `;
        
        document.body.appendChild(dashboard);
        
        // Setup close button
        document.getElementById('close-dashboard').onclick = () => {
            this.hide();
        };
    }

    registerHandlers() {
        // Register all error handlers
        this.handlers = {
            'timer': window.timerErrorHandler,
            'journal': window.journalErrorHandler,
            'workout': window.workoutErrorHandler,
            'interview': window.interviewErrorHandler,
            'page': window.pageErrorHandlers,
            'global': window.errorMonitor
        };
    }

    startMonitoring() {
        // Update dashboard every 5 seconds
        setInterval(() => {
            if (this.isVisible) {
                this.updateDashboard();
            }
        }, 5000);
        
        // Listen for error events
        window.addEventListener('error', (event) => {
            this.logError('javascript', event.error, event);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('promise_rejection', event.reason, event);
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'E') {
                event.preventDefault();
                this.toggle();
            }
        });
    }

    show() {
        const dashboard = document.getElementById('error-dashboard');
        if (dashboard) {
            dashboard.classList.remove('translate-x-full');
            this.isVisible = true;
            this.updateDashboard();
        }
    }

    hide() {
        const dashboard = document.getElementById('error-dashboard');
        if (dashboard) {
            dashboard.classList.add('translate-x-full');
            this.isVisible = false;
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    updateDashboard() {
        this.updateSystemStatus();
        this.updateErrorStats();
        this.updateRecoveryActions();
        this.updateRecentErrors();
    }

    updateSystemStatus() {
        const statusContainer = document.getElementById('system-status');
        if (!statusContainer) return;

        const currentPage = this.getCurrentPage();
        const handlers = Object.keys(this.handlers).map(handlerName => {
            const handler = this.handlers[handlerName];
            const isActive = handler && typeof handler.getErrorStats === 'function';
            const stats = isActive ? handler.getErrorStats() : {};
            
            return {
                name: handlerName,
                active: isActive,
                errorCount: stats.errorCount || 0,
                fallbackMode: stats.fallbackMode || false
            };
        });

        statusContainer.innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between items-center">
                    <span class="text-sm font-medium">Current Page:</span>
                    <span class="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">${currentPage}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm font-medium">Total Handlers:</span>
                    <span class="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">${handlers.length}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm font-medium">Active Handlers:</span>
                    <span class="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">${handlers.filter(h => h.active).length}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm font-medium">Fallback Mode:</span>
                    <span class="text-sm px-2 py-1 ${handlers.some(h => h.fallbackMode) ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'} rounded">
                        ${handlers.some(h => h.fallbackMode) ? 'Active' : 'None'}
                    </span>
                </div>
            </div>
        `;
    }

    updateErrorStats() {
        const statsContainer = document.getElementById('error-stats');
        if (!statsContainer) return;

        const totalErrors = Object.values(this.handlers).reduce((total, handler) => {
            if (handler && typeof handler.getErrorStats === 'function') {
                const stats = handler.getErrorStats();
                return total + (stats.errorCount || 0);
            }
            return total;
        }, 0);

        const fallbackHandlers = Object.values(this.handlers).filter(handler => {
            if (handler && typeof handler.getErrorStats === 'function') {
                const stats = handler.getErrorStats();
                return stats.fallbackMode;
            }
            return false;
        }).length;

        statsContainer.innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between items-center">
                    <span class="text-sm font-medium">Total Errors:</span>
                    <span class="text-sm px-2 py-1 ${totalErrors > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} rounded">
                        ${totalErrors}
                    </span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm font-medium">Fallback Handlers:</span>
                    <span class="text-sm px-2 py-1 ${fallbackHandlers > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'} rounded">
                        ${fallbackHandlers}
                    </span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm font-medium">Recovery Success Rate:</span>
                    <span class="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        ${this.calculateSuccessRate()}%
                    </span>
                </div>
            </div>
        `;
    }

    updateRecoveryActions() {
        const actionsContainer = document.getElementById('recovery-actions');
        if (!actionsContainer) return;

        actionsContainer.innerHTML = `
            <div class="space-y-2">
                <button onclick="window.errorDashboard.forceRecovery('timer')" 
                        class="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded text-sm">
                    🔄 Reset Timer Handler
                </button>
                <button onclick="window.errorDashboard.forceRecovery('journal')" 
                        class="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded text-sm">
                    📝 Reset Journal Handler
                </button>
                <button onclick="window.errorDashboard.forceRecovery('workout')" 
                        class="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded text-sm">
                    💪 Reset Workout Handler
                </button>
                <button onclick="window.errorDashboard.forceRecovery('interview')" 
                        class="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded text-sm">
                    🎯 Reset Interview Handler
                </button>
                <button onclick="window.errorDashboard.enableAllFallbacks()" 
                        class="w-full text-left p-2 bg-yellow-50 hover:bg-yellow-100 rounded text-sm">
                    ⚠️ Enable All Fallbacks
                </button>
            </div>
        `;
    }

    updateRecentErrors() {
        const errorsContainer = document.getElementById('recent-errors');
        if (!errorsContainer) return;

        const recentErrors = this.recoveryHistory.slice(-5).reverse();
        
        if (recentErrors.length === 0) {
            errorsContainer.innerHTML = '<p class="text-sm text-gray-500">No recent errors</p>';
            return;
        }

        errorsContainer.innerHTML = recentErrors.map(error => `
            <div class="p-2 bg-red-50 border border-red-200 rounded text-sm">
                <div class="font-medium text-red-800">${error.type}</div>
                <div class="text-red-600">${error.message}</div>
                <div class="text-xs text-red-500">${new Date(error.timestamp).toLocaleTimeString()}</div>
            </div>
        `).join('');
    }

    logError(type, error, event) {
        const errorEntry = {
            type: type,
            message: error.message || error.toString(),
            timestamp: Date.now(),
            handler: this.getCurrentPage(),
            stack: error.stack
        };
        
        this.recoveryHistory.push(errorEntry);
        
        // Keep only last 50 errors
        if (this.recoveryHistory.length > 50) {
            this.recoveryHistory.splice(0, this.recoveryHistory.length - 50);
        }
        
        if (this.isVisible) {
            this.updateRecentErrors();
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('timer')) return 'timer';
        if (path.includes('journal')) return 'journal';
        if (path.includes('workout')) return 'workout';
        if (path.includes('interview')) return 'interview';
        return 'home';
    }

    calculateSuccessRate() {
        if (this.recoveryHistory.length === 0) return 100;
        
        const successfulRecoveries = this.recoveryHistory.filter(error => 
            !error.message.includes('failed') && !error.message.includes('error')
        ).length;
        
        return Math.round((successfulRecoveries / this.recoveryHistory.length) * 100);
    }

    // Manual Control Methods
    forceRecovery(handlerName) {
        const handler = this.handlers[handlerName];
        if (handler && typeof handler.reset === 'function') {
            handler.reset();
            this.showNotification(`Reset ${handlerName} handler`, 'success');
        } else {
            this.showNotification(`Handler ${handlerName} not found`, 'error');
        }
    }

    resetAllHandlers() {
        Object.values(this.handlers).forEach(handler => {
            if (handler && typeof handler.reset === 'function') {
                handler.reset();
            }
        });
        this.showNotification('All handlers reset', 'success');
        this.updateDashboard();
    }

    clearErrorHistory() {
        this.recoveryHistory = [];
        this.showNotification('Error history cleared', 'success');
        this.updateRecentErrors();
    }

    exportErrorLog() {
        const errorLog = {
            timestamp: new Date().toISOString(),
            handlers: Object.keys(this.handlers).reduce((acc, name) => {
                const handler = this.handlers[name];
                if (handler && typeof handler.getErrorStats === 'function') {
                    acc[name] = handler.getErrorStats();
                }
                return acc;
            }, {}),
            recentErrors: this.recoveryHistory,
            systemInfo: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: Date.now()
            }
        };
        
        const blob = new Blob([JSON.stringify(errorLog, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-log-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Error log exported', 'success');
    }

    enableAllFallbacks() {
        Object.values(this.handlers).forEach(handler => {
            if (handler && typeof handler.enableFallback === 'function') {
                handler.enableFallback();
            }
        });
        this.showNotification('All fallbacks enabled', 'warning');
    }

    showNotification(message, type) {
        const colors = {
            success: 'green',
            warning: 'yellow',
            error: 'red',
            info: 'blue'
        };
        
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };

        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 left-4 bg-${colors[type]}-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-xl">${icons[type]}</span>
                <span class="text-sm">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize error dashboard
window.ErrorDashboard = ErrorDashboard;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other handlers to initialize
    setTimeout(() => {
        window.errorDashboard = new ErrorDashboard();
    }, 1000);
});
