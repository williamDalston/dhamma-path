/**
 * Adaptive Timing System
 * Dynamic duration adjustments based on user behavior and preferences
 */

class AdaptiveTimingSystem {
    constructor() {
        this.isEnabled = true;
        this.learningEnabled = true;
        this.timingProfiles = {
            meditation: {
                baseDuration: 10,
                minDuration: 2,
                maxDuration: 60,
                learningRate: 0.1,
                patterns: {
                    completion: [],
                    abandonment: [],
                    satisfaction: []
                }
            },
            journal: {
                baseDuration: 15,
                minDuration: 5,
                maxDuration: 45,
                learningRate: 0.1,
                patterns: {
                    completion: [],
                    abandonment: [],
                    satisfaction: []
                }
            },
            workout: {
                baseDuration: 20,
                minDuration: 10,
                maxDuration: 60,
                learningRate: 0.1,
                patterns: {
                    completion: [],
                    abandonment: [],
                    satisfaction: []
                }
            },
            clarity: {
                baseDuration: 8,
                minDuration: 3,
                maxDuration: 20,
                learningRate: 0.1,
                patterns: {
                    completion: [],
                    abandonment: [],
                    satisfaction: []
                }
            }
        };
        
        this.contextualFactors = {
            timeOfDay: {
                morning: { meditation: 1.2, workout: 1.3, journal: 1.1, clarity: 1.0 },
                day: { meditation: 0.8, workout: 1.0, journal: 0.9, clarity: 1.1 },
                evening: { meditation: 1.0, workout: 0.8, journal: 1.2, clarity: 0.9 },
                night: { meditation: 0.9, workout: 0.4, journal: 1.0, clarity: 0.7 }
            },
            userMood: {
                stressed: { meditation: 1.4, workout: 0.7, journal: 1.2, clarity: 0.8 },
                energized: { meditation: 0.8, workout: 1.3, journal: 0.9, clarity: 1.2 },
                calm: { meditation: 1.1, workout: 0.9, journal: 1.1, clarity: 1.0 },
                neutral: { meditation: 1.0, workout: 1.0, journal: 1.0, clarity: 1.0 }
            },
            energyLevel: {
                high: { meditation: 0.8, workout: 1.3, journal: 0.9, clarity: 1.1 },
                medium: { meditation: 1.0, workout: 1.0, journal: 1.0, clarity: 1.0 },
                low: { meditation: 1.3, workout: 0.6, journal: 1.1, clarity: 0.8 }
            },
            schedule: {
                busy: { meditation: 1.2, workout: 0.7, journal: 0.8, clarity: 0.9 },
                moderate: { meditation: 1.0, workout: 1.0, journal: 1.0, clarity: 1.0 },
                free: { meditation: 0.9, workout: 1.2, journal: 1.1, clarity: 1.1 }
            }
        };
        
        this.userPreferences = {
            preferredDurations: {},
            timeConstraints: {},
            energyPatterns: {},
            successPatterns: {}
        };
        
        this.adaptiveAlgorithms = {
            exponentialSmoothing: new ExponentialSmoothingAlgorithm(),
            patternRecognition: new PatternRecognitionAlgorithm(),
            contextualAdjustment: new ContextualAdjustmentAlgorithm(),
            userFeedback: new UserFeedbackAlgorithm()
        };
        
        this.init();
    }

    init() {
        console.log('⏱️ Initializing Adaptive Timing System...');
        this.loadUserPreferences();
        this.setupEventListeners();
        this.setupLearningSystem();
        this.setupContextualAnalysis();
        console.log('✅ Adaptive Timing System initialized');
    }

    loadUserPreferences() {
        // Load timing preferences from localStorage
        const savedPreferences = localStorage.getItem('adaptiveTimingPreferences');
        if (savedPreferences) {
            this.userPreferences = { ...this.userPreferences, ...JSON.parse(savedPreferences) };
        }
        
        // Load timing profiles
        const savedProfiles = localStorage.getItem('timingProfiles');
        if (savedProfiles) {
            this.timingProfiles = { ...this.timingProfiles, ...JSON.parse(savedProfiles) };
        }
    }

