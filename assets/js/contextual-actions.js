/**
 * Contextual Actions System
 * Intelligent, floating actions that adapt to user context and provide smart suggestions
 */

class ContextualActions {
    constructor() {
        this.isEnabled = true;
        this.context = {
            currentPage: null,
            userMood: 'neutral',
            timeOfDay: 'day',
            userActivity: 'idle',
            recentActions: [],
            userPreferences: {},
            healthData: null,
            weatherData: null
        };
        
        this.actionTypes = {
            primary: 'primary',
            secondary: 'secondary',
            tertiary: 'tertiary',
            contextual: 'contextual'
        };
        
        this.actionStates = {
            visible: 'visible',
            hidden: 'hidden',
            minimized: 'minimized',
            expanded: 'expanded'
        };
        
        this.floatingActions = new Map();
        this.contextualSuggestions = [];
        this.smartRecommendations = [];
        
        this.init();
    }

    init() {
        console.log('🧠 Initializing Contextual Actions System...');
        this.setupContextDetection();
        this.setupActionTemplates();
        this.setupContextualListeners();
        this.setupSmartSuggestions();
        this.createFloatingActionContainer();
        console.log('✅ Contextual Actions System initialized');
    }

    setupContextDetection() {
        // Detect current context
        this.detectCurrentContext();
        
        // Setup context monitoring
        this.setupContextMonitoring();
        
        // Load user preferences
        this.loadUserPreferences();
    }

