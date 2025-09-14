/**
 * Weather Integration System
 * Provides weather-based recommendations and mood correlation tracking
 */

class WeatherIntegration {
    constructor() {
        this.apiKey = null; // Would be set from environment or user input
        this.currentWeather = null;
        this.weatherHistory = [];
        this.moodWeatherCorrelation = {};
        
        this.initializeWeatherSystem();
    }
    
    initializeWeatherSystem() {
        this.setupWeatherAPI();
        this.loadWeatherHistory();
        this.setupWeatherRecommendations();
        this.setupWeatherEvents();
    }
    
    setupWeatherAPI() {
        // In a real app, this would use a weather API like OpenWeatherMap
        // For demo purposes, we'll use mock data
        this.mockWeatherData = {
            current: {
                temperature: 72,
                condition: 'sunny',
                humidity: 45,
                windSpeed: 5,
                description: 'Clear sky',
                icon: '☀️'
            },
            forecast: [
                { day: 'Today', temp: 72, condition: 'sunny', icon: '☀️' },
                { day: 'Tomorrow', temp: 68, condition: 'partly-cloudy', icon: '⛅' },
                { day: 'Wednesday', temp: 65, condition: 'rainy', icon: '🌧️' },
                { day: 'Thursday', temp: 70, condition: 'cloudy', icon: '☁️' },
                { day: 'Friday', temp: 75, condition: 'sunny', icon: '☀️' }
            ]
        };
        
        this.weatherConditions = {
            sunny: {
                name: 'Sunny',
                icon: '☀️',
                mood: 'energetic',
                recommendations: [
                    'Perfect day for outdoor meditation!',
                    'Consider a morning walk before your routine',
                    'Great weather for positive energy'
                ],
                activitySuggestions: ['outdoor meditation', 'morning walk', 'gratitude practice']
            },
            rainy: {
                name: 'Rainy',
                icon: '🌧️',
                mood: 'calm',
                recommendations: [
                    'Rainy days are perfect for deep reflection',
                    'The sound of rain can enhance meditation',
                    'Cozy indoor journaling session ahead'
                ],
                activitySuggestions: ['indoor meditation', 'deep journaling', 'listening to rain sounds']
            },
            cloudy: {
                name: 'Cloudy',
                icon: '☁️',
                mood: 'neutral',
                recommendations: [
                    'Cloudy days offer balanced energy',
                    'Great for focused productivity',
                    'Perfect for structured routines'
                ],
                activitySuggestions: ['focused meditation', 'structured journaling', 'goal review']
            },
            'partly-cloudy': {
                name: 'Partly Cloudy',
                icon: '⛅',
                mood: 'optimistic',
                recommendations: [
                    'Mixed weather brings creative energy',
                    'Great for trying new meditation techniques',
                    'Perfect balance of indoor and outdoor activities'
                ],
                activitySuggestions: ['varied meditation', 'creative journaling', 'flexible routine']
            }
        };
    }
    
    async getCurrentWeather() {
        try {
            // In a real implementation, this would fetch from a weather API
            // For now, we'll use mock data and add some randomness
            const conditions = Object.keys(this.weatherConditions);
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            
            this.currentWeather = {
                ...this.mockWeatherData.current,
                condition: randomCondition,
                ...this.weatherConditions[randomCondition]
            };
            
            this.saveWeatherData();
            this.generateWeatherRecommendations();
            
            return this.currentWeather;
        } catch (error) {
            console.error('Failed to fetch weather:', error);
            return null;
        }
    }
    
    saveWeatherData() {
        const weatherEntry = {
            date: new Date().toISOString().split('T')[0],
            weather: this.currentWeather,
            timestamp: new Date()
        };
        
        this.weatherHistory.push(weatherEntry);
        
        // Keep only last 30 days
        if (this.weatherHistory.length > 30) {
            this.weatherHistory = this.weatherHistory.slice(-30);
        }
        
        localStorage.setItem('weather-history', JSON.stringify(this.weatherHistory));
    }
    
    loadWeatherHistory() {
        const stored = localStorage.getItem('weather-history');
        if (stored) {
            this.weatherHistory = JSON.parse(stored).map(entry => ({
                ...entry,
                timestamp: new Date(entry.timestamp)
            }));
        }
        
        // Load mood correlation data
        const moodCorrelation = localStorage.getItem('mood-weather-correlation');
        if (moodCorrelation) {
            this.moodWeatherCorrelation = JSON.parse(moodCorrelation);
        }
    }
    
    generateWeatherRecommendations() {
        if (!this.currentWeather) return;
        
        const recommendations = {
            weather: this.currentWeather,
            suggestions: this.getWeatherSuggestions(),
            moodImpact: this.analyzeMoodImpact(),
            activityRecommendations: this.getActivityRecommendations()
        };
        
        this.displayWeatherRecommendations(recommendations);
        return recommendations;
    }
    
