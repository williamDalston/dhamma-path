/**
 * Health Data Integration System
 * Biometric integration and health data sync for intelligent companion
 */

class HealthIntegrationSystem {
    constructor() {
        this.isEnabled = true;
        this.isAuthorized = false;
        this.healthData = {
            heartRate: null,
            steps: null,
            sleep: null,
            stress: null,
            energy: null,
            mood: null,
            activity: null,
            lastUpdated: null
        };
        
        this.healthMetrics = {
            heartRate: {
                normal: { min: 60, max: 100 },
                elevated: { min: 100, max: 120 },
                high: { min: 120, max: 150 },
                critical: { min: 150, max: 200 }
            },
            steps: {
                sedentary: { max: 5000 },
                lightlyActive: { min: 5000, max: 10000 },
                moderatelyActive: { min: 10000, max: 15000 },
                veryActive: { min: 15000, max: 25000 },
                extremelyActive: { min: 25000 }
            },
            sleep: {
                excellent: { min: 8 },
                good: { min: 7, max: 8 },
                fair: { min: 6, max: 7 },
                poor: { max: 6 }
            },
            stress: {
                low: { max: 3 },
                moderate: { min: 3, max: 6 },
                high: { min: 6, max: 8 },
                critical: { min: 8 }
            }
        };
        
        this.healthInsights = {
            recommendations: [],
            warnings: [],
            trends: [],
            correlations: []
        };
        
        this.integrationProviders = {
            appleHealth: new AppleHealthIntegration(),
            googleFit: new GoogleFitIntegration(),
            fitbit: new FitbitIntegration(),
            samsungHealth: new SamsungHealthIntegration()
        };
        
        this.healthAlgorithms = {
            stressDetection: new StressDetectionAlgorithm(),
            energyPrediction: new EnergyPredictionAlgorithm(),
            moodAnalysis: new MoodAnalysisAlgorithm(),
            activityOptimization: new ActivityOptimizationAlgorithm()
        };
        
        this.init();
    }

    init() {
        console.log('❤️ Initializing Health Integration System...');
        this.setupHealthPermissions();
        this.setupHealthMonitoring();
        this.setupHealthInsights();
        this.setupHealthRecommendations();
        console.log('✅ Health Integration System initialized');
    }

    setupHealthPermissions() {
        // Setup health data permissions
        this.setupAppleHealthPermissions();
        this.setupGoogleFitPermissions();
        this.setupFitbitPermissions();
        this.setupSamsungHealthPermissions();
    }

    setupAppleHealthPermissions() {
        // Apple Health integration
        if (window.HealthKit) {
            this.requestAppleHealthPermissions();
        }
    }

    setupGoogleFitPermissions() {
        // Google Fit integration
        if (window.gapi && window.gapi.client) {
            this.requestGoogleFitPermissions();
        }
    }

    setupFitbitPermissions() {
        // Fitbit integration
        if (window.FitbitAPI) {
            this.requestFitbitPermissions();
        }
    }

    setupSamsungHealthPermissions() {
        // Samsung Health integration
        if (window.SamsungHealth) {
            this.requestSamsungHealthPermissions();
        }
    }

    setupHealthMonitoring() {
        // Setup continuous health monitoring
        this.setupHeartRateMonitoring();
        this.setupActivityMonitoring();
        this.setupSleepMonitoring();
        this.setupStressMonitoring();
    }

    setupHeartRateMonitoring() {
        // Monitor heart rate changes
        setInterval(() => {
            this.updateHeartRate();
        }, 30000); // Every 30 seconds
    }

    setupActivityMonitoring() {
        // Monitor activity levels
        setInterval(() => {
            this.updateActivityLevel();
        }, 300000); // Every 5 minutes
    }

    setupSleepMonitoring() {
        // Monitor sleep patterns
        setInterval(() => {
            this.updateSleepData();
        }, 3600000); // Every hour
    }

    setupStressMonitoring() {
        // Monitor stress levels
        setInterval(() => {
            this.updateStressLevel();
        }, 60000); // Every minute
    }

    setupHealthInsights() {
        // Setup health insights generation
        this.setupHealthTrends();
        this.setupHealthCorrelations();
        this.setupHealthWarnings();
    }

    setupHealthTrends() {
        // Analyze health trends
        setInterval(() => {
            this.analyzeHealthTrends();
        }, 1800000); // Every 30 minutes
    }

    setupHealthCorrelations() {
        // Analyze health correlations
        setInterval(() => {
            this.analyzeHealthCorrelations();
        }, 3600000); // Every hour
    }