    setupEventListeners() {
        // Listen for activity events
        window.addEventListener('activityStarted', (event) => {
            this.recordActivityStart(event.detail);
        });
        
        window.addEventListener('activityCompleted', (event) => {
            this.recordActivityCompletion(event.detail);
        });
        
        window.addEventListener('activityAbandoned', (event) => {
            this.recordActivityAbandonment(event.detail);
        });
        
        window.addEventListener('durationChanged', (event) => {
            this.recordDurationChange(event.detail);
        });
        
        window.addEventListener('userFeedback', (event) => {
            this.recordUserFeedback(event.detail);
        });
        
        // Listen for context changes
        window.addEventListener('contextUpdated', (event) => {
            this.updateContextualFactors(event.detail);
        });
    }

    setupLearningSystem() {
        // Setup continuous learning
        this.setupContinuousLearning();
        
        // Setup pattern analysis
        this.setupPatternAnalysis();
        
        // Setup preference learning
        this.setupPreferenceLearning();
    }

    setupContinuousLearning() {
        // Learn from user behavior every 30 minutes
        setInterval(() => {
            this.performContinuousLearning();
        }, 1800000); // 30 minutes
        
        // Daily analysis
        setInterval(() => {
            this.performDailyAnalysis();
        }, 86400000); // 24 hours
    }

    setupPatternAnalysis() {
        // Analyze patterns every hour
        setInterval(() => {
            this.analyzeTimingPatterns();
        }, 3600000); // 1 hour
    }

    setupPreferenceLearning() {
        // Learn preferences every 15 minutes
        setInterval(() => {
            this.learnUserPreferences();
        }, 900000); // 15 minutes
    }

    setupContextualAnalysis() {
        // Setup contextual analysis
        this.contextualAnalyzer = new TimingContextualAnalyzer();
        
        // Listen for context changes
        window.addEventListener('contextUpdated', (event) => {
            this.updateContextualFactors(event.detail);
        });
    }

    // Core Timing Methods
    getOptimalDuration(activity, context = null) {
        if (!this.isEnabled) {
            return this.timingProfiles[activity]?.baseDuration || 10;
        }
        
        const currentContext = context || this.getCurrentContext();
        const profile = this.timingProfiles[activity];
        
        if (!profile) {
            console.warn(`No timing profile found for activity: ${activity}`);
            return 10;
        }
        
        // Calculate optimal duration using multiple algorithms
        const algorithms = [
            this.adaptiveAlgorithms.exponentialSmoothing.calculate(activity, profile, currentContext),
            this.adaptiveAlgorithms.patternRecognition.calculate(activity, profile, currentContext),
            this.adaptiveAlgorithms.contextualAdjustment.calculate(activity, profile, currentContext),
            this.adaptiveAlgorithms.userFeedback.calculate(activity, profile, currentContext)
        ];
        
        // Weighted average of algorithms
        const weights = [0.3, 0.25, 0.25, 0.2];
        let optimalDuration = 0;
        
        algorithms.forEach((duration, index) => {
            optimalDuration += duration * weights[index];
        });
        
        // Apply contextual factors
        optimalDuration = this.applyContextualFactors(optimalDuration, activity, currentContext);
        
        // Ensure within bounds
        optimalDuration = Math.max(profile.minDuration, Math.min(profile.maxDuration, optimalDuration));
        
        // Round to nearest minute
        return Math.round(optimalDuration);
    }

    getSuggestedDurations(activity, context = null) {
        const currentContext = context || this.getCurrentContext();
        const profile = this.timingProfiles[activity];
        
        if (!profile) return [];
        
        const baseDuration = this.getOptimalDuration(activity, currentContext);
        
        // Generate suggested durations
        const suggestions = [
            {
                duration: Math.max(profile.minDuration, baseDuration - 5),
                label: 'Quick',
                description: 'Perfect for a busy schedule',
                confidence: this.calculateConfidence(activity, currentContext, 'quick')
            },
            {
                duration: baseDuration,
                label: 'Recommended',
                description: 'Optimal based on your patterns',
                confidence: this.calculateConfidence(activity, currentContext, 'optimal')
            },
            {
                duration: Math.min(profile.maxDuration, baseDuration + 10),
                label: 'Extended',
                description: 'Great when you have more time',
                confidence: this.calculateConfidence(activity, currentContext, 'extended')
            }
        ];
        
        return suggestions.filter(suggestion => suggestion.confidence > 0.3);
    }

