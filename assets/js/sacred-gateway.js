/**
 * Sacred Gateway - The Path of Least Resistance
 * 
 * Implements the Golden Thread System 2.0 and micro-ritual of commitment
 * according to the MorningFlow Codex principles.
 */

class SacredGateway {
    constructor() {
        this.currentIntention = null;
        this.intentionSuggestions = [
            { word: 'Peace', emoji: '🕊️', context: 'inner calm and tranquility' },
            { word: 'Focus', emoji: '🎯', context: 'clarity and purpose' },
            { word: 'Joy', emoji: '✨', context: 'happiness and lightness' },
            { word: 'Strength', emoji: '💪', context: 'resilience and power' },
            { word: 'Wisdom', emoji: '🧠', context: 'understanding and insight' },
            { word: 'Love', emoji: '❤️', context: 'compassion and connection' },
            { word: 'Growth', emoji: '🌱', context: 'learning and development' },
            { word: 'Gratitude', emoji: '🙏', context: 'appreciation and thankfulness' }
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadSmartSuggestion();
        this.checkExistingIntention();
        console.log('🌅 Sacred Gateway initialized');
    }
    
    bindEvents() {
        const intentionInput = document.getElementById('intention-input');
        const suggestionsContainer = document.getElementById('intention-suggestions');
        const sacredFlowBtn = document.getElementById('begin-sacred-flow-btn');
        
        // Intention input events
        if (intentionInput) {
            intentionInput.addEventListener('focus', () => this.showSuggestions());
            intentionInput.addEventListener('blur', (e) => {
                // Delay hiding to allow suggestion clicks
                setTimeout(() => this.hideSuggestions(), 200);
            });
            intentionInput.addEventListener('input', (e) => this.handleIntentionInput(e));
            intentionInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        }
        
        // Suggestion clicks
        if (suggestionsContainer) {
            suggestionsContainer.addEventListener('click', (e) => {
                const suggestion = e.target.closest('.suggestion-item');
                if (suggestion) {
                    const intention = suggestion.dataset.intention;
                    this.selectIntention(intention);
                }
            });
        }
        
        // Sacred flow button
        if (sacredFlowBtn) {
            sacredFlowBtn.addEventListener('click', () => this.beginSacredFlow());
        }
        
        // Smart suggestion generation
        this.generateSmartSuggestions();
    }
    
    generateSmartSuggestions() {
        // Consider day of week, time, weather, and recent patterns
        const now = new Date();
        const dayOfWeek = now.getDay();
        const hour = now.getHours();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isMorning = hour < 12;
        const isEvening = hour >= 18;
        
        // Get recent journal entries for pattern analysis
        const recentEntries = this.getRecentJournalEntries();
        const recentMoods = this.extractMoods(recentEntries);
        
        // Smart suggestions based on context
        let smartSuggestions = [];
        
        if (isWeekend) {
            smartSuggestions = ['Peace', 'Joy', 'Gratitude', 'Love'];
        } else if (isMorning) {
            smartSuggestions = ['Focus', 'Strength', 'Growth', 'Wisdom'];
        } else if (isEvening) {
            smartSuggestions = ['Peace', 'Gratitude', 'Love', 'Joy'];
        } else {
            smartSuggestions = ['Focus', 'Strength', 'Growth', 'Peace'];
        }
        
        // Adjust based on recent moods
        if (recentMoods.includes('anxious') || recentMoods.includes('stressed')) {
            smartSuggestions = ['Peace', 'Gratitude', 'Joy', 'Love'];
        } else if (recentMoods.includes('tired') || recentMoods.includes('low')) {
            smartSuggestions = ['Strength', 'Joy', 'Growth', 'Focus'];
        }
        
        this.smartSuggestions = smartSuggestions.slice(0, 4);
    }
    
    loadSmartSuggestion() {
        const intentionInput = document.getElementById('intention-input');
        if (intentionInput && this.smartSuggestions && this.smartSuggestions.length > 0) {
            const smartSuggestion = this.smartSuggestions[0];
            const suggestionData = this.intentionSuggestions.find(s => s.word === smartSuggestion);
            
            if (suggestionData) {
                intentionInput.placeholder = `${suggestionData.emoji} ${suggestionData.word}`;
            }
        }
    }
    
    checkExistingIntention() {
        const storedIntention = localStorage.getItem('morningFlowGoldenThread');
        if (storedIntention) {
            const today = new Date().toDateString();
            const storedDate = localStorage.getItem('morningFlowGoldenThreadDate');
            
            if (storedDate === today) {
                this.selectIntention(storedIntention);
            }
        }
    }
    
    showSuggestions() {
        const suggestionsContainer = document.getElementById('intention-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.remove('hidden');
            this.populateSmartSuggestions();
        }
    }
    
    hideSuggestions() {
        const suggestionsContainer = document.getElementById('intention-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.add('hidden');
        }
    }
    
    populateSmartSuggestions() {
        const suggestionsContainer = document.getElementById('intention-suggestions');
        if (!suggestionsContainer) return;
        
        // Clear existing suggestions
        suggestionsContainer.innerHTML = '';
        
        // Add smart suggestions first
        this.smartSuggestions.forEach(word => {
            const suggestionData = this.intentionSuggestions.find(s => s.word === word);
            if (suggestionData) {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item px-4 py-3 hover:bg-sage-deep/10 cursor-pointer transition-colors duration-200';
                suggestionItem.dataset.intention = word;
                suggestionItem.innerHTML = `
                    <span class="text-sage-deep">${suggestionData.emoji}</span> ${word}
                `;
                suggestionsContainer.appendChild(suggestionItem);
            }
        });
        
        // Add separator if we have smart suggestions
        if (this.smartSuggestions.length > 0) {
            const separator = document.createElement('div');
            separator.className = 'px-4 py-2 text-xs text-charcoal/40 border-t border-sage-deep/10';
            separator.textContent = 'Or choose your own...';
            suggestionsContainer.appendChild(separator);
        }
        
        // Add all other suggestions
        this.intentionSuggestions.forEach(suggestion => {
            if (!this.smartSuggestions.includes(suggestion.word)) {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item px-4 py-3 hover:bg-sage-deep/10 cursor-pointer transition-colors duration-200';
                suggestionItem.dataset.intention = suggestion.word;
                suggestionItem.innerHTML = `
                    <span class="text-sage-deep">${suggestion.emoji}</span> ${suggestion.word}
                `;
                suggestionsContainer.appendChild(suggestionItem);
            }
        });
    }
    
    handleIntentionInput(event) {
        const value = event.target.value.trim();
        if (value.length > 0) {
            this.enableSacredFlowButton();
        } else {
            this.disableSacredFlowButton();
        }
    }
    
    handleKeydown(event) {
        if (event.key === 'Enter') {
            const value = event.target.value.trim();
            if (value.length > 0) {
                this.selectCustomIntention(value);
            }
        } else if (event.key === 'Escape') {
            this.hideSuggestions();
        }
    }
    
    selectIntention(intentionWord) {
        const intentionData = this.intentionSuggestions.find(s => s.word === intentionWord);
        if (!intentionData) return;
        
        this.currentIntention = intentionData;
        
        // Update input
        const intentionInput = document.getElementById('intention-input');
        if (intentionInput) {
            intentionInput.value = intentionData.word;
        }
        
        // Show golden thread display
        this.showGoldenThread(intentionData);
        
        // Enable sacred flow button
        this.enableSacredFlowButton();
        
        // Hide suggestions
        this.hideSuggestions();
        
        // Store intention
        this.storeIntention(intentionData.word);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        
        console.log(`🧵 Golden Thread set: ${intentionData.word}`);
    }
    
    selectCustomIntention(customWord) {
        this.currentIntention = {
            word: customWord,
            emoji: '✨',
            context: 'your personal intention'
        };
        
        // Show golden thread display
        this.showGoldenThread(this.currentIntention);
        
        // Enable sacred flow button
        this.enableSacredFlowButton();
        
        // Store intention
        this.storeIntention(customWord);
        
        console.log(`🧵 Custom Golden Thread set: ${customWord}`);
    }
    
    showGoldenThread(intentionData) {
        const goldenThreadDisplay = document.getElementById('golden-thread-display');
        const threadWord = document.getElementById('thread-word');
        const threadContext = document.getElementById('thread-context');
        const flowPreview = document.getElementById('flow-preview');
        
        if (goldenThreadDisplay) {
            goldenThreadDisplay.classList.remove('hidden');
        }
        
        if (threadWord) {
            threadWord.textContent = intentionData.word;
        }
        
        if (threadContext) {
            threadContext.textContent = `This intention will guide your ${intentionData.context} today`;
        }
        
        if (flowPreview) {
            flowPreview.classList.remove('hidden');
        }
    }
    
    enableSacredFlowButton() {
        const sacredFlowBtn = document.getElementById('begin-sacred-flow-btn');
        if (sacredFlowBtn) {
            sacredFlowBtn.disabled = false;
            sacredFlowBtn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed');
        }
    }
    
    disableSacredFlowButton() {
        const sacredFlowBtn = document.getElementById('begin-sacred-flow-btn');
        if (sacredFlowBtn) {
            sacredFlowBtn.disabled = true;
            sacredFlowBtn.classList.add('disabled:opacity-50', 'disabled:cursor-not-allowed');
        }
    }
    
    storeIntention(intentionWord) {
        const today = new Date().toDateString();
        localStorage.setItem('morningFlowGoldenThread', intentionWord);
        localStorage.setItem('morningFlowGoldenThreadDate', today);
    }
    
    beginSacredFlow() {
        if (!this.currentIntention) {
            console.warn('⚠️ No intention set');
            return;
        }
        
        // Store the intention for use throughout the flow
        localStorage.setItem('morningFlowCurrentIntention', JSON.stringify(this.currentIntention));
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        // Start the seamless flow
        if (window.seamlessFlowEngine) {
            window.seamlessFlowEngine.startFlow();
        } else {
            // Fallback to timer page
            if (window.navigationManager) {
                window.navigationManager.navigateToPage('timer');
            }
        }
        
        console.log(`🌊 Sacred Flow begun with intention: ${this.currentIntention.word}`);
    }
    
    getRecentJournalEntries() {
        try {
            const entries = JSON.parse(localStorage.getItem('morningFlowJournalEntries') || '[]');
            // Get entries from last 7 days
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            return entries.filter(entry => entry.timestamp > sevenDaysAgo);
        } catch (error) {
            console.error('Error loading journal entries:', error);
            return [];
        }
    }
    
    extractMoods(entries) {
        return entries.map(entry => entry.mood).filter(Boolean);
    }
    
    getCurrentIntention() {
        return this.currentIntention;
    }
    
    getIntentionForContext(context) {
        if (!this.currentIntention) return null;
        
        const intentionWord = this.currentIntention.word;
        
        // Contextual variations
        const contextualIntention = {
            timer: `Meditating on: ${intentionWord}`,
            journal: `Reflecting on: ${intentionWord}`,
            workout: `Exercising with: ${intentionWord}`,
            clarity: `Expressing: ${intentionWord}`,
            gratitude: `Grateful for: ${intentionWord}`
        };
        
        return contextualIntention[context] || intentionWord;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.sacred-gateway')) {
        window.sacredGateway = new SacredGateway();
        console.log('🌅 Sacred Gateway ready');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SacredGateway;
}