    setupHealthWarnings() {
        // Monitor for health warnings
        setInterval(() => {
            this.checkHealthWarnings();
        }, 60000); // Every minute
    }

    checkHealthWarnings() {
        // Check for health-related warnings and notifications
        const now = new Date();
        const hour = now.getHours();
        
        // Check for extended screen time (assuming 8+ hours is concerning)
        const screenTime = this.getScreenTime();
        if (screenTime > 480) { // 8 hours in minutes
            console.warn('⚠️ Extended screen time detected:', screenTime, 'minutes');
            this.showHealthNotification('Consider taking a break from screens');
        }
        
        // Check for late night usage (after 11 PM)
        if (hour >= 23 || hour <= 5) {
            console.warn('🌙 Late night usage detected');
            this.showHealthNotification('Consider winding down for better sleep');
        }
        
        // Check for prolonged inactivity
        const lastActivity = this.getLastActivityTime();
        const inactivityMinutes = (now - lastActivity) / (1000 * 60);
        if (inactivityMinutes > 60) {
            console.warn('🏃 Prolonged inactivity detected:', inactivityMinutes, 'minutes');
            this.showHealthNotification('Consider taking a movement break');
        }
    }

    getScreenTime() {
        // Use session baseline for accurate screen time calculation
        const sessionStart = window.__sessionStart || (window.__sessionStart = Date.now());
        const minutesOnPage = Math.max(0, Math.round((Date.now() - sessionStart) / 60000));
        
        // Only warn if actually extended (3+ hours)
        if (minutesOnPage > 180) {
            console.warn(`⚠️ Extended screen time detected: ${minutesOnPage} minutes`);
        }
        
        return minutesOnPage;
    }

    getLastActivityTime() {
        // Mock last activity time - in real app, this would track actual user activity
        return new Date(Date.now() - Math.random() * 30 * 60 * 1000); // 0-30 minutes ago
    }

    showHealthNotification(message) {
        if (Notification.permission === 'granted') {
            new Notification('Health Reminder', {
                body: message,
                icon: '/assets/icons/icon-192.png'
            });
        }
        console.log('💚 Health notification:', message);
    }

    setupHealthRecommendations() {
        // Setup health-based recommendations
        this.setupActivityRecommendations();
        this.setupTimingRecommendations();
        this.setupIntensityRecommendations();
    }

    setupActivityRecommendations() {
        // Generate activity recommendations based on health data
        setInterval(() => {
            this.generateActivityRecommendations();
        }, 900000); // Every 15 minutes
    }

    setupTimingRecommendations() {
        // Generate timing recommendations based on health data
        setInterval(() => {
            this.generateTimingRecommendations();
        }, 1800000); // Every 30 minutes
    }

    setupIntensityRecommendations() {
        // Generate intensity recommendations based on health data
        setInterval(() => {
            this.generateIntensityRecommendations();
        }, 1800000); // Every 30 minutes
    }

    // Health Data Methods
    async requestAppleHealthPermissions() {
        try {
            const permissions = await window.HealthKit.requestAuthorization({
                read: [
                    'HKQuantityTypeIdentifierHeartRate',
                    'HKQuantityTypeIdentifierStepCount',
                    'HKCategoryTypeIdentifierSleepAnalysis',
                    'HKQuantityTypeIdentifierActiveEnergyBurned'
                ]
            });
            
            if (permissions) {
                this.isAuthorized = true;
                this.startAppleHealthSync();
            }
        } catch (error) {
            console.error('Apple Health permission error:', error);
        }
    }

    async requestGoogleFitPermissions() {
        try {
            const authResult = await window.gapi.auth2.getAuthInstance().signIn({
                scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read'
            });
            
            if (authResult.isSignedIn()) {
                this.isAuthorized = true;
                this.startGoogleFitSync();
            }
        } catch (error) {
            console.error('Google Fit permission error:', error);
        }
    }

    async requestFitbitPermissions() {
        try {
            const authResult = await window.FitbitAPI.authorize({
                clientId: 'your-fitbit-client-id',
                scope: ['activity', 'heartrate', 'sleep', 'profile']
            });
            
            if (authResult) {
                this.isAuthorized = true;
                this.startFitbitSync();
            }
        } catch (error) {
            console.error('Fitbit permission error:', error);
        }
    }

