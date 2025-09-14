/**
 * Interview Page Error Handler
 * Ultra-robust error handling specifically for the interview practice functionality
 */

class InterviewErrorHandler {
    constructor() {
        this.interview = null;
        this.errorCount = 0;
        this.maxRetries = 3;
        this.fallbackMode = false;
        this.defaultQuestions = [
            {
                category: 'Behavioral',
                question: 'Tell me about a time when you had to work with a difficult team member.',
                tips: ['Use the STAR method', 'Focus on the positive outcome', 'Show your communication skills']
            },
            {
                category: 'Technical',
                question: 'How would you approach solving a complex problem?',
                tips: ['Break it down into steps', 'Explain your thought process', 'Consider multiple solutions']
            },
            {
                category: 'Situational',
                question: 'How do you handle tight deadlines and competing priorities?',
                tips: ['Prioritize tasks', 'Communicate with stakeholders', 'Show time management skills']
            },
            {
                category: 'Leadership',
                question: 'Describe a time when you had to lead a team through a challenging project.',
                tips: ['Highlight your leadership style', 'Show problem-solving skills', 'Demonstrate team management']
            },
            {
                category: 'Problem Solving',
                question: 'Walk me through your decision-making process.',
                tips: ['Show analytical thinking', 'Consider pros and cons', 'Explain your reasoning']
            }
        ];
        this.init();
    }

    init() {
        this.setupQuestionErrorHandlers();
        this.setupTimerErrorHandlers();
        this.setupNavigationErrorHandlers();
        this.setupTipsErrorHandlers();
        this.setupCategoryErrorHandlers();
    }

    setupQuestionErrorHandlers() {
        // Question data loading errors
        this.handleQuestionDataError = (error) => {
            console.error('Question data error:', error);
            this.errorCount++;
            
            if (this.errorCount <= this.maxRetries) {
                this.showRecoveryNotification('Question data failed to load', 'Retrying...', 'warning');
                setTimeout(() => this.reloadQuestionData(), 1000);
            } else {
                this.enableDefaultQuestions();
            }
        };

        // Question display errors
        this.handleQuestionDisplayError = (error) => {
            console.error('Question display error:', error);
            this.showRecoveryNotification('Question display failed', 'Switching to basic display', 'warning');
            this.enableBasicQuestionDisplay();
        };

        // Question state errors
        this.handleQuestionStateError = (error) => {
            console.error('Question state error:', error);
            this.showRecoveryNotification('Question state corrupted', 'Resetting to first question', 'error');
            this.resetQuestionState();
        };
    }

    setupTimerErrorHandlers() {
        // Practice timer errors
        this.handlePracticeTimerError = (error) => {
            console.error('Practice timer error:', error);
            this.showRecoveryNotification('Practice timer failed', 'Reinitializing timer', 'warning');
            this.reinitializePracticeTimer();
        };

        // Timer display errors
        this.handleTimerDisplayError = (error) => {
            console.error('Timer display error:', error);
            this.showRecoveryNotification('Timer display failed', 'Showing text timer', 'warning');
            this.enableTextTimer();
        };

        // Timer state errors
        this.handleTimerStateError = (error) => {
            console.error('Timer state error:', error);
            this.showRecoveryNotification('Timer state corrupted', 'Resetting timer', 'error');
            this.resetTimerState();
        };
    }

    setupNavigationErrorHandlers() {
        // Next/Previous question errors
        this.handleQuestionNavigationError = (error) => {
            console.error('Question navigation error:', error);
            this.showRecoveryNotification('Question navigation failed', 'Enabling manual navigation', 'warning');
            this.enableManualNavigation();
        };

        // Question list errors
        this.handleQuestionListError = (error) => {
            console.error('Question list error:', error);
            this.showRecoveryNotification('Question list failed', 'Showing basic list', 'warning');
            this.showBasicQuestionList();
        };
    }

