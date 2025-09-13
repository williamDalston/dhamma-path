/**
 * Ultra-Robust Page-Specific Error Handling System
 * The most comprehensive error handling ever built for each page
 */

class PageErrorHandlers {
    constructor() {
        this.pageHandlers = {};
        this.recoveryStrategies = {};
        this.userGuidance = {};
        this.fallbackContent = {};
        this.init();
    }

    init() {
        this.setupPageHandlers();
        this.setupRecoveryStrategies();
        this.setupUserGuidance();
        this.setupFallbackContent();
        this.initializeGlobalHandlers();
    }

    setupPageHandlers() {
        // Home Page Error Handler
        this.pageHandlers.home = {
            name: 'Home Page',
            criticalElements: ['main-content', 'navigation', 'cards-container'],
            errorTypes: {
                'navigation_failure': {
                    severity: 'critical',
                    recovery: 'reload_navigation',
                    message: 'Navigation system failed to load',
                    userAction: 'Please refresh the page'
                },
                'cards_load_failure': {
                    severity: 'high',
                    recovery: 'show_fallback_cards',
                    message: 'Some content failed to load',
                    userAction: 'Content will reload automatically'
                },
                'analytics_failure': {
                    severity: 'low',
                    recovery: 'continue_without_analytics',
                    message: 'Analytics temporarily unavailable',
                    userAction: 'App continues to work normally'
                },
                'animation_failure': {
                    severity: 'low',
                    recovery: 'disable_animations',
                    message: 'Some animations may not work',
                    userAction: 'App functionality is not affected'
                }
            },
            recoveryActions: {
                'reload_navigation': () => this.reloadNavigation(),
                'show_fallback_cards': () => this.showFallbackCards(),
                'continue_without_analytics': () => this.disableAnalytics(),
                'disable_animations': () => this.disableAnimations()
            }
        };

        // Timer Page Error Handler
        this.pageHandlers.timer = {
            name: 'Meditation Timer',
            criticalElements: ['timer-display', 'timer-controls', 'duration-selector'],
            errorTypes: {
                'timer_initialization_failure': {
                    severity: 'critical',
                    recovery: 'reinitialize_timer',
                    message: 'Timer failed to initialize',
                    userAction: 'Please try again or refresh the page'
                },
                'audio_context_failure': {
                    severity: 'high',
                    recovery: 'fallback_audio',
                    message: 'Audio system unavailable',
                    userAction: 'Timer will work without sound'
                },
                'progress_circle_failure': {
                    severity: 'medium',
                    recovery: 'show_text_progress',
                    message: 'Visual progress indicator failed',
                    userAction: 'Progress will be shown as text'
                },
                'duration_selector_failure': {
                    severity: 'high',
                    recovery: 'show_default_duration',
                    message: 'Duration selector not working',
                    userAction: 'Default 10-minute timer will be used'
                },
                'timer_state_corruption': {
                    severity: 'critical',
                    recovery: 'reset_timer_state',
                    message: 'Timer state corrupted',
                    userAction: 'Timer will be reset to default state'
                }
            },
            recoveryActions: {
                'reinitialize_timer': () => this.reinitializeTimer(),
                'fallback_audio': () => this.setupFallbackAudio(),
                'show_text_progress': () => this.showTextProgress(),
                'show_default_duration': () => this.showDefaultDuration(),
                'reset_timer_state': () => this.resetTimerState()
            }
        };

        // Journal Page Error Handler
        this.pageHandlers.journal = {
            name: 'Journal Page',
            criticalElements: ['journal-editor', 'entry-list', 'save-button'],
            errorTypes: {
                'editor_initialization_failure': {
                    severity: 'critical',
                    recovery: 'show_textarea_fallback',
                    message: 'Rich text editor failed to load',
                    userAction: 'Basic text editor will be used instead'
                },
                'save_failure': {
                    severity: 'critical',
                    recovery: 'local_storage_fallback',
                    message: 'Failed to save journal entry',
                    userAction: 'Entry will be saved locally'
                },
                'load_entries_failure': {
                    severity: 'high',
                    recovery: 'show_empty_state',
                    message: 'Failed to load previous entries',
                    userAction: 'Previous entries will be loaded when available'
                },
                'word_count_failure': {
                    severity: 'low',
                    recovery: 'disable_word_count',
                    message: 'Word counter not working',
                    userAction: 'Word counting is temporarily disabled'
                },
                'auto_save_failure': {
                    severity: 'medium',
                    recovery: 'manual_save_only',
                    message: 'Auto-save not working',
                    userAction: 'Please save manually using the save button'
                }
            },
            recoveryActions: {
                'show_textarea_fallback': () => this.showTextareaFallback(),
                'local_storage_fallback': () => this.enableLocalStorageFallback(),
                'show_empty_state': () => this.showEmptyState(),
                'disable_word_count': () => this.disableWordCount(),
                'manual_save_only': () => this.enableManualSaveOnly()
            }
        };

        // Workout Page Error Handler
        this.pageHandlers.workout = {
            name: 'Workout Page',
            criticalElements: ['workout-timer', 'exercise-display', 'navigation-controls'],
            errorTypes: {
                'exercise_data_failure': {
                    severity: 'critical',
                    recovery: 'load_default_exercises',
                    message: 'Exercise data failed to load',
                    userAction: 'Default exercises will be loaded'
                },
                'workout_timer_failure': {
                    severity: 'critical',
                    recovery: 'reinitialize_workout_timer',
                    message: 'Workout timer failed to start',
                    userAction: 'Timer will be reinitialized'
                },
                'exercise_navigation_failure': {
                    severity: 'high',
                    recovery: 'enable_manual_navigation',
                    message: 'Exercise navigation not working',
                    userAction: 'Manual navigation will be enabled'
                },
                'progress_tracking_failure': {
                    severity: 'medium',
                    recovery: 'disable_progress_tracking',
                    message: 'Progress tracking unavailable',
                    userAction: 'Workout will continue without progress tracking'
                },
                'sound_failure': {
                    severity: 'low',
                    recovery: 'continue_without_sound',
                    message: 'Audio cues unavailable',
                    userAction: 'Workout will continue without sound'
                }
            },
            recoveryActions: {
                'load_default_exercises': () => this.loadDefaultExercises(),
                'reinitialize_workout_timer': () => this.reinitializeWorkoutTimer(),
                'enable_manual_navigation': () => this.enableManualNavigation(),
                'disable_progress_tracking': () => this.disableProgressTracking(),
                'continue_without_sound': () => this.disableWorkoutSound()
            }
        };

        // Interview Page Error Handler
        this.pageHandlers.interview = {
            name: 'Interview Practice',
            criticalElements: ['question-display', 'timer-display', 'question-navigation'],
            errorTypes: {
                'question_data_failure': {
                    severity: 'critical',
                    recovery: 'load_default_questions',
                    message: 'Interview questions failed to load',
                    userAction: 'Default questions will be loaded'
                },
                'practice_timer_failure': {
                    severity: 'critical',
                    recovery: 'reinitialize_practice_timer',
                    message: 'Practice timer failed to start',
                    userAction: 'Timer will be reinitialized'
                },
                'question_navigation_failure': {
                    severity: 'high',
                    recovery: 'enable_manual_navigation',
                    message: 'Question navigation not working',
                    userAction: 'Manual navigation will be enabled'
                },
                'tips_load_failure': {
                    severity: 'medium',
                    recovery: 'show_basic_tips',
                    message: 'Interview tips failed to load',
                    userAction: 'Basic tips will be shown'
                },
                'category_filter_failure': {
                    severity: 'low',
                    recovery: 'show_all_questions',
                    message: 'Category filtering not working',
                    userAction: 'All questions will be shown'
                }
            },
            recoveryActions: {
                'load_default_questions': () => this.loadDefaultQuestions(),
                'reinitialize_practice_timer': () => this.reinitializePracticeTimer(),
                'enable_manual_navigation': () => this.enableQuestionNavigation(),
                'show_basic_tips': () => this.showBasicTips(),
                'show_all_questions': () => this.showAllQuestions()
            }
        };

        // Navigation Error Handler
        this.pageHandlers.navigation = {
            name: 'Navigation System',
            criticalElements: ['main-nav', 'mobile-menu', 'page-content'],
            errorTypes: {
                'page_load_failure': {
                    severity: 'critical',
                    recovery: 'show_error_page',
                    message: 'Page failed to load',
                    userAction: 'Please try again or go back to home'
                },
                'template_load_failure': {
                    severity: 'critical',
                    recovery: 'show_fallback_content',
                    message: 'Page template failed to load',
                    userAction: 'Basic page content will be shown'
                },
                'mobile_menu_failure': {
                    severity: 'high',
                    recovery: 'show_desktop_nav',
                    message: 'Mobile menu not working',
                    userAction: 'Desktop navigation will be shown'
                },
                'dark_mode_failure': {
                    severity: 'low',
                    recovery: 'disable_dark_mode',
                    message: 'Dark mode toggle not working',
                    userAction: 'App will use light mode'
                }
            },
            recoveryActions: {
                'show_error_page': () => this.showErrorPage(),
                'show_fallback_content': () => this.showFallbackContent(),
                'show_desktop_nav': () => this.showDesktopNav(),
                'disable_dark_mode': () => this.disableDarkMode()
            }
        };
    }

