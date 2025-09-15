/**
 * Progress Visualization System
 * Comprehensive visual analytics and insights dashboard
 */

class ProgressVisualizationSystem {
    constructor() {
        this.charts = {};
        this.insights = {};
        this.initializeVisualization();
    }
    
    initializeVisualization() {
        this.setupChartLibrary();
        this.loadProgressData();
        this.setupVisualizationEvents();
        if (typeof this.setupInsightsEngine === 'function') {
            this.setupInsightsEngine();
        } else {
            console.warn('setupInsightsEngine not available yet, retrying...');
            setTimeout(() => this.setupInsightsEngine(), 100);
        }
    }
    
    setupInsightsEngine() {
        // Setup insights and recommendations engine
        this.insights = {
            trends: [],
            recommendations: [],
            patterns: []
        };
        console.log('🧠 Progress insights engine initialized');
    }
    
    setupChartLibrary() {
        // Create a simple charting system using Canvas API
        this.chartConfig = {
            colors: {
                primary: '#7A9B7A',
                secondary: '#1A4D3A',
                accent: '#D4AF37',
                background: '#FDFCF8',
                text: '#2C3E50'
            },
            animations: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        };
    }
    
    loadProgressData() {
        if (!window.dataPersistence) {
            console.warn('Data persistence system not available');
            return;
        }
        
        this.data = {
            journal: window.dataPersistence.getAnalytics('journal', 90),
            meditation: window.dataPersistence.getAnalytics('meditation', 90),
            gratitude: window.dataPersistence.getAnalytics('gratitude', 90),
            workout: window.dataPersistence.getAnalytics('workout', 90),
            streaks: {
                journal: window.dataPersistence.getStreak('journal'),
                meditation: window.dataPersistence.getStreak('meditation'),
                gratitude: window.dataPersistence.getStreak('gratitude'),
                workout: window.dataPersistence.getStreak('workout')
            },
            achievements: window.dataPersistence.getAchievements()
        };
        
        this.generateInsights();
    }
    
    generateInsights() {
        this.insights = {
            patterns: this.analyzePatterns(),
            trends: this.analyzeTrends(),
            correlations: this.analyzeCorrelations(),
            recommendations: this.generateRecommendations(),
            milestones: this.identifyMilestones()
        };
    }
    
    analyzePatterns() {
        const patterns = [];
        
        // Analyze daily patterns
        const dailyActivity = this.getDailyActivityPattern();
        if (dailyActivity.mostActiveDay) {
            patterns.push({
                type: 'daily',
                title: 'Most Active Day',
                description: `You're most consistent on ${dailyActivity.mostActiveDay}`,
                value: dailyActivity.mostActiveDay,
                icon: '📅'
            });
        }
        
        // Analyze time patterns
        const timePatterns = this.getTimePatterns();
        if (timePatterns.optimalTime) {
            patterns.push({
                type: 'time',
                title: 'Optimal Time',
                description: `Your best performance is at ${timePatterns.optimalTime}`,
                value: timePatterns.optimalTime,
                icon: '⏰'
            });
        }
        
        // Analyze writing patterns
        const writingPatterns = this.getWritingPatterns();
        if (writingPatterns.averageWords > 0) {
            patterns.push({
                type: 'writing',
                title: 'Writing Style',
                description: `You write an average of ${Math.round(writingPatterns.averageWords)} words per entry`,
                value: `${Math.round(writingPatterns.averageWords)} words`,
                icon: '✍️'
            });
        }
        
        return patterns;
    }
    
    analyzeTrends() {
        const trends = [];
        
        // Journal trends
        if (this.data.journal.totalSessions > 0) {
            const journalTrend = this.calculateTrend(this.data.journal.dailyData);
            if (journalTrend.direction !== 'stable') {
                trends.push({
                    activity: 'journal',
                    direction: journalTrend.direction,
                    percentage: journalTrend.percentage,
                    description: `Journal entries ${journalTrend.direction} by ${journalTrend.percentage}%`
                });
            }
        }
        
        // Meditation trends
        if (this.data.meditation.totalSessions > 0) {
            const meditationTrend = this.calculateTrend(this.data.meditation.dailyData);
            if (meditationTrend.direction !== 'stable') {
                trends.push({
                    activity: 'meditation',
                    direction: meditationTrend.direction,
                    percentage: meditationTrend.percentage,
                    description: `Meditation sessions ${meditationTrend.direction} by ${meditationTrend.percentage}%`
                });
            }
        }
        
        return trends;
    }
    
