/**
 * Haptic Storytelling System
 * Creates narrative through touch, motion, and ambient feedback
 */

class HapticStorytelling {
    constructor() {
        this.isEnabled = true;
        this.intensity = 'medium';
        this.storyContext = {
            currentActivity: null,
            activityPhase: 'idle',
            userMood: 'neutral',
            timeOfDay: 'day'
        };
        
        this.hapticPatterns = {
            meditation: {
                start: [100, 50, 100],
                breathing: [50],
                transition: [200],
                complete: [100, 100, 100]
            },
            journal: {
                start: [80],
                writing: [30],
                save: [100, 50],
                complete: [150, 100, 150]
            },
            workout: {
                start: [200],
                exercise: [100],
                rest: [50, 50, 50],
                complete: [300, 100, 300]
            },
            clarity: {
                start: [120],
                recording: [40],
                playback: [60, 60],
                complete: [180, 100, 180]
            }
        };
        
        this.ambientPatterns = {
            meditation: {
                breathing: { duration: 4000, intensity: 'gentle' },
                bell: { duration: 2000, intensity: 'soft' },
                chime: { duration: 3000, intensity: 'medium' }
            },
            journal: {
                writing: { duration: 500, intensity: 'subtle' },
                thinking: { duration: 2000, intensity: 'gentle' },
                inspiration: { duration: 1500, intensity: 'medium' }
            },
            workout: {
                energy: { duration: 1000, intensity: 'strong' },
                rhythm: { duration: 2000, intensity: 'medium' },
                achievement: { duration: 3000, intensity: 'strong' }
            },
            clarity: {
                focus: { duration: 800, intensity: 'medium' },
                confidence: { duration: 1200, intensity: 'strong' },
                clarity: { duration: 2000, intensity: 'gentle' }
            }
        };
        
        this.init();
    }

    init() {
        console.log('🎭 Initializing Haptic Storytelling System...');
        this.setupHapticSupport();
        this.setupAmbientFeedback();
        this.setupActivityListeners();
        this.setupContextAwareness();
        console.log('✅ Haptic Storytelling System initialized');
    }

    setupHapticSupport() {
        // Check for haptic support
        this.hasHapticSupport = 'vibrate' in navigator;
        
        if (this.hasHapticSupport) {
            console.log('📳 Haptic feedback supported');
        } else {
            console.log('📳 Haptic feedback not supported, using visual feedback');
        }
        
        // Setup haptic intensity preferences
        this.loadHapticPreferences();
    }

    setupAmbientFeedback() {
        // Setup ambient visual feedback
        this.setupAmbientVisuals();
        
        // Setup audio feedback (if available)
        this.setupAudioFeedback();
        
        // Setup screen brightness/color feedback
        this.setupScreenFeedback();
    }

    setupActivityListeners() {
        // Listen for activity events
        window.addEventListener('activityStarted', (event) => {
            this.onActivityStarted(event.detail);
        });
        
        window.addEventListener('activityPhaseChanged', (event) => {
            this.onActivityPhaseChanged(event.detail);
        });
        
        window.addEventListener('activityCompleted', (event) => {
            this.onActivityCompleted(event.detail);
        });
        
        // Listen for user interaction events
        window.addEventListener('userInteraction', (event) => {
            this.onUserInteraction(event.detail);
        });
    }

    setupContextAwareness() {
        // Listen for mood changes
        window.addEventListener('moodChanged', (event) => {
            this.storyContext.userMood = event.detail.mood;
        });
        
        // Listen for time changes
        window.addEventListener('timeChanged', (event) => {
            this.storyContext.timeOfDay = event.detail.timeOfDay;
        });
        
        // Listen for theme changes
        window.addEventListener('themeChanged', (event) => {
            this.adjustHapticIntensity(event.detail.theme);
        });
    }

    setupAmbientVisuals() {
        // Create ambient visual feedback container
        this.ambientContainer = document.createElement('div');
        this.ambientContainer.className = 'ambient-feedback';
        this.ambientContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(this.ambientContainer);
    }