    setupActionTemplates() {
        this.actionTemplates = {
            // Home page actions
            home: {
                primary: [
                    {
                        id: 'start-flow',
                        title: 'Start Your Flow',
                        icon: '🌅',
                        action: 'startMorningFlow',
                        priority: 1,
                        conditions: ['morning', 'idle']
                    },
                    {
                        id: 'quick-meditation',
                        title: 'Quick Meditation',
                        icon: '🧘',
                        action: 'startQuickMeditation',
                        priority: 2,
                        conditions: ['any', 'stressed']
                    }
                ],
                secondary: [
                    {
                        id: 'weather-check',
                        title: 'Check Weather',
                        icon: '🌤️',
                        action: 'showWeather',
                        priority: 1,
                        conditions: ['morning']
                    },
                    {
                        id: 'health-summary',
                        title: 'Health Summary',
                        icon: '❤️',
                        action: 'showHealthSummary',
                        priority: 2,
                        conditions: ['any']
                    }
                ],
                contextual: [
                    {
                        id: 'energy-boost',
                        title: 'Energy Boost',
                        icon: '⚡',
                        action: 'startEnergyBoost',
                        priority: 1,
                        conditions: ['low-energy', 'afternoon']
                    },
                    {
                        id: 'wind-down',
                        title: 'Wind Down',
                        icon: '🌙',
                        action: 'startWindDown',
                        priority: 1,
                        conditions: ['evening', 'high-energy']
                    }
                ]
            },
            
            // Timer page actions
            timer: {
                primary: [
                    {
                        id: 'adjust-duration',
                        title: 'Adjust Duration',
                        icon: '⏱️',
                        action: 'adjustTimerDuration',
                        priority: 1,
                        conditions: ['any']
                    },
                    {
                        id: 'change-sound',
                        title: 'Change Sound',
                        icon: '🔊',
                        action: 'changeTimerSound',
                        priority: 2,
                        conditions: ['any']
                    }
                ],
                secondary: [
                    {
                        id: 'breathing-guide',
                        title: 'Breathing Guide',
                        icon: '🫁',
                        action: 'showBreathingGuide',
                        priority: 1,
                        conditions: ['meditation']
                    },
                    {
                        id: 'ambient-sounds',
                        title: 'Ambient Sounds',
                        icon: '🎵',
                        action: 'showAmbientSounds',
                        priority: 2,
                        conditions: ['any']
                    }
                ],
                contextual: [
                    {
                        id: 'extend-session',
                        title: 'Extend Session',
                        icon: '⏳',
                        action: 'extendSession',
                        priority: 1,
                        conditions: ['near-completion', 'positive-mood']
                    },
                    {
                        id: 'skip-to-end',
                        title: 'Skip to End',
                        icon: '⏭️',
                        action: 'skipToEnd',
                        priority: 1,
                        conditions: ['anxious', 'time-pressed']
                    }
                ]
            },
            
            // Journal page actions
            journal: {
                primary: [
                    {
                        id: 'smart-prompts',
                        title: 'Smart Prompts',
                        icon: '💡',
                        action: 'showSmartPrompts',
                        priority: 1,
                        conditions: ['any']
                    },
                    {
                        id: 'voice-to-text',
                        title: 'Voice to Text',
                        icon: '🎤',
                        action: 'startVoiceToText',
                        priority: 2,
                        conditions: ['any']
                    }
                ],
                secondary: [
                    {
                        id: 'mood-tracker',
                        title: 'Mood Tracker',
                        icon: '😊',
                        action: 'showMoodTracker',
                        priority: 1,
                        conditions: ['any']
                    },
                    {
                        id: 'gratitude-list',
                        title: 'Gratitude List',
                        icon: '🙏',
                        action: 'showGratitudeList',
                        priority: 2,
                        conditions: ['any']
                    }
                ],
                contextual: [
                    {
                        id: 'emotional-check',
                        title: 'Emotional Check',
                        icon: '💭',
                        action: 'startEmotionalCheck',
                        priority: 1,
                        conditions: ['emotional', 'any']
                    },
                    {
                        id: 'goal-setting',
                        title: 'Goal Setting',
                        icon: '🎯',
                        action: 'startGoalSetting',
                        priority: 1,
                        conditions: ['motivated', 'morning']
                    }
                ]
            },
            
            // Workout page actions
            workout: {
                primary: [
                    {
                        id: 'customize-workout',
                        title: 'Customize Workout',
                        icon: '⚙️',
                        action: 'customizeWorkout',
                        priority: 1,
                        conditions: ['any']
                    },
                    {
                        id: 'workout-music',
                        title: 'Workout Music',
                        icon: '🎵',
                        action: 'showWorkoutMusic',
                        priority: 2,
                        conditions: ['any']
                    }
                ],
                secondary: [
                    {
                        id: 'form-guide',
                        title: 'Form Guide',
                        icon: '📖',
                        action: 'showFormGuide',
                        priority: 1,
                        conditions: ['beginner']
                    },
                    {
                        id: 'progress-tracker',
                        title: 'Progress Tracker',
                        icon: '📊',
                        action: 'showProgressTracker',
                        priority: 2,
                        conditions: ['any']
                    }
                ],
                contextual: [
                    {
                        id: 'intensity-adjust',
                        title: 'Adjust Intensity',
                        icon: '💪',
                        action: 'adjustIntensity',
                        priority: 1,
                        conditions: ['any']
                    },
                    {
                        id: 'rest-reminder',
                        title: 'Rest Reminder',
                        icon: '😴',
                        action: 'showRestReminder',
                        priority: 1,
                        conditions: ['overtraining']
                    }
                ]
            },
            
            // Clarity page actions
            clarity: {
                primary: [
                    {
                        id: 'prompt-suggestions',
                        title: 'Prompt Suggestions',
                        icon: '💭',
                        action: 'showPromptSuggestions',
                        priority: 1,
                        conditions: ['any']
                    },
                    {
                        id: 'voice-coaching',
                        title: 'Voice Coaching',
                        icon: '🗣️',
                        action: 'startVoiceCoaching',
                        priority: 2,
                        conditions: ['any']
                    }
                ],
                secondary: [
                    {
                        id: 'confidence-tips',
                        title: 'Confidence Tips',
                        icon: '💪',
                        action: 'showConfidenceTips',
                        priority: 1,
                        conditions: ['any']
                    },
                    {
                        id: 'speech-analysis',
                        title: 'Speech Analysis',
                        icon: '📈',
                        action: 'showSpeechAnalysis',
                        priority: 2,
                        conditions: ['any']
                    }
                ],
                contextual: [
                    {
                        id: 'warm-up-exercises',
                        title: 'Warm-up Exercises',
                        icon: '🔥',
                        action: 'startWarmUpExercises',
                        priority: 1,
                        conditions: ['nervous', 'any']
                    },
                    {
                        id: 'reflection-prompts',
                        title: 'Reflection Prompts',
                        icon: '🪞',
                        action: 'showReflectionPrompts',
                        priority: 1,
                        conditions: ['post-session']
                    }
                ]
            }
        };
    }

