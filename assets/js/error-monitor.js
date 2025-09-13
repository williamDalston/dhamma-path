/**
 * Production Error Monitor
 * Comprehensive error tracking and monitoring for production
 */

class ErrorMonitor {
    constructor() {
        this.errorQueue = [];
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        this.setupGlobalErrorHandlers();
        this.setupNetworkMonitoring();
        this.setupPerformanceMonitoring();
        this.setupUserFeedback();
        this.startErrorReporting();
    }

    setupGlobalErrorHandlers() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise_rejection',
                message: event.reason?.message || event.reason,
                stack: event.reason?.stack,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleError({
                    type: 'resource_error',
                    message: `Failed to load resource: ${event.target.src || event.target.href}`,
                    resource: event.target.src || event.target.href,
                    tagName: event.target.tagName,
                    timestamp: Date.now(),
                    url: window.location.href
                });
            }
        }, true);
    }

    setupNetworkMonitoring() {
        // Monitor network status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processErrorQueue();
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('Connection lost - errors will be queued', 'warning');
        });

        // Monitor network requests
        this.interceptFetch();
    }

    interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = Date.now();
            try {
                const response = await originalFetch(...args);
                const duration = Date.now() - startTime;
                
                // Log slow requests
                if (duration > 5000) {
                    this.handleError({
                        type: 'slow_request',
                        message: `Slow network request: ${duration}ms`,
                        url: args[0],
                        duration: duration,
                        timestamp: Date.now()
                    });
                }
                
                return response;
            } catch (error) {
                this.handleError({
                    type: 'network_error',
                    message: `Network request failed: ${error.message}`,
                    url: args[0],
                    timestamp: Date.now()
                });
                throw error;
            }
        };
    }

    setupPerformanceMonitoring() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const longTaskObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (entry.duration > 50) {
                        this.handleError({
                            type: 'long_task',
                            message: `Long task detected: ${entry.duration}ms`,
                            duration: entry.duration,
                            startTime: entry.startTime,
                            timestamp: Date.now()
                        });
                    }
                }
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        }

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = memory.usedJSHeapSize / 1024 / 1024;
                const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
                
                if (usedMB / limitMB > 0.8) {
                    this.handleError({
                        type: 'high_memory_usage',
                        message: `High memory usage: ${usedMB.toFixed(2)}MB / ${limitMB.toFixed(2)}MB`,
                        memoryUsage: usedMB,
                        memoryLimit: limitMB,
                        percentage: (usedMB / limitMB) * 100,
                        timestamp: Date.now()
                    });
                }
            }, 30000); // Check every 30 seconds
        }
    }

    setupUserFeedback() {
        // Create feedback button
        const feedbackButton = document.createElement('button');
        feedbackButton.id = 'error-feedback-btn';
        feedbackButton.className = 'fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors z-50 hidden';
        feedbackButton.innerHTML = '🐛 Report Issue';
        feedbackButton.onclick = () => this.showFeedbackModal();
        document.body.appendChild(feedbackButton);

        // Show feedback button after multiple errors
        this.errorCount = 0;
        this.errorThreshold = 3;
    }

    handleError(errorData) {
        console.error('Error detected:', errorData);
        
        // Add to queue
        this.errorQueue.push(errorData);
        
        // Increment error count
        this.errorCount++;
        
        // Show feedback button if threshold reached
        if (this.errorCount >= this.errorThreshold) {
            const feedbackBtn = document.getElementById('error-feedback-btn');
            if (feedbackBtn) {
                feedbackBtn.classList.remove('hidden');
            }
        }
        
        // Try to report immediately if online
        if (this.isOnline) {
            this.reportError(errorData);
        }
        
        // Show user notification for critical errors
        if (this.isCriticalError(errorData)) {
            this.showCriticalErrorNotification(errorData);
        }
    }

    isCriticalError(errorData) {
        const criticalTypes = ['javascript', 'promise_rejection', 'resource_error'];
        return criticalTypes.includes(errorData.type) && 
               !errorData.message.includes('favicon') &&
               !errorData.message.includes('analytics');
    }

    showCriticalErrorNotification(errorData) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-md';
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <span class="text-xl">⚠️</span>
                <div>
                    <h4 class="font-semibold">Something went wrong</h4>
                    <p class="text-sm opacity-90 mt-1">We've been notified and are working to fix this issue.</p>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="mt-2 text-xs underline opacity-75 hover:opacity-100">
                        Dismiss
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    async reportError(errorData) {
        try {
            // Add session context
            const enrichedError = {
                ...errorData,
                sessionId: this.getSessionId(),
                userId: this.getUserId(),
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                screen: {
                    width: screen.width,
                    height: screen.height
                },
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: navigator.language
            };

            // Send to error tracking service
            const response = await fetch('/api/errors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Error-Report': 'true'
                },
                body: JSON.stringify(enrichedError)
            });

            if (!response.ok) {
                throw new Error(`Error reporting failed: ${response.status}`);
            }

            console.log('✅ Error reported successfully');
        } catch (error) {
            console.error('❌ Failed to report error:', error);
            // Store in localStorage for later retry
            this.storeErrorForRetry(errorData);
        }
    }

    async processErrorQueue() {
        if (!this.isOnline || this.errorQueue.length === 0) {
            return;
        }

        const errorsToProcess = [...this.errorQueue];
        this.errorQueue = [];

        for (const error of errorsToProcess) {
            await this.reportError(error);
            await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
        }

        // Process stored errors
        await this.processStoredErrors();
    }

    async processStoredErrors() {
        try {
            const storedErrors = JSON.parse(localStorage.getItem('pending-errors') || '[]');
            if (storedErrors.length === 0) return;

            for (const error of storedErrors) {
                await this.reportError(error);
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            localStorage.removeItem('pending-errors');
        } catch (error) {
            console.error('Failed to process stored errors:', error);
        }
    }

    storeErrorForRetry(errorData) {
        try {
            const storedErrors = JSON.parse(localStorage.getItem('pending-errors') || '[]');
            storedErrors.push(errorData);
            
            // Keep only last 50 errors
            if (storedErrors.length > 50) {
                storedErrors.splice(0, storedErrors.length - 50);
            }
            
            localStorage.setItem('pending-errors', JSON.stringify(storedErrors));
        } catch (error) {
            console.error('Failed to store error for retry:', error);
        }
    }

    startErrorReporting() {
        // Process queue every 30 seconds
        setInterval(() => {
            this.processErrorQueue();
        }, 30000);

        // Clean up old errors
        setInterval(() => {
            this.cleanupOldErrors();
        }, 300000); // Every 5 minutes
    }

    cleanupOldErrors() {
        try {
            const storedErrors = JSON.parse(localStorage.getItem('pending-errors') || '[]');
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            
            const recentErrors = storedErrors.filter(error => error.timestamp > oneDayAgo);
            localStorage.setItem('pending-errors', JSON.stringify(recentErrors));
        } catch (error) {
            console.error('Failed to cleanup old errors:', error);
        }
    }

    showFeedbackModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-lg font-semibold mb-4">Report an Issue</h3>
                <form id="error-feedback-form">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            What happened?
                        </label>
                        <textarea id="error-description" 
                                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  rows="4" 
                                  placeholder="Describe what you were doing when the issue occurred..."></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Contact Email (optional)
                        </label>
                        <input type="email" 
                               id="user-email" 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                               placeholder="your@email.com">
                    </div>
                    <div class="flex space-x-3">
                        <button type="submit" 
                                class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                            Send Report
                        </button>
                        <button type="button" 
                                onclick="this.closest('.fixed').remove()"
                                class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        modal.querySelector('#error-feedback-form').onsubmit = (e) => {
            e.preventDefault();
            this.submitFeedback(modal);
        };
    }

    async submitFeedback(modal) {
        const description = modal.querySelector('#error-description').value;
        const email = modal.querySelector('#user-email').value;
        
        if (!description.trim()) {
            alert('Please describe the issue');
            return;
        }

        try {
            const feedbackData = {
                type: 'user_feedback',
                description: description,
                email: email,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                recentErrors: this.errorQueue.slice(-5) // Include recent errors for context
            };

            await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedbackData)
            });

            modal.remove();
            this.showNotification('Thank you for your feedback!', 'success');
            
            // Hide feedback button
            const feedbackBtn = document.getElementById('error-feedback-btn');
            if (feedbackBtn) {
                feedbackBtn.classList.add('hidden');
            }
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            alert('Failed to send feedback. Please try again.');
        }
    }

    showNotification(message, type = 'info') {
        if (window.dhammaPathApp && window.dhammaPathApp.showNotification) {
            window.dhammaPathApp.showNotification(message, type);
        }
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('session-id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('session-id', sessionId);
        }
        return sessionId;
    }

    getUserId() {
        return localStorage.getItem('user-id') || 'anonymous';
    }

    // Public API
    getErrorStats() {
        return {
            totalErrors: this.errorCount,
            queuedErrors: this.errorQueue.length,
            isOnline: this.isOnline
        };
    }

    clearErrors() {
        this.errorQueue = [];
        this.errorCount = 0;
        localStorage.removeItem('pending-errors');
    }
}

// Initialize error monitor
window.ErrorMonitor = ErrorMonitor;

// Auto-initialize in production
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        window.errorMonitor = new ErrorMonitor();
    });
}