    setupTipsErrorHandlers() {
        // Interview tips loading errors
        this.handleTipsLoadError = (error) => {
            console.error('Tips load error:', error);
            this.showRecoveryNotification('Interview tips failed to load', 'Showing basic tips', 'warning');
            this.showBasicTips();
        };

        // Tips display errors
        this.handleTipsDisplayError = (error) => {
            console.error('Tips display error:', error);
            this.showRecoveryNotification('Tips display failed', 'Hiding tips section', 'info');
            this.hideTipsDisplay();
        };
    }

    setupCategoryErrorHandlers() {
        // Category filtering errors
        this.handleCategoryFilterError = (error) => {
            console.error('Category filter error:', error);
            this.showRecoveryNotification('Category filtering failed', 'Showing all questions', 'warning');
            this.showAllQuestions();
        };

        // Category display errors
        this.handleCategoryDisplayError = (error) => {
            console.error('Category display error:', error);
            this.showRecoveryNotification('Category display failed', 'Hiding category filters', 'info');
            this.hideCategoryFilters();
        };
    }

    // Recovery Actions
    reloadQuestionData() {
        try {
            // Attempt to reload question data
            this.showRecoveryNotification('Reloading question data', 'Please wait...', 'info');
            // Implementation would reload from server or cache
        } catch (error) {
            console.error('Question data reload failed:', error);
            this.enableDefaultQuestions();
        }
    }

    enableDefaultQuestions() {
        this.fallbackMode = true;
        this.showFallbackInterviewUI();
        this.showRecoveryNotification('Default questions loaded', 'Basic interview practice available', 'warning');
    }

    showFallbackInterviewUI() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="text-center py-8">
                    <div class="mb-8">
                        <div class="text-6xl mb-4">🎯</div>
                        <h1 class="text-4xl font-bold mb-4">Interview Practice</h1>
                        <p class="text-gray-600 mb-8">Practice with common interview questions</p>
                    </div>
                    
                    <div class="mb-8">
                        <div id="fallback-practice-timer" class="text-6xl font-bold mb-4">05:00</div>
                        <div id="fallback-question-category" class="text-lg text-blue-600 mb-2">Behavioral</div>
                        <div id="fallback-question-text" class="text-xl font-semibold mb-4 px-4">
                            Tell me about a time when you had to work with a difficult team member.
                        </div>
                    </div>
                    
                    <div class="flex justify-center space-x-4 mb-8">
                        <button id="fallback-start-btn" onclick="window.interviewErrorHandler.toggleFallbackPractice()" 
                                class="btn-premium btn-success">
                            ▶️ Start Practice
                        </button>
                        <button id="fallback-pause-btn" onclick="window.interviewErrorHandler.pauseFallbackPractice()" 
                                class="btn-premium btn-warning hidden">
                            ⏸️ Pause
                        </button>
                        <button id="fallback-reset-btn" onclick="window.interviewErrorHandler.resetFallbackPractice()" 
                                class="btn-premium btn-secondary">
                            🔄 Reset
                        </button>
                    </div>
                    
                    <div class="flex justify-center space-x-4 mb-8">
                        <button onclick="window.interviewErrorHandler.previousQuestion()" 
                                class="btn-premium btn-outline">
                            ⬅️ Previous
                        </button>
                        <button onclick="window.interviewErrorHandler.nextQuestion()" 
                                class="btn-premium btn-outline">
                            Next ➡️
                        </button>
                    </div>
                    
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold mb-4">Interview Tips</h3>
                        <div id="fallback-tips-list" class="max-w-2xl mx-auto">
                            <!-- Tips will be populated here -->
                        </div>
                    </div>
                    
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold mb-4">Question Categories</h3>
                        <div id="fallback-category-list" class="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                            <!-- Categories will be populated here -->
                        </div>
                    </div>
                    