    calculateConfidence(activity, context, durationType) {
        const profile = this.timingProfiles[activity];
        const baseConfidence = 0.5;
        
        // Time-based confidence
        const timeConfidence = this.getTimeBasedConfidence(activity, context.timeOfDay);
        
        // Mood-based confidence
        const moodConfidence = this.getMoodBasedConfidence(activity, context.userMood);
        
        // Pattern-based confidence
        const patternConfidence = this.getPatternBasedConfidence(activity, durationType);
        
        // Success rate confidence
        const successConfidence = this.getSuccessBasedConfidence(activity);
        
        const totalConfidence = baseConfidence + 
            (timeConfidence * 0.3) + 
            (moodConfidence * 0.25) + 
            (patternConfidence * 0.25) + 
            (successConfidence * 0.2);
        
        return Math.min(totalConfidence, 1.0);
    }

    // Event Recording Methods
    recordActivityStart(activity) {
        const timestamp = Date.now();
        const context = this.getCurrentContext();
        
        // Record activity start
        this.timingProfiles[activity.type].patterns.completion.push({
            timestamp: timestamp,
            context: context,
            duration: activity.plannedDuration,
            status: 'started'
        });
        
        // Update user preferences
        this.updateUserPreferences(activity.type, 'start', activity.plannedDuration, context);
        
        this.saveUserData();
    }

    recordActivityCompletion(activity) {
        const timestamp = Date.now();
        const context = this.getCurrentContext();
        
        // Record successful completion
        this.timingProfiles[activity.type].patterns.completion.push({
            timestamp: timestamp,
            context: context,
            duration: activity.actualDuration,
            status: 'completed',
            satisfaction: activity.satisfaction || 5
        });
        
        // Update user preferences
        this.updateUserPreferences(activity.type, 'complete', activity.actualDuration, context);
        
        // Learn from successful completion
        this.learnFromCompletion(activity.type, activity.actualDuration, context);
        
        this.saveUserData();
    }

    recordActivityAbandonment(activity) {
        const timestamp = Date.now();
        const context = this.getCurrentContext();
        
        // Record abandonment
        this.timingProfiles[activity.type].patterns.abandonment.push({
            timestamp: timestamp,
            context: context,
            duration: activity.actualDuration,
            status: 'abandoned',
            reason: activity.reason
        });
        
        // Update user preferences
        this.updateUserPreferences(activity.type, 'abandon', activity.actualDuration, context);
        
        // Learn from abandonment
        this.learnFromAbandonment(activity.type, activity.actualDuration, context);
        
        this.saveUserData();
    }

    recordDurationChange(change) {
        const timestamp = Date.now();
        const context = this.getCurrentContext();
        
        // Record duration change
        this.timingProfiles[change.activity].patterns.satisfaction.push({
            timestamp: timestamp,
            context: context,
            oldDuration: change.oldDuration,
            newDuration: change.newDuration,
            reason: change.reason
        });
        
        // Learn from duration change
        this.learnFromDurationChange(change.activity, change.oldDuration, change.newDuration, context);
        
        this.saveUserData();
    }

    recordUserFeedback(feedback) {
        const timestamp = Date.now();
        const context = this.getCurrentContext();
        
        // Record user feedback
        this.timingProfiles[feedback.activity].patterns.satisfaction.push({
            timestamp: timestamp,
            context: context,
            duration: feedback.duration,
            feedback: feedback.feedback,
            rating: feedback.rating
        });
        
        // Learn from user feedback
        this.learnFromUserFeedback(feedback.activity, feedback.duration, feedback.rating, context);
        
        this.saveUserData();
    }

