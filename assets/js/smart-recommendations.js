/**
 * Smart Recommendation Engine
 * AI-powered activity suggestion engine that learns from user behavior
 */

class SmartRecommendationEngine {
    constructor() {
        this.isEnabled = true;
        this.learningEnabled = true;
        this.recommendationHistory = [];
        this.userPatterns = {
            timePreferences: {},
            moodPatterns: {},
            activityPreferences: {},
            successRates: {},
            seasonalPatterns: {}
        };
        
        this.recommendationFactors = {
            timeOfDay: 0.3,
            userMood: 0.25,
            recentActivity: 0.2,
            successRate: 0.15,
            seasonalContext: 0.1
        };
        
        this.activityDatabase = {
            meditation: {
                baseScore: 0.8,
                timeWeights: { morning: 1.2, day: 0.8, evening: 1.0, night: 0.6 },
                moodWeights: { stressed: 1.3, energized: 0.7, calm: 1.1, neutral: 1.0 },
                duration: { min: 2, max: 60, optimal: 10 },
                benefits: ['stress-relief', 'focus', 'mindfulness', 'sleep-quality']
            },
            journal: {
                baseScore: 0.7,
                timeWeights: { morning: 1.1, day: 0.9, evening: 1.2, night: 0.8 },
                moodWeights: { stressed: 1.1, energized: 0.8, calm: 1.2, neutral: 1.0 },
                duration: { min: 5, max: 30, optimal: 15 },
                benefits: ['self-reflection', 'goal-setting', 'gratitude', 'mental-clarity']
            },
            workout: {
                baseScore: 0.6,
                timeWeights: { morning: 1.3, day: 1.0, evening: 0.8, night: 0.4 },
                moodWeights: { stressed: 0.9, energized: 1.4, calm: 0.7, neutral: 1.0 },
                duration: { min: 10, max: 45, optimal: 20 },
                benefits: ['energy', 'strength', 'endurance', 'mood-boost']
            },
            clarity: {
                baseScore: 0.5,
                timeWeights: { morning: 1.0, day: 1.1, evening: 0.9, night: 0.7 },
                moodWeights: { stressed: 0.8, energized: 1.2, calm: 1.1, neutral: 1.0 },
                duration: { min: 3, max: 15, optimal: 8 },
                benefits: ['confidence', 'communication', 'self-expression', 'clarity']
            }
        };
        
        this.contextualTriggers = {
            weather: {
                sunny: { workout: 1.2, meditation: 0.9 },
                rainy: { meditation: 1.3, journal: 1.1, workout: 0.7 },
                cold: { meditation: 1.1, journal: 1.0, workout: 0.8 },
                hot: { meditation: 1.0, workout: 0.6, clarity: 1.1 }
            },
            health: {
                lowEnergy: { meditation: 1.2, workout: 0.6, journal: 1.1 },
                highStress: { meditation: 1.4, journal: 1.2, workout: 0.8 },
                goodSleep: { workout: 1.3, clarity: 1.1, meditation: 0.9 },
                poorSleep: { meditation: 1.3, journal: 1.1, workout: 0.7 }
            },
            schedule: {
                busy: { meditation: 1.2, clarity: 0.8, workout: 0.7 },
                free: { workout: 1.2, journal: 1.1, meditation: 0.9 },
                meetings: { meditation: 1.1, clarity: 1.2, workout: 0.8 }
            }
        };
        
        this.init();
    }

    init() {
        console.log('🧠 Initializing Smart Recommendation Engine...');
        this.loadUserData();
        this.setupLearningSystem();
        this.setupContextualAnalysis();
        this.generateInitialRecommendations();
        console.log('✅ Smart Recommendation Engine initialized');
    }

    loadUserData() {
        // Load user patterns from localStorage
        const savedPatterns = localStorage.getItem('userPatterns');
        if (savedPatterns) {
            this.userPatterns = { ...this.userPatterns, ...JSON.parse(savedPatterns) };
        }
        
        // Load recommendation history
        const savedHistory = localStorage.getItem('recommendationHistory');
        if (savedHistory) {
            this.recommendationHistory = JSON.parse(savedHistory);
        }
        
        // Load success rates
        const savedSuccessRates = localStorage.getItem('successRates');
        if (savedSuccessRates) {
            this.userPatterns.successRates = JSON.parse(savedSuccessRates);
        }
    }

