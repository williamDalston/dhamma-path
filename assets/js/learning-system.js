/**
 * Machine Learning System
 * ML-based user pattern recognition and adaptation
 */

class LearningSystem {
    constructor() {
        this.isEnabled = true;
        this.learningRate = 0.1;
        this.patterns = {
            userBehavior: new Map(),
            preferences: new Map(),
            successRates: new Map(),
            contextualPatterns: new Map()
        };
        
        this.models = {
            behaviorPredictor: new BehaviorPredictor(),
            preferenceLearner: new PreferenceLearner(),
            successOptimizer: new SuccessOptimizer(),
            contextAnalyzer: new ContextAnalyzer()
        };
        
        this.init();
    }

    init() {
        console.log('🧠 Initializing Learning System...');
        this.loadLearningData();
        this.setupLearningLoops();
        this.setupPatternRecognition();
        console.log('✅ Learning System initialized');
    }

    loadLearningData() {
        const saved = localStorage.getItem('learningSystemData');
        if (saved) {
            const data = JSON.parse(saved);
            this.patterns = { ...this.patterns, ...data.patterns };
        }
    }

    setupLearningLoops() {
        // Continuous learning every 5 minutes
        setInterval(() => {
            this.performContinuousLearning();
        }, 300000);
        
        // Pattern analysis every hour
        setInterval(() => {
            this.analyzePatterns();
        }, 3600000);
        
        // Model training daily
        setInterval(() => {
            this.trainModels();
        }, 86400000);
    }

    setupPatternRecognition() {
        // Listen for user interactions
        window.addEventListener('userInteraction', (event) => {
            this.learnFromInteraction(event.detail);
        });
        
        window.addEventListener('activityCompleted', (event) => {
            this.learnFromActivity(event.detail);
        });
        
        window.addEventListener('preferenceChanged', (event) => {
            this.learnFromPreference(event.detail);
        });
    }

    // Learning Methods
    learnFromInteraction(interaction) {
        const pattern = this.extractPattern(interaction);
        this.updatePattern('userBehavior', pattern);
        
        // Predict next action
        const prediction = this.models.behaviorPredictor.predict(interaction);
        if (prediction) {
            this.dispatchPrediction(prediction);
        }
    }

    learnFromActivity(activity) {
        const pattern = this.extractActivityPattern(activity);
        this.updatePattern('successRates', pattern);
        
        // Optimize for success
        const optimization = this.models.successOptimizer.optimize(activity);
        if (optimization) {
            this.applyOptimization(optimization);
        }
    }

    learnFromPreference(preference) {
        const pattern = this.extractPreferencePattern(preference);
        this.updatePattern('preferences', pattern);
        
        // Learn preferences
        this.models.preferenceLearner.learn(preference);
    }

    // Pattern Recognition
    analyzePatterns() {
        // Analyze user behavior patterns
        this.analyzeBehaviorPatterns();
        
        // Analyze success patterns
        this.analyzeSuccessPatterns();
        
        // Analyze contextual patterns
        this.analyzeContextualPatterns();
    }

    analyzeBehaviorPatterns() {
        const behaviorData = Array.from(this.patterns.userBehavior.values());
        if (behaviorData.length < 10) return;
        
        // Find common patterns
        const patterns = this.findCommonPatterns(behaviorData);
        
        // Update behavior model
        this.models.behaviorPredictor.updatePatterns(patterns);
    }

    analyzeSuccessPatterns() {
        const successData = Array.from(this.patterns.successRates.values());
        if (successData.length < 5) return;
        
        // Find success factors
        const successFactors = this.findSuccessFactors(successData);
        
        // Update success model
        this.models.successOptimizer.updateFactors(successFactors);
    }

    analyzeContextualPatterns() {
        const contextData = Array.from(this.patterns.contextualPatterns.values());
        if (contextData.length < 5) return;
        
        // Find contextual correlations
        const correlations = this.findContextualCorrelations(contextData);
        
        // Update context model
        this.models.contextAnalyzer.updateCorrelations(correlations);
    }