    setupContextualListeners() {
        // Listen for context changes
        window.addEventListener('pageChanged', (event) => {
            this.updateContext('currentPage', event.detail.page);
        });
        
        window.addEventListener('moodChanged', (event) => {
            this.updateContext('userMood', event.detail.mood);
        });
        
        window.addEventListener('timeChanged', (event) => {
            this.updateContext('timeOfDay', event.detail.timeOfDay);
        });
        
        window.addEventListener('activityStarted', (event) => {
            this.updateContext('userActivity', event.detail.activity);
        });
        
        window.addEventListener('activityCompleted', (event) => {
            this.updateContext('userActivity', 'idle');
        });
        
        // Listen for health data updates
        window.addEventListener('healthDataUpdated', (event) => {
            this.updateContext('healthData', event.detail);
        });
        
        // Listen for weather data updates
        window.addEventListener('weatherDataUpdated', (event) => {
            this.updateContext('weatherData', event.detail);
        });
    }

    setupSmartSuggestions() {
        // Setup smart suggestion engine
        this.smartSuggestionEngine = new SmartSuggestionEngine();
        
        // Generate initial suggestions
        this.generateSmartSuggestions();
        
        // Setup suggestion refresh
        this.setupSuggestionRefresh();
    }

    createFloatingActionContainer() {
        // Create floating action container
        this.actionContainer = document.createElement('div');
        this.actionContainer.className = 'floating-actions-container';
        this.actionContainer.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            pointer-events: none;
        `;
        
        document.body.appendChild(this.actionContainer);
        
        // Create action button
        this.createMainActionButton();
    }

    createMainActionButton() {
        this.mainActionButton = document.createElement('div');
        this.mainActionButton.className = 'floating-action-button main-action';
        this.mainActionButton.style.cssText = `
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--forest-deep) 0%, var(--sage-deep) 100%);
            box-shadow: 0 8px 32px rgba(26, 77, 58, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            pointer-events: auto;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-size: 1.5rem;
            color: white;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;
        
        this.mainActionButton.innerHTML = '✨';
        
        // Add hover effects
        this.mainActionButton.addEventListener('mouseenter', () => {
            this.mainActionButton.style.transform = 'scale(1.1) rotate(5deg)';
            this.mainActionButton.style.boxShadow = '0 12px 40px rgba(26, 77, 58, 0.4)';
        });
        
        this.mainActionButton.addEventListener('mouseleave', () => {
            this.mainActionButton.style.transform = 'scale(1) rotate(0deg)';
            this.mainActionButton.style.boxShadow = '0 8px 32px rgba(26, 77, 58, 0.3)';
        });
        
        // Add click handler
        this.mainActionButton.addEventListener('click', () => {
            this.toggleActionMenu();
        });
        
        this.actionContainer.appendChild(this.mainActionButton);
    }

    // Context Detection Methods
    detectCurrentContext() {
        // Detect current page
        if (window.navigationManager) {
            this.context.currentPage = window.navigationManager.currentPage || 'home';
        }
        
        // Detect time of day
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 10) {
            this.context.timeOfDay = 'morning';
        } else if (hour >= 10 && hour < 18) {
            this.context.timeOfDay = 'day';
        } else if (hour >= 18 && hour < 22) {
            this.context.timeOfDay = 'evening';
        } else {
            this.context.timeOfDay = 'night';
        }
        
        // Detect user mood from recent actions
        this.detectUserMood();
        
        // Detect user activity
        this.detectUserActivity();
    }

    detectUserMood() {
        // Simple mood detection based on recent actions
        const recentActions = this.context.recentActions.slice(-5);
        
        if (recentActions.some(action => action.type === 'stress' || action.type === 'anxiety')) {
            this.context.userMood = 'stressed';
        } else if (recentActions.some(action => action.type === 'energy' || action.type === 'motivation')) {
            this.context.userMood = 'energized';
        } else if (recentActions.some(action => action.type === 'calm' || action.type === 'meditation')) {
            this.context.userMood = 'calm';
        } else {
            this.context.userMood = 'neutral';
        }
    }

    detectUserActivity() {
        // Detect current user activity
        if (this.context.currentPage === 'timer' && this.isTimerRunning()) {
            this.context.userActivity = 'meditating';
        } else if (this.context.currentPage === 'workout' && this.isWorkoutActive()) {
            this.context.userActivity = 'working-out';
        } else if (this.context.currentPage === 'journal' && this.isJournalActive()) {
            this.context.userActivity = 'journaling';
        } else if (this.context.currentPage === 'clarity' && this.isClarityActive()) {
            this.context.userActivity = 'speaking';
        } else {
            this.context.userActivity = 'idle';
        }
    }

    // Context Monitoring
    setupContextMonitoring() {
        // Monitor context changes every 30 seconds
        setInterval(() => {
            this.detectCurrentContext();
            this.updateContextualActions();
        }, 30000);
        
        // Monitor scroll for contextual actions
        window.addEventListener('scroll', () => {
            this.updateContextualActions();
        });
        
        // Monitor focus changes
        window.addEventListener('focus', () => {
            this.detectCurrentContext();
            this.updateContextualActions();
        });
    }

    // Action Management
    updateContextualActions() {
        // Clear existing actions
        this.clearContextualActions();
        
        // Get actions for current context
        const actions = this.getActionsForContext();
        
        // Create and display actions
        actions.forEach(action => {
            this.createContextualAction(action);
        });
        
        // Update main action button
        this.updateMainActionButton();
    }

    getActionsForContext() {
        const pageActions = this.actionTemplates[this.context.currentPage] || {};
        const allActions = [
            ...(pageActions.primary || []),
            ...(pageActions.secondary || []),
            ...(pageActions.contextual || [])
        ];
        
        // Filter actions based on conditions
        const filteredActions = allActions.filter(action => {
            return this.evaluateActionConditions(action.conditions);
        });
        
        // Sort by priority
        return filteredActions.sort((a, b) => a.priority - b.priority).slice(0, 3);
    }

    evaluateActionConditions(conditions) {
        if (!conditions || conditions.length === 0) return true;
        
        return conditions.some(condition => {
            switch (condition) {
                case 'morning':
                    return this.context.timeOfDay === 'morning';
                case 'day':
                    return this.context.timeOfDay === 'day';
                case 'evening':
                    return this.context.timeOfDay === 'evening';
                case 'night':
                    return this.context.timeOfDay === 'night';
                case 'stressed':
                    return this.context.userMood === 'stressed';
                case 'energized':
                    return this.context.userMood === 'energized';
                case 'calm':
                    return this.context.userMood === 'calm';
                case 'idle':
                    return this.context.userActivity === 'idle';
                case 'any':
                    return true;
                default:
                    return true;
            }
        });
    }

    createContextualAction(action) {
        const actionElement = document.createElement('div');
        actionElement.className = 'contextual-action';
        actionElement.style.cssText = `
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(26, 77, 58, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            pointer-events: auto;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-size: 1.2rem;
            color: var(--forest-deep);
            user-select: none;
            opacity: 0;
            transform: translateY(20px);
        `;
        
        actionElement.innerHTML = action.icon;
        actionElement.title = action.title;
        
        // Add hover effects
        actionElement.addEventListener('mouseenter', () => {
            actionElement.style.transform = 'translateY(-2px) scale(1.1)';
            actionElement.style.boxShadow = '0 8px 24px rgba(26, 77, 58, 0.2)';
        });
        
        actionElement.addEventListener('mouseleave', () => {
            actionElement.style.transform = 'translateY(0) scale(1)';
            actionElement.style.boxShadow = 'none';
        });
        
        // Add click handler
        actionElement.addEventListener('click', () => {
            this.executeAction(action);
        });
        
        // Animate in
        setTimeout(() => {
            actionElement.style.opacity = '1';
            actionElement.style.transform = 'translateY(0)';
        }, 100);
        
        this.actionContainer.appendChild(actionElement);
        this.floatingActions.set(action.id, actionElement);
    }

    clearContextualActions() {
        this.floatingActions.forEach(action => {
            action.style.opacity = '0';
            action.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (action.parentNode) {
                    action.parentNode.removeChild(action);
                }
            }, 300);
        });
        this.floatingActions.clear();
    }

    updateMainActionButton() {
        // Update main action button based on context
        const primaryAction = this.getActionsForContext()[0];
        
        if (primaryAction) {
            this.mainActionButton.innerHTML = primaryAction.icon;
            this.mainActionButton.title = primaryAction.title;
        } else {
            this.mainActionButton.innerHTML = '✨';
            this.mainActionButton.title = 'Smart Actions';
        }
    }

    // Action Execution
    executeAction(action) {
        console.log('🧠 Executing contextual action:', action);
        
        // Add to recent actions
        this.addToRecentActions(action);
        
        // Execute action based on type
        switch (action.action) {
            case 'startMorningFlow':
                this.startMorningFlow();
                break;
            case 'startQuickMeditation':
                this.startQuickMeditation();
                break;
            case 'showWeather':
                this.showWeather();
                break;
            case 'showHealthSummary':
                this.showHealthSummary();
                break;
            case 'adjustTimerDuration':
                this.adjustTimerDuration();
                break;
            case 'showSmartPrompts':
                this.showSmartPrompts();
                break;
            case 'customizeWorkout':
                this.customizeWorkout();
                break;
            case 'showPromptSuggestions':
                this.showPromptSuggestions();
                break;
            default:
                console.log('Unknown action:', action.action);
        }
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'medium');
        }
        
        // Dispatch action event
        window.dispatchEvent(new CustomEvent('contextualActionExecuted', {
            detail: action
        }));
    }

    // Action Implementations
    startMorningFlow() {
        if (window.navigationManager) {
            window.navigationManager.navigateToPage('timer');
        }
    }

    startQuickMeditation() {
        if (window.navigationManager) {
            window.navigationManager.navigateToPage('timer');
        }
    }

    showWeather() {
        // Show weather information
        console.log('🌤️ Showing weather information');
    }

    showHealthSummary() {
        // Show health summary
        console.log('❤️ Showing health summary');
    }

    adjustTimerDuration() {
        // Show timer duration adjustment
        console.log('⏱️ Adjusting timer duration');
    }

    showSmartPrompts() {
        // Show smart journal prompts
        console.log('💡 Showing smart prompts');
    }

    customizeWorkout() {
        // Show workout customization
        console.log('⚙️ Customizing workout');
    }

    showPromptSuggestions() {
        // Show clarity prompt suggestions
        console.log('💭 Showing prompt suggestions');
    }

    // Smart Suggestions
    generateSmartSuggestions() {
        this.smartRecommendations = this.smartSuggestionEngine.generateRecommendations(this.context);
    }

    setupSuggestionRefresh() {
        // Refresh suggestions every 5 minutes
        setInterval(() => {
            this.generateSmartSuggestions();
        }, 300000);
    }

    // Context Updates
    updateContext(key, value) {
        this.context[key] = value;
        this.updateContextualActions();
        
        // Dispatch context update event
        window.dispatchEvent(new CustomEvent('contextUpdated', {
            detail: { key, value, context: this.context }
        }));
    }

    addToRecentActions(action) {
        this.context.recentActions.push({
            ...action,
            timestamp: Date.now()
        });
        
        // Keep only last 10 actions
        if (this.context.recentActions.length > 10) {
            this.context.recentActions.shift();
        }
    }

    // Utility Methods
    isTimerRunning() {
        return window.meditationTimer && window.meditationTimer.isRunning();
    }

    isWorkoutActive() {
        return window.workoutManager && window.workoutManager.isActive();
    }

    isJournalActive() {
        return window.journalManager && window.journalManager.isActive();
    }

    isClarityActive() {
        return window.clarityManager && window.clarityManager.isActive();
    }

    toggleActionMenu() {
        // Toggle action menu visibility
        const isVisible = this.floatingActions.size > 0;
        
        if (isVisible) {
            this.clearContextualActions();
        } else {
            this.updateContextualActions();
        }
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('contextualActionsPreferences');
        if (saved) {
            const preferences = JSON.parse(saved);
            this.context.userPreferences = preferences;
        }
    }

    saveUserPreferences() {
        localStorage.setItem('contextualActionsPreferences', JSON.stringify(this.context.userPreferences));
    }

    // Public API
    getContext() {
        return { ...this.context };
    }

    getActions() {
        return this.getActionsForContext();
    }

    getSuggestions() {
        return this.smartRecommendations;
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled) {
            this.clearContextualActions();
        }
    }

    // Cleanup
    destroy() {
        this.clearContextualActions();
        if (this.actionContainer) {
            this.actionContainer.remove();
        }
    }
}

// Smart Suggestion Engine
class SmartSuggestionEngine {
    generateRecommendations(context) {
        const recommendations = [];
        
        // Time-based recommendations
        if (context.timeOfDay === 'morning') {
            recommendations.push({
                type: 'meditation',
                title: 'Morning Meditation',
                description: 'Start your day with 5 minutes of mindfulness',
                priority: 1
            });
        }
        
        // Mood-based recommendations
        if (context.userMood === 'stressed') {
            recommendations.push({
                type: 'breathing',
                title: 'Breathing Exercise',
                description: 'Take a moment to center yourself',
                priority: 1
            });
        }
        
        // Activity-based recommendations
        if (context.userActivity === 'idle' && context.timeOfDay === 'evening') {
            recommendations.push({
                type: 'journal',
                title: 'Evening Reflection',
                description: 'Reflect on your day and set intentions',
                priority: 2
            });
        }
        
        return recommendations;
    }
}

// Initialize contextual actions
window.ContextualActions = ContextualActions;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.contextualActions = new ContextualActions();
    });
} else {
    window.contextualActions = new ContextualActions();
}