    setupLearningSystem() {
        // Setup learning from user interactions
        this.setupInteractionLearning();
        
        // Setup pattern recognition
        this.setupPatternRecognition();
        
        // Setup success rate tracking
        this.setupSuccessTracking();
    }

    setupInteractionLearning() {
        // Listen for user interactions
        window.addEventListener('activityStarted', (event) => {
            this.learnFromActivityStart(event.detail);
        });
        
        window.addEventListener('activityCompleted', (event) => {
            this.learnFromActivityCompletion(event.detail);
        });
        
        window.addEventListener('activityAbandoned', (event) => {
            this.learnFromActivityAbandonment(event.detail);
        });
        
        window.addEventListener('recommendationAccepted', (event) => {
            this.learnFromRecommendationAcceptance(event.detail);
        });
        
        window.addEventListener('recommendationRejected', (event) => {
            this.learnFromRecommendationRejection(event.detail);
        });
    }

    setupPatternRecognition() {
        // Analyze user patterns every hour
        setInterval(() => {
            this.analyzeUserPatterns();
        }, 3600000); // 1 hour
        
        // Daily pattern analysis
        setInterval(() => {
            this.performDailyAnalysis();
        }, 86400000); // 24 hours
    }

    setupSuccessTracking() {
        // Track success rates for different activities
        this.successTracking = {
            meditation: { completed: 0, started: 0, abandoned: 0 },
            journal: { completed: 0, started: 0, abandoned: 0 },
            workout: { completed: 0, started: 0, abandoned: 0 },
            clarity: { completed: 0, started: 0, abandoned: 0 }
        };
    }

    setupContextualAnalysis() {
        // Setup contextual analysis
        this.contextualAnalyzer = new ContextualAnalyzer();
        
        // Listen for context changes
        window.addEventListener('contextUpdated', (event) => {
            this.updateContextualFactors(event.detail);
        });
    }

    // Learning Methods
    learnFromActivityStart(activity) {
        const timestamp = Date.now();
        const timeOfDay = this.getTimeOfDay();
        
        // Record activity start
        this.recommendationHistory.push({
            type: 'activity_start',
            activity: activity.type,
            timestamp: timestamp,
            timeOfDay: timeOfDay,
            context: this.getCurrentContext()
        });
        
        // Update success tracking
        if (this.successTracking[activity.type]) {
            this.successTracking[activity.type].started++;
        }
        
        // Update time preferences
        if (!this.userPatterns.timePreferences[activity.type]) {
            this.userPatterns.timePreferences[activity.type] = {};
        }
        
        if (!this.userPatterns.timePreferences[activity.type][timeOfDay]) {
            this.userPatterns.timePreferences[activity.type][timeOfDay] = 0;
        }
        
        this.userPatterns.timePreferences[activity.type][timeOfDay]++;
        
        this.saveUserData();
    }

    learnFromActivityCompletion(activity) {
        const timestamp = Date.now();
        
        // Record activity completion
        this.recommendationHistory.push({
            type: 'activity_completed',
            activity: activity.type,
            timestamp: timestamp,
            duration: activity.duration,
            satisfaction: activity.satisfaction || 5
        });
        
        // Update success tracking
        if (this.successTracking[activity.type]) {
            this.successTracking[activity.type].completed++;
        }
        
        // Update success rates
        this.updateSuccessRate(activity.type, true);
        
        this.saveUserData();
    }

    learnFromActivityAbandonment(activity) {
        const timestamp = Date.now();
        
        // Record activity abandonment
        this.recommendationHistory.push({
            type: 'activity_abandoned',
            activity: activity.type,
            timestamp: timestamp,
            duration: activity.duration,
            reason: activity.reason
        });
        
        // Update success tracking
        if (this.successTracking[activity.type]) {
            this.successTracking[activity.type].abandoned++;
        }
        
        // Update success rates
        this.updateSuccessRate(activity.type, false);
        
        this.saveUserData();
    }