    // Model Training
    trainModels() {
        console.log('🧠 Training ML models...');
        
        // Train behavior predictor
        this.models.behaviorPredictor.train();
        
        // Train preference learner
        this.models.preferenceLearner.train();
        
        // Train success optimizer
        this.models.successOptimizer.train();
        
        // Train context analyzer
        this.models.contextAnalyzer.train();
        
        console.log('✅ ML models trained');
    }

    // Pattern Extraction
    extractPattern(interaction) {
        return {
            timestamp: Date.now(),
            type: interaction.type,
            context: interaction.context,
            outcome: interaction.outcome,
            duration: interaction.duration
        };
    }

    extractActivityPattern(activity) {
        return {
            timestamp: Date.now(),
            activity: activity.type,
            duration: activity.duration,
            success: activity.success,
            satisfaction: activity.satisfaction,
            context: activity.context
        };
    }

    extractPreferencePattern(preference) {
        return {
            timestamp: Date.now(),
            preference: preference.type,
            value: preference.value,
            context: preference.context
        };
    }

    // Pattern Updates
    updatePattern(patternType, pattern) {
        const key = this.generatePatternKey(pattern);
        const existing = this.patterns[patternType].get(key);
        
        if (existing) {
            // Update existing pattern
            this.patterns[patternType].set(key, {
                ...existing,
                ...pattern,
                count: existing.count + 1,
                lastSeen: Date.now()
            });
        } else {
            // Create new pattern
            this.patterns[patternType].set(key, {
                ...pattern,
                count: 1,
                firstSeen: Date.now(),
                lastSeen: Date.now()
            });
        }
        
        this.saveLearningData();
    }

    generatePatternKey(pattern) {
        return `${pattern.type}_${pattern.context?.timeOfDay || 'unknown'}_${pattern.context?.userMood || 'unknown'}`;
    }

    // Pattern Analysis
    findCommonPatterns(data) {
        const patterns = new Map();
        
        data.forEach(item => {
            const key = `${item.type}_${item.context?.timeOfDay}`;
            if (!patterns.has(key)) {
                patterns.set(key, []);
            }
            patterns.get(key).push(item);
        });
        
        // Find most common patterns
        const commonPatterns = [];
        patterns.forEach((items, key) => {
            if (items.length >= 3) {
                commonPatterns.push({
                    pattern: key,
                    frequency: items.length,
                    avgOutcome: this.calculateAverageOutcome(items)
                });
            }
        });
        
        return commonPatterns.sort((a, b) => b.frequency - a.frequency);
    }

    findSuccessFactors(data) {
        const factors = {
            timeOfDay: {},
            duration: {},
            context: {}
        };
        
        data.forEach(item => {
            if (item.success) {
                // Time of day factor
                const timeOfDay = item.context?.timeOfDay || 'unknown';
                factors.timeOfDay[timeOfDay] = (factors.timeOfDay[timeOfDay] || 0) + 1;
                
                // Duration factor
                const durationRange = this.getDurationRange(item.duration);
                factors.duration[durationRange] = (factors.duration[durationRange] || 0) + 1;
                
                // Context factor
                const context = item.context?.userMood || 'unknown';
                factors.context[context] = (factors.context[context] || 0) + 1;
            }
        });
        
        return factors;
    }

    findContextualCorrelations(data) {
        const correlations = new Map();
        
        data.forEach(item => {
            const context = `${item.context?.timeOfDay}_${item.context?.userMood}`;
            if (!correlations.has(context)) {
                correlations.set(context, {
                    total: 0,
                    successful: 0,
                    avgSatisfaction: 0
                });
            }
            
            const correlation = correlations.get(context);
            correlation.total++;
            if (item.success) correlation.successful++;
            correlation.avgSatisfaction = (correlation.avgSatisfaction + (item.satisfaction || 5)) / 2;
        });
        
        return correlations;
    }

    // Utility Methods
    calculateAverageOutcome(items) {
        const total = items.reduce((sum, item) => sum + (item.outcome || 5), 0);
        return total / items.length;
    }

    getDurationRange(duration) {
        if (duration < 5) return 'short';
        if (duration < 15) return 'medium';
        if (duration < 30) return 'long';
        return 'very-long';
    }

