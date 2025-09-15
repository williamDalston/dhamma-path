/**
 * CONSOLE DASHBOARD - Visual Console Issue Monitoring
 * 
 * Provides a visual dashboard to monitor console issues, performance metrics,
 * and system health in real-time.
 */

class ConsoleDashboard {
    constructor() {
        this.dashboard = null;
        this.isVisible = false;
        this.metrics = {
            errors: 0,
            warnings: 0,
            fixes: 0,
            performance: 0,
            memory: 0,
            network: 0
        };
        
        this.setupDashboard();
        this.startMonitoring();
        this.addKeyboardShortcuts();
        
        console.log('📊 Console Dashboard initialized - Press Ctrl+Shift+D to toggle');
    }

    setupDashboard() {
        // Create dashboard container
        this.dashboard = document.createElement('div');
        this.dashboard.id = 'console-dashboard';
        this.dashboard.innerHTML = `
            <div class="dashboard-header">
                <h3>🛡️ Console Guardian Dashboard</h3>
                <button id="dashboard-close" class="close-btn">×</button>
            </div>
            <div class="dashboard-content">
                <div class="metrics-grid">
                    <div class="metric-card error">
                        <div class="metric-icon">❌</div>
                        <div class="metric-value" id="error-count">0</div>
                        <div class="metric-label">Errors</div>
                    </div>
                    <div class="metric-card warning">
                        <div class="metric-icon">⚠️</div>
                        <div class="metric-value" id="warning-count">0</div>
                        <div class="metric-label">Warnings</div>
                    </div>
                    <div class="metric-card success">
                        <div class="metric-icon">🔧</div>
                        <div class="metric-value" id="fix-count">0</div>
                        <div class="metric-label">Auto-Fixes</div>
                    </div>
                    <div class="metric-card performance">
                        <div class="metric-icon">⚡</div>
                        <div class="metric-value" id="performance-score">100</div>
                        <div class="metric-label">Performance</div>
                    </div>
                    <div class="metric-card memory">
                        <div class="metric-icon">🧠</div>
                        <div class="metric-value" id="memory-usage">0MB</div>
                        <div class="metric-label">Memory</div>
                    </div>
                    <div class="metric-card network">
                        <div class="metric-icon">🌐</div>
                        <div class="metric-value" id="network-status">Online</div>
                        <div class="metric-label">Network</div>
                    </div>
                </div>
                <div class="issues-section">
                    <h4>Recent Issues</h4>
                    <div id="issues-list" class="issues-list"></div>
                </div>
                <div class="actions-section">
                    <h4>Actions</h4>
                    <div class="action-buttons">
                        <button id="clear-issues" class="action-btn">Clear Issues</button>
                        <button id="force-heal" class="action-btn">Force Heal</button>
                        <button id="export-report" class="action-btn">Export Report</button>
                        <button id="refresh-metrics" class="action-btn">Refresh</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        this.addStyles();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initially hidden
        this.dashboard.style.display = 'none';
        document.body.appendChild(this.dashboard);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #console-dashboard {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 80vh;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                overflow: hidden;
                border: 1px solid rgba(0, 0, 0, 0.1);
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px 12px 0 0;
            }
            
            .dashboard-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            
            .close-btn:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            .dashboard-content {
                padding: 20px;
                max-height: calc(80vh - 60px);
                overflow-y: auto;
            }
            
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
                margin-bottom: 20px;
            }
            
            .metric-card {
                background: white;
                border-radius: 8px;
                padding: 16px;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                border-left: 4px solid #e5e7eb;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .metric-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
            
            .metric-card.error {
                border-left-color: #ef4444;
            }
            
            .metric-card.warning {
                border-left-color: #f59e0b;
            }
            
            .metric-card.success {
                border-left-color: #10b981;
            }
            
            .metric-card.performance {
                border-left-color: #3b82f6;
            }
            
            .metric-card.memory {
                border-left-color: #8b5cf6;
            }
            
            .metric-card.network {
                border-left-color: #06b6d4;
            }
            
            .metric-icon {
                font-size: 24px;
                margin-bottom: 8px;
            }
            
            .metric-value {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 4px;
                color: #1f2937;
            }
            
            .metric-label {
                font-size: 12px;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .issues-section {
                margin-bottom: 20px;
            }
            
            .issues-section h4 {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #374151;
                font-weight: 600;
            }
            
            .issues-list {
                max-height: 200px;
                overflow-y: auto;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                background: #f9fafb;
            }
            
            .issue-item {
                padding: 8px 12px;
                border-bottom: 1px solid #e5e7eb;
                font-size: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .issue-item:last-child {
                border-bottom: none;
            }
            
            .issue-item.error {
                background: #fef2f2;
                color: #dc2626;
            }
            
            .issue-item.warning {
                background: #fffbeb;
                color: #d97706;
            }
            
            .issue-item.fixed {
                background: #f0fdf4;
                color: #059669;
            }
            
            .issue-message {
                flex: 1;
                margin-right: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .issue-time {
                font-size: 10px;
                color: #9ca3af;
            }
            
            .actions-section h4 {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #374151;
                font-weight: 600;
            }
            
            .action-buttons {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
            
            .action-btn {
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 8px 12px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .action-btn:hover {
                background: #2563eb;
            }
            
            .action-btn:active {
                transform: translateY(1px);
            }
            
            .action-btn.danger {
                background: #ef4444;
            }
            
            .action-btn.danger:hover {
                background: #dc2626;
            }
            
            .action-btn.success {
                background: #10b981;
            }
            
            .action-btn.success:hover {
                background: #059669;
            }
            
            @media (max-width: 768px) {
                #console-dashboard {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                }
                
                .metrics-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
        `;
        document.head.appendChild(style);
    }