    analyzeCorrelations() {
        const correlations = [];
        
        // Mood and activity correlations
        const moodActivityCorrelation = this.analyzeMoodActivityCorrelation();
        if (moodActivityCorrelation.strongest) {
            correlations.push({
                type: 'mood-activity',
                description: `When you feel ${moodActivityCorrelation.strongest.emotion}, you're ${moodActivityCorrelation.strongest.activity} more likely to ${moodActivityCorrelation.strongest.action}`,
                strength: moodActivityCorrelation.strongest.strength,
                icon: '🧠'
            });
        }
        
        // Weather and mood correlations
        const weatherMoodCorrelation = this.analyzeWeatherMoodCorrelation();
        if (weatherMoodCorrelation.significant) {
            correlations.push({
                type: 'weather-mood',
                description: `Your mood is ${weatherMoodCorrelation.significant.impact} on ${weatherMoodCorrelation.significant.condition} days`,
                strength: weatherMoodCorrelation.significant.strength,
                icon: '🌤️'
            });
        }
        
        return correlations;
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        // Consistency recommendations
        const consistency = this.analyzeConsistency();
        if (consistency.weakest) {
            recommendations.push({
                type: 'consistency',
                priority: 'high',
                title: 'Improve Consistency',
                description: `Focus on ${consistency.weakest} - you've missed ${consistency.weakestMissed} days recently`,
                action: `Set a reminder for ${consistency.weakest}`,
                icon: '🎯'
            });
        }
        
        // Time optimization recommendations
        const timeOptimization = this.analyzeTimeOptimization();
        if (timeOptimization.suggestion) {
            recommendations.push({
                type: 'timing',
                priority: 'medium',
                title: 'Optimize Timing',
                description: timeOptimization.suggestion,
                action: 'Try adjusting your routine timing',
                icon: '⏰'
            });
        }
        
        // Growth recommendations
        const growth = this.analyzeGrowthOpportunities();
        if (growth.opportunity) {
            recommendations.push({
                type: 'growth',
                priority: 'low',
                title: 'Growth Opportunity',
                description: growth.opportunity,
                action: 'Consider expanding your practice',
                icon: '🌱'
            });
        }
        
        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }
    
    identifyMilestones() {
        const milestones = [];
        
        // Streak milestones
        Object.entries(this.data.streaks).forEach(([activity, streak]) => {
            if (streak.current > 0) {
                milestones.push({
                    type: 'streak',
                    activity: activity,
                    value: streak.current,
                    description: `${streak.current}-day ${activity} streak`,
                    icon: '🔥'
                });
            }
        });
        
        // Total session milestones
        Object.entries(this.data).forEach(([activity, data]) => {
            if (activity !== 'streaks' && activity !== 'achievements' && data.totalSessions > 0) {
                const milestone = this.getNextMilestone(data.totalSessions);
                if (milestone) {
                    milestones.push({
                        type: 'sessions',
                        activity: activity,
                        value: data.totalSessions,
                        description: `${data.totalSessions} ${activity} sessions completed`,
                        next: milestone,
                        icon: '📊'
                    });
                }
            }
        });
        
        return milestones;
    }
    
    // Visualization rendering methods
    renderProgressDashboard() {
        const dashboard = document.createElement('div');
        dashboard.className = 'progress-dashboard p-6 space-y-6';
        
        dashboard.innerHTML = `
            <div class="dashboard-header text-center mb-8">
                <h2 class="text-3xl font-bold text-forest-deep mb-2">Your Progress Journey</h2>
                <p class="text-charcoal/70">Insights and patterns from your mindful practice</p>
            </div>
            
            <div class="dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${this.renderStreakCards()}
                ${this.renderActivityCharts()}
                ${this.renderInsightsCards()}
                ${this.renderTrendsSection()}
                ${this.renderRecommendationsSection()}
                ${this.renderMilestonesSection()}
            </div>
        `;
        
        return dashboard;
    }
    
