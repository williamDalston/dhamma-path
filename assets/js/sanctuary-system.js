/**
 * Sanctuary System - Deepening the Sanctuaries
 * 
 * Implements the Timer, Journal, and Gratitude sanctuaries according to
 * the MorningFlow Codex Pillar II: Deepening the Sanctuaries
 */

class SanctuarySystem {
    constructor() {
        this.currentIntention = null;
        this.init();
    }
    
    init() {
        this.loadGoldenThread();
        this.bindEvents();
        console.log('🏛️ Sanctuary System initialized');
    }
    
    loadGoldenThread() {
        try {
            const storedIntention = localStorage.getItem('morningFlowCurrentIntention');
            if (storedIntention) {
                this.currentIntention = JSON.parse(storedIntention);
                this.updateGoldenThreadLabels();
            }
        } catch (error) {
            console.error('Error loading Golden Thread:', error);
        }
    }
    
    updateGoldenThreadLabels() {
        if (!this.currentIntention) return;
        
        const intentionWord = this.currentIntention.word;
        
        // Update Timer Sanctuary
        const timerThreadWord = document.getElementById('timer-thread-word');
        if (timerThreadWord) {
            timerThreadWord.textContent = intentionWord;
        }
        
        // Update Journal Sanctuary
        const journalThreadWord = document.getElementById('journal-thread-word');
        const journalWatermark = document.getElementById('watermark-text');
        if (journalThreadWord) {
            journalThreadWord.textContent = intentionWord;
        }
        if (journalWatermark) {
            journalWatermark.textContent = intentionWord;
        }
        
        // Update Gratitude Sanctuary
        const gratitudeThreadWord = document.getElementById('gratitude-thread-word');
        const gratitudeContext = document.getElementById('gratitude-context');
        if (gratitudeThreadWord) {
            gratitudeThreadWord.textContent = intentionWord;
        }
        if (gratitudeContext) {
            const contextualPrompts = {
                'Peace': 'What brought you calm today?',
                'Focus': 'What helped you concentrate today?',
                'Joy': 'What made you smile today?',
                'Strength': 'What made you feel powerful today?',
                'Wisdom': 'What did you learn today?',
                'Love': 'What touched your heart today?',
                'Growth': 'How did you grow today?',
                'Gratitude': 'What are you most thankful for today?'
            };
            gratitudeContext.textContent = contextualPrompts[intentionWord] || 'What brought you light today?';
        }
    }
    
    bindEvents() {
        // Timer Sanctuary Events
        this.bindTimerEvents();
        
        // Journal Sanctuary Events
        this.bindJournalEvents();
        
        // Gratitude Sanctuary Events
        this.bindGratitudeEvents();
    }
    