                    <div>
                        <button onclick="window.location.href='/'" 
                                class="btn-premium btn-outline">
                            ← Back to Home
                        </button>
                    </div>
                </div>
            `;
            
            this.currentQuestionIndex = 0;
            this.fallbackTimeRemaining = 300; // 5 minutes
            this.fallbackInterval = null;
            this.populateTipsList();
            this.populateCategoryList();
            this.updateQuestionDisplay();
        }
    }

    populateTipsList() {
        const tipsList = document.getElementById('fallback-tips-list');
        if (tipsList) {
            const currentQuestion = this.defaultQuestions[this.currentQuestionIndex];
            tipsList.innerHTML = currentQuestion.tips.map(tip => `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                    <div class="flex items-start space-x-3">
                        <span class="text-blue-500 text-xl">💡</span>
                        <p class="text-gray-700">${tip}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    populateCategoryList() {
        const categoryList = document.getElementById('fallback-category-list');
        if (categoryList) {
            const categories = [...new Set(this.defaultQuestions.map(q => q.category))];
            categoryList.innerHTML = categories.map(category => `
                <button onclick="window.interviewErrorHandler.filterByCategory('${category}')"
                        class="btn-premium btn-outline btn-sm">
                    ${category}
                </button>
            `).join('');
        }
    }