    async requestSamsungHealthPermissions() {
        try {
            const authResult = await window.SamsungHealth.authorize({
                permissions: ['heart_rate', 'step_count', 'sleep', 'stress']
            });
            
            if (authResult) {
                this.isAuthorized = true;
                this.startSamsungHealthSync();
            }
        } catch (error) {
            console.error('Samsung Health permission error:', error);
        }
    }

    // Health Data Sync Methods
    async startAppleHealthSync() {
        try {
            const heartRate = await window.HealthKit.getHeartRate();
            const steps = await window.HealthKit.getStepCount();
            const sleep = await window.HealthKit.getSleepData();
            
            this.updateHealthData({
                heartRate: heartRate,
                steps: steps,
                sleep: sleep,
                provider: 'apple-health'
            });
        } catch (error) {
            console.error('Apple Health sync error:', error);
        }
    }

    async startGoogleFitSync() {
        try {
            const heartRate = await this.getGoogleFitHeartRate();
            const steps = await this.getGoogleFitSteps();
            const sleep = await this.getGoogleFitSleep();
            
            this.updateHealthData({
                heartRate: heartRate,
                steps: steps,
                sleep: sleep,
                provider: 'google-fit'
            });
        } catch (error) {
            console.error('Google Fit sync error:', error);
        }
    }

    async startFitbitSync() {
        try {
            const heartRate = await this.getFitbitHeartRate();
            const steps = await this.getFitbitSteps();
            const sleep = await this.getFitbitSleep();
            
            this.updateHealthData({
                heartRate: heartRate,
                steps: steps,
                sleep: sleep,
                provider: 'fitbit'
            });
        } catch (error) {
            console.error('Fitbit sync error:', error);
        }
    }

    async startSamsungHealthSync() {
        try {
            const heartRate = await this.getSamsungHealthHeartRate();
            const steps = await this.getSamsungHealthSteps();
            const sleep = await this.getSamsungHealthSleep();
            
            this.updateHealthData({
                heartRate: heartRate,
                steps: steps,
                sleep: sleep,
                provider: 'samsung-health'
            });
        } catch (error) {
            console.error('Samsung Health sync error:', error);
        }
    }

    // Health Data Update Methods
    updateHeartRate() {
        if (!this.isAuthorized) return;
        
        // Get heart rate from available providers
        this.getHeartRateFromProviders().then(heartRate => {
            if (heartRate) {
                this.updateHealthData({ heartRate: heartRate });
                this.analyzeHeartRate(heartRate);
            }
        });
    }

    updateActivityLevel() {
        if (!this.isAuthorized) return;
        
        // Get activity level from available providers
        this.getActivityFromProviders().then(activity => {
            if (activity) {
                this.updateHealthData({ activity: activity });
                this.analyzeActivityLevel(activity);
            }
        });
    }

    updateSleepData() {
        if (!this.isAuthorized) return;
        
        // Get sleep data from available providers
        this.getSleepFromProviders().then(sleep => {
            if (sleep) {
                this.updateHealthData({ sleep: sleep });
                this.analyzeSleepQuality(sleep);
            }
        });
    }

    updateStressLevel() {
        if (!this.isAuthorized) return;
        
        // Calculate stress level from available data
        const stressLevel = this.calculateStressLevel();
        if (stressLevel) {
            this.updateHealthData({ stress: stressLevel });
            this.analyzeStressLevel(stressLevel);
        }
    }

    updateHealthData(newData) {
        this.healthData = { ...this.healthData, ...newData, lastUpdated: Date.now() };
        
        // Dispatch health data update event
        window.dispatchEvent(new CustomEvent('healthDataUpdated', {
            detail: { ...this.healthData }
        }));
        
        // Update contextual actions with health data
        if (window.contextualActions) {
            window.contextualActions.updateContext('healthData', this.healthData);
        }
        
        // Update adaptive timing with health data
        if (window.adaptiveTimingSystem) {
            window.adaptiveTimingSystem.updateContextualFactors('health', this.healthData);
        }
        
        // Save health data
        this.saveHealthData();
    }

    // Health Analysis Methods
    analyzeHeartRate(heartRate) {
        const analysis = this.analyzeHeartRateLevel(heartRate);
        
        if (analysis.level === 'elevated' || analysis.level === 'high') {
            this.addHealthWarning({
                type: 'heart-rate',
                level: analysis.level,
                value: heartRate,
                message: `Heart rate is ${analysis.level}: ${heartRate} bpm`,
                recommendation: this.getHeartRateRecommendation(analysis.level)
            });
        }
        
        // Update energy level based on heart rate
        this.updateEnergyLevelFromHeartRate(heartRate);
    }

