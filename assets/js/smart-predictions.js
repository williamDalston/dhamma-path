/**
 * Smart Predictions System
 * Learns from user behavior and provides intelligent predictions
 */

class SmartPredictionsSystem {
    constructor() {
        this.userPatterns = {
            preferredTimes: [],
            commonEmotions: [],
            writingLength: [],
            sessionDuration: [],
            flowCompletion: [],
            skipPatterns: [],
            repeatActions: []
        };
        
        this.predictionModel = {
            nextBestTime: null,
            likelyEmotions: [],
            suggestedPrompts: [],
            optimalSessionLength: 15, // minutes
            flowPreferences: ['meditation', 'journal', 'gratitude'],
            personalizationLevel: 'beginner' // beginner, intermediate, advanced
        };
        
        this.initializePredictions();
    }
    
    initializePredictions() {
        this.loadUserPatterns();
        this.analyzePatterns();
        this.setupPredictionTriggers();
    }
    
    loadUserPatterns() {
        // Load from localStorage or analytics
        const stored = localStorage.getItem('user-patterns');
        if (stored) {
            this.userPatterns = { ...this.userPatterns, ...JSON.parse(stored) };
        }
    }
    
    saveUserPatterns() {
        localStorage.setItem('user-patterns', JSON.stringify(this.userPatterns));
    }
    
    analyzePatterns() {
        // Analyze time patterns
        if (this.userPatterns.preferredTimes.length > 0) {
            this.predictNextBestTime();
        }
        
        // Analyze emotion patterns
        if (this.userPatterns.commonEmotions.length > 0) {
            this.predictLikelyEmotions();
        }
        
        // Analyze writing patterns
        if (this.userPatterns.writingLength.length > 0) {
            this.predictOptimalPrompts();
        }
        
        // Analyze session patterns
        if (this.userPatterns.sessionDuration.length > 0) {
            this.predictOptimalSessionLength();
        }
    }
    
    predictNextBestTime() {
        const times = this.userPatterns.preferredTimes;
        const currentHour = new Date().getHours();
        
        // Find most common time ranges
        const timeRanges = {};
        times.forEach(time => {
            const hour = new Date(time).getHours();
            const range = Math.floor(hour / 2) * 2; // 2-hour ranges
            timeRanges[range] = (timeRanges[range] || 0) + 1;
        });
        
        const bestRange = Object.keys(timeRanges).reduce((a, b) => 
            timeRanges[a] > timeRanges[b] ? a : b
        );
        
        this.predictionModel.nextBestTime = parseInt(bestRange);
    }
    