    addEventListeners() {
        // Close button
        this.dashboard.querySelector('#dashboard-close').addEventListener('click', () => {
            this.hide();
        });

        // Action buttons
        this.dashboard.querySelector('#clear-issues').addEventListener('click', () => {
            this.clearIssues();
        });

        this.dashboard.querySelector('#force-heal').addEventListener('click', () => {
            this.forceHeal();
        });

        this.dashboard.querySelector('#export-report').addEventListener('click', () => {
            this.exportReport();
        });

        this.dashboard.querySelector('#refresh-metrics').addEventListener('click', () => {
            this.refreshMetrics();
        });

        // Click outside to close
        document.addEventListener('click', (event) => {
            if (this.isVisible && !this.dashboard.contains(event.target)) {
                this.hide();
            }
        });
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl+Shift+D to toggle dashboard
            if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                this.toggle();
            }
            
            // Escape to close dashboard
            if (event.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    startMonitoring() {
        // Update metrics every 10 seconds (reduced frequency)
        setInterval(() => {
            this.updateMetrics();
        }, 10000);

        // Update issues every 30 seconds (reduced frequency)
        setInterval(() => {
            this.updateIssues();
        }, 30000);
    }

    updateMetrics() {
        // Get metrics from Console Guardian
        if (window.consoleGuardian) {
            const guardianMetrics = window.consoleGuardian.getPerformance();
            this.metrics.errors = guardianMetrics.errors;
            this.metrics.warnings = guardianMetrics.warnings;
            this.metrics.fixes = guardianMetrics.fixes;
        }

        // Get performance metrics
        if (window.performanceMonitor) {
            const perfMetrics = window.performanceMonitor.getMetrics();
            this.metrics.performance = window.performanceMonitor.calculatePerformanceScore();
            this.metrics.memory = Math.round(perfMetrics.memoryUsage / 1024 / 1024);
        }

        // Get network status
        this.metrics.network = navigator.onLine ? 'Online' : 'Offline';

        // Update UI
        this.dashboard.querySelector('#error-count').textContent = this.metrics.errors;
        this.dashboard.querySelector('#warning-count').textContent = this.metrics.warnings;
        this.dashboard.querySelector('#fix-count').textContent = this.metrics.fixes;
        this.dashboard.querySelector('#performance-score').textContent = this.metrics.performance;
        this.dashboard.querySelector('#memory-usage').textContent = `${this.metrics.memory}MB`;
        this.dashboard.querySelector('#network-status').textContent = this.metrics.network;

        // Update metric card colors based on values
        this.updateMetricCardColors();
    }

    updateMetricCardColors() {
        const errorCard = this.dashboard.querySelector('.metric-card.error');
        const warningCard = this.dashboard.querySelector('.metric-card.warning');
        const performanceCard = this.dashboard.querySelector('.metric-card.performance');
        const memoryCard = this.dashboard.querySelector('.metric-card.memory');
        const networkCard = this.dashboard.querySelector('.metric-card.network');

        // Error card
        if (this.metrics.errors > 10) {
            errorCard.style.borderLeftColor = '#dc2626';
        } else if (this.metrics.errors > 5) {
            errorCard.style.borderLeftColor = '#f59e0b';
        } else {
            errorCard.style.borderLeftColor = '#10b981';
        }

        // Warning card
        if (this.metrics.warnings > 20) {
            warningCard.style.borderLeftColor = '#dc2626';
        } else if (this.metrics.warnings > 10) {
            warningCard.style.borderLeftColor = '#f59e0b';
        } else {
            warningCard.style.borderLeftColor = '#10b981';
        }

        // Performance card
        if (this.metrics.performance < 50) {
            performanceCard.style.borderLeftColor = '#dc2626';
        } else if (this.metrics.performance < 80) {
            performanceCard.style.borderLeftColor = '#f59e0b';
        } else {
            performanceCard.style.borderLeftColor = '#10b981';
        }

        // Memory card
        if (this.metrics.memory > 100) {
            memoryCard.style.borderLeftColor = '#dc2626';
        } else if (this.metrics.memory > 50) {
            memoryCard.style.borderLeftColor = '#f59e0b';
        } else {
            memoryCard.style.borderLeftColor = '#10b981';
        }

        // Network card
        if (this.metrics.network === 'Offline') {
            networkCard.style.borderLeftColor = '#dc2626';
        } else {
            networkCard.style.borderLeftColor = '#10b981';
        }
    }

    updateIssues() {
        const issuesList = this.dashboard.querySelector('#issues-list');
        issuesList.innerHTML = '';

        if (window.consoleGuardian) {
            const issues = window.consoleGuardian.getIssues();
            const recentIssues = issues
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 10);

            recentIssues.forEach(issue => {
                const issueItem = document.createElement('div');
                issueItem.className = `issue-item ${issue.fixed ? 'fixed' : issue.type}`;
                
                const message = issue.message.length > 50 
                    ? issue.message.substring(0, 50) + '...' 
                    : issue.message;
                
                const time = new Date(issue.timestamp).toLocaleTimeString();
                
                issueItem.innerHTML = `
                    <div class="issue-message">${message}</div>
                    <div class="issue-time">${time}</div>
                `;
                
                issuesList.appendChild(issueItem);
            });
        }

        if (issuesList.children.length === 0) {
            issuesList.innerHTML = '<div class="issue-item" style="text-align: center; color: #9ca3af;">No recent issues</div>';
        }
    }