    bindTimerEvents() {
        const startBtn = document.getElementById('timer-start-btn');
        const pauseBtn = document.getElementById('timer-pause-btn');
        const resetBtn = document.getElementById('timer-reset-btn');
        const adjustBtns = document.querySelectorAll('.duration-adjust-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startTimer());
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseTimer());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetTimer());
        }
        
        adjustBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const adjust = parseInt(e.target.dataset.adjust);
                this.adjustTimerDuration(adjust);
            });
        });
    }
    
    bindJournalEvents() {
        // Breathing preparation
        const breathingPrep = document.getElementById('breathing-preparation');
        if (breathingPrep) {
            // Auto-hide after 3 seconds
            setTimeout(() => {
                breathingPrep.style.display = 'none';
                this.showJournalContent();
            }, 3000);
        }
        
        // Emotion wheel
        const emotionBtns = document.querySelectorAll('.emotion-btn');
        emotionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const emotion = e.currentTarget.dataset.emotion;
                this.selectEmotion(emotion, e.currentTarget);
            });
        });
        
        // Journal textarea
        const textarea = document.getElementById('journal-textarea');
        if (textarea) {
            textarea.addEventListener('input', () => this.updateWordCount());
            textarea.addEventListener('focus', () => this.activateWatermark());
            textarea.addEventListener('blur', () => this.deactivateWatermark());
        }
        
        // Complete button
        const completeBtn = document.getElementById('journal-complete-btn');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => this.completeJournal());
        }
    }
    
    bindGratitudeEvents() {
        const gratitudeInputs = document.querySelectorAll('.gratitude-input');
        const illuminateBtn = document.getElementById('illuminate-btn');
        
        gratitudeInputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                this.handleGratitudeInput(input, index);
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.focusNextGratitudeInput(index);
                }
            });
        });
        
        if (illuminateBtn) {
            illuminateBtn.addEventListener('click', () => this.illuminateGratitude());
        }
    }
    
    // Timer Sanctuary Methods
    startTimer() {
        const startBtn = document.getElementById('timer-start-btn');
        const hiddenControls = document.getElementById('hidden-controls');
        const preTips = document.getElementById('pre-meditation-tips');
        
        if (startBtn) {
            startBtn.textContent = 'Meditating...';
            startBtn.disabled = true;
        }
        
        if (hiddenControls) {
            hiddenControls.classList.remove('hidden');
        }
        
        if (preTips) {
            preTips.classList.remove('hidden');
            setTimeout(() => {
                preTips.classList.add('hidden');
            }, 3000);
        }
        
        // Start actual timer logic here
        console.log('🧘 Timer started');
    }
    
    pauseTimer() {
        console.log('⏸️ Timer paused');
    }
    
    resetTimer() {
        const startBtn = document.getElementById('timer-start-btn');
        const hiddenControls = document.getElementById('hidden-controls');
        
        if (startBtn) {
            startBtn.textContent = 'Begin Meditation';
            startBtn.disabled = false;
        }
        
        if (hiddenControls) {
            hiddenControls.classList.add('hidden');
        }
        
        console.log('🔄 Timer reset');
    }
    
    adjustTimerDuration(seconds) {
        console.log(`⏱️ Timer adjusted by ${seconds} seconds`);
    }
    
    // Journal Sanctuary Methods
    showJournalContent() {
        const journalContent = document.querySelector('.journal-content');
        if (journalContent) {
            journalContent.style.opacity = '1';
            journalContent.style.transform = 'translateY(0)';
        }
    }
    
    selectEmotion(emotion, button) {
        // Remove previous selection
        document.querySelectorAll('.emotion-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Select current emotion
        button.classList.add('selected');
        
        // Show selected emotion
        const selectedEmotion = document.getElementById('selected-emotion');
        const emotionDisplay = document.getElementById('emotion-display');
        
        if (selectedEmotion) {
            selectedEmotion.classList.remove('hidden');
        }
        
        if (emotionDisplay) {
            const emotionEmojis = {
                'joy': '😊',
                'peace': '😌',
                'gratitude': '🙏',
                'curiosity': '🤔',
                'determination': '💪',
                'love': '❤️'
            };
            emotionDisplay.textContent = `${emotionEmojis[emotion]} ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`;
        }
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        console.log(`🎭 Emotion selected: ${emotion}`);
    }
    
    updateWordCount() {
        const textarea = document.getElementById('journal-textarea');
        const wordCount = document.getElementById('word-count');
        const charCount = document.getElementById('char-count');
        
        if (textarea) {
            const text = textarea.value;
            const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
            const chars = text.length;
            
            if (wordCount) {
                wordCount.textContent = `${words} words`;
            }
            if (charCount) {
                charCount.textContent = `${chars} characters`;
            }
        }
    }
    
    activateWatermark() {
        const watermark = document.getElementById('golden-thread-watermark');
        if (watermark) {
            watermark.classList.add('active');
        }
    }
    
    deactivateWatermark() {
        const watermark = document.getElementById('golden-thread-watermark');
        if (watermark) {
            watermark.classList.remove('active');
        }
    }
    
    completeJournal() {
        const textarea = document.getElementById('journal-textarea');
        const selahCompletion = document.getElementById('selah-completion');
        
        if (textarea && textarea.value.trim()) {
            // Save journal entry
            this.saveJournalEntry(textarea.value);
            
            // Show Selah completion ritual
            if (selahCompletion) {
                selahCompletion.classList.remove('hidden');
                
                // Auto-continue after 4 seconds
                setTimeout(() => {
                    this.continueFlow();
                }, 4000);
            }
        }
        
        console.log('📝 Journal completed');
    }
    
    saveJournalEntry(content) {
        try {
            const entries = JSON.parse(localStorage.getItem('morningFlowJournalEntries') || '[]');
            const newEntry = {
                content: content,
                timestamp: Date.now(),
                intention: this.currentIntention?.word || 'Unknown'
            };
            
            entries.unshift(newEntry);
            localStorage.setItem('morningFlowJournalEntries', JSON.stringify(entries));
        } catch (error) {
            console.error('Error saving journal entry:', error);
        }
    }
    
    // Gratitude Sanctuary Methods
    handleGratitudeInput(input, index) {
        const nextInput = document.getElementById(`gratitude-input-${index + 2}`);
        const illuminateBtn = document.getElementById('illuminate-btn');
        
        // Reveal next input if current has content
        if (input.value.trim() && nextInput) {
            const nextContainer = nextInput.closest('.gratitude-input-container');
            if (nextContainer) {
                nextContainer.classList.add('revealed');
            }
        }
        
        // Enable illuminate button if all inputs have content
        const allInputs = document.querySelectorAll('.gratitude-input');
        const allFilled = Array.from(allInputs).every(input => input.value.trim());
        
        if (illuminateBtn) {
            illuminateBtn.disabled = !allFilled;
        }
    }
    
    focusNextGratitudeInput(currentIndex) {
        const nextInput = document.getElementById(`gratitude-input-${currentIndex + 2}`);
        if (nextInput) {
            nextInput.focus();
        }
    }
    
    illuminateGratitude() {
        const illuminateBtn = document.getElementById('illuminate-btn');
        const lightsAnimation = document.getElementById('lights-animation');
        
        if (illuminateBtn) {
            illuminateBtn.textContent = 'Illuminating...';
            illuminateBtn.disabled = true;
        }
        
        if (lightsAnimation) {
            lightsAnimation.classList.remove('hidden');
        }
        
        // Save gratitude entries
        this.saveGratitudeEntries();
        
        // Continue flow after animation
        setTimeout(() => {
            this.continueFlow();
        }, 3000);
        
        console.log('✨ Gratitude illuminated');
    }
    
    saveGratitudeEntries() {
        try {
            const entries = [];
            for (let i = 1; i <= 3; i++) {
                const input = document.getElementById(`gratitude-input-${i}`);
                if (input && input.value.trim()) {
                    entries.push(input.value.trim());
                }
            }
            
            const gratitudeData = {
                entries: entries,
                timestamp: Date.now(),
                intention: this.currentIntention?.word || 'Unknown'
            };
            
            localStorage.setItem('morningFlowGratitudeEntries', JSON.stringify(gratitudeData));
        } catch (error) {
            console.error('Error saving gratitude entries:', error);
        }
    }
    
    continueFlow() {
        // Continue to next step in the flow
        if (window.seamlessFlowEngine) {
            window.seamlessFlowEngine.continueFlow();
        } else {
            // Fallback navigation
            if (window.navigationManager) {
                window.navigationManager.navigateToPage('home');
            }
        }
        
        console.log('🌊 Flow continued');
    }
    
    // Public methods for external access
    getCurrentIntention() {
        return this.currentIntention;
    }
    
    updateIntention(newIntention) {
        this.currentIntention = newIntention;
        this.updateGoldenThreadLabels();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're in a sanctuary page
    const sanctuaryPages = ['timer', 'journal', 'gratitude'];
    const currentPage = document.body.dataset.page || window.location.pathname.split('/').pop().replace('.html', '');
    
    if (sanctuaryPages.includes(currentPage)) {
        window.sanctuarySystem = new SanctuarySystem();
        console.log(`🏛️ ${currentPage} Sanctuary initialized`);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SanctuarySystem;
}