    learnFromRecommendationAcceptance(recommendation) {
        const timestamp = Date.now();
        
        // Record recommendation acceptance
        this.recommendationHistory.push({
            type: 'recommendation_accepted',
            activity: recommendation.activity,
            timestamp: timestamp,
            confidence: recommendation.confidence,
            context: this.getCurrentContext()
        });
        
        // Boost confidence for similar recommendations
        this.boostRecommendationConfidence(recommendation.activity, 0.1);
        
        this.saveUserData();
    }

    learnFromRecommendationRejection(recommendation) {
        const timestamp = Date.now();
        
        // Record recommendation rejection
        this.recommendationHistory.push({
            type: 'recommendation_rejected',
            activity: recommendation.activity,
            timestamp: timestamp,
            confidence: recommendation.confidence,
            context: this.getCurrentContext()
        });
        
        // Reduce confidence for similar recommendations
        this.reduceRecommendationConfidence(recommendation.activity, 0.1);
        
        this.saveUserData();
    }

    // Pattern Recognition
    analyzeUserPatterns() {
        const recentHistory = this.getRecentHistory(7); // Last 7 days
        
        // Analyze time patterns
        this.analyzeTimePatterns(recentHistory);
        
        // Analyze mood patterns
        this.analyzeMoodPatterns(recentHistory);
        
        // Analyze activity patterns
        this.analyzeActivityPatterns(recentHistory);
        
        // Analyze success patterns
        this.analyzeSuccessPatterns(recentHistory);
    }

    analyzeTimePatterns(history) {
        const timePatterns = {};
        
        history.forEach(entry => {
            if (entry.type === 'activity_start' || entry.type === 'activity_completed') {
                const timeOfDay = entry.timeOfDay;
                const activity = entry.activity;
                
                if (!timePatterns[activity]) {
                    timePatterns[activity] = {};
                }
                
                if (!timePatterns[activity][timeOfDay]) {
                    timePatterns[activity][timeOfDay] = 0;
                }
                
                timePatterns[activity][timeOfDay]++;
            }
        });
        
        this.userPatterns.timePreferences = timePatterns;
    }

    analyzeMoodPatterns(history) {
        const moodPatterns = {};
        
        history.forEach(entry => {
            if (entry.context && entry.context.userMood) {
                const mood = entry.context.userMood;
                const activity = entry.activity;
                
                if (!moodPatterns[mood]) {
                    moodPatterns[mood] = {};
                }
                
                if (!moodPatterns[mood][activity]) {
                    moodPatterns[mood][activity] = 0;
                }
                
                moodPatterns[mood][activity]++;
            }
        });
        
        this.userPatterns.moodPatterns = moodPatterns;
    }

    analyzeActivityPatterns(history) {
        const activityCounts = {};
        
        history.forEach(entry => {
            if (entry.type === 'activity_completed') {
                const activity = entry.activity;
                
                if (!activityCounts[activity]) {
                    activityCounts[activity] = 0;
                }
                
                activityCounts[activity]++;
            }
        });
        
        this.userPatterns.activityPreferences = activityCounts;
    }

    analyzeSuccessPatterns(history) {
        const successPatterns = {};
        
        Object.keys(this.successTracking).forEach(activity => {
            const tracking = this.successTracking[activity];
            const total = tracking.completed + tracking.abandoned;
            
            if (total > 0) {
                successPatterns[activity] = tracking.completed / total;
            }
        });
        
        this.userPatterns.successRates = successPatterns;
    }

    performDailyAnalysis() {
        // Perform comprehensive daily analysis
        this.analyzeUserPatterns();
        
        // Update seasonal patterns
        this.updateSeasonalPatterns();
        
        // Clean up old data
        this.cleanupOldData();
        
        // Save updated patterns
        this.saveUserData();
    }

