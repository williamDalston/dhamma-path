/**
 * Mirror of Duality 2.0 - The Wisdom Engine
 * 
 * Implements the signature feature that presents two elegant cards containing
 * the user's own past journal entries, selected by AI to tell a meaningful story.
 * This transforms the app from a passive logbook into an active, collaborative
 * partner in self-discovery.
 */

class MirrorOfDuality {
    constructor() {
        this.insights = [];
        this.wisdomCollection = [];
        this.triggerFrequency = 7; // Maximum once per week
        this.lastInsightDate = null;
        
        this.insightTemplates = {
            growth: {
                title: "Notice how your perspective has evolved",
                template: "Your understanding of {topic} has deepened. {timeAgo}, you wrote: '{pastEntry}'. Recently, you reflected: '{recentEntry}'. This evolution shows your growing wisdom.",
                icon: "🌱",
                color: "from-green-400 to-green-600"
            },
            strength: {
                title: "A reflection on your resilience",
                template: "Even on a day you felt {emotion}, you found the strength to write: '{entry}'. This shows your inner power and ability to find light in darkness.",
                icon: "💪",
                color: "from-red-400 to-red-600"
            },
            pattern: {
                title: "We've noticed a beautiful pattern",
                template: "Your feeling of {emotion} often follows days you write about '{theme}'. This connection reveals the deeper rhythms of your inner world.",
                icon: "🔮",
                color: "from-purple-400 to-purple-600"
            },
            gratitude: {
                title: "Your gratitude practice is bearing fruit",
                template: "Your consistent practice of appreciation has created a foundation of joy. {timeAgo}, you wrote: '{entry}'. This gratitude continues to illuminate your path.",
                icon: "✨",
                color: "from-yellow-400 to-yellow-600"
            },
            wisdom: {
                title: "Your own wisdom speaks",
                template: "Sometimes the most profound insights come from within. {timeAgo}, you wrote: '{entry}'. This wisdom still resonates today.",
                icon: "🧠",
                color: "from-indigo-400 to-indigo-600"
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadWisdomCollection();
        this.loadLastInsightDate();
        this.bindEvents();
        console.log('🪞 Mirror of Duality 2.0 initialized');
    }
    
    bindEvents() {
        // Listen for flow completion to potentially trigger insights
        window.addEventListener('flowCompleted', (event) => {
            this.checkForInsightTrigger(event.detail);
        });
        
        // Listen for journal entries to analyze patterns
        window.addEventListener('journalEntrySaved', (event) => {
            this.analyzeNewEntry(event.detail);
        });
    }
    
    checkForInsightTrigger(flowData) {
        if (this.shouldTriggerInsight()) {
            this.generateInsight();
        }
    }
    
    shouldTriggerInsight() {
        // Check if enough time has passed since last insight
        const today = new Date();
        const lastInsight = this.lastInsightDate ? new Date(this.lastInsightDate) : null;
        
        if (lastInsight) {
            const daysSinceLastInsight = Math.floor((today - lastInsight) / (1000 * 60 * 60 * 24));
            if (daysSinceLastInsight < this.triggerFrequency) {
                return false;
            }
        }
        
        // Check if we have enough journal entries for analysis
        const journalEntries = this.getJournalEntries();
        return journalEntries.length >= 5; // Minimum entries for meaningful insights
    }
    
    generateInsight() {
        const journalEntries = this.getJournalEntries();
        const gratitudeEntries = this.getGratitudeEntries();
        
        // Analyze patterns and select insight type
        const insightType = this.selectInsightType(journalEntries, gratitudeEntries);
        
        // Generate the insight
        const insight = this.createInsight(insightType, journalEntries, gratitudeEntries);
        
        if (insight) {
            this.displayInsight(insight);
            this.saveInsight(insight);
            this.updateLastInsightDate();
        }
    }
    
    selectInsightType(journalEntries, gratitudeEntries) {
        // Analyze patterns to determine the most meaningful insight type
        
        // Check for growth patterns (entries with similar themes over time)
        const growthScore = this.calculateGrowthScore(journalEntries);
        
        // Check for strength patterns (resilient entries during difficult times)
        const strengthScore = this.calculateStrengthScore(journalEntries);
        
        // Check for gratitude patterns (consistent gratitude practice)
        const gratitudeScore = this.calculateGratitudeScore(gratitudeEntries);
        
        // Check for emotional patterns (connections between emotions and themes)
        const patternScore = this.calculatePatternScore(journalEntries);
        
        // Check for wisdom patterns (insightful or reflective entries)
        const wisdomScore = this.calculateWisdomScore(journalEntries);
        
        // Select the highest scoring insight type
        const scores = {
            growth: growthScore,
            strength: strengthScore,
            gratitude: gratitudeScore,
            pattern: patternScore,
            wisdom: wisdomScore
        };
        
        const maxScore = Math.max(...Object.values(scores));
        const selectedType = Object.keys(scores).find(key => scores[key] === maxScore);
        
        return selectedType || 'wisdom'; // Default to wisdom if no clear pattern
    }
    
    calculateGrowthScore(entries) {
        // Look for entries with similar themes that show evolution over time
        const themes = this.extractThemes(entries);
        const themeCounts = {};
        
        themes.forEach(theme => {
            themeCounts[theme] = (themeCounts[theme] || 0) + 1;
        });
        
        // Higher score for themes that appear multiple times (indicating growth)
        const recurringThemes = Object.values(themeCounts).filter(count => count > 1).length;
        return recurringThemes * 0.3;
    }
    
    calculateStrengthScore(entries) {
        // Look for entries that show resilience during difficult times
        const strengthKeywords = ['challenge', 'difficult', 'struggle', 'overcome', 'persevere', 'resilient', 'strong'];
        let strengthCount = 0;
        
        entries.forEach(entry => {
            const text = entry.content.toLowerCase();
            if (strengthKeywords.some(keyword => text.includes(keyword))) {
                strengthCount++;
            }
        });
        
        return strengthCount * 0.2;
    }
    
    calculateGratitudeScore(gratitudeEntries) {
        // Look for consistent gratitude practice
        if (gratitudeEntries.length < 3) return 0;
        
        const recentEntries = gratitudeEntries.slice(0, 7); // Last 7 entries
        return recentEntries.length * 0.4;
    }
    
    calculatePatternScore(entries) {
        // Look for emotional patterns and theme connections
        const emotions = this.extractEmotions(entries);
        const themes = this.extractThemes(entries);
        
        // Simple pattern detection: emotions that appear with certain themes
        let patternCount = 0;
        entries.forEach(entry => {
            const text = entry.content.toLowerCase();
            if (text.includes('joy') && (text.includes('connection') || text.includes('love'))) {
                patternCount++;
            }
        });
        
        return patternCount * 0.3;
    }
    
    calculateWisdomScore(entries) {
        // Look for entries that contain reflective or insightful language
        const wisdomKeywords = ['realize', 'understand', 'learn', 'insight', 'wisdom', 'aware', 'reflect'];
        let wisdomCount = 0;
        
        entries.forEach(entry => {
            const text = entry.content.toLowerCase();
            if (wisdomKeywords.some(keyword => text.includes(keyword))) {
                wisdomCount++;
            }
        });
        
        return wisdomCount * 0.25;
    }
    
    createInsight(insightType, journalEntries, gratitudeEntries) {
        const template = this.insightTemplates[insightType];
        if (!template) return null;
        
        let insight;
        
        switch (insightType) {
            case 'growth':
                insight = this.createGrowthInsight(journalEntries, template);
                break;
            case 'strength':
                insight = this.createStrengthInsight(journalEntries, template);
                break;
            case 'pattern':
                insight = this.createPatternInsight(journalEntries, template);
                break;
            case 'gratitude':
                insight = this.createGratitudeInsight(gratitudeEntries, template);
                break;
            case 'wisdom':
                insight = this.createWisdomInsight(journalEntries, template);
                break;
            default:
                insight = this.createWisdomInsight(journalEntries, template);
        }
        
        return insight;
    }
    
    createGrowthInsight(entries, template) {
        // Find entries with similar themes that show evolution
        const themes = this.extractThemes(entries);
        const themeCounts = {};
        
        themes.forEach(theme => {
            themeCounts[theme] = (themeCounts[theme] || 0) + 1;
        });
        
        const recurringTheme = Object.keys(themeCounts).find(theme => themeCounts[theme] > 1);
        
        if (!recurringTheme) return null;
        
        const relatedEntries = entries.filter(entry => 
            entry.content.toLowerCase().includes(recurringTheme)
        ).sort((a, b) => a.timestamp - b.timestamp);
        
        if (relatedEntries.length < 2) return null;
        
        const pastEntry = relatedEntries[0];
        const recentEntry = relatedEntries[relatedEntries.length - 1];
        
        const timeAgo = this.formatTimeAgo(pastEntry.timestamp);
        
        return {
            type: 'growth',
            title: template.title,
            content: template.template
                .replace('{topic}', recurringTheme)
                .replace('{timeAgo}', timeAgo)
                .replace('{pastEntry}', this.truncateEntry(pastEntry.content))
                .replace('{recentEntry}', this.truncateEntry(recentEntry.content)),
            icon: template.icon,
            color: template.color,
            entries: [pastEntry, recentEntry],
            timestamp: Date.now()
        };
    }
    
    createStrengthInsight(entries, template) {
        // Find entries that show resilience during difficult times
        const strengthKeywords = ['challenge', 'difficult', 'struggle', 'overcome'];
        const strengthEntries = entries.filter(entry => 
            strengthKeywords.some(keyword => entry.content.toLowerCase().includes(keyword))
        );
        
        if (strengthEntries.length === 0) return null;
        
        const entry = strengthEntries[0];
        const emotion = this.extractEmotionFromEntry(entry);
        
        return {
            type: 'strength',
            title: template.title,
            content: template.template
                .replace('{emotion}', emotion)
                .replace('{entry}', this.truncateEntry(entry.content)),
            icon: template.icon,
            color: template.color,
            entries: [entry],
            timestamp: Date.now()
        };
    }
    
    createPatternInsight(entries, template) {
        // Look for emotional patterns
        const emotions = this.extractEmotions(entries);
        const themes = this.extractThemes(entries);
        
        // Simple pattern: joy + connection
        const joyEntries = entries.filter(entry => 
            entry.content.toLowerCase().includes('joy') || 
            entry.content.toLowerCase().includes('happy')
        );
        
        if (joyEntries.length === 0) return null;
        
        const entry = joyEntries[0];
        const emotion = 'Joy';
        const theme = 'connection';
        
        return {
            type: 'pattern',
            title: template.title,
            content: template.template
                .replace('{emotion}', emotion)
                .replace('{theme}', theme),
            icon: template.icon,
            color: template.color,
            entries: [entry],
            timestamp: Date.now()
        };
    }
    
    createGratitudeInsight(gratitudeEntries, template) {
        if (gratitudeEntries.length === 0) return null;
        
        const recentEntry = gratitudeEntries[0];
        const timeAgo = this.formatTimeAgo(recentEntry.timestamp);
        
        return {
            type: 'gratitude',
            title: template.title,
            content: template.template
                .replace('{timeAgo}', timeAgo)
                .replace('{entry}', this.truncateGratitudeEntry(recentEntry)),
            icon: template.icon,
            color: template.color,
            entries: [recentEntry],
            timestamp: Date.now()
        };
    }
    
    createWisdomInsight(entries, template) {
        // Find the most insightful entry
        const wisdomKeywords = ['realize', 'understand', 'learn', 'insight'];
        const wisdomEntries = entries.filter(entry => 
            wisdomKeywords.some(keyword => entry.content.toLowerCase().includes(keyword))
        );
        
        const entry = wisdomEntries.length > 0 ? wisdomEntries[0] : entries[0];
        const timeAgo = this.formatTimeAgo(entry.timestamp);
        
        return {
            type: 'wisdom',
            title: template.title,
            content: template.template
                .replace('{timeAgo}', timeAgo)
                .replace('{entry}', this.truncateEntry(entry.content)),
            icon: template.icon,
            color: template.color,
            entries: [entry],
            timestamp: Date.now()
        };
    }
    
    displayInsight(insight) {
        // Create the insight display modal
        const modal = this.createInsightModal(insight);
        document.body.appendChild(modal);
        
        // Show the modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }
    
    createInsightModal(insight) {
        const modal = document.createElement('div');
        modal.className = 'mirror-duality-modal fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="insight-modal bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-sage-deep/20">
                <div class="insight-header text-center mb-6">
                    <div class="insight-icon text-6xl mb-4">${insight.icon}</div>
                    <h2 class="insight-title text-2xl font-serif text-forest-deep mb-2">${insight.title}</h2>
                </div>
                
                <div class="insight-content mb-8">
                    <p class="insight-text text-lg text-charcoal/80 leading-relaxed font-serif">
                        ${insight.content}
                    </p>
                </div>
                
                <div class="insight-actions flex gap-4 justify-center">
                    <button class="save-insight-btn bg-gradient-to-r ${insight.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
                        <span class="mr-2">💾</span>Save This Insight
                    </button>
                    <button class="resonates-btn bg-gradient-to-r from-sage-deep to-forest-deep text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
                        <span class="mr-2">✨</span>This Resonates
                    </button>
                </div>
                
                <button class="close-insight-btn absolute top-4 right-4 w-8 h-8 bg-charcoal/10 rounded-full flex items-center justify-center hover:bg-charcoal/20 transition-colors duration-200">
                    <span class="text-charcoal/60">×</span>
                </button>
            </div>
        `;
        
        // Add event listeners
        const saveBtn = modal.querySelector('.save-insight-btn');
        const resonatesBtn = modal.querySelector('.resonates-btn');
        const closeBtn = modal.querySelector('.close-insight-btn');
        
        saveBtn.addEventListener('click', () => {
            this.saveToWisdomCollection(insight);
            this.closeModal(modal);
        });
        
        resonatesBtn.addEventListener('click', () => {
            this.markInsightAsResonant(insight);
            this.closeModal(modal);
        });
        
        closeBtn.addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        return modal;
    }
    
    closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
    
    saveToWisdomCollection(insight) {
        this.wisdomCollection.push(insight);
        this.saveWisdomCollection();
        console.log('💾 Insight saved to wisdom collection');
    }
    
    markInsightAsResonant(insight) {
        insight.resonant = true;
        insight.resonantTimestamp = Date.now();
        this.saveInsight(insight);
        console.log('✨ Insight marked as resonant');
    }
    
    saveInsight(insight) {
        this.insights.push(insight);
        localStorage.setItem('morningFlowInsights', JSON.stringify(this.insights));
    }
    
    saveWisdomCollection() {
        localStorage.setItem('morningFlowWisdomCollection', JSON.stringify(this.wisdomCollection));
    }
    
    loadWisdomCollection() {
        try {
            this.wisdomCollection = JSON.parse(localStorage.getItem('morningFlowWisdomCollection') || '[]');
        } catch (error) {
            console.error('Error loading wisdom collection:', error);
            this.wisdomCollection = [];
        }
    }
    
    loadLastInsightDate() {
        this.lastInsightDate = localStorage.getItem('morningFlowLastInsightDate');
    }
    
    updateLastInsightDate() {
        this.lastInsightDate = new Date().toISOString();
        localStorage.setItem('morningFlowLastInsightDate', this.lastInsightDate);
    }
    
    getJournalEntries() {
        try {
            return JSON.parse(localStorage.getItem('morningFlowJournalEntries') || '[]');
        } catch (error) {
            console.error('Error loading journal entries:', error);
            return [];
        }
    }
    
    getGratitudeEntries() {
        try {
            return JSON.parse(localStorage.getItem('morningFlowGratitudeEntries') || '[]');
        } catch (error) {
            console.error('Error loading gratitude entries:', error);
            return [];
        }
    }
    
    extractThemes(entries) {
        const themes = [];
        const themeKeywords = {
            'growth': ['grow', 'learn', 'develop', 'progress', 'evolve'],
            'connection': ['connect', 'relationship', 'love', 'family', 'friend'],
            'challenge': ['challenge', 'difficult', 'struggle', 'hard', 'tough'],
            'gratitude': ['grateful', 'thankful', 'appreciate', 'blessed'],
            'peace': ['peace', 'calm', 'tranquil', 'serene', 'quiet'],
            'joy': ['joy', 'happy', 'smile', 'laugh', 'celebrate']
        };
        
        entries.forEach(entry => {
            const text = entry.content.toLowerCase();
            Object.keys(themeKeywords).forEach(theme => {
                if (themeKeywords[theme].some(keyword => text.includes(keyword))) {
                    themes.push(theme);
                }
            });
        });
        
        return themes;
    }
    
    extractEmotions(entries) {
        const emotions = [];
        const emotionKeywords = {
            'joy': ['joy', 'happy', 'smile', 'laugh', 'celebrate'],
            'peace': ['peace', 'calm', 'tranquil', 'serene'],
            'gratitude': ['grateful', 'thankful', 'appreciate'],
            'love': ['love', 'care', 'cherish', 'adore'],
            'strength': ['strong', 'powerful', 'resilient', 'determined']
        };
        
        entries.forEach(entry => {
            const text = entry.content.toLowerCase();
            Object.keys(emotionKeywords).forEach(emotion => {
                if (emotionKeywords[emotion].some(keyword => text.includes(keyword))) {
                    emotions.push(emotion);
                }
            });
        });
        
        return emotions;
    }
    
    extractEmotionFromEntry(entry) {
        const emotions = this.extractEmotions([entry]);
        return emotions[0] || 'challenged';
    }
    
    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'today';
        if (days === 1) return 'yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    }
    
    truncateEntry(content, maxLength = 100) {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    }
    
    truncateGratitudeEntry(entry) {
        if (typeof entry === 'string') {
            return this.truncateEntry(entry);
        }
        
        const entries = entry.entries || [];
        if (entries.length === 0) return 'your gratitude practice';
        
        return entries[0].substring(0, 80) + '...';
    }
    
    analyzeNewEntry(entry) {
        // Analyze the new entry for patterns
        // This could trigger immediate insights for particularly meaningful entries
        console.log('🔍 Analyzing new journal entry for patterns');
    }
    
    // Public methods
    getWisdomCollection() {
        return this.wisdomCollection;
    }
    
    getInsights() {
        return this.insights;
    }
    
    forceInsight() {
        // For testing purposes - force an insight to be generated
        this.generateInsight();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mirrorOfDuality = new MirrorOfDuality();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MirrorOfDuality;
}