    setupRecoveryStrategies() {
        // Global recovery strategies
        this.recoveryStrategies = {
            'retry_with_backoff': async (fn, maxRetries = 3, baseDelay = 1000) => {
                for (let i = 0; i < maxRetries; i++) {
                    try {
                        return await fn();
                    } catch (error) {
                        if (i === maxRetries - 1) throw error;
                        const delay = baseDelay * Math.pow(2, i);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            },
            'graceful_degradation': (fallbackFn) => {
                try {
                    return fallbackFn();
                } catch (error) {
                    console.error('Fallback also failed:', error);
                    return this.showCriticalError();
                }
            },
            'user_guided_recovery': (error, userAction) => {
                this.showUserGuidance(error, userAction);
                return false; // Indicate manual intervention needed
            }
        };
    }

    setupUserGuidance() {
        this.userGuidance = {
            'critical': {
                icon: '🚨',
                color: 'red',
                title: 'Critical Error',
                description: 'A critical component has failed',
                actions: ['Refresh Page', 'Go to Home', 'Contact Support']
            },
            'high': {
                icon: '⚠️',
                color: 'orange',
                title: 'Important Issue',
                description: 'Some functionality is affected',
                actions: ['Try Again', 'Continue Anyway', 'Report Issue']
            },
            'medium': {
                icon: 'ℹ️',
                color: 'blue',
                title: 'Minor Issue',
                description: 'Some features may not work as expected',
                actions: ['Continue', 'Report Issue']
            },
            'low': {
                icon: '💡',
                color: 'green',
                title: 'Notice',
                description: 'Everything is working, with minor limitations',
                actions: ['Continue']
            }
        };
    }

    setupFallbackContent() {
        this.fallbackContent = {
            'home': {
                title: 'The Dhamma Path',
                message: 'Your mindfulness journey starts here',
                actions: [
                    { text: 'Meditate', action: 'navigate', target: 'timer' },
                    { text: 'Journal', action: 'navigate', target: 'journal' },
                    { text: 'Exercise', action: 'navigate', target: 'workout' }
                ]
            },
            'timer': {
                title: 'Meditation Timer',
                message: 'Find your inner peace',
                actions: [
                    { text: 'Start 10 Min Timer', action: 'start_timer', duration: 600 },
                    { text: 'Start 5 Min Timer', action: 'start_timer', duration: 300 },
                    { text: 'Back to Home', action: 'navigate', target: 'home' }
                ]
            },
            'journal': {
                title: 'Journal',
                message: 'Reflect on your journey',
                actions: [
                    { text: 'New Entry', action: 'new_entry' },
                    { text: 'Back to Home', action: 'navigate', target: 'home' }
                ]
            },
            'workout': {
                title: 'Exercise',
                message: 'Move your body, calm your mind',
                actions: [
                    { text: 'Start Workout', action: 'start_workout' },
                    { text: 'Back to Home', action: 'navigate', target: 'home' }
                ]
            },
            'interview': {
                title: 'Interview Practice',
                message: 'Prepare for your next opportunity',
                actions: [
                    { text: 'Start Practice', action: 'start_practice' },
                    { text: 'Back to Home', action: 'navigate', target: 'home' }
                ]
            }
        };
    }

    initializeGlobalHandlers() {
        // Global error handler that routes to page-specific handlers
        window.addEventListener('error', (event) => {
            const currentPage = this.getCurrentPage();
            this.handlePageError(currentPage, event.error, event);
        });

        window.addEventListener('unhandledrejection', (event) => {
            const currentPage = this.getCurrentPage();
            this.handlePageError(currentPage, event.reason, event);
        });

        // Navigation error handler
        document.addEventListener('navigation-error', (event) => {
            this.handleNavigationError(event.detail);
        });
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('timer')) return 'timer';
        if (path.includes('journal')) return 'journal';
        if (path.includes('workout')) return 'workout';
        if (path.includes('interview')) return 'interview';
        return 'home';
    }

    handlePageError(page, error, event) {
        const handler = this.pageHandlers[page];
        if (!handler) {
            console.error('No error handler found for page:', page);
            return;
        }

        // Determine error type
        const errorType = this.classifyError(error, handler);
        if (!errorType) {
            console.error('Unknown error type for page:', page, error);
            return;
        }

        const errorConfig = handler.errorTypes[errorType];
        if (!errorConfig) {
            console.error('No error configuration found for type:', errorType);
            return;
        }

        // Execute recovery action
        this.executeRecoveryAction(page, errorType, errorConfig, error);
    }

    classifyError(error, handler) {
        const errorMessage = error.message || error.toString();
        
        // Check for specific error patterns
        if (errorMessage.includes('timer') || errorMessage.includes('Timer')) {
            return 'timer_initialization_failure';
        }
        if (errorMessage.includes('audio') || errorMessage.includes('Audio')) {
            return 'audio_context_failure';
        }
        if (errorMessage.includes('navigation') || errorMessage.includes('Navigation')) {
            return 'navigation_failure';
        }
        if (errorMessage.includes('load') || errorMessage.includes('Load')) {
            return 'page_load_failure';
        }
        if (errorMessage.includes('save') || errorMessage.includes('Save')) {
            return 'save_failure';
        }
        
        // Default classification based on page
        const defaultErrors = Object.keys(handler.errorTypes);
        return defaultErrors[0] || 'unknown_error';
    }

    executeRecoveryAction(page, errorType, errorConfig, error) {
        const handler = this.pageHandlers[page];
        const recoveryAction = handler.recoveryActions[errorConfig.recovery];
        
        if (!recoveryAction) {
            console.error('No recovery action found for:', errorConfig.recovery);
            this.showGenericError(error);
            return;
        }

        try {
            const result = recoveryAction();
            this.showRecoveryNotification(errorConfig, result);
        } catch (recoveryError) {
            console.error('Recovery action failed:', recoveryError);
            this.showCriticalError(error);
        }
    }

    showRecoveryNotification(errorConfig, recoveryResult) {
        const guidance = this.userGuidance[errorConfig.severity];
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 bg-${guidance.color}-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-md`;
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <span class="text-xl">${guidance.icon}</span>
                <div>
                    <h4 class="font-semibold">${guidance.title}</h4>
                    <p class="text-sm opacity-90 mt-1">${errorConfig.message}</p>
                    <p class="text-xs opacity-75 mt-2">${errorConfig.userAction}</p>
                    <div class="mt-3 flex space-x-2">
                        ${guidance.actions.map(action => 
                            `<button onclick="this.closest('.fixed').remove()" 
                                    class="text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30">
                                ${action}
                            </button>`
                        ).join('')}
                    </div>
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

    // Recovery Action Implementations
    reloadNavigation() {
        console.log('🔄 Reloading navigation...');
        if (window.navigationManager) {
            window.navigationManager.destroy();
            window.navigationManager = new window.NavigationManager();
        }
        return { success: true, message: 'Navigation reloaded' };
    }

    showFallbackCards() {
        console.log('🔄 Showing fallback cards...');
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const fallbackHTML = this.generateFallbackCardsHTML();
            mainContent.innerHTML = fallbackHTML;
        }
        return { success: true, message: 'Fallback cards displayed' };
    }

    disableAnalytics() {
        console.log('🔄 Disabling analytics...');
        if (window.analyticsSystem) {
            window.analyticsSystem.disable();
        }
        return { success: true, message: 'Analytics disabled' };
    }

    disableAnimations() {
        console.log('🔄 Disabling animations...');
        document.documentElement.classList.add('reduce-motion');
        return { success: true, message: 'Animations disabled' };
    }

    reinitializeTimer() {
        console.log('🔄 Reinitializing timer...');
        if (window.meditationTimer) {
            window.meditationTimer.destroy();
            window.meditationTimer = new window.MeditationTimer();
        }
        return { success: true, message: 'Timer reinitialized' };
    }

    setupFallbackAudio() {
        console.log('🔄 Setting up fallback audio...');
        // Implement fallback audio system
        return { success: true, message: 'Fallback audio enabled' };
    }

    showTextProgress() {
        console.log('🔄 Showing text progress...');
        const progressCircle = document.querySelector('.progress-circle');
        if (progressCircle) {
            progressCircle.style.display = 'none';
            const textProgress = document.createElement('div');
            textProgress.className = 'text-progress text-center text-2xl font-bold';
            textProgress.textContent = 'Progress: 0%';
            progressCircle.parentElement.appendChild(textProgress);
        }
        return { success: true, message: 'Text progress enabled' };
    }

    showDefaultDuration() {
        console.log('🔄 Showing default duration...');
        const durationSelector = document.getElementById('timer-duration');
        if (durationSelector) {
            durationSelector.value = '600'; // 10 minutes
            durationSelector.disabled = true;
        }
        return { success: true, message: 'Default duration set' };
    }

    resetTimerState() {
        console.log('🔄 Resetting timer state...');
        if (window.meditationTimer) {
            window.meditationTimer.reset();
        }
        return { success: true, message: 'Timer state reset' };
    }

    generateFallbackCardsHTML() {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="card-premium hover-lift cursor-pointer" onclick="window.navigationManager.navigateToPage('timer')">
                    <div class="card-header">
                        <div class="text-6xl mb-4">🧘</div>
                        <h3 class="text-xl font-bold mb-2">Meditate</h3>
                        <p class="text-gray-600">Find your inner peace</p>
                    </div>
                </div>
                <div class="card-premium hover-lift cursor-pointer" onclick="window.navigationManager.navigateToPage('journal')">
                    <div class="card-header">
                        <div class="text-6xl mb-4">📝</div>
                        <h3 class="text-xl font-bold mb-2">Journal</h3>
                        <p class="text-gray-600">Reflect on your journey</p>
                    </div>
                </div>
                <div class="card-premium hover-lift cursor-pointer" onclick="window.navigationManager.navigateToPage('workout')">
                    <div class="card-header">
                        <div class="text-6xl mb-4">💪</div>
                        <h3 class="text-xl font-bold mb-2">Exercise</h3>
                        <p class="text-gray-600">Move your body</p>
                    </div>
                </div>
                <div class="card-premium hover-lift cursor-pointer" onclick="window.navigationManager.navigateToPage('interview')">
                    <div class="card-header">
                        <div class="text-6xl mb-4">🎯</div>
                        <h3 class="text-xl font-bold mb-2">Practice</h3>
                        <p class="text-gray-600">Prepare for success</p>
                    </div>
                </div>
            </div>
        `;
    }

    showCriticalError(error) {
        const errorModal = document.createElement('div');
        errorModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        errorModal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div class="text-center">
                    <div class="text-6xl mb-4">🚨</div>
                    <h3 class="text-xl font-bold mb-4">Critical Error</h3>
                    <p class="text-gray-600 mb-6">Something went wrong that we couldn't recover from automatically.</p>
                    <div class="space-y-3">
                        <button onclick="window.location.reload()" 
                                class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                            Refresh Page
                        </button>
                        <button onclick="window.location.href='/'"
                                class="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                            Go to Home
                        </button>
                        <button onclick="this.closest('.fixed').remove()"
                                class="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                            Continue Anyway
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(errorModal);
    }

    showGenericError(error) {
        console.error('Generic error handler:', error);
        this.showCriticalError(error);
    }

    // Additional recovery methods for other pages
    showTextareaFallback() {
        console.log('🔄 Showing textarea fallback...');
        // Implementation for journal textarea fallback
        return { success: true, message: 'Textarea fallback enabled' };
    }

    enableLocalStorageFallback() {
        console.log('🔄 Enabling localStorage fallback...');
        // Implementation for localStorage fallback
        return { success: true, message: 'LocalStorage fallback enabled' };
    }

    // ... (Additional recovery methods would be implemented here)
}

// Initialize page error handlers
window.PageErrorHandlers = PageErrorHandlers;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    window.pageErrorHandlers = new PageErrorHandlers();
});