    // Learning Methods
    learnFromCompletion(activity, duration, context) {
        const profile = this.timingProfiles[activity];
        
        // Adjust base duration based on successful completion
        const adjustment = (duration - profile.baseDuration) * profile.learningRate;
        profile.baseDuration += adjustment;
        
        // Update contextual factors
        this.updateContextualFactors(activity, context, 'success');
        
        // Update success patterns
        if (!this.userPreferences.successPatterns[activity]) {
            this.userPreferences.successPatterns[activity] = {};
        }
        
        const contextKey = this.getContextKey(context);
        if (!this.userPreferences.successPatterns[activity][contextKey]) {
            this.userPreferences.successPatterns[activity][contextKey] = [];
        }
        
        this.userPreferences.successPatterns[activity][contextKey].push({
            duration: duration,
            timestamp: Date.now()
        });
    }

    learnFromAbandonment(activity, duration, context) {
        const profile = this.timingProfiles[activity];
        
        // Adjust base duration based on abandonment
        const adjustment = (profile.baseDuration - duration) * profile.learningRate * 0.5;
        profile.baseDuration += adjustment;
        
        // Update contextual factors
        this.updateContextualFactors(activity, context, 'abandonment');
        
        // Update abandonment patterns
        if (!this.userPreferences.successPatterns[activity]) {
            this.userPreferences.successPatterns[activity] = {};
        }
        
        const contextKey = this.getContextKey(context);
        if (!this.userPreferences.successPatterns[activity][contextKey]) {
            this.userPreferences.successPatterns[activity][contextKey] = [];
        }
        
        this.userPreferences.successPatterns[activity][contextKey].push({
            duration: duration,
            timestamp: Date.now(),
            abandoned: true
        });
    }

    learnFromDurationChange(activity, oldDuration, newDuration, context) {
        const profile = this.timingProfiles[activity];
        
        // Learn from user's duration preferences
        const preference = newDuration - oldDuration;
        const adjustment = preference * profile.learningRate * 0.3;
        
        profile.baseDuration += adjustment;
        
        // Update user preferences
        if (!this.userPreferences.preferredDurations[activity]) {
            this.userPreferences.preferredDurations[activity] = [];
        }
        
        this.userPreferences.preferredDurations[activity].push({
            duration: newDuration,
            timestamp: Date.now(),
            context: context
        });
    }

    learnFromUserFeedback(activity, duration, rating, context) {
        const profile = this.timingProfiles[activity];
        
        // Adjust based on user feedback
        const feedbackAdjustment = (rating - 5) * profile.learningRate * 0.2;
        profile.baseDuration += feedbackAdjustment;
        
        // Update satisfaction patterns
        if (!this.userPreferences.successPatterns[activity]) {
            this.userPreferences.successPatterns[activity] = {};
        }
        
        const contextKey = this.getContextKey(context);
        if (!this.userPreferences.successPatterns[activity][contextKey]) {
            this.userPreferences.successPatterns[activity][contextKey] = [];
        }
        
        this.userPreferences.successPatterns[activity][contextKey].push({
            duration: duration,
            rating: rating,
            timestamp: Date.now()
        });
    }

    // Pattern Analysis
    analyzeTimingPatterns() {
        Object.keys(this.timingProfiles).forEach(activity => {
            const profile = this.timingProfiles[activity];
            
            // Analyze completion patterns
            this.analyzeCompletionPatterns(activity, profile);
            
            // Analyze abandonment patterns
            this.analyzeAbandonmentPatterns(activity, profile);
            
            // Analyze satisfaction patterns
            this.analyzeSatisfactionPatterns(activity, profile);
        });
    }

    analyzeCompletionPatterns(activity, profile) {
        const completions = profile.patterns.completion;
        if (completions.length < 3) return;
        
        // Calculate average completion duration
        const avgDuration = completions.reduce((sum, completion) => sum + completion.duration, 0) / completions.length;
        
        // Adjust base duration if significantly different
        const difference = avgDuration - profile.baseDuration;
        if (Math.abs(difference) > 2) {
            profile.baseDuration += difference * 0.1;
        }
    }