    updateSeasonalPatterns() {
        const season = this.getCurrentSeason();
        const recentHistory = this.getRecentHistory(30); // Last 30 days
        
        if (!this.userPatterns.seasonalPatterns[season]) {
            this.userPatterns.seasonalPatterns[season] = {};
        }
        
        recentHistory.forEach(entry => {
            if (entry.type === 'activity_completed') {
                const activity = entry.activity;
                
                if (!this.userPatterns.seasonalPatterns[season][activity]) {
                    this.userPatterns.seasonalPatterns[season][activity] = 0;
                }
                
                this.userPatterns.seasonalPatterns[season][activity]++;
            }
        });
    }

    // Recommendation Generation
    generateRecommendations(context = null) {
        if (!this.isEnabled) return [];
        
        const currentContext = context || this.getCurrentContext();
        const recommendations = [];
        
        // Generate recommendations for each activity
        Object.keys(this.activityDatabase).forEach(activity => {
            const score = this.calculateRecommendationScore(activity, currentContext);
            
            if (score > 0.3) { // Minimum threshold
                recommendations.push({
                    activity: activity,
                    score: score,
                    confidence: this.calculateConfidence(activity, currentContext),
                    reasoning: this.generateReasoning(activity, currentContext),
                    duration: this.getOptimalDuration(activity, currentContext),
                    benefits: this.activityDatabase[activity].benefits
                });
            }
        });
        
        // Sort by score
        recommendations.sort((a, b) => b.score - a.score);
        
        // Return top 3 recommendations
        return recommendations.slice(0, 3);
    }

    calculateRecommendationScore(activity, context) {
        const activityData = this.activityDatabase[activity];
        let score = activityData.baseScore;
        
        // Time of day factor
        const timeWeight = activityData.timeWeights[context.timeOfDay] || 1.0;
        score *= timeWeight * this.recommendationFactors.timeOfDay;
        
        // User mood factor
        const moodWeight = activityData.moodWeights[context.userMood] || 1.0;
        score *= moodWeight * this.recommendationFactors.userMood;
        
        // Recent activity factor
        const recentActivityFactor = this.getRecentActivityFactor(activity, context);
        score *= recentActivityFactor * this.recommendationFactors.recentActivity;
        
        // Success rate factor
        const successRate = this.userPatterns.successRates[activity] || 0.5;
        score *= successRate * this.recommendationFactors.successRate;
        
        // Seasonal factor
        const seasonalFactor = this.getSeasonalFactor(activity, context);
        score *= seasonalFactor * this.recommendationFactors.seasonalContext;
        
        // User preference factor
        const preferenceFactor = this.getUserPreferenceFactor(activity, context);
        score *= preferenceFactor;
        
        return Math.min(score, 1.0); // Cap at 1.0
    }

    calculateConfidence(activity, context) {
        const baseConfidence = 0.5;
        
        // Increase confidence based on user patterns
        const timePreference = this.userPatterns.timePreferences[activity]?.[context.timeOfDay] || 0;
        const moodPreference = this.userPatterns.moodPatterns[context.userMood]?.[activity] || 0;
        const successRate = this.userPatterns.successRates[activity] || 0.5;
        
        const confidence = baseConfidence + 
            (timePreference * 0.2) + 
            (moodPreference * 0.2) + 
            (successRate * 0.3);
        
        return Math.min(confidence, 1.0);
    }

    generateReasoning(activity, context) {
        const reasons = [];
        
        // Time-based reasoning
        if (this.activityDatabase[activity].timeWeights[context.timeOfDay] > 1.0) {
            reasons.push(`Great time for ${activity} based on your patterns`);
        }
        
        // Mood-based reasoning
        if (this.activityDatabase[activity].moodWeights[context.userMood] > 1.0) {
            reasons.push(`Perfect for your current mood`);
        }
        
        // Success-based reasoning
        const successRate = this.userPatterns.successRates[activity] || 0.5;
        if (successRate > 0.7) {
            reasons.push(`You've been successful with this activity`);
        }
        
        // Contextual reasoning
        if (context.weather) {
            const weatherFactor = this.contextualTriggers.weather[context.weather]?.[activity];
            if (weatherFactor > 1.0) {
                reasons.push(`Ideal for current weather conditions`);
            }
        }
        
        return reasons.length > 0 ? reasons.join(', ') : 'Based on your preferences and patterns';
    }