    clearIssues() {
        if (window.consoleGuardian) {
            window.consoleGuardian.clearIssues();
        }
        this.updateIssues();
        console.log('🧹 Issues cleared');
    }

    forceHeal() {
        if (window.autoHealer) {
            // Try to heal all systems
            const strategies = ['resource_loading', 'js_errors', 'css_loading', 'service_worker', 'performance', 'memory', 'network'];
            strategies.forEach(strategy => {
                window.autoHealer.forceHeal(strategy);
            });
        }
        console.log('🩺 Force healing initiated');
    }

    exportReport() {
        const report = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            issues: window.consoleGuardian ? window.consoleGuardian.getIssues() : [],
            performance: window.performanceMonitor ? window.performanceMonitor.getReport() : null,
            health: window.autoHealer ? window.autoHealer.getHealthStatus() : null
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `console-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('📊 Report exported');
    }

    refreshMetrics() {
        this.updateMetrics();
        this.updateIssues();
        console.log('🔄 Metrics refreshed');
    }

    show() {
        this.dashboard.style.display = 'block';
        this.isVisible = true;
        this.updateMetrics();
        this.updateIssues();
    }

    hide() {
        this.dashboard.style.display = 'none';
        this.isVisible = false;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    // Public API
    getMetrics() {
        return { ...this.metrics };
    }

    isDashboardVisible() {
        return this.isVisible;
    }
}

// Initialize Console Dashboard
window.consoleDashboard = new ConsoleDashboard();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConsoleDashboard;
}