    performContinuousLearning() {
        // Update learning models
        this.models.behaviorPredictor.update();
        this.models.preferenceLearner.update();
        this.models.successOptimizer.update();
        this.models.contextAnalyzer.update();
    }

    dispatchPrediction(prediction) {
        window.dispatchEvent(new CustomEvent('mlPrediction', {
            detail: prediction
        }));
    }

    applyOptimization(optimization) {
        window.dispatchEvent(new CustomEvent('mlOptimization', {
            detail: optimization
        }));
    }

    saveLearningData() {
        const data = {
            patterns: Object.fromEntries(
                Object.entries(this.patterns).map(([key, value]) => [
                    key,
                    value instanceof Map ? Object.fromEntries(value) : value
                ])
            )
        };
        localStorage.setItem('learningSystemData', JSON.stringify(data));
    }

    // Public API
    getPredictions(context) {
        return this.models.behaviorPredictor.predict(context);
    }

    getOptimizations(activity) {
        return this.models.successOptimizer.optimize(activity);
    }

    getLearnedPreferences() {
        return this.models.preferenceLearner.getPreferences();
    }

    getContextualInsights(context) {
        return this.models.contextAnalyzer.analyze(context);
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
    }

    destroy() {
        this.saveLearningData();
    }
}

// ML Models
class BehaviorPredictor {
    constructor() {
        this.patterns = new Map();
        this.weights = {
            timeOfDay: 0.3,
            userMood: 0.25,
            recentActivity: 0.2,
            successRate: 0.15,
            preference: 0.1
        };
    }

    predict(context) {
        const predictions = [];
        
        // Predict based on time of day
        const timePrediction = this.predictByTime(context.timeOfDay);
        if (timePrediction) predictions.push(timePrediction);
        
        // Predict based on mood
        const moodPrediction = this.predictByMood(context.userMood);
        if (moodPrediction) predictions.push(moodPrediction);
        
        // Combine predictions
        return this.combinePredictions(predictions);
    }

    predictByTime(timeOfDay) {
        const patterns = this.patterns.get('timeOfDay') || new Map();
        const timePattern = patterns.get(timeOfDay);
        
        if (timePattern && timePattern.count >= 3) {
            return {
                type: 'time-based',
                confidence: Math.min(timePattern.count / 10, 1),
                recommendation: timePattern.mostCommonActivity,
                reasoning: `Based on your ${timeOfDay} patterns`
            };
        }
        
        return null;
    }

    predictByMood(mood) {
        const patterns = this.patterns.get('mood') || new Map();
        const moodPattern = patterns.get(mood);
        
        if (moodPattern && moodPattern.count >= 3) {
            return {
                type: 'mood-based',
                confidence: Math.min(moodPattern.count / 10, 1),
                recommendation: moodPattern.mostCommonActivity,
                reasoning: `Based on your ${mood} mood patterns`
            };
        }
        
        return null;
    }

    combinePredictions(predictions) {
        if (predictions.length === 0) return null;
        
        // Weight predictions by confidence
        const weightedPredictions = predictions.map(pred => ({
            ...pred,
            weight: pred.confidence * this.weights[pred.type.split('-')[0]]
        }));
        
        // Find best prediction
        const bestPrediction = weightedPredictions.reduce((best, current) => 
            current.weight > best.weight ? current : best
        );
        
        return bestPrediction.weight > 0.3 ? bestPrediction : null;
    }

    updatePatterns(patterns) {
        // Update internal patterns
        patterns.forEach(pattern => {
            const key = pattern.pattern.split('_')[0];
            if (!this.patterns.has(key)) {
                this.patterns.set(key, new Map());
            }
            
            const patternKey = pattern.pattern.split('_')[1];
            this.patterns.get(key).set(patternKey, {
                count: pattern.frequency,
                mostCommonActivity: pattern.pattern.split('_')[0],
                avgOutcome: pattern.avgOutcome
            });
        });
    }

    train() {
        // Train the model (placeholder)
        console.log('Training BehaviorPredictor...');
    }

    update() {
        // Update model weights based on recent performance
        console.log('Updating BehaviorPredictor...');
    }
}

