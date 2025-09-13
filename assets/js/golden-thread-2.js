/**
 * Golden Thread System 2.0 - Narrative Anchor
 * 
 * Implements the refined Golden Thread system that weaves the user's
 * intention contextually throughout every sanctuary, creating narrative
 * coherence and personal meaning.
 */

class GoldenThreadSystem {
    constructor() {
        this.currentIntention = null;
        this.contextualVariations = {
            timer: {
                'Peace': 'Finding inner calm',
                'Focus': 'Centering your attention',
                'Joy': 'Embracing lightness',
                'Strength': 'Building inner power',
                'Wisdom': 'Seeking understanding',
                'Love': 'Opening your heart',
                'Growth': 'Nurturing development',
                'Gratitude': 'Appreciating abundance'
            },
            journal: {
                'Peace': 'Reflecting on tranquility',
                'Focus': 'Exploring clarity',
                'Joy': 'Capturing happiness',
                'Strength': 'Recognizing power',
                'Wisdom': 'Discovering insights',
                'Love': 'Feeling connection',
                'Growth': 'Tracking progress',
                'Gratitude': 'Acknowledging gifts'
            },
            workout: {
                'Peace': 'Moving with grace',
                'Focus': 'Building discipline',
                'Joy': 'Celebrating energy',
                'Strength': 'Developing power',
                'Wisdom': 'Learning through movement',
                'Love': 'Caring for your body',
                'Growth': 'Pushing boundaries',
                'Gratitude': 'Honoring your strength'
            },
            gratitude: {
                'Peace': 'What brought you calm?',
                'Focus': 'What helped you concentrate?',
                'Joy': 'What made you smile?',
                'Strength': 'What made you feel powerful?',
                'Wisdom': 'What did you learn?',
                'Love': 'What touched your heart?',
                'Growth': 'How did you grow?',
                'Gratitude': 'What are you most thankful for?'
            },
            clarity: {
                'Peace': 'Expressing serenity',
                'Focus': 'Speaking with purpose',
                'Joy': 'Sharing happiness',
                'Strength': 'Voicing confidence',
                'Wisdom': 'Articulating insights',
                'Love': 'Speaking from the heart',
                'Growth': 'Declaring intentions',
                'Gratitude': 'Giving thanks aloud'
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadCurrentIntention();
        this.bindEvents();
        this.startContextualWeaving();
        console.log('🧵 Golden Thread System 2.0 initialized');
    }
    
    loadCurrentIntention() {
        try {
            const storedIntention = localStorage.getItem('morningFlowCurrentIntention');
            if (storedIntention) {
                this.currentIntention = JSON.parse(storedIntention);
                console.log(`🧵 Loaded intention: ${this.currentIntention.word}`);
            }
        } catch (error) {
            console.error('Error loading Golden Thread intention:', error);
        }
    }
    
    bindEvents() {
        // Listen for intention updates from Sacred Gateway
        window.addEventListener('intentionSet', (event) => {
            this.currentIntention = event.detail;
            this.updateAllContextualWeaving();
            this.saveIntention();
        });
        
        // Listen for page changes to update contextual weaving
        window.addEventListener('pageChanged', (event) => {
            this.updateContextualWeaving(event.detail.page);
        });
    }
    
    startContextualWeaving() {
        if (this.currentIntention) {
            this.updateAllContextualWeaving();
        }
    }
    
    updateAllContextualWeaving() {
        const pages = ['timer', 'journal', 'workout', 'gratitude', 'clarity'];
        pages.forEach(page => {
            this.updateContextualWeaving(page);
        });
    }
    
    updateContextualWeaving(page) {
        if (!this.currentIntention) return;
        
        const intentionWord = this.currentIntention.word;
        const contextualVariation = this.contextualVariations[page]?.[intentionWord];
        
        if (!contextualVariation) return;
        
        // Update page-specific elements
        switch (page) {
            case 'timer':
                this.updateTimerContext(intentionWord, contextualVariation);
                break;
            case 'journal':
                this.updateJournalContext(intentionWord, contextualVariation);
                break;
            case 'workout':
                this.updateWorkoutContext(intentionWord, contextualVariation);
                break;
            case 'gratitude':
                this.updateGratitudeContext(intentionWord, contextualVariation);
                break;
            case 'clarity':
                this.updateClarityContext(intentionWord, contextualVariation);
                break;
        }
    }
    
    updateTimerContext(intentionWord, variation) {
        const threadWord = document.getElementById('timer-thread-word');
        const threadLabel = document.getElementById('timer-thread-label');
        const timerStatus = document.getElementById('timer-status');
        
        if (threadWord) {
            threadWord.textContent = intentionWord;
        }
        
        if (threadLabel) {
            threadLabel.innerHTML = `${variation}: <span class="thread-word text-sage-deep font-semibold">${intentionWord}</span>`;
        }
        
        if (timerStatus) {
            timerStatus.textContent = `Ready to begin ${variation.toLowerCase()}`;
        }
    }
    
    updateJournalContext(intentionWord, variation) {
        const threadWord = document.getElementById('journal-thread-word');
        const threadLabel = document.getElementById('journal-thread-label');
        const watermark = document.getElementById('watermark-text');
        const placeholder = document.getElementById('journal-textarea');
        
        if (threadWord) {
            threadWord.textContent = intentionWord;
        }
        
        if (threadLabel) {
            threadLabel.innerHTML = `${variation}: <span class="thread-word text-sage-deep font-semibold">${intentionWord}</span>`;
        }
        
        if (watermark) {
            watermark.textContent = intentionWord;
        }
        
        if (placeholder) {
            placeholder.placeholder = `Begin ${variation.toLowerCase()}... Let your heart speak freely.`;
        }
    }
    
    updateWorkoutContext(intentionWord, variation) {
        const workoutTitle = document.querySelector('.workout-title');
        const workoutSubtitle = document.querySelector('.workout-subtitle');
        
        if (workoutTitle) {
            workoutTitle.innerHTML = `Exercise for <span class="text-sage-deep">${intentionWord}</span>`;
        }
        
        if (workoutSubtitle) {
            workoutSubtitle.textContent = variation;
        }
    }
    
    updateGratitudeContext(intentionWord, variation) {
        const threadWord = document.getElementById('gratitude-thread-word');
        const threadLabel = document.getElementById('gratitude-thread-label');
        const contextText = document.getElementById('gratitude-context');
        
        if (threadWord) {
            threadWord.textContent = intentionWord;
        }
        
        if (threadLabel) {
            threadLabel.innerHTML = `Grateful for: <span class="thread-word text-sage-deep font-semibold">${intentionWord}</span>`;
        }
        
        if (contextText) {
            contextText.textContent = variation;
        }
    }
    
    updateClarityContext(intentionWord, variation) {
        const clarityTitle = document.querySelector('.clarity-title');
        const claritySubtitle = document.querySelector('.clarity-subtitle');
        
        if (clarityTitle) {
            clarityTitle.innerHTML = `Voice for <span class="text-sage-deep">${intentionWord}</span>`;
        }
        
        if (claritySubtitle) {
            claritySubtitle.textContent = variation;
        }
    }
    
    getContextualPrompt(context, intentionWord) {
        const prompts = {
            journal: {
                'Peace': 'What moments brought you tranquility today?',
                'Focus': 'Where did you find clarity today?',
                'Joy': 'What sparked happiness in your heart today?',
                'Strength': 'How did you demonstrate resilience today?',
                'Wisdom': 'What insights emerged for you today?',
                'Love': 'How did you experience connection today?',
                'Growth': 'In what ways did you evolve today?',
                'Gratitude': 'What gifts are you most thankful for today?'
            },
            workout: {
                'Peace': 'Move with gentle, flowing motions',
                'Focus': 'Channel your energy with precision',
                'Joy': 'Let your body express happiness',
                'Strength': 'Build power with each movement',
                'Wisdom': 'Learn from your body\'s responses',
                'Love': 'Care for your body with compassion',
                'Growth': 'Push beyond your comfort zone',
                'Gratitude': 'Honor your body\'s capabilities'
            },
            clarity: {
                'Peace': 'Speak about what brings you calm',
                'Focus': 'Express your deepest intentions',
                'Joy': 'Share what makes your heart sing',
                'Strength': 'Voice your inner power',
                'Wisdom': 'Articulate your insights',
                'Love': 'Speak from your heart',
                'Growth': 'Declare your aspirations',
                'Gratitude': 'Give thanks with your voice'
            }
        };
        
        return prompts[context]?.[intentionWord] || `Explore your relationship with ${intentionWord.toLowerCase()}`;
    }
    
    createIntentionStory() {
        if (!this.currentIntention) return null;
        
        const intentionWord = this.currentIntention.word;
        const stories = {
            'Peace': 'Today, you seek the quiet spaces within, the moments of stillness that bring clarity to your mind and calm to your heart.',
            'Focus': 'Today, you channel your energy with precision, cutting through distractions to find what truly matters.',
            'Joy': 'Today, you embrace the lightness of being, allowing happiness to flow through your experiences.',
            'Strength': 'Today, you recognize your inner power, building resilience through each challenge you face.',
            'Wisdom': 'Today, you seek understanding, learning from each experience and growing in insight.',
            'Love': 'Today, you open your heart to connection, both with yourself and with others.',
            'Growth': 'Today, you embrace change and evolution, stepping into your becoming.',
            'Gratitude': 'Today, you acknowledge the abundance in your life, finding joy in appreciation.'
        };
        
        return stories[intentionWord] || `Today, you explore the essence of ${intentionWord.toLowerCase()}.`;
    }
    
    getIntentionColor(intentionWord) {
        const colors = {
            'Peace': 'from-blue-400 to-blue-600',
            'Focus': 'from-purple-400 to-purple-600',
            'Joy': 'from-yellow-400 to-yellow-600',
            'Strength': 'from-red-400 to-red-600',
            'Wisdom': 'from-indigo-400 to-indigo-600',
            'Love': 'from-pink-400 to-pink-600',
            'Growth': 'from-green-400 to-green-600',
            'Gratitude': 'from-orange-400 to-orange-600'
        };
        
        return colors[intentionWord] || 'from-sage-deep to-forest-deep';
    }
    
    saveIntention() {
        if (this.currentIntention) {
            localStorage.setItem('morningFlowCurrentIntention', JSON.stringify(this.currentIntention));
            
            // Also save to daily intentions log
            this.logDailyIntention();
        }
    }
    
    logDailyIntention() {
        try {
            const today = new Date().toDateString();
            const dailyIntentions = JSON.parse(localStorage.getItem('morningFlowDailyIntentions') || '{}');
            
            if (!dailyIntentions[today]) {
                dailyIntentions[today] = {
                    intention: this.currentIntention.word,
                    timestamp: Date.now(),
                    context: this.currentIntention.context || 'your personal intention'
                };
                
                localStorage.setItem('morningFlowDailyIntentions', JSON.stringify(dailyIntentions));
            }
        } catch (error) {
            console.error('Error logging daily intention:', error);
        }
    }
    
    getIntentionHistory() {
        try {
            return JSON.parse(localStorage.getItem('morningFlowDailyIntentions') || '{}');
        } catch (error) {
            console.error('Error loading intention history:', error);
            return {};
        }
    }
    
    getIntentionPatterns() {
        const history = this.getIntentionHistory();
        const intentions = Object.values(history).map(entry => entry.intention);
        
        // Calculate frequency
        const frequency = {};
        intentions.forEach(intention => {
            frequency[intention] = (frequency[intention] || 0) + 1;
        });
        
        // Find most common intention
        const mostCommon = Object.keys(frequency).reduce((a, b) => 
            frequency[a] > frequency[b] ? a : b
        );
        
        return {
            mostCommon,
            frequency,
            totalDays: intentions.length,
            uniqueIntentions: Object.keys(frequency).length
        };
    }
    
    // Public methods for external access
    getCurrentIntention() {
        return this.currentIntention;
    }
    
    setIntention(intention) {
        this.currentIntention = intention;
        this.updateAllContextualWeaving();
        this.saveIntention();
        
        // Dispatch event for other systems
        window.dispatchEvent(new CustomEvent('intentionSet', {
            detail: intention
        }));
    }
    
    getContextualVariation(page) {
        if (!this.currentIntention) return null;
        return this.contextualVariations[page]?.[this.currentIntention.word];
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.goldenThreadSystem = new GoldenThreadSystem();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoldenThreadSystem;
}