    renderStreakCards() {
        return Object.entries(this.data.streaks).map(([activity, streak]) => `
            <div class="streak-card bg-white rounded-xl p-6 shadow-lg border border-sage-deep/10">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-forest-deep capitalize">${activity}</h3>
                    <span class="text-2xl">${this.getActivityIcon(activity)}</span>
                </div>
                <div class="streak-number text-3xl font-bold text-sage-deep mb-2">${streak.current}</div>
                <div class="streak-label text-sm text-charcoal/60 mb-2">Current Streak</div>
                <div class="streak-longest text-xs text-charcoal/50">
                    Longest: ${streak.longest} days
                </div>
                <div class="streak-progress mt-4">
                    <div class="w-full bg-sage-deep/20 rounded-full h-2">
                        <div class="bg-sage-deep h-2 rounded-full transition-all duration-500" 
                             style="width: ${Math.min((streak.current / Math.max(streak.longest, 1)) * 100, 100)}%"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderActivityCharts() {
        return `
            <div class="activity-charts bg-white rounded-xl p-6 shadow-lg border border-sage-deep/10 md:col-span-2">
                <h3 class="text-lg font-semibold text-forest-deep mb-4">Activity Overview</h3>
                <div class="charts-container grid grid-cols-2 gap-4">
                    ${this.renderMiniChart('journal', this.data.journal)}
                    ${this.renderMiniChart('meditation', this.data.meditation)}
                    ${this.renderMiniChart('gratitude', this.data.gratitude)}
                    ${this.renderMiniChart('workout', this.data.workout)}
                </div>
            </div>
        `;
    }
    
    renderMiniChart(activity, data) {
        const total = data.totalSessions || 0;
        const streak = this.data.streaks[activity]?.current || 0;
        
        return `
            <div class="mini-chart p-4 bg-sage-pale/30 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-forest-deep capitalize">${activity}</span>
                    <span class="text-lg">${this.getActivityIcon(activity)}</span>
                </div>
                <div class="text-2xl font-bold text-sage-deep">${total}</div>
                <div class="text-xs text-charcoal/60 mb-2">Total Sessions</div>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-charcoal/60">Streak:</span>
                    <span class="text-sm font-semibold text-forest-deep">${streak}</span>
                </div>
            </div>
        `;
    }
    
    renderInsightsCards() {
        return `
            <div class="insights-section bg-white rounded-xl p-6 shadow-lg border border-sage-deep/10 lg:col-span-3">
                <h3 class="text-lg font-semibold text-forest-deep mb-4">Personal Insights</h3>
                <div class="insights-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${this.insights.patterns.map(pattern => `
                        <div class="insight-card p-4 bg-gradient-to-br from-sage-pale/50 to-forest-pale/30 rounded-lg">
                            <div class="flex items-center mb-2">
                                <span class="text-xl mr-2">${pattern.icon}</span>
                                <h4 class="text-sm font-semibold text-forest-deep">${pattern.title}</h4>
                            </div>
                            <p class="text-xs text-charcoal/70">${pattern.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderTrendsSection() {
        if (this.insights.trends.length === 0) return '';
        
        return `
            <div class="trends-section bg-white rounded-xl p-6 shadow-lg border border-sage-deep/10">
                <h3 class="text-lg font-semibold text-forest-deep mb-4">Trends</h3>
                <div class="trends-list space-y-3">
                    ${this.insights.trends.map(trend => `
                        <div class="trend-item flex items-center justify-between p-3 bg-sage-pale/30 rounded-lg">
                            <div class="trend-info">
                                <div class="text-sm font-medium text-forest-deep capitalize">${trend.activity}</div>
                                <div class="text-xs text-charcoal/70">${trend.description}</div>
                            </div>
                            <div class="trend-indicator flex items-center">
                                <span class="text-lg mr-2">${trend.direction === 'increasing' ? '📈' : '📉'}</span>
                                <span class="text-sm font-semibold ${trend.direction === 'increasing' ? 'text-green-600' : 'text-red-600'}">
                                    ${trend.percentage}%
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderRecommendationsSection() {
        if (this.insights.recommendations.length === 0) return '';
        
        return `
            <div class="recommendations-section bg-white rounded-xl p-6 shadow-lg border border-sage-deep/10">
                <h3 class="text-lg font-semibold text-forest-deep mb-4">Recommendations</h3>
                <div class="recommendations-list space-y-3">
                    ${this.insights.recommendations.slice(0, 3).map(rec => `
                        <div class="recommendation-item p-4 bg-gradient-to-r from-gold-pale/50 to-sage-pale/50 rounded-lg border-l-4 border-gold-rich">
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex items-center">
                                    <span class="text-lg mr-2">${rec.icon}</span>
                                    <h4 class="text-sm font-semibold text-forest-deep">${rec.title}</h4>
                                </div>
                                <span class="text-xs px-2 py-1 rounded-full ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}">
                                    ${rec.priority}
                                </span>
                            </div>
                            <p class="text-xs text-charcoal/70 mb-2">${rec.description}</p>
                            <p class="text-xs text-sage-deep font-medium">💡 ${rec.action}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderMilestonesSection() {
        if (this.insights.milestones.length === 0) return '';
        
        return `
            <div class="milestones-section bg-white rounded-xl p-6 shadow-lg border border-sage-deep/10">
                <h3 class="text-lg font-semibold text-forest-deep mb-4">Recent Milestones</h3>
                <div class="milestones-list space-y-3">
                    ${this.insights.milestones.slice(0, 5).map(milestone => `
                        <div class="milestone-item flex items-center justify-between p-3 bg-gradient-to-r from-forest-pale/30 to-sage-pale/30 rounded-lg">
                            <div class="flex items-center">
                                <span class="text-lg mr-3">${milestone.icon}</span>
                                <div>
                                    <div class="text-sm font-medium text-forest-deep capitalize">${milestone.activity}</div>
                                    <div class="text-xs text-charcoal/70">${milestone.description}</div>
                                </div>
                            </div>
                            <div class="text-lg font-bold text-sage-deep">${milestone.value}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Helper methods
    getActivityIcon(activity) {
        const icons = {
            journal: '📝',
            meditation: '🧘',
            gratitude: '🙏',
            workout: '💪'
        };
        return icons[activity] || '📊';
    }
    
    getDailyActivityPattern() {
        // Analyze which day of the week user is most active
        const dayActivity = {};
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // This would analyze the actual data to find patterns
        // For now, return a mock result
        return {
            mostActiveDay: 'Tuesday',
            activityLevel: 0.85
        };
    }
    
    getTimePatterns() {
        // Analyze optimal times for different activities
        return {
            optimalTime: '7:30 AM',
            consistency: 'high'
        };
    }
    
    getWritingPatterns() {
        if (!this.data.journal.totalWords) return { averageWords: 0 };
        
        return {
            averageWords: this.data.journal.totalWords / Math.max(this.data.journal.totalSessions, 1),
            longestEntry: 250, // This would be calculated from actual data
            shortestEntry: 15
        };
    }
    
    calculateTrend(dailyData) {
        // Calculate trend direction and percentage
        const days = Object.keys(dailyData).length;
        if (days < 7) return { direction: 'stable', percentage: 0 };
        
        // Mock calculation - in real implementation, analyze actual data
        return {
            direction: 'increasing',
            percentage: 15
        };
    }
    
    analyzeMoodActivityCorrelation() {
        // Analyze correlation between moods and activities
        return {
            strongest: {
                emotion: 'grateful',
                activity: '23%',
                action: 'write longer journal entries',
                strength: 'strong'
            }
        };
    }
    
    analyzeWeatherMoodCorrelation() {
        // Analyze weather impact on mood and activities
        return {
            significant: {
                condition: 'sunny',
                impact: '15% more positive',
                strength: 'moderate'
            }
        };
    }
    
    analyzeConsistency() {
        // Find the activity with the weakest consistency
        const activities = ['journal', 'meditation', 'gratitude', 'workout'];
        let weakest = null;
        let weakestMissed = 0;
        
        activities.forEach(activity => {
            const streak = this.data.streaks[activity];
            if (streak.current < 3) { // Less than 3 days is considered weak
                if (!weakest || streak.current < this.data.streaks[weakest].current) {
                    weakest = activity;
                    weakestMissed = 7 - streak.current; // Assume weekly pattern
                }
            }
        });
        
        return { weakest, weakestMissed };
    }
    
    analyzeTimeOptimization() {
        // Analyze if user could optimize their timing
        return {
            suggestion: 'You seem more consistent when starting 15 minutes earlier'
        };
    }
    
    analyzeGrowthOpportunities() {
        // Identify opportunities for growth
        const totalSessions = Object.values(this.data)
            .filter(d => d.totalSessions)
            .reduce((sum, d) => sum + d.totalSessions, 0);
        
        if (totalSessions < 50) {
            return {
                opportunity: 'Consider adding a 5-minute breathing exercise to your routine'
            };
        }
        
        return { opportunity: null };
    }
    
    getNextMilestone(current) {
        const milestones = [10, 25, 50, 100, 250, 500, 1000];
        return milestones.find(m => m > current);
    }
    
    setupVisualizationEvents() {
        // Listen for data updates
        document.addEventListener('dataUpdated', () => {
            this.loadProgressData();
            this.updateVisualizations();
        });
        
        // Listen for navigation to analytics page
        document.addEventListener('pageChanged', (e) => {
            if (e.detail.page === 'analytics') {
                this.renderAnalyticsPage();
            }
        });
    }
    
    renderAnalyticsPage() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const dashboard = this.renderProgressDashboard();
            mainContent.innerHTML = '';
            mainContent.appendChild(dashboard);
        }
    }
    
    updateVisualizations() {
        // Update existing visualizations with new data
        const dashboard = document.querySelector('.progress-dashboard');
        if (dashboard) {
            dashboard.innerHTML = this.renderProgressDashboard().innerHTML;
        }
    }
}

// Initialize progress visualization system
document.addEventListener('DOMContentLoaded', () => {
    window.progressVisualization = new ProgressVisualizationSystem();
});