    analyzeAbandonmentPatterns(activity, profile) {
        const abandonments = profile.patterns.abandonment;
        if (abandonments.length < 3) return;
        
        // Calculate average abandonment duration
        const avgDuration = abandonments.reduce((sum, abandonment) => sum + abandonment.duration, 0) / abandonments.length;
        
        // Adjust base duration to avoid abandonment
        const difference = profile.baseDuration - avgDuration;
        if (difference < 3) {
            profile.baseDuration = avgDuration + 3;
        }
    }

    analyzeSatisfactionPatterns(activity, profile) {
        const satisfactions = profile.patterns.satisfaction;
        if (satisfactions.length < 3) return;
        
        // Calculate average satisfaction rating
        const avgRating = satisfactions.reduce((sum, satisfaction) => sum + (satisfaction.rating || 5), 0) / satisfactions.length;
        
        // Adjust base duration based on satisfaction
        if (avgRating < 4) {
            profile.baseDuration *= 0.95; // Reduce duration for low satisfaction
        } else if (avgRating > 6) {
            profile.baseDuration *= 1.05; // Increase duration for high satisfaction
        }
    }

    // Contextual Analysis
    applyContextualFactors(duration, activity, context) {
        let adjustedDuration = duration;
        
        // Apply time of day factor
        const timeFactor = this.contextualFactors.timeOfDay[context.timeOfDay]?.[activity] || 1.0;
        adjustedDuration *= timeFactor;
        
        // Apply mood factor
        const moodFactor = this.contextualFactors.userMood[context.userMood]?.[activity] || 1.0;
        adjustedDuration *= moodFactor;
        
        // Apply energy level factor
        const energyFactor = this.contextualFactors.energyLevel[context.energyLevel]?.[activity] || 1.0;
        adjustedDuration *= energyFactor;
        
        // Apply schedule factor
        const scheduleFactor = this.contextualFactors.schedule[context.schedule]?.[activity] || 1.0;
        adjustedDuration *= scheduleFactor;
        
        return adjustedDuration;
    }

    updateContextualFactors(activity, context, outcome) {
        // Update contextual factors based on outcomes
        const factor = outcome === 'success' ? 1.05 : 0.95;
        
        // Update time of day factor
        if (this.contextualFactors.timeOfDay[context.timeOfDay]) {
            this.contextualFactors.timeOfDay[context.timeOfDay][activity] *= factor;
        }
        
        // Update mood factor
        if (this.contextualFactors.userMood[context.userMood]) {
            this.contextualFactors.userMood[context.userMood][activity] *= factor;
        }
        
        // Update energy level factor
        if (this.contextualFactors.energyLevel[context.energyLevel]) {
            this.contextualFactors.energyLevel[context.energyLevel][activity] *= factor;
        }
        
        // Update schedule factor
        if (this.contextualFactors.schedule[context.schedule]) {
            this.contextualFactors.schedule[context.schedule][activity] *= factor;
        }
    }