    analyzeActivityLevel(activity) {
        const analysis = this.analyzeActivityLevel(activity);
        
        if (analysis.level === 'sedentary') {
            this.addHealthRecommendation({
                type: 'activity',
                level: 'low',
                message: 'You\'ve been sedentary today. Consider a light workout or walk.',
                recommendation: 'Start with a 10-minute walk or light stretching.'
            });
        } else if (analysis.level === 'extremely-active') {
            this.addHealthRecommendation({
                type: 'activity',
                level: 'high',
                message: 'You\'ve been very active today. Consider rest or light meditation.',
                recommendation: 'Take a break with a 5-minute meditation or gentle stretching.'
            });
        }
    }

    analyzeSleepQuality(sleep) {
        const analysis = this.analyzeSleepQuality(sleep);
        
        if (analysis.quality === 'poor') {
            this.addHealthWarning({
                type: 'sleep',
                level: 'poor',
                value: sleep.duration,
                message: `Poor sleep quality: ${sleep.duration} hours`,
                recommendation: 'Consider meditation or relaxation techniques before bed.'
            });
        }
        
        // Update energy level based on sleep
        this.updateEnergyLevelFromSleep(sleep);
    }

    analyzeStressLevel(stressLevel) {
        const analysis = this.analyzeStressLevel(stressLevel);
        
        if (analysis.level === 'high' || analysis.level === 'critical') {
            this.addHealthWarning({
                type: 'stress',
                level: analysis.level,
                value: stressLevel,
                message: `High stress level detected: ${stressLevel}/10`,
                recommendation: 'Try meditation, deep breathing, or journaling to reduce stress.'
            });
        }
        
        // Update mood based on stress
        this.updateMoodFromStress(stressLevel);
    }

    // Health Insight Generation
    generateActivityRecommendations() {
        const recommendations = [];
        
        // Heart rate based recommendations
        if (this.healthData.heartRate) {
            const heartRateAnalysis = this.analyzeHeartRateLevel(this.healthData.heartRate);
            
            if (heartRateAnalysis.level === 'elevated' || heartRateAnalysis.level === 'high') {
                recommendations.push({
                    type: 'meditation',
                    priority: 'high',
                    reason: 'High heart rate detected',
                    duration: 10,
                    intensity: 'gentle'
                });
            }
        }
        
        // Activity level based recommendations
        if (this.healthData.activity) {
            const activityAnalysis = this.analyzeActivityLevel(this.healthData.activity);
            
            if (activityAnalysis.level === 'sedentary') {
                recommendations.push({
                    type: 'workout',
                    priority: 'medium',
                    reason: 'Low activity level',
                    duration: 15,
                    intensity: 'moderate'
                });
            }
        }
        
        // Sleep based recommendations
        if (this.healthData.sleep) {
            const sleepAnalysis = this.analyzeSleepQuality(this.healthData.sleep);
            
            if (sleepAnalysis.quality === 'poor') {
                recommendations.push({
                    type: 'meditation',
                    priority: 'high',
                    reason: 'Poor sleep quality',
                    duration: 15,
                    intensity: 'gentle'
                });
            }
        }
        
        // Stress based recommendations
        if (this.healthData.stress) {
            const stressAnalysis = this.analyzeStressLevel(this.healthData.stress);
            
            if (stressAnalysis.level === 'high' || stressAnalysis.level === 'critical') {
                recommendations.push({
                    type: 'journal',
                    priority: 'high',
                    reason: 'High stress level',
                    duration: 10,
                    intensity: 'gentle'
                });
            }
        }
        
        this.healthInsights.recommendations = recommendations;
        
        // Update contextual actions with health recommendations
        if (window.contextualActions) {
            window.contextualActions.updateContext('healthRecommendations', recommendations);
        }
        
        return recommendations;
    }

    generateTimingRecommendations() {
        const recommendations = [];
        
        // Energy level based timing
        if (this.healthData.energy) {
            if (this.healthData.energy < 3) {
                recommendations.push({
                    type: 'timing',
                    recommendation: 'morning',
                    reason: 'Low energy detected, morning activities recommended',
                    activities: ['meditation', 'light-workout']
                });
            } else if (this.healthData.energy > 7) {
                recommendations.push({
                    type: 'timing',
                    recommendation: 'anytime',
                    reason: 'High energy detected, any activity timing suitable',
                    activities: ['workout', 'clarity', 'journal']
                });
            }
        }
        
        // Sleep quality based timing
        if (this.healthData.sleep) {
            const sleepAnalysis = this.analyzeSleepQuality(this.healthData.sleep);
            
            if (sleepAnalysis.quality === 'poor') {
                recommendations.push({
                    type: 'timing',
                    recommendation: 'evening',
                    reason: 'Poor sleep quality, evening relaxation recommended',
                    activities: ['meditation', 'journal']
                });
            }
        }
        
        return recommendations;
    }