    predictLikelyEmotions() {
        const emotions = this.userPatterns.commonEmotions;
        const emotionCounts = {};
        
        emotions.forEach(emotion => {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
        
        this.predictionModel.likelyEmotions = Object.keys(emotionCounts)
            .sort((a, b) => emotionCounts[b] - emotionCounts[a])
            .slice(0, 3);
    }
    
    predictOptimalPrompts() {
        const lengths = this.userPatterns.writingLength;
        const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
        
        // Suggest prompts based on writing style
        if (avgLength < 50) {
            this.predictionModel.suggestedPrompts = [
                "What's one thing that made you smile today?",
                "How are you feeling in this moment?",
                "What are you grateful for right now?"
            ];
        } else if (avgLength < 150) {
            this.predictionModel.suggestedPrompts = [
                "What patterns do you notice in your thoughts today?",
                "How does this connect to your deeper values?",
                "What would you tell a dear friend about this?"
            ];
        } else {
            this.predictionModel.suggestedPrompts = [
                "What deeper insights are emerging for you?",
                "How is this experience shaping your perspective?",
                "What wisdom is your heart trying to share?"
            ];
        }
    }
    
    predictOptimalSessionLength() {
        const durations = this.userPatterns.sessionDuration;
        if (durations.length > 0) {
            const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
            this.predictionModel.optimalSessionLength = Math.round(avgDuration / 60000); // Convert to minutes
        }
    }
    
    setupPredictionTriggers() {
        // Listen for user actions to build patterns
        document.addEventListener('emotionSelected', (e) => {
            this.recordEmotion(e.detail.emotion);
        });
        
        document.addEventListener('journalCompleted', (e) => {
            this.recordWritingLength(e.detail.wordCount);
        });
        
        document.addEventListener('sessionStarted', (e) => {
            this.recordSessionStart(e.detail.timestamp);
        });
        
        document.addEventListener('sessionEnded', (e) => {
            this.recordSessionEnd(e.detail.timestamp);
        });
        
        document.addEventListener('flowCompleted', (e) => {
            this.recordFlowCompletion(e.detail.flow);
        });
        
        // Predict based on time of day
        this.setupTimeBasedPredictions();
    }
    
    setupTimeBasedPredictions() {
        const currentHour = new Date().getHours();
        
        // Morning predictions (6-10 AM)
        if (currentHour >= 6 && currentHour < 10) {
            this.showMorningPredictions();
        }
        // Afternoon predictions (12-4 PM)
        else if (currentHour >= 12 && currentHour < 16) {
            this.showAfternoonPredictions();
        }
        // Evening predictions (6-10 PM)
        else if (currentHour >= 18 && currentHour < 22) {
            this.showEveningPredictions();
        }
    }
    
    showMorningPredictions() {
        const predictions = [
            "Good morning! Ready to set a peaceful intention for your day?",
            "Morning energy is perfect for meditation and reflection",
            "Start your day with gratitude - what are you thankful for?"
        ];
        
        const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
        this.showPrediction(randomPrediction, 'morning');
    }
    
    showAfternoonPredictions() {
        const predictions = [
            "Afternoon is a great time for gentle movement and reflection",
            "How's your day unfolding? Take a moment to check in",
            "Midday pause: what's bringing you joy right now?"
        ];
        
        const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
        this.showPrediction(randomPrediction, 'afternoon');
    }
    
    showEveningPredictions() {
        const predictions = [
            "Evening reflection: what did you learn about yourself today?",
            "Time to unwind and reflect on the day's experiences",
            "Evening gratitude: what moments made your day special?"
        ];
        
        const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
        this.showPrediction(randomPrediction, 'evening');
    }
    
    showPrediction(message, type) {
        // Only show if user hasn't seen predictions today
        const lastPrediction = localStorage.getItem('last-prediction-date');
        const today = new Date().toDateString();
        
        if (lastPrediction !== today) {
            setTimeout(() => {
                this.displayPrediction(message, type);
                localStorage.setItem('last-prediction-date', today);
            }, 3000);
        }
    }
    
    addSafeClass(element, className) {
        if (className && !className.includes(' ') && !className.includes('/')) {
            element.classList.add(className);
        } else {
            console.warn('Invalid CSS class name:', className);
            // Split and add valid classes
            if (className) {
                className.split(' ').forEach(cls => {
                    if (cls && !cls.includes('/')) {
                        element.classList.add(cls);
                    }
                });
            }
        }
    }
    
    displayPrediction(message, type) {
        const predictionEl = document.createElement('div');
        predictionEl.className = 'smart-prediction fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm border border-sage-deep/20 rounded-lg p-4 shadow-lg max-w-md text-center transition-all duration-300 opacity-0 translate-y-[-10px]';
        
        const typeClasses = {
            morning: 'text-forest-deep',
            afternoon: 'text-gold-rich',
            evening: 'text-sage-deep'
        };
        
        this.addSafeClass(predictionEl, typeClasses[type] || 'text-charcoal');
        
        predictionEl.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="text-sm font-medium">${message}</div>
                <button class="close-prediction text-xs opacity-60 hover:opacity-100 ml-2">×</button>
            </div>
        `;
        
        document.body.appendChild(predictionEl);
        
        // Animate in
        setTimeout(() => {
            predictionEl.classList.remove('opacity-0', 'translate-y-[-10px]');
            predictionEl.classList.add('opacity-100', 'translate-y-0');
        }, 100);
        
        // Auto remove after 8 seconds
        setTimeout(() => {
            this.removePrediction(predictionEl);
        }, 8000);
        
        // Close button
        predictionEl.querySelector('.close-prediction').addEventListener('click', () => {
            this.removePrediction(predictionEl);
        });
    }
    
    removePrediction(predictionEl) {
        predictionEl.classList.add('opacity-0', 'translate-y-[-10px]');
        setTimeout(() => {
            if (predictionEl.parentNode) {
                predictionEl.parentNode.removeChild(predictionEl);
            }
        }, 300);
    }
    
    // Pattern recording methods
    recordEmotion(emotion) {
        this.userPatterns.commonEmotions.push(emotion);
        this.userPatterns.commonEmotions = this.userPatterns.commonEmotions.slice(-50); // Keep last 50
        this.saveUserPatterns();
    }
    
    recordWritingLength(wordCount) {
        this.userPatterns.writingLength.push(wordCount);
        this.userPatterns.writingLength = this.userPatterns.writingLength.slice(-20); // Keep last 20
        this.saveUserPatterns();
    }
    
    recordSessionStart(timestamp) {
        this.userPatterns.preferredTimes.push(timestamp);
        this.userPatterns.preferredTimes = this.userPatterns.preferredTimes.slice(-30); // Keep last 30
        this.saveUserPatterns();
    }
    
    recordSessionEnd(timestamp) {
        if (this.userPatterns.preferredTimes.length > 0) {
            const startTime = this.userPatterns.preferredTimes[this.userPatterns.preferredTimes.length - 1];
            const duration = timestamp - startTime;
            this.userPatterns.sessionDuration.push(duration);
            this.userPatterns.sessionDuration = this.userPatterns.sessionDuration.slice(-20); // Keep last 20
            this.saveUserPatterns();
        }
    }
    
    recordFlowCompletion(flow) {
        this.userPatterns.flowCompletion.push(flow);
        this.userPatterns.flowCompletion = this.userPatterns.flowCompletion.slice(-10); // Keep last 10
        this.saveUserPatterns();
    }
    
    // Prediction getters
    getNextBestTime() {
        return this.predictionModel.nextBestTime;
    }
    
    getLikelyEmotions() {
        return this.predictionModel.likelyEmotions;
    }
    
    getSuggestedPrompts() {
        return this.predictionModel.suggestedPrompts;
    }
    
    getOptimalSessionLength() {
        return this.predictionModel.optimalSessionLength;
    }
    
    // Smart suggestions based on patterns
    getSmartSuggestions(context) {
        const suggestions = [];
        
        // Time-based suggestions
        const currentHour = new Date().getHours();
        if (currentHour >= 6 && currentHour < 10) {
            suggestions.push({
                type: 'morning',
                message: 'Morning is perfect for setting intentions',
                action: 'meditation'
            });
        }
        
        // Emotion-based suggestions
        if (this.predictionModel.likelyEmotions.length > 0) {
            const topEmotion = this.predictionModel.likelyEmotions[0];
            suggestions.push({
                type: 'emotion',
                message: `You often feel ${topEmotion} - explore this today`,
                action: 'journal'
            });
        }
        
        // Flow-based suggestions
        if (this.userPatterns.flowCompletion.length > 0) {
            const incompleteFlow = this.userPatterns.flowCompletion.filter(f => !f.completed);
            if (incompleteFlow.length > 0) {
                suggestions.push({
                    type: 'flow',
                    message: 'Complete your morning flow for maximum benefit',
                    action: 'continue-flow'
                });
            }
        }
        
        return suggestions;
    }
}

// Initialize the smart predictions system
document.addEventListener('DOMContentLoaded', () => {
    window.smartPredictions = new SmartPredictionsSystem();
});