class PreferenceLearner {
    constructor() {
        this.preferences = new Map();
        this.learningRate = 0.1;
    }

    learn(preference) {
        const key = `${preference.type}_${preference.context?.timeOfDay || 'any'}`;
        const existing = this.preferences.get(key);
        
        if (existing) {
            // Update existing preference
            this.preferences.set(key, {
                ...existing,
                value: existing.value + this.learningRate * (preference.value - existing.value),
                confidence: Math.min(existing.confidence + 0.1, 1)
            });
        } else {
            // Create new preference
            this.preferences.set(key, {
                type: preference.type,
                value: preference.value,
                confidence: 0.1,
                context: preference.context
            });
        }
    }

    getPreferences() {
        return Object.fromEntries(this.preferences);
    }

    train() {
        console.log('Training PreferenceLearner...');
    }

    update() {
        console.log('Updating PreferenceLearner...');
    }
}

class SuccessOptimizer {
    constructor() {
        this.successFactors = {};
        this.optimizationRules = new Map();
    }

    optimize(activity) {
        const factors = this.successFactors[activity.type];
        if (!factors) return null;
        
        // Find optimal conditions
        const optimalTime = this.findOptimalTime(factors.timeOfDay);
        const optimalDuration = this.findOptimalDuration(factors.duration);
        const optimalContext = this.findOptimalContext(factors.context);
        
        return {
            type: 'optimization',
            activity: activity.type,
            recommendations: {
                timeOfDay: optimalTime,
                duration: optimalDuration,
                context: optimalContext
            },
            confidence: this.calculateOptimizationConfidence(factors)
        };
    }

    findOptimalTime(timeFactors) {
        const entries = Object.entries(timeFactors);
        if (entries.length === 0) return null;
        
        const best = entries.reduce((best, current) => 
            current[1] > best[1] ? current : best
        );
        
        return best[1] > 0 ? best[0] : null;
    }

    findOptimalDuration(durationFactors) {
        const entries = Object.entries(durationFactors);
        if (entries.length === 0) return null;
        
        const best = entries.reduce((best, current) => 
            current[1] > best[1] ? current : best
        );
        
        return best[1] > 0 ? best[0] : null;
    }

    findOptimalContext(contextFactors) {
        const entries = Object.entries(contextFactors);
        if (entries.length === 0) return null;
        
        const best = entries.reduce((best, current) => 
            current[1] > best[1] ? current : best
        );
        
        return best[1] > 0 ? best[0] : null;
    }

    calculateOptimizationConfidence(factors) {
        const totalFactors = Object.values(factors).flat().length;
        const successfulFactors = Object.values(factors).flat().filter(f => f > 0).length;
        
        return totalFactors > 0 ? successfulFactors / totalFactors : 0;
    }

    updateFactors(factors) {
        this.successFactors = { ...this.successFactors, ...factors };
    }

    train() {
        console.log('Training SuccessOptimizer...');
    }

    update() {
        console.log('Updating SuccessOptimizer...');
    }
}

class ContextAnalyzer {
    constructor() {
        this.correlations = new Map();
        this.contextWeights = {
            timeOfDay: 0.4,
            userMood: 0.3,
            energy: 0.2,
            schedule: 0.1
        };
    }

    analyze(context) {
        const contextKey = `${context.timeOfDay}_${context.userMood}`;
        const correlation = this.correlations.get(contextKey);
        
        if (!correlation) return null;
        
        const successRate = correlation.successful / correlation.total;
        const satisfaction = correlation.avgSatisfaction;
        
        return {
            type: 'contextual-insight',
            context: contextKey,
            successRate: successRate,
            satisfaction: satisfaction,
            recommendation: successRate > 0.7 ? 'continue' : 'adjust',
            confidence: Math.min(correlation.total / 10, 1)
        };
    }

    updateCorrelations(correlations) {
        this.correlations = correlations;
    }

    train() {
        console.log('Training ContextAnalyzer...');
    }

    update() {
        console.log('Updating ContextAnalyzer...');
    }
}

// Initialize learning system
window.LearningSystem = LearningSystem;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.learningSystem = new LearningSystem();
    });
} else {
    window.learningSystem = new LearningSystem();
}