    generateIntensityRecommendations() {
        const recommendations = [];
        
        // Heart rate based intensity
        if (this.healthData.heartRate) {
            const heartRateAnalysis = this.analyzeHeartRateLevel(this.healthData.heartRate);
            
            if (heartRateAnalysis.level === 'elevated' || heartRateAnalysis.level === 'high') {
                recommendations.push({
                    type: 'intensity',
                    recommendation: 'low',
                    reason: 'High heart rate detected',
                    activities: ['meditation', 'journal']
                });
            } else if (heartRateAnalysis.level === 'normal') {
                recommendations.push({
                    type: 'intensity',
                    recommendation: 'moderate',
                    reason: 'Normal heart rate',
                    activities: ['workout', 'clarity']
                });
            }
        }
        
        // Energy level based intensity
        if (this.healthData.energy) {
            if (this.healthData.energy < 3) {
                recommendations.push({
                    type: 'intensity',
                    recommendation: 'low',
                    reason: 'Low energy level',
                    activities: ['meditation', 'journal']
                });
            } else if (this.healthData.energy > 7) {
                recommendations.push({
                    type: 'intensity',
                    recommendation: 'high',
                    reason: 'High energy level',
                    activities: ['workout', 'clarity']
                });
            }
        }
        
        return recommendations;
    }

    // Health Analysis Algorithms
    analyzeHeartRateLevel(heartRate) {
        const metrics = this.healthMetrics.heartRate;
        
        if (heartRate <= metrics.normal.max) {
            return { level: 'normal', description: 'Normal heart rate' };
        } else if (heartRate <= metrics.elevated.max) {
            return { level: 'elevated', description: 'Elevated heart rate' };
        } else if (heartRate <= metrics.high.max) {
            return { level: 'high', description: 'High heart rate' };
        } else {
            return { level: 'critical', description: 'Critical heart rate' };
        }
    }

    analyzeActivityLevel(activity) {
        const metrics = this.healthMetrics.steps;
        
        if (activity.steps <= metrics.sedentary.max) {
            return { level: 'sedentary', description: 'Sedentary lifestyle' };
        } else if (activity.steps <= metrics.lightlyActive.max) {
            return { level: 'lightly-active', description: 'Lightly active' };
        } else if (activity.steps <= metrics.moderatelyActive.max) {
            return { level: 'moderately-active', description: 'Moderately active' };
        } else if (activity.steps <= metrics.veryActive.max) {
            return { level: 'very-active', description: 'Very active' };
        } else {
            return { level: 'extremely-active', description: 'Extremely active' };
        }
    }

    analyzeSleepQuality(sleep) {
        const metrics = this.healthMetrics.sleep;
        
        if (sleep.duration >= metrics.excellent.min) {
            return { quality: 'excellent', description: 'Excellent sleep quality' };
        } else if (sleep.duration >= metrics.good.min) {
            return { quality: 'good', description: 'Good sleep quality' };
        } else if (sleep.duration >= metrics.fair.min) {
            return { quality: 'fair', description: 'Fair sleep quality' };
        } else {
            return { quality: 'poor', description: 'Poor sleep quality' };
        }
    }

    analyzeStressLevel(stressLevel) {
        const metrics = this.healthMetrics.stress;
        
        if (stressLevel <= metrics.low.max) {
            return { level: 'low', description: 'Low stress level' };
        } else if (stressLevel <= metrics.moderate.max) {
            return { level: 'moderate', description: 'Moderate stress level' };
        } else if (stressLevel <= metrics.high.max) {
            return { level: 'high', description: 'High stress level' };
        } else {
            return { level: 'critical', description: 'Critical stress level' };
        }
    }

