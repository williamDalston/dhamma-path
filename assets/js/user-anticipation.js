/**
 * User Anticipation System
 * Intelligently anticipates user needs and provides proactive responses
 */

class UserAnticipationSystem {
    constructor() {
        this.userContext = {
            currentPage: 'home',
            lastAction: null,
            typingSpeed: 0,
            pauseDuration: 0,
            emotionState: null,
            completionRate: 0,
            sessionDuration: 0,
            interactionPattern: []
        };
        
        this.anticipationRules = {
            journal: {
                afterTyping: ['suggestCompletion', 'showProgress', 'autoSave'],
                afterPause: ['suggestPrompts', 'showInsights'],
                afterEmotion: ['suggestReflection', 'showRelatedThoughts'],
                afterCompletion: ['showSummary', 'suggestNextStep']
            },
            timer: {
                afterStart: ['showBreathingGuide', 'minimizeDistractions'],
                afterPause: ['suggestResume', 'showEncouragement'],
                afterCompletion: ['showCelebration', 'suggestReflection', 'autoAdvance']
            },
            gratitude: {
                afterInput: ['suggestMore', 'showPatterns', 'autoSave'],
                afterCompletion: ['showImpact', 'suggestSharing']
            }
        };
        
        this.initializeAnticipation();
    }
    
    initializeAnticipation() {
        this.setupJournalAnticipation();
        this.setupTimerAnticipation();
        this.setupGratitudeAnticipation();
        this.setupNavigationAnticipation();
        this.setupEmotionAnticipation();
        
        // Track user session
        this.startSessionTracking();
    }
    
    setupJournalAnticipation() {
        const textarea = document.getElementById('journal-textarea');
        if (!textarea) return;
        
        let typingTimer;
        let pauseTimer;
        let lastTypingTime = Date.now();
        
        textarea.addEventListener('input', (e) => {
            this.trackTypingSpeed();
            this.userContext.lastAction = 'typing';
            
            // Clear previous timers
            clearTimeout(typingTimer);
            clearTimeout(pauseTimer);
            
            // Auto-save after 2 seconds of no typing
            typingTimer = setTimeout(() => {
                this.anticipateAction('journal', 'afterTyping');
            }, 2000);
            
            // Detect pause for suggestions
            pauseTimer = setTimeout(() => {
                this.anticipateAction('journal', 'afterPause');
            }, 5000);
            
            lastTypingTime = Date.now();
        });
        
        // Word count anticipation
        textarea.addEventListener('input', (e) => {
            const wordCount = e.target.value.trim().split(/\s+/).filter(word => word.length > 0).length;
            this.anticipateWordCount(wordCount);
        });
        
        // Focus anticipation
        textarea.addEventListener('focus', () => {
            this.anticipateFocus('journal');
        });
        
        // Blur anticipation
        textarea.addEventListener('blur', () => {
            this.anticipateBlur('journal');
        });
    }
    