    getWeatherSuggestions() {
        const condition = this.currentWeather.condition;
        const weatherData = this.weatherConditions[condition];
        
        return {
            primary: weatherData.recommendations[0],
            secondary: weatherData.recommendations.slice(1),
            mood: weatherData.mood,
            activities: weatherData.activitySuggestions
        };
    }
    
    analyzeMoodImpact() {
        // Analyze how weather affects user's mood based on historical data
        const condition = this.currentWeather.condition;
        
        if (this.moodWeatherCorrelation[condition]) {
            return {
                impact: this.moodWeatherCorrelation[condition].impact,
                confidence: this.moodWeatherCorrelation[condition].confidence,
                description: `Weather typically makes you feel ${this.moodWeatherCorrelation[condition].impact}`
            };
        }
        
        // Default impact based on weather condition
        const defaultImpacts = {
            sunny: { impact: 'more positive', confidence: 'medium' },
            rainy: { impact: 'more reflective', confidence: 'medium' },
            cloudy: { impact: 'more focused', confidence: 'low' },
            'partly-cloudy': { impact: 'more balanced', confidence: 'low' }
        };
        
        return defaultImpacts[condition] || { impact: 'neutral', confidence: 'low' };
    }
    
    getActivityRecommendations() {
        const condition = this.currentWeather.condition;
        const suggestions = this.weatherConditions[condition].activitySuggestions;
        
        return suggestions.map(activity => ({
            activity,
            reason: this.getActivityReason(activity, condition),
            priority: this.getActivityPriority(activity, condition)
        }));
    }
    
    getActivityReason(activity, condition) {
        const reasons = {
            'outdoor meditation': 'Fresh air and natural sounds enhance mindfulness',
            'indoor meditation': 'Peaceful indoor environment for deep focus',
            'morning walk': 'Gentle movement in pleasant weather',
            'deep journaling': 'Reflective weather supports introspection',
            'gratitude practice': 'Positive weather enhances appreciation',
            'focused meditation': 'Stable weather conditions aid concentration'
        };
        
        return reasons[activity] || 'Weather conditions support this activity';
    }
    
    getActivityPriority(activity, condition) {
        // Determine priority based on weather suitability
        const priorities = {
            sunny: { 'outdoor meditation': 'high', 'morning walk': 'high', 'gratitude practice': 'medium' },
            rainy: { 'indoor meditation': 'high', 'deep journaling': 'high', 'listening to rain sounds': 'high' },
            cloudy: { 'focused meditation': 'high', 'structured journaling': 'high', 'goal review': 'medium' },
            'partly-cloudy': { 'varied meditation': 'medium', 'creative journaling': 'medium', 'flexible routine': 'medium' }
        };
        
        return priorities[condition]?.[activity] || 'low';
    }
    
    displayWeatherRecommendations(recommendations) {
        // Create weather widget
        this.createWeatherWidget(recommendations);
        
        // Show contextual recommendations
        this.showContextualRecommendations(recommendations);
    }
    