    // Health Data Calculation Methods
    calculateStressLevel() {
        let stressLevel = 5; // Base stress level
        
        // Adjust based on heart rate
        if (this.healthData.heartRate) {
            const heartRateAnalysis = this.analyzeHeartRateLevel(this.healthData.heartRate);
            if (heartRateAnalysis.level === 'elevated') stressLevel += 1;
            if (heartRateAnalysis.level === 'high') stressLevel += 2;
            if (heartRateAnalysis.level === 'critical') stressLevel += 3;
        }
        
        // Adjust based on sleep quality
        if (this.healthData.sleep) {
            const sleepAnalysis = this.analyzeSleepQuality(this.healthData.sleep);
            if (sleepAnalysis.quality === 'poor') stressLevel += 2;
            if (sleepAnalysis.quality === 'fair') stressLevel += 1;
            if (sleepAnalysis.quality === 'excellent') stressLevel -= 1;
        }
        
        // Adjust based on activity level
        if (this.healthData.activity) {
            const activityAnalysis = this.analyzeActivityLevel(this.healthData.activity);
            if (activityAnalysis.level === 'sedentary') stressLevel += 1;
            if (activityAnalysis.level === 'extremely-active') stressLevel += 1;
        }
        
        return Math.max(1, Math.min(10, stressLevel));
    }

    updateEnergyLevelFromHeartRate(heartRate) {
        let energyLevel = 5; // Base energy level
        
        if (heartRate <= 60) energyLevel = 3; // Low energy
        else if (heartRate <= 80) energyLevel = 6; // Good energy
        else if (heartRate <= 100) energyLevel = 7; // High energy
        else energyLevel = 4; // Elevated but not sustainable
        
        this.updateHealthData({ energy: energyLevel });
    }

    updateEnergyLevelFromSleep(sleep) {
        let energyLevel = 5; // Base energy level
        
        const sleepAnalysis = this.analyzeSleepQuality(sleep);
        if (sleepAnalysis.quality === 'excellent') energyLevel = 8;
        else if (sleepAnalysis.quality === 'good') energyLevel = 6;
        else if (sleepAnalysis.quality === 'fair') energyLevel = 4;
        else energyLevel = 2;
        
        this.updateHealthData({ energy: energyLevel });
    }

    updateMoodFromStress(stressLevel) {
        let mood = 'neutral';
        
        const stressAnalysis = this.analyzeStressLevel(stressLevel);
        if (stressAnalysis.level === 'low') mood = 'calm';
        else if (stressAnalysis.level === 'moderate') mood = 'neutral';
        else if (stressAnalysis.level === 'high') mood = 'stressed';
        else mood = 'anxious';
        
        this.updateHealthData({ mood: mood });
        
        // Update contextual actions with mood
        if (window.contextualActions) {
            window.contextualActions.updateContext('userMood', mood);
        }
    }

    // Health Warning and Recommendation Methods
    addHealthWarning(warning) {
        this.healthInsights.warnings.push({
            ...warning,
            timestamp: Date.now(),
            id: this.generateWarningId()
        });
        
        // Dispatch warning event
        window.dispatchEvent(new CustomEvent('healthWarning', {
            detail: warning
        }));
        
        // Show notification
        this.showHealthNotification(warning);
    }

    addHealthRecommendation(recommendation) {
        this.healthInsights.recommendations.push({
            ...recommendation,
            timestamp: Date.now(),
            id: this.generateRecommendationId()
        });
        
        // Dispatch recommendation event
        window.dispatchEvent(new CustomEvent('healthRecommendation', {
            detail: recommendation
        }));
    }

    showHealthNotification(warning) {
        // Show health notification
        if (window.notificationSystem) {
            window.notificationSystem.show({
                type: 'warning',
                title: 'Health Alert',
                message: warning.message,
                duration: 5000
            });
        }
    }

    // Utility Methods
    generateWarningId() {
        return 'warning_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateRecommendationId() {
        return 'recommendation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getHeartRateFromProviders() {
        // Get heart rate from available providers
        const providers = [];
        
        if (window.HealthKit) providers.push('apple-health');
        if (window.gapi) providers.push('google-fit');
        if (window.FitbitAPI) providers.push('fitbit');
        if (window.SamsungHealth) providers.push('samsung-health');
        
        // Try to get heart rate from first available provider
        return this.getHeartRateFromProvider(providers[0]);
    }

    getActivityFromProviders() {
        // Get activity from available providers
        const providers = [];
        
        if (window.HealthKit) providers.push('apple-health');
        if (window.gapi) providers.push('google-fit');
        if (window.FitbitAPI) providers.push('fitbit');
        if (window.SamsungHealth) providers.push('samsung-health');
        
        // Try to get activity from first available provider
        return this.getActivityFromProvider(providers[0]);
    }

    getSleepFromProviders() {
        // Get sleep from available providers
        const providers = [];
        
        if (window.HealthKit) providers.push('apple-health');
        if (window.gapi) providers.push('google-fit');
        if (window.FitbitAPI) providers.push('fitbit');
        if (window.SamsungHealth) providers.push('samsung-health');
        
        // Try to get sleep from first available provider
        return this.getSleepFromProvider(providers[0]);
    }