    setupTimerAnticipation() {
        const timerBtn = document.getElementById('timer-start-btn');
        const pauseBtn = document.getElementById('timer-pause-btn');
        
        if (timerBtn) {
            timerBtn.addEventListener('click', () => {
                setTimeout(() => {
                    this.anticipateAction('timer', 'afterStart');
                }, 1000);
            });
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.anticipateAction('timer', 'afterPause');
            });
        }
        
        // Listen for timer completion
        document.addEventListener('timerCompleted', () => {
            this.anticipateAction('timer', 'afterCompletion');
        });
    }
    
    setupGratitudeAnticipation() {
        const gratitudeInput = document.getElementById('gratitude-input');
        if (!gratitudeInput) return;
        
        let inputTimer;
        
        gratitudeInput.addEventListener('input', (e) => {
            clearTimeout(inputTimer);
            
            inputTimer = setTimeout(() => {
                this.anticipateAction('gratitude', 'afterInput');
            }, 1500);
        });
        
        // Listen for gratitude completion
        document.addEventListener('gratitudeCompleted', () => {
            this.anticipateAction('gratitude', 'afterCompletion');
        });
    }
    
    setupNavigationAnticipation() {
        // Track page transitions
        document.addEventListener('pageChanged', (e) => {
            this.userContext.currentPage = e.detail.page;
            this.anticipatePageTransition(e.detail.page);
        });
        
        // Track flow progress
        document.addEventListener('flowProgress', (e) => {
            this.anticipateFlowProgress(e.detail);
        });
    }
    
    setupEmotionAnticipation() {
        const emotionBtns = document.querySelectorAll('.emotion-btn');
        emotionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const emotion = e.currentTarget.dataset.emotion;
                this.userContext.emotionState = emotion;
                this.anticipateAction('journal', 'afterEmotion');
            });
        });
    }
    
    anticipateAction(page, trigger) {
        const actions = this.anticipationRules[page]?.[trigger] || [];
        
        actions.forEach(action => {
            switch (action) {
                case 'suggestCompletion':
                    this.suggestJournalCompletion();
                    break;
                case 'showProgress':
                    this.showWritingProgress();
                    break;
                case 'autoSave':
                    this.autoSaveJournal();
                    break;
                case 'suggestPrompts':
                    this.suggestJournalPrompts();
                    break;
                case 'showInsights':
                    this.showWritingInsights();
                    break;
                case 'suggestReflection':
                    this.suggestEmotionReflection();
                    break;
                case 'showRelatedThoughts':
                    this.showRelatedThoughts();
                    break;
                case 'showSummary':
                    this.showJournalSummary();
                    break;
                case 'suggestNextStep':
                    this.suggestNextFlowStep();
                    break;
                case 'showBreathingGuide':
                    this.showBreathingGuidance();
                    break;
                case 'minimizeDistractions':
                    this.minimizeDistractions();
                    break;
                case 'suggestResume':
                    this.suggestTimerResume();
                    break;
                case 'showEncouragement':
                    this.showEncouragement();
                    break;
                case 'showCelebration':
                    this.showTimerCelebration();
                    break;
                case 'autoAdvance':
                    this.autoAdvanceFlow();
                    break;
                case 'suggestMore':
                    this.suggestMoreGratitude();
                    break;
                case 'showPatterns':
                    this.showGratitudePatterns();
                    break;
                case 'showImpact':
                    this.showGratitudeImpact();
                    break;
                case 'suggestSharing':
                    this.suggestGratitudeSharing();
                    break;
            }
        });
    }
    
    anticipateWordCount(wordCount) {
        if (wordCount === 50) {
            this.showMilestone('Halfway to a full reflection!');
        } else if (wordCount === 100) {
            this.showMilestone('Excellent depth of reflection!');
        } else if (wordCount === 150) {
            this.showMilestone('Profound insights emerging...');
        } else if (wordCount > 200) {
            this.showMilestone('Deep wisdom flowing through your words');
        }
    }
    
    anticipateFocus(page) {
        if (page === 'journal') {
            this.showFocusedWritingMode();
            this.prepareWritingEnvironment();
        }
    }
    
    anticipateBlur(page) {
        if (page === 'journal') {
            this.autoSaveJournal();
            this.showBlurEncouragement();
        }
    }
    
    anticipatePageTransition(page) {
        // Prepare next page based on user context
        setTimeout(() => {
            this.preparePageContent(page);
        }, 100);
    }
    
    anticipateFlowProgress(progress) {
        if (progress.completed === 3) {
            this.showFlowCompletion();
        } else if (progress.completed === 2) {
            this.showAlmostDone();
        }
    }
    
    // Journal Anticipation Actions
    suggestJournalCompletion() {
        const textarea = document.getElementById('journal-textarea');
        if (!textarea || textarea.value.trim().length < 20) return;
        
        this.showSubtleMessage('✨ Consider reflecting on how this feels in your body', 'suggestion');
    }
    
    showWritingProgress() {
        const textarea = document.getElementById('journal-textarea');
        if (!textarea) return;
        
        const wordCount = textarea.value.trim().split(/\s+/).filter(word => word.length > 0).length;
        
        if (wordCount > 10 && wordCount % 25 === 0) {
            this.showProgressIndicator(`Words flowing: ${wordCount}`, 'progress');
        }
    }
    
    autoSaveJournal() {
        const textarea = document.getElementById('journal-textarea');
        if (!textarea || !textarea.value.trim()) return;
        
        localStorage.setItem('journal-draft', textarea.value);
        this.showAutoSaveIndicator();
    }
    
    suggestJournalPrompts() {
        const prompts = [
            "What patterns do you notice in your thoughts?",
            "How does this connect to your deeper values?",
            "What would you tell a dear friend in this situation?",
            "What feels most true right now?"
        ];
        
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        this.showPromptSuggestion(randomPrompt);
    }
    
    showWritingInsights() {
        const insights = [
            "Your thoughts are becoming clearer...",
            "Wisdom is emerging through your reflection",
            "You're creating space for deeper understanding"
        ];
        
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        this.showSubtleMessage(randomInsight, 'insight');
    }
    
    suggestEmotionReflection() {
        if (!this.userContext.emotionState) return;
        
        const reflections = {
            joy: "What brought this joy? How can you cultivate more of this?",
            peace: "Notice this peaceful feeling. What does it teach you?",
            gratitude: "Gratitude opens the heart. What else are you grateful for?",
            curiosity: "Curiosity is wisdom in action. What would you like to explore?",
            determination: "This determination has power. How will you channel it?",
            love: "Love is the greatest teacher. What is love showing you?"
        };
        
        const reflection = reflections[this.userContext.emotionState];
        if (reflection) {
            this.showSubtleMessage(reflection, 'reflection');
        }
    }
    
    showRelatedThoughts() {
        const thoughts = [
            "This connects to something deeper within you...",
            "There's wisdom in what you're feeling",
            "Your heart knows the truth of this moment"
        ];
        
        const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
        this.showSubtleMessage(randomThought, 'thought');
    }
    
    showJournalSummary() {
        this.showSubtleMessage('Your reflection has created space for growth 🌱', 'celebration');
    }
    
    // Timer Anticipation Actions
    showBreathingGuidance() {
        this.showSubtleMessage('Breathe naturally. Let your breath guide you into stillness', 'guidance');
    }
    
    minimizeDistractions() {
        // Dim the interface slightly
        document.body.style.filter = 'brightness(0.95)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
    }
    
    suggestTimerResume() {
        this.showSubtleMessage('Your practice is waiting for you. Ready to continue?', 'encouragement');
    }
    
    showEncouragement() {
        const encouragements = [
            "You're doing beautifully",
            "This stillness is precious",
            "Your commitment to practice is inspiring",
            "Peace is flowing through you"
        ];
        
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.showSubtleMessage(randomEncouragement, 'encouragement');
    }
    
    showTimerCelebration() {
        this.showSubtleMessage('✨ Beautiful practice! Your mind is clearer now', 'celebration');
    }
    
    autoAdvanceFlow() {
        setTimeout(() => {
            this.showSubtleMessage('Ready for reflection? Your journal awaits', 'flow');
        }, 3000);
    }
    
    // Gratitude Anticipation Actions
    suggestMoreGratitude() {
        this.showSubtleMessage('What else fills your heart with gratitude today?', 'prompt');
    }
    
    showGratitudePatterns() {
        this.showSubtleMessage('Notice the patterns in what you appreciate', 'insight');
    }
    
    showGratitudeImpact() {
        this.showSubtleMessage('Your gratitude creates ripples of positivity 🌊', 'celebration');
    }
    
    suggestGratitudeSharing() {
        this.showSubtleMessage('Consider sharing this gratitude with someone special', 'suggestion');
    }
    
    // Flow Anticipation Actions
    suggestNextFlowStep() {
        const nextSteps = {
            'meditation': 'Ready for some gentle movement?',
            'journal': 'Time to nurture your body?',
            'workout': 'Your morning flow is complete!'
        };
        
        const nextStep = nextSteps[this.userContext.currentPage];
        if (nextStep) {
            setTimeout(() => {
                this.showSubtleMessage(nextStep, 'flow');
            }, 2000);
        }
    }
    
    showFlowCompletion() {
        this.showSubtleMessage('🎉 Your sacred morning flow is complete! You\'ve nourished mind, heart, and body', 'celebration');
    }
    
    showAlmostDone() {
        this.showSubtleMessage('Almost there! One more step to complete your flow', 'encouragement');
    }
    
    // UI Helper Methods
    showSubtleMessage(message, type = 'info') {
        // Remove existing messages
        const existing = document.querySelector('.anticipation-message');
        if (existing) existing.remove();
        
        const messageEl = document.createElement('div');
        messageEl.className = 'anticipation-message fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm border border-sage-deep/20 rounded-lg px-4 py-2 shadow-lg transition-all duration-300 opacity-0 translate-y-[-10px]';
        
        const typeClasses = {
            suggestion: 'text-sage-deep',
            insight: 'text-forest-deep',
            encouragement: 'text-gold-rich',
            celebration: 'text-forest-deep bg-gold-pale/50',
            guidance: 'text-sage-deep bg-sage-pale/50',
            reflection: 'text-forest-deep bg-forest-pale/50',
            thought: 'text-charcoal bg-linen-white/80',
            prompt: 'text-sage-deep bg-sage-pale/30',
            flow: 'text-forest-deep bg-forest-pale/30',
            progress: 'text-gold-rich bg-gold-pale/30'
        };
        
        messageEl.classList.add(typeClasses[type] || 'text-charcoal');
        messageEl.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-sm font-medium">${message}</span>
                <button class="close-message text-xs opacity-60 hover:opacity-100">×</button>
            </div>
        `;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.classList.remove('opacity-0', 'translate-y-[-10px]');
            messageEl.classList.add('opacity-100', 'translate-y-0');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeMessage(messageEl);
        }, 5000);
        
        // Close button
        messageEl.querySelector('.close-message').addEventListener('click', () => {
            this.removeMessage(messageEl);
        });
    }
    
    removeMessage(messageEl) {
        messageEl.classList.add('opacity-0', 'translate-y-[-10px]');
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }
    
    showMilestone(message) {
        this.showSubtleMessage(message, 'celebration');
    }
    
    showFocusedWritingMode() {
        this.showSubtleMessage('✨ Entering focused writing mode', 'guidance');
    }
    
    prepareWritingEnvironment() {
        // Could dim other elements, adjust lighting, etc.
        document.body.classList.add('writing-mode');
        setTimeout(() => {
            document.body.classList.remove('writing-mode');
        }, 2000);
    }
    
    showBlurEncouragement() {
        this.showSubtleMessage('Your thoughts are saved. Return when ready', 'encouragement');
    }
    
    showAutoSaveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'auto-save-indicator fixed bottom-4 right-4 bg-sage-deep/90 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-300';
        indicator.textContent = 'Auto-saved';
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.classList.add('opacity-100');
        }, 100);
        
        setTimeout(() => {
            indicator.classList.remove('opacity-100');
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }, 2000);
    }
    
    showProgressIndicator(message, type) {
        this.showSubtleMessage(message, type);
    }
    
    showPromptSuggestion(prompt) {
        const promptEl = document.createElement('div');
        promptEl.className = 'prompt-suggestion fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 bg-white/95 backdrop-blur-sm border border-gold-rich/20 rounded-lg p-4 shadow-lg max-w-md text-center transition-all duration-300 opacity-0 translate-y-[10px]';
        promptEl.innerHTML = `
            <div class="text-sm text-charcoal/80 mb-2">💭 Consider this:</div>
            <div class="text-sage-deep font-medium mb-3">${prompt}</div>
            <button class="use-prompt-btn text-xs bg-sage-deep/10 hover:bg-sage-deep/20 text-sage-deep px-3 py-1 rounded transition-colors duration-200">Use this prompt</button>
        `;
        
        document.body.appendChild(promptEl);
        
        setTimeout(() => {
            promptEl.classList.remove('opacity-0', 'translate-y-[10px]');
            promptEl.classList.add('opacity-100', 'translate-y-0');
        }, 100);
        
        // Use prompt button
        promptEl.querySelector('.use-prompt-btn').addEventListener('click', () => {
            const textarea = document.getElementById('journal-textarea');
            if (textarea) {
                textarea.value += '\n\n' + prompt;
                textarea.focus();
                // Trigger input event to update word count and trigger other anticipations
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
            this.removeMessage(promptEl);
        });
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            this.removeMessage(promptEl);
        }, 10000);
    }
    
    preparePageContent(page) {
        // Prepare content based on user context
        switch (page) {
            case 'journal':
                this.restoreJournalDraft();
                break;
            case 'timer':
                this.prepareTimerEnvironment();
                break;
            case 'gratitude':
                this.prepareGratitudeEnvironment();
                break;
        }
    }
    
    restoreJournalDraft() {
        const draft = localStorage.getItem('journal-draft');
        const textarea = document.getElementById('journal-textarea');
        
        if (draft && textarea && !textarea.value) {
            textarea.value = draft;
            this.showSubtleMessage('📝 Your previous thoughts have been restored', 'info');
        }
    }
    
    prepareTimerEnvironment() {
        // Could adjust lighting, sound, etc.
        document.body.classList.add('meditation-mode');
        setTimeout(() => {
            document.body.classList.remove('meditation-mode');
        }, 1000);
    }
    
    prepareGratitudeEnvironment() {
        // Prepare gratitude environment
        document.body.classList.add('gratitude-mode');
        setTimeout(() => {
            document.body.classList.remove('gratitude-mode');
        }, 1000);
    }
    
    trackTypingSpeed() {
        // Simple typing speed tracking
        const now = Date.now();
        if (this.userContext.lastTypingTime) {
            const speed = now - this.userContext.lastTypingTime;
            this.userContext.typingSpeed = (this.userContext.typingSpeed + speed) / 2;
        }
        this.userContext.lastTypingTime = now;
    }
    
    startSessionTracking() {
        this.userContext.sessionStart = Date.now();
        
        // Dispatch session start event
        document.dispatchEvent(new CustomEvent('sessionStarted', {
            detail: { timestamp: this.userContext.sessionStart }
        }));
        
        setInterval(() => {
            this.userContext.sessionDuration = Date.now() - this.userContext.sessionStart;
        }, 1000);
        
        // Track session end on page unload
        window.addEventListener('beforeunload', () => {
            document.dispatchEvent(new CustomEvent('sessionEnded', {
                detail: { timestamp: Date.now() }
            }));
        });
    }
}

// Initialize the anticipation system
document.addEventListener('DOMContentLoaded', () => {
    window.userAnticipation = new UserAnticipationSystem();
});