    getOptimalDuration(activity, context) {
        const activityData = this.activityDatabase[activity];
        const baseDuration = activityData.duration.optimal;
        
        // Adjust based on user patterns
        const userPatterns = this.userPatterns.activityPreferences[activity] || 0;
        const successRate = this.userPatterns.successRates[activity] || 0.5;
        
        let duration = baseDuration;
        
        // Increase duration for successful activities
        if (successRate > 0.7) {
            duration *= 1.2;
        }
        
        // Decrease duration for less successful activities
        if (successRate < 0.3) {
            duration *= 0.8;
        }
        
        // Adjust based on time of day
        if (context.timeOfDay === 'morning') {
            duration *= 1.1;
        } else if (context.timeOfDay === 'evening') {
            duration *= 0.9;
        }
        
        return Math.round(Math.max(activityData.duration.min, Math.min(activityData.duration.max, duration)));
    }

    // Helper Methods
    getCurrentContext() {
        return {
            timeOfDay: this.getTimeOfDay(),
            userMood: this.getCurrentMood(),
            weather: this.getCurrentWeather(),
            health: this.getCurrentHealth(),
            schedule: this.getCurrentSchedule()
        };
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 10) return 'morning';
        if (hour >= 10 && hour < 18) return 'day';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }

    getCurrentMood() {
        // Get mood from contextual actions system
        if (window.contextualActions) {
            return window.contextualActions.getContext().userMood;
        }
        return 'neutral';
    }

    getCurrentWeather() {
        // Placeholder for weather data
        return 'sunny';
    }

    getCurrentHealth() {
        // Placeholder for health data
        return 'good';
    }

    getCurrentSchedule() {
        // Placeholder for schedule data
        return 'free';
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    getRecentHistory(days) {
        const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
        return this.recommendationHistory.filter(entry => entry.timestamp > cutoffTime);
    }

    getRecentActivityFactor(activity, context) {
        const recentHistory = this.getRecentHistory(1); // Last 24 hours
        const recentActivity = recentHistory.filter(entry => entry.activity === activity);
        
        if (recentActivity.length === 0) return 1.0;
        
        // Reduce score if activity was done recently
        return Math.max(0.3, 1.0 - (recentActivity.length * 0.3));
    }

    getSeasonalFactor(activity, context) {
        const season = this.getCurrentSeason();
        const seasonalData = this.userPatterns.seasonalPatterns[season];
        
        if (!seasonalData || !seasonalData[activity]) return 1.0;
        
        // Calculate seasonal preference
        const totalSeasonalActivities = Object.values(seasonalData).reduce((sum, count) => sum + count, 0);
        const activityCount = seasonalData[activity];
        
        return activityCount / Math.max(totalSeasonalActivities, 1);
    }

    getUserPreferenceFactor(activity, context) {
        const timePreference = this.userPatterns.timePreferences[activity]?.[context.timeOfDay] || 0;
        const moodPreference = this.userPatterns.moodPatterns[context.userMood]?.[activity] || 0;
        
        return 1.0 + (timePreference * 0.1) + (moodPreference * 0.1);
    }

    updateSuccessRate(activity, success) {
        if (!this.userPatterns.successRates[activity]) {
            this.userPatterns.successRates[activity] = 0.5;
        }
        
        const currentRate = this.userPatterns.successRates[activity];
        const adjustment = success ? 0.05 : -0.05;
        
        this.userPatterns.successRates[activity] = Math.max(0, Math.min(1, currentRate + adjustment));
    }

    boostRecommendationConfidence(activity, boost) {
        // Boost confidence for this activity type
        if (!this.userPatterns.activityPreferences[activity]) {
            this.userPatterns.activityPreferences[activity] = 0;
        }
        
        this.userPatterns.activityPreferences[activity] += boost;
    }

    reduceRecommendationConfidence(activity, reduction) {
        // Reduce confidence for this activity type
        if (!this.userPatterns.activityPreferences[activity]) {
            this.userPatterns.activityPreferences[activity] = 0;
        }
        
        this.userPatterns.activityPreferences[activity] = Math.max(0, this.userPatterns.activityPreferences[activity] - reduction);
    }

    cleanupOldData() {
        // Keep only last 90 days of history
        const cutoffTime = Date.now() - (90 * 24 * 60 * 60 * 1000);
        this.recommendationHistory = this.recommendationHistory.filter(entry => entry.timestamp > cutoffTime);
        
        // Limit history size
        if (this.recommendationHistory.length > 1000) {
            this.recommendationHistory = this.recommendationHistory.slice(-1000);
        }
    }

    generateInitialRecommendations() {
        // Generate initial recommendations based on current context
        const recommendations = this.generateRecommendations();
        
        // Store for contextual actions system
        if (window.contextualActions) {
            window.contextualActions.smartRecommendations = recommendations;
        }
        
        return recommendations;
    }

    updateContextualFactors(contextUpdate) {
        // Update contextual factors when context changes
        if (contextUpdate.key === 'userMood' || contextUpdate.key === 'timeOfDay') {
            this.generateInitialRecommendations();
        }
    }

    // Public API
    getRecommendations(context = null) {
        return this.generateRecommendations(context);
    }

    getTopRecommendation(context = null) {
        const recommendations = this.generateRecommendations(context);
        return recommendations.length > 0 ? recommendations[0] : null;
    }

    getUserPatterns() {
        return { ...this.userPatterns };
    }

    getSuccessRates() {
        return { ...this.userPatterns.successRates };
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
    }

    setLearningEnabled(enabled) {
        this.learningEnabled = enabled;
    }

    saveUserData() {
        localStorage.setItem('userPatterns', JSON.stringify(this.userPatterns));
        localStorage.setItem('recommendationHistory', JSON.stringify(this.recommendationHistory));
        localStorage.setItem('successRates', JSON.stringify(this.userPatterns.successRates));
    }

    // Cleanup
    destroy() {
        this.saveUserData();
    }
}