    setupAudioFeedback() {
        // Setup audio context for ambient sounds
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audioEnabled = true;
        } catch (error) {
            console.log('🔊 Audio feedback not available');
            this.audioEnabled = false;
        }
    }

    setupScreenFeedback() {
        // Setup screen brightness/color feedback
        this.screenFeedback = {
            brightness: 1.0,
            color: { r: 255, g: 255, b: 255 }
        };
    }

    // Activity Event Handlers
    onActivityStarted(activity) {
        this.storyContext.currentActivity = activity.type;
        this.storyContext.activityPhase = 'starting';
        
        this.tellStory('start', activity.type);
        this.startAmbientFeedback(activity.type);
    }

    onActivityPhaseChanged(phase) {
        this.storyContext.activityPhase = phase.type;
        
        this.tellStory('phase', phase.type);
        this.updateAmbientFeedback(phase.type);
    }

    onActivityCompleted(activity) {
        this.storyContext.activityPhase = 'completed';
        
        this.tellStory('complete', activity.type);
        this.completeAmbientFeedback(activity.type);
        
        // Reset context after delay
        setTimeout(() => {
            this.resetStoryContext();
        }, 3000);
    }

    onUserInteraction(interaction) {
        // Provide immediate haptic feedback for user interactions
        this.provideImmediateFeedback(interaction.type, interaction.intensity);
    }

    // Storytelling Methods
    tellStory(event, activity) {
        const story = this.createStory(event, activity);
        this.executeStory(story);
    }

    createStory(event, activity) {
        const basePattern = this.hapticPatterns[activity] || this.hapticPatterns.meditation;
        const ambientPattern = this.ambientPatterns[activity] || this.ambientPatterns.meditation;
        
        let story = {
            haptic: [],
            ambient: null,
            visual: null,
            audio: null
        };
        
        switch (event) {
            case 'start':
                story.haptic = basePattern.start;
                story.ambient = ambientPattern.breathing || ambientPattern.energy;
                break;
            case 'phase':
                story.haptic = basePattern.exercise || basePattern.writing || basePattern.recording;
                story.ambient = ambientPattern.rhythm || ambientPattern.thinking || ambientPattern.focus;
                break;
            case 'complete':
                story.haptic = basePattern.complete;
                story.ambient = ambientPattern.achievement || ambientPattern.clarity || ambientPattern.inspiration;
                break;
        }
        
        // Adjust story based on context
        story = this.adjustStoryForContext(story);
        
        return story;
    }

    adjustStoryForContext(story) {
        // Adjust based on user mood
        switch (this.storyContext.userMood) {
            case 'energized':
                story.haptic = story.haptic.map(v => Math.min(v * 1.2, 300));
                break;
            case 'calm':
                story.haptic = story.haptic.map(v => Math.max(v * 0.8, 20));
                break;
            case 'focused':
                story.haptic = story.haptic.map(v => Math.min(v * 1.1, 250));
                break;
            case 'restful':
                story.haptic = story.haptic.map(v => Math.max(v * 0.7, 15));
                break;
        }
        
        // Adjust based on time of day
        switch (this.storyContext.timeOfDay) {
            case 'morning':
                story.haptic = story.haptic.map(v => Math.min(v * 1.1, 280));
                break;
            case 'evening':
                story.haptic = story.haptic.map(v => Math.max(v * 0.9, 25));
                break;
            case 'night':
                story.haptic = story.haptic.map(v => Math.max(v * 0.6, 15));
                break;
        }
        
        return story;
    }

    executeStory(story) {
        // Execute haptic feedback
        if (story.haptic && story.haptic.length > 0) {
            this.executeHapticPattern(story.haptic);
        }
        
        // Execute ambient feedback
        if (story.ambient) {
            this.executeAmbientFeedback(story.ambient);
        }
        
        // Execute visual feedback
        if (story.visual) {
            this.executeVisualFeedback(story.visual);
        }
        
        // Execute audio feedback
        if (story.audio && this.audioEnabled) {
            this.executeAudioFeedback(story.audio);
        }
    }

    executeHapticPattern(pattern) {
        if (!this.hasHapticSupport || !this.isEnabled) {
            this.simulateHapticWithVisual(pattern);
            return;
        }
        
        // Execute haptic pattern
        navigator.vibrate(pattern);
        
        // Log haptic execution
        console.log('📳 Haptic pattern executed:', pattern);
    }

    simulateHapticWithVisual(pattern) {
        // Simulate haptic feedback with visual cues
        const totalDuration = pattern.reduce((sum, duration) => sum + duration, 0);
        
        this.ambientContainer.style.opacity = '0.1';
        this.ambientContainer.style.background = 'rgba(26, 77, 58, 0.1)';
        
        setTimeout(() => {
            this.ambientContainer.style.opacity = '0';
        }, totalDuration);
    }

    executeAmbientFeedback(ambient) {
        switch (ambient.intensity) {
            case 'gentle':
                this.createGentleAmbient(ambient.duration);
                break;
            case 'medium':
                this.createMediumAmbient(ambient.duration);
                break;
            case 'strong':
                this.createStrongAmbient(ambient.duration);
                break;
            case 'subtle':
                this.createSubtleAmbient(ambient.duration);
                break;
        }
    }

    createGentleAmbient(duration) {
        this.ambientContainer.style.background = 'radial-gradient(circle, rgba(26, 77, 58, 0.05) 0%, transparent 70%)';
        this.ambientContainer.style.opacity = '1';
        
        setTimeout(() => {
            this.ambientContainer.style.opacity = '0';
        }, duration);
    }

    createMediumAmbient(duration) {
        this.ambientContainer.style.background = 'radial-gradient(circle, rgba(26, 77, 58, 0.1) 0%, transparent 70%)';
        this.ambientContainer.style.opacity = '1';
        
        setTimeout(() => {
            this.ambientContainer.style.opacity = '0';
        }, duration);
    }

    createStrongAmbient(duration) {
        this.ambientContainer.style.background = 'radial-gradient(circle, rgba(26, 77, 58, 0.15) 0%, transparent 70%)';
        this.ambientContainer.style.opacity = '1';
        
        setTimeout(() => {
            this.ambientContainer.style.opacity = '0';
        }, duration);
    }

    createSubtleAmbient(duration) {
        this.ambientContainer.style.background = 'radial-gradient(circle, rgba(26, 77, 58, 0.03) 0%, transparent 70%)';
        this.ambientContainer.style.opacity = '1';
        
        setTimeout(() => {
            this.ambientContainer.style.opacity = '0';
        }, duration);
    }

    executeVisualFeedback(visual) {
        // Execute visual feedback patterns
        console.log('👁️ Visual feedback executed:', visual);
    }

    executeAudioFeedback(audio) {
        if (!this.audioEnabled) return;
        
        // Execute audio feedback patterns
        console.log('🔊 Audio feedback executed:', audio);
    }

    // Ambient Feedback Methods
    startAmbientFeedback(activity) {
        switch (activity) {
            case 'meditation':
                this.startMeditationAmbient();
                break;
            case 'journal':
                this.startJournalAmbient();
                break;
            case 'workout':
                this.startWorkoutAmbient();
                break;
            case 'clarity':
                this.startClarityAmbient();
                break;
        }
    }

    startMeditationAmbient() {
        // Gentle breathing pattern
        this.createBreathingPattern(4000);
    }

    startJournalAmbient() {
        // Soft writing rhythm
        this.createWritingRhythm(2000);
    }

    startWorkoutAmbient() {
        // Energetic rhythm
        this.createEnergyPattern(1500);
    }

    startClarityAmbient() {
        // Focus pattern
        this.createFocusPattern(1000);
    }

    createBreathingPattern(interval) {
        const breathe = () => {
            this.ambientContainer.style.background = 'radial-gradient(circle, rgba(26, 77, 58, 0.08) 0%, transparent 70%)';
            this.ambientContainer.style.opacity = '1';
            
            setTimeout(() => {
                this.ambientContainer.style.opacity = '0';
            }, interval / 2);
        };
        
        breathe();
        this.breathingInterval = setInterval(breathe, interval);
    }

    createWritingRhythm(interval) {
        const write = () => {
            this.ambientContainer.style.background = 'linear-gradient(45deg, rgba(26, 77, 58, 0.05) 0%, transparent 50%)';
            this.ambientContainer.style.opacity = '1';
            
            setTimeout(() => {
                this.ambientContainer.style.opacity = '0';
            }, interval / 3);
        };
        
        write();
        this.writingInterval = setInterval(write, interval);
    }

    createEnergyPattern(interval) {
        const energize = () => {
            this.ambientContainer.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)';
            this.ambientContainer.style.opacity = '1';
            
            setTimeout(() => {
                this.ambientContainer.style.opacity = '0';
            }, interval / 2);
        };
        
        energize();
        this.energyInterval = setInterval(energize, interval);
    }

    createFocusPattern(interval) {
        const focus = () => {
            this.ambientContainer.style.background = 'conic-gradient(from 0deg, rgba(26, 77, 58, 0.06) 0%, transparent 50%)';
            this.ambientContainer.style.opacity = '1';
            
            setTimeout(() => {
                this.ambientContainer.style.opacity = '0';
            }, interval / 2);
        };
        
        focus();
        this.focusInterval = setInterval(focus, interval);
    }

    updateAmbientFeedback(phase) {
        // Update ambient feedback based on activity phase
        console.log('🌊 Ambient feedback updated for phase:', phase);
    }

    completeAmbientFeedback(activity) {
        // Complete ambient feedback with celebration
        this.ambientContainer.style.background = 'radial-gradient(circle, rgba(26, 77, 58, 0.2) 0%, transparent 70%)';
        this.ambientContainer.style.opacity = '1';
        
        setTimeout(() => {
            this.ambientContainer.style.opacity = '0';
        }, 2000);
        
        // Clear any active intervals
        this.clearAmbientIntervals();
    }

    clearAmbientIntervals() {
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }
        if (this.writingInterval) {
            clearInterval(this.writingInterval);
            this.writingInterval = null;
        }
        if (this.energyInterval) {
            clearInterval(this.energyInterval);
            this.energyInterval = null;
        }
        if (this.focusInterval) {
            clearInterval(this.focusInterval);
            this.focusInterval = null;
        }
    }

    // Immediate Feedback Methods
    provideImmediateFeedback(type, intensity = 'medium') {
        const pattern = this.getImmediatePattern(type, intensity);
        this.executeHapticPattern(pattern);
    }

    getImmediatePattern(type, intensity) {
        const patterns = {
            tap: { gentle: [30], medium: [50], strong: [80] },
            swipe: { gentle: [40, 20], medium: [60, 30], strong: [100, 50] },
            longPress: { gentle: [100], medium: [150], strong: [200] },
            button: { gentle: [40], medium: [60], strong: [100] },
            error: { gentle: [50, 50], medium: [100, 100], strong: [200, 100, 200] },
            success: { gentle: [80], medium: [120], strong: [200] }
        };
        
        return patterns[type]?.[intensity] || [50];
    }

    // Context Awareness Methods
    adjustHapticIntensity(theme) {
        switch (theme) {
            case 'morning':
                this.intensity = 'strong';
                break;
            case 'day':
                this.intensity = 'medium';
                break;
            case 'evening':
                this.intensity = 'gentle';
                break;
            case 'night':
                this.intensity = 'subtle';
                break;
        }
    }

    loadHapticPreferences() {
        const saved = localStorage.getItem('hapticPreferences');
        if (saved) {
            const preferences = JSON.parse(saved);
            this.intensity = preferences.intensity || 'medium';
            this.isEnabled = preferences.enabled !== false;
        }
    }

    saveHapticPreferences() {
        const preferences = {
            intensity: this.intensity,
            enabled: this.isEnabled
        };
        localStorage.setItem('hapticPreferences', JSON.stringify(preferences));
    }

    resetStoryContext() {
        this.storyContext = {
            currentActivity: null,
            activityPhase: 'idle',
            userMood: this.storyContext.userMood,
            timeOfDay: this.storyContext.timeOfDay
        };
    }

    // Public API
    setIntensity(intensity) {
        this.intensity = intensity;
        this.saveHapticPreferences();
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
        this.saveHapticPreferences();
    }

    getIntensity() {
        return this.intensity;
    }

    isHapticEnabled() {
        return this.isEnabled;
    }

    // Cleanup
    destroy() {
        this.clearAmbientIntervals();
        if (this.ambientContainer) {
            this.ambientContainer.remove();
        }
    }
}

// Initialize haptic storytelling
window.HapticStorytelling = HapticStorytelling;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.hapticStorytelling = new HapticStorytelling();
    });
} else {
    window.hapticStorytelling = new HapticStorytelling();
}
