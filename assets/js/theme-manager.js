/**
 * Dynamic Theme Manager
 * Handles time-based and mood-adaptive theme switching
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'day';
        this.currentMood = null;
        this.isAutoThemeEnabled = true;
        this.themeTransitionDuration = 800;
        this.init();
    }

    init() {
        console.log('🎨 Initializing Dynamic Theme Manager...');
        this.setupThemeDetection();
        this.setupMoodIntegration();
        this.applyInitialTheme();
        this.startThemeMonitoring();
        console.log('✅ Theme Manager initialized');
    }

    setupThemeDetection() {
        // Time-based theme detection
        this.timeBasedThemes = {
            morning: { start: 5, end: 10, theme: 'morning' },
            day: { start: 10, end: 18, theme: 'day' },
            evening: { start: 18, end: 22, theme: 'evening' },
            night: { start: 22, end: 5, theme: 'night' }
        };

        // Mood-based theme mapping
        this.moodThemes = {
            energized: 'energized',
            calm: 'calm',
            focused: 'focused',
            restful: 'restful'
        };
    }

    setupMoodIntegration() {
        // Listen for mood changes from journal entries
        this.setupMoodListener();
        
        // Check for saved mood data
        this.loadSavedMood();
    }

    setupMoodListener() {
        // Listen for mood tracking events
        window.addEventListener('moodTracked', (event) => {
            this.updateMoodTheme(event.detail.mood);
        });

        // Listen for journal entries that might indicate mood
        window.addEventListener('journalSaved', (event) => {
            this.analyzeJournalMood(event.detail.content);
        });
    }

    loadSavedMood() {
        const savedMood = localStorage.getItem('currentMood');
        if (savedMood) {
            this.currentMood = JSON.parse(savedMood);
            this.updateMoodTheme(this.currentMood);
        }
    }

    analyzeJournalMood(content) {
        // Simple mood analysis based on journal content
        const moodKeywords = {
            energized: ['excited', 'energetic', 'motivated', 'ready', 'powerful', 'strong'],
            calm: ['peaceful', 'serene', 'calm', 'relaxed', 'tranquil', 'quiet'],
            focused: ['concentrated', 'focused', 'determined', 'clear', 'sharp', 'attentive'],
            restful: ['tired', 'rest', 'sleepy', 'gentle', 'soft', 'quiet']
        };

        const contentLower = content.toLowerCase();
        let detectedMood = null;
        let maxMatches = 0;

        for (const [mood, keywords] of Object.entries(moodKeywords)) {
            const matches = keywords.filter(keyword => contentLower.includes(keyword)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedMood = mood;
            }
        }

        if (detectedMood && maxMatches > 0) {
            this.updateMoodTheme(detectedMood);
        }
    }

    getCurrentTimeTheme() {
        const hour = new Date().getHours();
        
        for (const [period, config] of Object.entries(this.timeBasedThemes)) {
            if (config.start <= config.end) {
                // Normal case (e.g., 10-18)
                if (hour >= config.start && hour < config.end) {
                    return config.theme;
                }
            } else {
                // Overnight case (e.g., 22-5)
                if (hour >= config.start || hour < config.end) {
                    return config.theme;
                }
            }
        }
        
        return 'day'; // Default fallback
    }

    applyInitialTheme() {
        const timeTheme = this.getCurrentTimeTheme();
        this.applyTheme(timeTheme, true); // Skip animation on initial load
    }

    applyTheme(themeName, skipAnimation = false) {
        const body = document.body;
        
        // Remove existing theme classes
        const themeClasses = ['theme-morning', 'theme-day', 'theme-evening', 'theme-night'];
        themeClasses.forEach(themeClass => body.classList.remove(themeClass));

        // Add new theme class
        body.classList.add(`theme-${themeName}`);
        
        // Add theme transition class if not skipping animation
        if (!skipAnimation) {
            body.classList.add('theme-transition');
            
            // Remove transition class after animation
            setTimeout(() => {
                body.classList.remove('theme-transition');
            }, this.themeTransitionDuration);
        }

        this.currentTheme = themeName;
        
        // Update theme indicator if exists
        this.updateThemeIndicator();
        
        // Save theme preference
        localStorage.setItem('currentTheme', themeName);
        
        console.log(`🎨 Theme applied: ${themeName}`);
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName, mood: this.currentMood }
        }));
    }

    updateMoodTheme(mood) {
        if (!this.moodThemes[mood]) return;
        
        this.currentMood = mood;
        
        // Save mood data
        localStorage.setItem('currentMood', JSON.stringify(mood));
        
        // Apply mood theme as overlay
        this.applyMoodOverlay(mood);
        
        console.log(`🎭 Mood theme applied: ${mood}`);
    }

    applyMoodOverlay(mood) {
        const body = document.body;
        
        // Remove existing mood classes
        const moodClasses = ['theme-energized', 'theme-calm', 'theme-focused', 'theme-restful'];
        moodClasses.forEach(moodClass => body.classList.remove(moodClass));
        
        // Add new mood class
        body.classList.add(`theme-${mood}`);
        
        // Add transition
        body.classList.add('theme-transition');
        setTimeout(() => {
            body.classList.remove('theme-transition');
        }, this.themeTransitionDuration);
    }

    updateThemeIndicator() {
        const indicator = document.getElementById('theme-indicator');
        if (indicator) {
            const themeEmojis = {
                morning: '🌅',
                day: '☀️',
                evening: '🌆',
                night: '🌙'
            };
            
            const moodEmojis = {
                energized: '⚡',
                calm: '🧘',
                focused: '🎯',
                restful: '😌'
            };
            
            let emoji = themeEmojis[this.currentTheme] || '☀️';
            if (this.currentMood) {
                emoji = moodEmojis[this.currentMood] || emoji;
            }
            
            indicator.textContent = emoji;
        }
    }

    startThemeMonitoring() {
        // Check for theme changes every minute
        setInterval(() => {
            if (this.isAutoThemeEnabled) {
                const newTimeTheme = this.getCurrentTimeTheme();
                if (newTimeTheme !== this.currentTheme) {
                    this.applyTheme(newTimeTheme);
                }
            }
        }, 60000); // Check every minute
        
        // Check for theme changes on visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isAutoThemeEnabled) {
                const newTimeTheme = this.getCurrentTimeTheme();
                if (newTimeTheme !== this.currentTheme) {
                    this.applyTheme(newTimeTheme);
                }
            }
        });
    }

    // Public API methods
    setAutoTheme(enabled) {
        this.isAutoThemeEnabled = enabled;
        localStorage.setItem('autoThemeEnabled', enabled.toString());
        
        if (enabled) {
            this.applyTheme(this.getCurrentTimeTheme());
        }
    }

    setManualTheme(themeName) {
        this.isAutoThemeEnabled = false;
        this.applyTheme(themeName);
    }

    getCurrentTheme() {
        return {
            theme: this.currentTheme,
            mood: this.currentMood,
            isAuto: this.isAutoThemeEnabled
        };
    }

    // Theme customization
    customizeTheme(themeName, customColors) {
        // This could be expanded to allow user customization
        console.log(`🎨 Customizing theme: ${themeName}`, customColors);
    }

    // Export theme data
    exportThemeData() {
        return {
            currentTheme: this.currentTheme,
            currentMood: this.currentMood,
            isAutoThemeEnabled: this.isAutoThemeEnabled,
            timestamp: new Date().toISOString()
        };
    }

    // Reset to default theme
    resetTheme() {
        this.currentMood = null;
        this.isAutoThemeEnabled = true;
        localStorage.removeItem('currentMood');
        localStorage.removeItem('currentTheme');
        this.applyTheme(this.getCurrentTimeTheme());
    }
}

// Initialize theme manager
window.ThemeManager = ThemeManager;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}