    async getHeartRateFromProvider(provider) {
        try {
            switch (provider) {
                case 'apple-health':
                    return await window.HealthKit.getHeartRate();
                case 'google-fit':
                    return await this.getGoogleFitHeartRate();
                case 'fitbit':
                    return await this.getFitbitHeartRate();
                case 'samsung-health':
                    return await this.getSamsungHealthHeartRate();
                default:
                    return null;
            }
        } catch (error) {
            console.error(`Error getting heart rate from ${provider}:`, error);
            return null;
        }
    }

    async getActivityFromProvider(provider) {
        try {
            switch (provider) {
                case 'apple-health':
                    return await window.HealthKit.getStepCount();
                case 'google-fit':
                    return await this.getGoogleFitSteps();
                case 'fitbit':
                    return await this.getFitbitSteps();
                case 'samsung-health':
                    return await this.getSamsungHealthSteps();
                default:
                    return null;
            }
        } catch (error) {
            console.error(`Error getting activity from ${provider}:`, error);
            return null;
        }
    }

    async getSleepFromProvider(provider) {
        try {
            switch (provider) {
                case 'apple-health':
                    return await window.HealthKit.getSleepData();
                case 'google-fit':
                    return await this.getGoogleFitSleep();
                case 'fitbit':
                    return await this.getFitbitSleep();
                case 'samsung-health':
                    return await this.getSamsungHealthSleep();
                default:
                    return null;
            }
        } catch (error) {
            console.error(`Error getting sleep from ${provider}:`, error);
            return null;
        }
    }

    // Provider-specific methods (placeholders)
    async getGoogleFitHeartRate() {
        // Placeholder for Google Fit heart rate
        return null;
    }

    async getGoogleFitSteps() {
        // Placeholder for Google Fit steps
        return null;
    }

    async getGoogleFitSleep() {
        // Placeholder for Google Fit sleep
        return null;
    }

    async getFitbitHeartRate() {
        // Placeholder for Fitbit heart rate
        return null;
    }

    async getFitbitSteps() {
        // Placeholder for Fitbit steps
        return null;
    }

    async getFitbitSleep() {
        // Placeholder for Fitbit sleep
        return null;
    }

    async getSamsungHealthHeartRate() {
        // Placeholder for Samsung Health heart rate
        return null;
    }

    async getSamsungHealthSteps() {
        // Placeholder for Samsung Health steps
        return null;
    }

    async getSamsungHealthSleep() {
        // Placeholder for Samsung Health sleep
        return null;
    }

    // Health Data Management
    saveHealthData() {
        localStorage.setItem('healthData', JSON.stringify(this.healthData));
        localStorage.setItem('healthInsights', JSON.stringify(this.healthInsights));
    }

    loadHealthData() {
        const savedHealthData = localStorage.getItem('healthData');
        if (savedHealthData) {
            this.healthData = { ...this.healthData, ...JSON.parse(savedHealthData) };
        }
        
        const savedHealthInsights = localStorage.getItem('healthInsights');
        if (savedHealthInsights) {
            this.healthInsights = { ...this.healthInsights, ...JSON.parse(savedHealthInsights) };
        }
    }

    // Public API
    getHealthData() {
        return { ...this.healthData };
    }

    getHealthInsights() {
        return { ...this.healthInsights };
    }

    getHealthRecommendations() {
        return this.healthInsights.recommendations;
    }

    getHealthWarnings() {
        return this.healthInsights.warnings;
    }

    isHealthDataAvailable() {
        return this.isAuthorized && this.healthData.lastUpdated;
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
    }

    // Cleanup
    destroy() {
        this.saveHealthData();
    }
}

// Health Integration Providers
class AppleHealthIntegration {
    constructor() {
        this.isAvailable = !!window.HealthKit;
    }
    
    async getHeartRate() {
        if (!this.isAvailable) return null;
        return await window.HealthKit.getHeartRate();
    }
    
    async getSteps() {
        if (!this.isAvailable) return null;
        return await window.HealthKit.getStepCount();
    }
    
    async getSleep() {
        if (!this.isAvailable) return null;
        return await window.HealthKit.getSleepData();
    }
}

class GoogleFitIntegration {
    constructor() {
        this.isAvailable = !!(window.gapi && window.gapi.client);
    }
    
    async getHeartRate() {
        if (!this.isAvailable) return null;
        // Placeholder for Google Fit heart rate
        return null;
    }
    