    // Helper Methods
    getCurrentContext() {
        return {
            timeOfDay: this.getTimeOfDay(),
            userMood: this.getCurrentMood(),
            energyLevel: this.getCurrentEnergyLevel(),
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
        if (window.contextualActions) {
            return window.contextualActions.getContext().userMood;
        }
        return 'neutral';
    }

    getCurrentEnergyLevel() {
        // Placeholder for energy level detection
        return 'medium';
    }

    getCurrentSchedule() {
        // Placeholder for schedule analysis
        return 'moderate';
    }

    getContextKey(context) {
        return `${context.timeOfDay}_${context.userMood}_${context.energyLevel}`;
    }

    updateUserPreferences(activity, action, duration, context) {
        if (!this.userPreferences.preferredDurations[activity]) {
            this.userPreferences.preferredDurations[activity] = [];
        }
        
        this.userPreferences.preferredDurations[activity].push({
            action: action,
            duration: duration,
            context: context,
            timestamp: Date.now()
        });
        
        // Keep only last 50 preferences
        if (this.userPreferences.preferredDurations[activity].length > 50) {
            this.userPreferences.preferredDurations[activity] = 
                this.userPreferences.preferredDurations[activity].slice(-50);
        }
    }

    performContinuousLearning() {
        // Perform continuous learning from recent data
        this.analyzeTimingPatterns();
        this.learnUserPreferences();
        this.saveUserData();
    }

    performDailyAnalysis() {
        // Perform comprehensive daily analysis
        this.analyzeTimingPatterns();
        this.learnUserPreferences();
        this.cleanupOldData();
        this.saveUserData();
    }

    learnUserPreferences() {
        // Learn from user preferences
        Object.keys(this.userPreferences.preferredDurations).forEach(activity => {
            const preferences = this.userPreferences.preferredDurations[activity];
            if (preferences.length < 5) return;
            
            // Calculate preferred duration
            const avgDuration = preferences.reduce((sum, pref) => sum + pref.duration, 0) / preferences.length;
            
            // Update base duration
            const profile = this.timingProfiles[activity];
            if (profile) {
                profile.baseDuration = (profile.baseDuration + avgDuration) / 2;
            }
        });
    }

    cleanupOldData() {
        // Clean up old data
        Object.keys(this.timingProfiles).forEach(activity => {
            const profile = this.timingProfiles[activity];
            
            // Keep only last 100 entries for each pattern
            ['completion', 'abandonment', 'satisfaction'].forEach(pattern => {
                if (profile.patterns[pattern].length > 100) {
                    profile.patterns[pattern] = profile.patterns[pattern].slice(-100);
                }
            });
        });
        
        // Clean up old preferences
        Object.keys(this.userPreferences.preferredDurations).forEach(activity => {
            const preferences = this.userPreferences.preferredDurations[activity];
            const cutoffTime = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days
            
            this.userPreferences.preferredDurations[activity] = 
                preferences.filter(pref => pref.timestamp > cutoffTime);
        });
    }

    // Confidence Calculation Methods
    getTimeBasedConfidence(activity, timeOfDay) {
        const factor = this.contextualFactors.timeOfDay[timeOfDay]?.[activity] || 1.0;
        return Math.min(factor, 1.0) - 0.5;
    }

    getMoodBasedConfidence(activity, mood) {
        const factor = this.contextualFactors.userMood[mood]?.[activity] || 1.0;
        return Math.min(factor, 1.0) - 0.5;
    }

    getPatternBasedConfidence(activity, durationType) {
        const profile = this.timingProfiles[activity];
        const completions = profile.patterns.completion.length;
        const abandonments = profile.patterns.abandonment.length;
        
        if (completions + abandonments === 0) return 0;
        
        const successRate = completions / (completions + abandonments);
        return successRate - 0.5;
    }

    getSuccessBasedConfidence(activity) {
        const profile = this.timingProfiles[activity];
        const completions = profile.patterns.completion.length;
        const abandonments = profile.patterns.abandonment.length;
        
        if (completions + abandonments === 0) return 0;
        
        const successRate = completions / (completions + abandonments);
        return successRate - 0.5;
    }

    // Public API
    getOptimalDurationForActivity(activity, context = null) {
        return this.getOptimalDuration(activity, context);
    }

    getSuggestedDurationsForActivity(activity, context = null) {
        return this.getSuggestedDurations(activity, context);
    }

    getTimingProfile(activity) {
        return { ...this.timingProfiles[activity] };
    }

    getUserPreferences() {
        return { ...this.userPreferences };
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
    }

    setLearningEnabled(enabled) {
        this.learningEnabled = enabled;
    }

    saveUserData() {
        localStorage.setItem('adaptiveTimingPreferences', JSON.stringify(this.userPreferences));
        localStorage.setItem('timingProfiles', JSON.stringify(this.timingProfiles));
    }

    // Cleanup
    destroy() {
        this.saveUserData();
    }
}

// Adaptive Algorithms
class ExponentialSmoothingAlgorithm {
    calculate(activity, profile, context) {
        const alpha = 0.3; // Smoothing factor
        const recentCompletions = profile.patterns.completion.slice(-10);
        
        if (recentCompletions.length === 0) {
            return profile.baseDuration;
        }
        
        let smoothedDuration = profile.baseDuration;
        
        recentCompletions.forEach(completion => {
            smoothedDuration = alpha * completion.duration + (1 - alpha) * smoothedDuration;
        });
        
        return smoothedDuration;
    }
}

class PatternRecognitionAlgorithm {
    calculate(activity, profile, context) {
        const contextKey = `${context.timeOfDay}_${context.userMood}`;
        const preferences = profile.patterns.completion.filter(comp => 
            comp.context.timeOfDay === context.timeOfDay && 
            comp.context.userMood === context.userMood
        );
        
        if (preferences.length === 0) {
            return profile.baseDuration;
        }
        
        const avgDuration = preferences.reduce((sum, comp) => sum + comp.duration, 0) / preferences.length;
        return avgDuration;
    }
}

class ContextualAdjustmentAlgorithm {
    calculate(activity, profile, context) {
        let duration = profile.baseDuration;
        
        // Apply contextual adjustments
        const timeFactor = this.getTimeFactor(activity, context.timeOfDay);
        const moodFactor = this.getMoodFactor(activity, context.userMood);
        
        duration *= timeFactor * moodFactor;
        
        return duration;
    }
    