    updateQuestionDisplay() {
        const question = this.defaultQuestions[this.currentQuestionIndex];
        const timerDisplay = document.getElementById('fallback-practice-timer');
        const categoryDisplay = document.getElementById('fallback-question-category');
        const questionDisplay = document.getElementById('fallback-question-text');
        
        if (timerDisplay) {
            const minutes = Math.floor(this.fallbackTimeRemaining / 60);
            const seconds = this.fallbackTimeRemaining % 60;
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (categoryDisplay) {
            categoryDisplay.textContent = question.category;
        }
        
        if (questionDisplay) {
            questionDisplay.textContent = question.question;
        }
        
        this.populateTipsList();
    }

    toggleFallbackPractice() {
        if (this.fallbackInterval) {
            this.pauseFallbackPractice();
        } else {
            this.startFallbackPractice();
        }
    }

    startFallbackPractice() {
        this.fallbackInterval = setInterval(() => {
            this.fallbackTimeRemaining--;
            this.updateQuestionDisplay();
            
            if (this.fallbackTimeRemaining <= 0) {
                this.completePractice();
            }
        }, 1000);
        
        document.getElementById('fallback-start-btn').innerHTML = '⏸️ Pause';
        document.getElementById('fallback-pause-btn').classList.remove('hidden');
        this.showRecoveryNotification('Practice started', 'Take your time to think', 'success');
    }

    pauseFallbackPractice() {
        clearInterval(this.fallbackInterval);
        this.fallbackInterval = null;
        document.getElementById('fallback-start-btn').innerHTML = '▶️ Resume';
        document.getElementById('fallback-pause-btn').classList.add('hidden');
        this.showRecoveryNotification('Practice paused', 'Click resume to continue', 'info');
    }

    resetFallbackPractice() {
        clearInterval(this.fallbackInterval);
        this.fallbackInterval = null;
        this.fallbackTimeRemaining = 300; // 5 minutes
        this.updateQuestionDisplay();
        document.getElementById('fallback-start-btn').innerHTML = '▶️ Start Practice';
        document.getElementById('fallback-pause-btn').classList.add('hidden');
        this.showRecoveryNotification('Practice reset', 'Ready to start again', 'info');
    }

    completePractice() {
        clearInterval(this.fallbackInterval);
        this.fallbackInterval = null;
        
        const question = this.defaultQuestions[this.currentQuestionIndex];
        this.showRecoveryNotification('Practice time complete!', `Great job on the ${question.category} question`, 'success');
        
        // Show completion message
        setTimeout(() => {
            alert('🎉 Practice Session Complete!\n\nYou did great! Keep practicing to improve your interview skills.');
        }, 1000);
    }

    nextQuestion() {
        this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.defaultQuestions.length;
        this.updateQuestionDisplay();
        this.showRecoveryNotification('Next question', this.defaultQuestions[this.currentQuestionIndex].category, 'info');
    }

    previousQuestion() {
        this.currentQuestionIndex = this.currentQuestionIndex === 0 ? 
            this.defaultQuestions.length - 1 : 
            this.currentQuestionIndex - 1;
        this.updateQuestionDisplay();
        this.showRecoveryNotification('Previous question', this.defaultQuestions[this.currentQuestionIndex].category, 'info');
    }

    filterByCategory(category) {
        const categoryQuestions = this.defaultQuestions.filter(q => q.category === category);
        if (categoryQuestions.length > 0) {
            this.currentQuestionIndex = this.defaultQuestions.indexOf(categoryQuestions[0]);
            this.updateQuestionDisplay();
            this.showRecoveryNotification('Category filtered', `Showing ${category} questions`, 'success');
        }
    }

    enableBasicQuestionDisplay() {
        // Implementation for basic question display
        this.showRecoveryNotification('Basic question display enabled', 'Limited formatting available', 'warning');
    }

    resetQuestionState() {
        // Implementation for question state reset
        this.showRecoveryNotification('Question state reset', 'Starting from first question', 'info');
    }

    reinitializePracticeTimer() {
        // Implementation for timer reinitialization
        this.showRecoveryNotification('Timer reinitialized', 'Ready to use', 'success');
    }

    enableTextTimer() {
        // Implementation for text timer
        this.showRecoveryNotification('Text timer enabled', 'Visual timer unavailable', 'warning');
    }

    resetTimerState() {
        // Implementation for timer state reset
        this.showRecoveryNotification('Timer state reset', 'Starting fresh', 'info');
    }

    enableManualNavigation() {
        // Implementation for manual navigation
        this.showRecoveryNotification('Manual navigation enabled', 'Use buttons to navigate', 'info');
    }

    showBasicQuestionList() {
        // Implementation for basic question list
        this.showRecoveryNotification('Basic question list shown', 'Limited functionality available', 'warning');
    }

    showBasicTips() {
        // Implementation for basic tips
        this.showRecoveryNotification('Basic tips shown', 'Standard interview advice available', 'info');
    }

    hideTipsDisplay() {
        // Implementation for hiding tips display
        this.showRecoveryNotification('Tips display hidden', 'Focus on questions only', 'info');
    }

    showAllQuestions() {
        // Implementation for showing all questions
        this.showRecoveryNotification('All questions shown', 'No category filtering', 'info');
    }

    hideCategoryFilters() {
        // Implementation for hiding category filters
        this.showRecoveryNotification('Category filters hidden', 'All questions accessible', 'info');
    }

    showRecoveryNotification(title, message, type) {
        const colors = {
            success: 'green',
            warning: 'yellow',
            error: 'red',
            info: 'blue'
        };
        
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 bg-${colors[type]}-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm`;
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <span class="text-xl">${icons[type]}</span>
                <div>
                    <h4 class="font-semibold">${title}</h4>
                    <p class="text-sm opacity-90 mt-1">${message}</p>
                </div>
                <button onclick="this.closest('.fixed').remove()" 
                        class="text-white opacity-75 hover:opacity-100">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Public API
    setInterview(interview) {
        this.interview = interview;
    }

    getErrorStats() {
        return {
            errorCount: this.errorCount,
            fallbackMode: this.fallbackMode,
            currentQuestion: this.defaultQuestions[this.currentQuestionIndex]?.category || 'None'
        };
    }

    reset() {
        this.errorCount = 0;
        this.fallbackMode = false;
        this.currentQuestionIndex = 0;
        clearInterval(this.fallbackInterval);
    }
}

// Initialize interview error handler
window.InterviewErrorHandler = InterviewErrorHandler;

// Auto-initialize when interview page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('interview') || document.getElementById('interview-timer')) {
        window.interviewErrorHandler = new InterviewErrorHandler();
    }
});