    async getSteps() {
        if (!this.isAvailable) return null;
        // Placeholder for Google Fit steps
        return null;
    }
    
    async getSleep() {
        if (!this.isAvailable) return null;
        // Placeholder for Google Fit sleep
        return null;
    }
}

class FitbitIntegration {
    constructor() {
        this.isAvailable = !!window.FitbitAPI;
    }
    
    async getHeartRate() {
        if (!this.isAvailable) return null;
        // Placeholder for Fitbit heart rate
        return null;
    }
    
    async getSteps() {
        if (!this.isAvailable) return null;
        // Placeholder for Fitbit steps
        return null;
    }
    
    async getSleep() {
        if (!this.isAvailable) return null;
        // Placeholder for Fitbit sleep
        return null;
    }
}

class SamsungHealthIntegration {
    constructor() {
        this.isAvailable = !!window.SamsungHealth;
    }
    
    async getHeartRate() {
        if (!this.isAvailable) return null;
        // Placeholder for Samsung Health heart rate
        return null;
    }
    
    async getSteps() {
        if (!this.isAvailable) return null;
        // Placeholder for Samsung Health steps
        return null;
    }
    
    async getSleep() {
        if (!this.isAvailable) return null;
        // Placeholder for Samsung Health sleep
        return null;
    }
}

// Health Algorithms
class StressDetectionAlgorithm {
    calculate(healthData) {
        let stressLevel = 5; // Base stress level
        
        // Heart rate factor
        if (healthData.heartRate > 100) stressLevel += 2;
        else if (healthData.heartRate > 80) stressLevel += 1;
        
        // Sleep factor
        if (healthData.sleep && healthData.sleep.duration < 6) stressLevel += 2;
        else if (healthData.sleep && healthData.sleep.duration < 7) stressLevel += 1;
        
        // Activity factor
        if (healthData.activity && healthData.activity.steps < 5000) stressLevel += 1;
        
        return Math.max(1, Math.min(10, stressLevel));
    }
}

class EnergyPredictionAlgorithm {
    calculate(healthData) {
        let energyLevel = 5; // Base energy level
        
        // Sleep factor
        if (healthData.sleep && healthData.sleep.duration >= 8) energyLevel = 8;
        else if (healthData.sleep && healthData.sleep.duration >= 7) energyLevel = 6;
        else if (healthData.sleep && healthData.sleep.duration >= 6) energyLevel = 4;
        else energyLevel = 2;
        
        // Heart rate factor
        if (healthData.heartRate > 100) energyLevel -= 1;
        else if (healthData.heartRate < 60) energyLevel -= 1;
        
        // Activity factor
        if (healthData.activity && healthData.activity.steps > 15000) energyLevel += 1;
        
        return Math.max(1, Math.min(10, energyLevel));
    }
}

class MoodAnalysisAlgorithm {
    calculate(healthData) {
        let mood = 'neutral';
        
        // Stress factor
        if (healthData.stress > 7) mood = 'stressed';
        else if (healthData.stress > 5) mood = 'anxious';
        else if (healthData.stress < 3) mood = 'calm';
        
        // Energy factor
        if (healthData.energy > 7) mood = 'energized';
        else if (healthData.energy < 3) mood = 'tired';
        
        // Sleep factor
        if (healthData.sleep && healthData.sleep.duration < 6) mood = 'tired';
        else if (healthData.sleep && healthData.sleep.duration >= 8) mood = 'energized';
        
        return mood;
    }
}

class ActivityOptimizationAlgorithm {
    calculate(healthData) {
        const recommendations = [];
        
        // Heart rate based recommendations
        if (healthData.heartRate > 100) {
            recommendations.push({
                type: 'meditation',
                intensity: 'gentle',
                duration: 10
            });
        }
        
        // Sleep based recommendations
        if (healthData.sleep && healthData.sleep.duration < 6) {
            recommendations.push({
                type: 'meditation',
                intensity: 'gentle',
                duration: 15
            });
        }
        
        // Activity based recommendations
        if (healthData.activity && healthData.activity.steps < 5000) {
            recommendations.push({
                type: 'workout',
                intensity: 'moderate',
                duration: 20
            });
        }
        
        return recommendations;
    }
}

// Initialize health integration system
window.HealthIntegrationSystem = HealthIntegrationSystem;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.healthIntegrationSystem = new HealthIntegrationSystem();
    });
} else {
    window.healthIntegrationSystem = new HealthIntegrationSystem();
}