    createWeatherWidget(recommendations) {
        // Remove existing widget
        const existingWidget = document.getElementById('weather-widget');
        if (existingWidget) {
            existingWidget.remove();
        }
        
        const widget = document.createElement('div');
        widget.id = 'weather-widget';
        widget.className = 'weather-widget fixed top-4 left-4 z-30 bg-white/95 backdrop-blur-sm border border-sage-deep/20 rounded-lg p-4 shadow-lg transition-all duration-300';
        
        widget.innerHTML = `
            <div class="weather-content">
                <div class="weather-header flex items-center justify-between mb-3">
                    <div class="weather-info">
                        <div class="weather-icon text-2xl">${recommendations.weather.icon}</div>
                        <div class="weather-temp text-lg font-semibold text-forest-deep">${recommendations.weather.temperature}°F</div>
                    </div>
                    <div class="weather-details text-right">
                        <div class="weather-condition text-sm font-medium text-charcoal capitalize">${recommendations.weather.name}</div>
                        <div class="weather-description text-xs text-charcoal/60">${recommendations.weather.description}</div>
                    </div>
                </div>
                
                <div class="weather-recommendation">
                    <div class="recommendation-text text-sm text-charcoal/80 mb-2">
                        ${recommendations.suggestions.primary}
                    </div>
                    <div class="mood-impact text-xs text-sage-deep">
                        💡 ${recommendations.moodImpact.description}
                    </div>
                </div>
                
                <div class="weather-actions mt-3">
                    <button class="weather-refresh text-xs text-sage-deep hover:text-forest-deep transition-colors">
                        🔄 Refresh
                    </button>
                    <button class="weather-details-btn text-xs text-sage-deep hover:text-forest-deep transition-colors ml-3">
                        📊 Details
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        
        // Add event listeners
        widget.querySelector('.weather-refresh').addEventListener('click', () => {
            this.refreshWeather();
        });
        
        widget.querySelector('.weather-details-btn').addEventListener('click', () => {
            this.showWeatherDetails();
        });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (widget.parentNode) {
                widget.style.opacity = '0.7';
            }
        }, 10000);
    }
    
    showContextualRecommendations(recommendations) {
        // Show recommendations based on current page
        document.addEventListener('pageChanged', (e) => {
            this.showPageSpecificRecommendations(e.detail.page, recommendations);
        });
        
        // Show for current page
        const currentPage = document.body.dataset.currentPage || 'home';
        this.showPageSpecificRecommendations(currentPage, recommendations);
    }
    
    showPageSpecificRecommendations(page, recommendations) {
        const highPriorityActivities = recommendations.activityRecommendations
            .filter(rec => rec.priority === 'high')
            .map(rec => rec.activity);
        
        let pageRecommendation = '';
        
        switch (page) {
            case 'timer':
                if (highPriorityActivities.includes('outdoor meditation')) {
                    pageRecommendation = '🌤️ Perfect weather for outdoor meditation! Consider moving outside.';
                } else if (highPriorityActivities.includes('indoor meditation')) {
                    pageRecommendation = '🏠 Cozy indoor meditation recommended today.';
                }
                break;
                
            case 'journal':
                if (highPriorityActivities.includes('deep journaling')) {
                    pageRecommendation = '📝 Weather supports deep reflection today.';
                } else if (highPriorityActivities.includes('creative journaling')) {
                    pageRecommendation = '✨ Creative energy in the air - perfect for expressive writing.';
                }
                break;
                
            case 'gratitude':
                if (recommendations.weather.condition === 'sunny') {
                    pageRecommendation = '☀️ Bright weather amplifies gratitude practice.';
                }
                break;
        }
        
        if (pageRecommendation) {
            this.showRecommendationMessage(pageRecommendation);
        }
    }
    
    showRecommendationMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'weather-recommendation-message fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-gradient-to-r from-sage-pale/95 to-forest-pale/95 backdrop-blur-sm border border-sage-deep/30 rounded-lg px-4 py-2 shadow-lg transition-all duration-300';
        messageDiv.innerHTML = `
            <div class="recommendation-content text-sm text-forest-deep font-medium">
                ${message}
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Animate in
        messageDiv.style.animation = 'slideInDown 0.5s ease-out';
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOutUp 0.3s ease-in';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    async refreshWeather() {
        const widget = document.getElementById('weather-widget');
        if (widget) {
            widget.style.opacity = '0.5';
        }
        
        await this.getCurrentWeather();
        
        if (widget) {
            widget.style.opacity = '1';
        }
    }
    