// Contextual Analyzer
class ContextualAnalyzer {
    constructor() {
        this.contextFactors = {
            time: 0.3,
            mood: 0.25,
            weather: 0.15,
            health: 0.15,
            schedule: 0.15
        };
    }

    analyzeContext(context) {
        const analysis = {
            timeScore: this.analyzeTimeContext(context.timeOfDay),
            moodScore: this.analyzeMoodContext(context.userMood),
            weatherScore: this.analyzeWeatherContext(context.weather),
            healthScore: this.analyzeHealthContext(context.health),
            scheduleScore: this.analyzeScheduleContext(context.schedule)
        };
        
        return analysis;
    }

    analyzeTimeContext(timeOfDay) {
        const timeScores = {
            morning: 0.8,
            day: 0.6,
            evening: 0.7,
            night: 0.4
        };
        
        return timeScores[timeOfDay] || 0.5;
    }

    analyzeMoodContext(mood) {
        const moodScores = {
            stressed: 0.3,
            energized: 0.9,
            calm: 0.8,
            neutral: 0.6
        };
        
        return moodScores[mood] || 0.5;
    }

    analyzeWeatherContext(weather) {
        const weatherScores = {
            sunny: 0.8,
            rainy: 0.4,
            cold: 0.5,
            hot: 0.6
        };
        
        return weatherScores[weather] || 0.6;
    }

    analyzeHealthContext(health) {
        const healthScores = {
            excellent: 1.0,
            good: 0.8,
            fair: 0.6,
            poor: 0.3
        };
        
        return healthScores[health] || 0.7;
    }

    analyzeScheduleContext(schedule) {
        const scheduleScores = {
            busy: 0.3,
            moderate: 0.6,
            free: 0.9
        };
        
        return scheduleScores[schedule] || 0.6;
    }
}

// Initialize smart recommendation engine
window.SmartRecommendationEngine = SmartRecommendationEngine;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.smartRecommendationEngine = new SmartRecommendationEngine();
    });
} else {
    window.smartRecommendationEngine = new SmartRecommendationEngine();
}