    getTimeFactor(activity, timeOfDay) {
        const factors = {
            morning: { meditation: 1.2, workout: 1.3, journal: 1.1, clarity: 1.0 },
            day: { meditation: 0.8, workout: 1.0, journal: 0.9, clarity: 1.1 },
            evening: { meditation: 1.0, workout: 0.8, journal: 1.2, clarity: 0.9 },
            night: { meditation: 0.9, workout: 0.4, journal: 1.0, clarity: 0.7 }
        };
        
        return factors[timeOfDay]?.[activity] || 1.0;
    }
    
    getMoodFactor(activity, mood) {
        const factors = {
            stressed: { meditation: 1.4, workout: 0.7, journal: 1.2, clarity: 0.8 },
            energized: { meditation: 0.8, workout: 1.3, journal: 0.9, clarity: 1.2 },
            calm: { meditation: 1.1, workout: 0.9, journal: 1.1, clarity: 1.0 },
            neutral: { meditation: 1.0, workout: 1.0, journal: 1.0, clarity: 1.0 }
        };
        
        return factors[mood]?.[activity] || 1.0;
    }
}

class UserFeedbackAlgorithm {
    calculate(activity, profile, context) {
        const feedback = profile.patterns.satisfaction.slice(-5);
        
        if (feedback.length === 0) {
            return profile.baseDuration;
        }
        
        const avgRating = feedback.reduce((sum, f) => sum + (f.rating || 5), 0) / feedback.length;
        const avgDuration = feedback.reduce((sum, f) => sum + f.duration, 0) / feedback.length;
        
        // Adjust based on rating
        const ratingAdjustment = (avgRating - 5) * 0.2;
        return avgDuration + ratingAdjustment;
    }
}

// Timing Contextual Analyzer
class TimingContextualAnalyzer {
    analyzeContext(context) {
        return {
            timeScore: this.analyzeTimeContext(context.timeOfDay),
            moodScore: this.analyzeMoodContext(context.userMood),
            energyScore: this.analyzeEnergyContext(context.energyLevel),
            scheduleScore: this.analyzeScheduleContext(context.schedule)
        };
    }
    
    analyzeTimeContext(timeOfDay) {
        const scores = { morning: 0.8, day: 0.6, evening: 0.7, night: 0.4 };
        return scores[timeOfDay] || 0.5;
    }
    
    analyzeMoodContext(mood) {
        const scores = { stressed: 0.3, energized: 0.9, calm: 0.8, neutral: 0.6 };
        return scores[mood] || 0.5;
    }
    
    analyzeEnergyContext(energyLevel) {
        const scores = { high: 0.9, medium: 0.7, low: 0.4 };
        return scores[energyLevel] || 0.6;
    }
    
    analyzeScheduleContext(schedule) {
        const scores = { busy: 0.3, moderate: 0.6, free: 0.9 };
        return scores[schedule] || 0.6;
    }
}

// Initialize adaptive timing system
window.AdaptiveTimingSystem = AdaptiveTimingSystem;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.adaptiveTimingSystem = new AdaptiveTimingSystem();
    });
} else {
    window.adaptiveTimingSystem = new AdaptiveTimingSystem();
}