    showWeatherDetails() {
        const detailsModal = document.createElement('div');
        detailsModal.className = 'weather-details-modal fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        
        detailsModal.innerHTML = `
            <div class="modal-content bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <div class="modal-header flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-forest-deep">Weather Details</h2>
                    <button class="close-modal text-sage-deep hover:text-forest-deep text-xl">×</button>
                </div>
                
                <div class="weather-details-content space-y-4">
                    <div class="current-weather">
                        <h3 class="text-lg font-semibold text-forest-deep mb-3">Current Conditions</h3>
                        <div class="weather-grid grid grid-cols-2 gap-4">
                            <div class="weather-item">
                                <div class="text-3xl mb-2">${this.currentWeather.icon}</div>
                                <div class="text-2xl font-bold text-sage-deep">${this.currentWeather.temperature}°F</div>
                                <div class="text-sm text-charcoal/60">Temperature</div>
                            </div>
                            <div class="weather-item">
                                <div class="text-2xl font-semibold text-forest-deep capitalize">${this.currentWeather.name}</div>
                                <div class="text-sm text-charcoal/60">Condition</div>
                            </div>
                            <div class="weather-item">
                                <div class="text-lg font-semibold text-sage-deep">${this.currentWeather.humidity}%</div>
                                <div class="text-sm text-charcoal/60">Humidity</div>
                            </div>
                            <div class="weather-item">
                                <div class="text-lg font-semibold text-sage-deep">${this.currentWeather.windSpeed} mph</div>
                                <div class="text-sm text-charcoal/60">Wind Speed</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="forecast-section">
                        <h3 class="text-lg font-semibold text-forest-deep mb-3">5-Day Forecast</h3>
                        <div class="forecast-list space-y-2">
                            ${this.mockWeatherData.forecast.map(day => `
                                <div class="forecast-item flex items-center justify-between p-2 bg-sage-pale/30 rounded-lg">
                                    <div class="flex items-center">
                                        <span class="text-lg mr-3">${day.icon}</span>
                                        <span class="text-sm font-medium text-forest-deep">${day.day}</span>
                                    </div>
                                    <div class="text-sm text-sage-deep font-semibold">${day.temp}°F</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="recommendations-section">
                        <h3 class="text-lg font-semibold text-forest-deep mb-3">Today's Recommendations</h3>
                        <div class="recommendations-list space-y-2">
                            ${this.getWeatherSuggestions().secondary.map(rec => `
                                <div class="recommendation-item text-sm text-charcoal/80 p-2 bg-sage-pale/20 rounded">
                                    • ${rec}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(detailsModal);
        
        // Add event listeners
        detailsModal.querySelector('.close-modal').addEventListener('click', () => {
            detailsModal.remove();
        });
        
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                detailsModal.remove();
            }
        });
    }
    
    trackMoodWeatherCorrelation(mood, activity) {
        if (!this.currentWeather) return;
        
        const condition = this.currentWeather.condition;
        
        if (!this.moodWeatherCorrelation[condition]) {
            this.moodWeatherCorrelation[condition] = {
                moods: [],
                activities: [],
                count: 0
            };
        }
        
        this.moodWeatherCorrelation[condition].moods.push(mood);
        this.moodWeatherCorrelation[condition].activities.push(activity);
        this.moodWeatherCorrelation[condition].count++;
        
        // Calculate correlation
        this.calculateMoodWeatherCorrelation(condition);
        
        // Save correlation data
        localStorage.setItem('mood-weather-correlation', JSON.stringify(this.moodWeatherCorrelation));
    }
    
    calculateMoodWeatherCorrelation(condition) {
        const data = this.moodWeatherCorrelation[condition];
        if (data.count < 5) return; // Need at least 5 data points
        
        // Simple correlation analysis
        const moodCounts = {};
        data.moods.forEach(mood => {
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        
        const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b
        );
        
        const confidence = Math.min(data.count / 20, 1); // Max confidence at 20 data points
        
        data.impact = dominantMood;
        data.confidence = confidence > 0.3 ? 'high' : confidence > 0.1 ? 'medium' : 'low';
    }
    
    setupWeatherEvents() {
        // Listen for mood changes
        document.addEventListener('emotionSelected', (e) => {
            this.trackMoodWeatherCorrelation(e.detail.emotion, 'emotion_selection');
        });
        
        // Listen for activity completions
        document.addEventListener('activityCompleted', (e) => {
            this.trackMoodWeatherCorrelation('positive', e.detail.activity);
        });
        
        // Auto-refresh weather every 30 minutes
        setInterval(() => {
            this.refreshWeather();
        }, 30 * 60 * 1000);
    }
    
    getWeatherInsights() {
        if (this.weatherHistory.length < 7) {
            return { message: 'Need more data for weather insights' };
        }
        
        const recentWeather = this.weatherHistory.slice(-7);
        const conditions = recentWeather.map(entry => entry.weather.condition);
        
        const mostCommon = conditions.reduce((a, b, i, arr) =>
            arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
        );
        
        return {
            mostCommonCondition: mostCommon,
            recentPattern: this.analyzeRecentPattern(recentWeather),
            moodCorrelation: this.moodWeatherCorrelation,
            recommendations: this.getLongTermRecommendations()
        };
    }
    
    analyzeRecentPattern(weatherData) {
        const conditions = weatherData.map(entry => entry.weather.condition);
        const uniqueConditions = [...new Set(conditions)];
        
        if (uniqueConditions.length === 1) {
            return `Consistent ${uniqueConditions[0]} weather`;
        } else if (uniqueConditions.length <= 3) {
            return `Mixed weather with ${uniqueConditions.join(', ')}`;
        } else {
            return 'Highly variable weather patterns';
        }
    }
    
    getLongTermRecommendations() {
        const insights = this.getWeatherInsights();
        const recommendations = [];
        
        if (insights.mostCommonCondition === 'sunny') {
            recommendations.push('Consider establishing outdoor meditation habits');
        } else if (insights.mostCommonCondition === 'rainy') {
            recommendations.push('Rainy weather supports indoor reflection practices');
        }
        
        return recommendations;
    }
}

// Initialize weather integration
document.addEventListener('DOMContentLoaded', () => {
    window.weatherIntegration = new WeatherIntegration();
    
    // Load weather on app start
    setTimeout(() => {
        window.weatherIntegration.getCurrentWeather();
    }, 2000);
});
