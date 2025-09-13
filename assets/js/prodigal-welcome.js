/**
 * Prodigal Child Welcome - The Open Arms
 * Gentle, non-judgmental welcome for users returning after absence
 * Shows deep, compassionate understanding of the user's journey
 */

class ProdigalWelcome {
    constructor() {
        this.isInitialized = false;
        this.lastVisitKey = 'morningFlowLastVisit';
        this.visitHistoryKey = 'morningFlowVisitHistory';
        this.absenceThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.extendedAbsenceThreshold = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        this.welcomeMessages = {
            short: [
                "Welcome back. The path waited for you.",
                "Good to see you again. Ready to continue your journey?",
                "The morning is patient. Welcome back.",
                "Your flow awaits. Welcome home."
            ],
            medium: [
                "The path waited for you. Welcome back.",
                "Life happens. The morning is always here when you're ready.",
                "Welcome back. Every new beginning is a chance to grow.",
                "The journey continues. Welcome home."
            ],
            long: [
                "The path never forgets. Welcome back, friend.",
                "Time apart only makes the return sweeter. Welcome home.",
                "The morning has been patient. Welcome back to your journey.",
                "Every return is a new beginning. Welcome home."
            ],
            veryLong: [
                "The path has been waiting with open arms. Welcome home.",
                "Distance makes the heart grow fonder. Welcome back to your morning ritual.",
                "The journey is patient. Welcome back, wherever you've been.",
                "Home is where the heart is. Welcome back to your morning flow."
            ]
        };
        
        this.encouragementMessages = [
            "Remember, consistency is a practice, not perfection.",
            "Every step forward is progress, no matter how small.",
            "Your journey is uniquely yours. Welcome back.",
            "The path is always here when you're ready.",
            "Growth happens in cycles. Welcome back to yours."
        ];
        
        this.init();
    }

    init() {
        console.log('🏠 Initializing Prodigal Welcome system...');
        this.trackCurrentVisit();
        this.isInitialized = true;
        console.log('✅ Prodigal Welcome system initialized');
    }

    trackCurrentVisit() {
        const now = Date.now();
        const lastVisit = localStorage.getItem(this.lastVisitKey);
        
        // Update last visit time
        localStorage.setItem(this.lastVisitKey, now.toString());
        
        // Track visit history
        this.updateVisitHistory(now);
        
        // Check if this is a return after absence
        if (lastVisit) {
            const timeSinceLastVisit = now - parseInt(lastVisit);
            if (timeSinceLastVisit > this.absenceThreshold) {
                this.showProdigalWelcome(timeSinceLastVisit);
            }
        }
    }

    updateVisitHistory(timestamp) {
        const history = this.getVisitHistory();
        history.unshift(timestamp);
        
        // Keep only last 30 visits
        if (history.length > 30) {
            history.splice(30);
        }
        
        localStorage.setItem(this.visitHistoryKey, JSON.stringify(history));
    }

    getVisitHistory() {
        const history = localStorage.getItem(this.visitHistoryKey);
        return history ? JSON.parse(history) : [];
    }

    showProdigalWelcome(timeSinceLastVisit) {
        console.log('🏠 Showing prodigal welcome...');
        
        const absenceType = this.getAbsenceType(timeSinceLastVisit);
        const message = this.getWelcomeMessage(absenceType);
        const encouragement = this.getEncouragementMessage();
        
        // Create and show the welcome overlay
        this.createProdigalWelcomeOverlay(message, encouragement, absenceType);
        
        // Track the welcome event
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('prodigal_welcome_shown', {
                absence_duration: timeSinceLastVisit,
                absence_type: absenceType,
                message_type: message.type || 'default'
            });
        }
        
        // Provide gentle haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'gentle');
        }
    }

    getAbsenceType(timeSinceLastVisit) {
        if (timeSinceLastVisit < this.extendedAbsenceThreshold) {
            return 'medium';
        } else if (timeSinceLastVisit < 30 * 24 * 60 * 60 * 1000) { // 30 days
            return 'long';
        } else {
            return 'veryLong';
        }
    }

    getWelcomeMessage(absenceType) {
        const messages = this.welcomeMessages[absenceType] || this.welcomeMessages.medium;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        return {
            text: randomMessage,
            type: absenceType
        };
    }

    getEncouragementMessage() {
        return this.encouragementMessages[Math.floor(Math.random() * this.encouragementMessages.length)];
    }

    createProdigalWelcomeOverlay(message, encouragement, absenceType) {
        const overlay = document.createElement('div');
        overlay.id = 'prodigal-welcome-overlay';
        overlay.className = 'prodigal-welcome-overlay';
        overlay.innerHTML = `
            <div class="prodigal-welcome-content">
                <div class="prodigal-welcome-icon">
                    <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#prodigalGradient)" stroke-width="3" opacity="0.8"/>
                        <circle cx="50" cy="50" r="25" fill="url(#prodigalGradient)" opacity="0.6"/>
                        <circle cx="50" cy="50" r="8" fill="url(#prodigalGradient)"/>
                        <defs>
                            <linearGradient id="prodigalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#1a4d3a;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#7a9b7a;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                
                <h1 class="prodigal-welcome-title">Welcome Back</h1>
                
                <p class="prodigal-welcome-message">${message.text}</p>
                
                <p class="prodigal-welcome-encouragement">${encouragement}</p>
                
                <div class="prodigal-welcome-stats">
                    <div class="prodigal-stat">
                        <span class="stat-icon">📅</span>
                        <span class="stat-text">${this.formatAbsenceDuration(absenceType)}</span>
                    </div>
                    <div class="prodigal-stat">
                        <span class="stat-icon">🏠</span>
                        <span class="stat-text">Ready to continue</span>
                    </div>
                </div>
                
                <div class="prodigal-welcome-actions">
                    <button class="prodigal-continue-btn" id="prodigalContinueBtn">
                        Continue Your Journey
                        <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    
                    <button class="prodigal-gentle-btn" id="prodigalGentleBtn">
                        Take It Slow
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Setup event listeners
        this.setupProdigalWelcomeEvents(overlay);
        
        // Show with animation
        setTimeout(() => {
            overlay.classList.add('show');
        }, 100);
        
        // Auto-dismiss after 10 seconds if no interaction
        setTimeout(() => {
            if (overlay.parentElement) {
                this.dismissProdigalWelcome(overlay);
            }
        }, 10000);
    }

    setupProdigalWelcomeEvents(overlay) {
        const continueBtn = overlay.querySelector('#prodigalContinueBtn');
        const gentleBtn = overlay.querySelector('#prodigalGentleBtn');
        
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.handleContinueJourney(overlay);
            });
        }
        
        if (gentleBtn) {
            gentleBtn.addEventListener('click', () => {
                this.handleTakeItSlow(overlay);
            });
        }
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.dismissProdigalWelcome(overlay);
            }
        });
        
        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.dismissProdigalWelcome(overlay);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    handleContinueJourney(overlay) {
        console.log('🚀 User chose to continue journey...');
        
        // Track choice
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('prodigal_welcome_continue', {
                choice: 'continue_journey'
            });
        }
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'medium');
        }
        
        // Dismiss overlay
        this.dismissProdigalWelcome(overlay);
        
        // Start flow if available
        if (window.seamlessFlowEngine) {
            setTimeout(() => {
                window.seamlessFlowEngine.startFlow();
            }, 300);
        }
    }

    handleTakeItSlow(overlay) {
        console.log('🌱 User chose to take it slow...');
        
        // Track choice
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('prodigal_welcome_gentle', {
                choice: 'take_it_slow'
            });
        }
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'gentle');
        }
        
        // Dismiss overlay
        this.dismissProdigalWelcome(overlay);
        
        // Show gentle breathing option
        setTimeout(() => {
            this.showGentleBreathingOption();
        }, 300);
    }

    showGentleBreathingOption() {
        const gentleOverlay = document.createElement('div');
        gentleOverlay.id = 'gentle-breathing-overlay';
        gentleOverlay.className = 'gentle-breathing-overlay';
        gentleOverlay.innerHTML = `
            <div class="gentle-breathing-content">
                <div class="gentle-breathing-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 14S9.5 16 12 16S16 14 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M9 9H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M15 9H15.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                
                <h2 class="gentle-breathing-title">Gentle Return</h2>
                <p class="gentle-breathing-message">Take a moment to breathe and center yourself.</p>
                
                <div class="gentle-breathing-circle">
                    <div class="gentle-breathing-inner">
                        <span class="gentle-breathing-text">Breathe</span>
                    </div>
                </div>
                
                <div class="gentle-breathing-actions">
                    <button class="gentle-breathing-btn" id="startGentleBreathing">
                        Start Gentle Breathing
                    </button>
                    <button class="gentle-skip-btn" id="skipGentleBreathing">
                        I'm Ready
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(gentleOverlay);
        
        // Setup gentle breathing events
        this.setupGentleBreathingEvents(gentleOverlay);
        
        // Show with animation
        setTimeout(() => {
            gentleOverlay.classList.add('show');
        }, 100);
    }

    setupGentleBreathingEvents(overlay) {
        const startBtn = overlay.querySelector('#startGentleBreathing');
        const skipBtn = overlay.querySelector('#skipGentleBreathing');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startGentleBreathing(overlay);
            });
        }
        
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                this.skipGentleBreathing(overlay);
            });
        }
    }

    startGentleBreathing(overlay) {
        console.log('🫁 Starting gentle breathing...');
        
        const breathingCircle = overlay.querySelector('.gentle-breathing-circle');
        const breathingText = overlay.querySelector('.gentle-breathing-text');
        
        if (breathingCircle) {
            breathingCircle.classList.add('breathing');
        }
        
        // Gentle breathing cycle
        const breathCycle = ['Breathe In', 'Hold', 'Breathe Out', 'Rest'];
        let cycleIndex = 0;
        
        const breathingInterval = setInterval(() => {
            if (breathingText) {
                breathingText.textContent = breathCycle[cycleIndex];
            }
            cycleIndex = (cycleIndex + 1) % breathCycle.length;
        }, 3000);
        
        // Auto-complete after 30 seconds
        setTimeout(() => {
            clearInterval(breathingInterval);
            this.completeGentleBreathing(overlay);
        }, 30000);
        
        // Track gentle breathing start
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('gentle_breathing_started', {
                context: 'prodigal_welcome'
            });
        }
    }

    completeGentleBreathing(overlay) {
        console.log('✅ Gentle breathing completed...');
        
        const breathingCircle = overlay.querySelector('.gentle-breathing-circle');
        const breathingText = overlay.querySelector('.gentle-breathing-text');
        
        if (breathingCircle) {
            breathingCircle.classList.remove('breathing');
        }
        
        if (breathingText) {
            breathingText.textContent = 'Welcome Home';
        }
        
        // Track completion
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('gentle_breathing_completed', {
                context: 'prodigal_welcome'
            });
        }
        
        // Dismiss after 2 seconds
        setTimeout(() => {
            this.dismissProdigalWelcome(overlay);
        }, 2000);
    }

    skipGentleBreathing(overlay) {
        console.log('⏭️ Skipping gentle breathing...');
        
        // Track skip
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('gentle_breathing_skipped', {
                context: 'prodigal_welcome'
            });
        }
        
        this.dismissProdigalWelcome(overlay);
    }

    dismissProdigalWelcome(overlay) {
        if (overlay && overlay.parentElement) {
            overlay.classList.remove('show');
            overlay.classList.add('hide');
            
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }

    formatAbsenceDuration(absenceType) {
        switch (absenceType) {
            case 'medium':
                return 'A day away';
            case 'long':
                return 'A week away';
            case 'veryLong':
                return 'A while away';
            default:
                return 'Welcome back';
        }
    }

    // Public API
    checkForProdigalWelcome() {
        const lastVisit = localStorage.getItem(this.lastVisitKey);
        if (lastVisit) {
            const timeSinceLastVisit = Date.now() - parseInt(lastVisit);
            if (timeSinceLastVisit > this.absenceThreshold) {
                this.showProdigalWelcome(timeSinceLastVisit);
                return true;
            }
        }
        return false;
    }

    getVisitStats() {
        const history = this.getVisitHistory();
        const now = Date.now();
        
        if (history.length === 0) return null;
        
        const lastVisit = history[0];
        const timeSinceLastVisit = now - lastVisit;
        
        return {
            totalVisits: history.length,
            lastVisit: lastVisit,
            timeSinceLastVisit: timeSinceLastVisit,
            absenceType: this.getAbsenceType(timeSinceLastVisit)
        };
    }

    // Cleanup
    destroy() {
        // Remove any active overlays
        const overlays = document.querySelectorAll('#prodigal-welcome-overlay, #gentle-breathing-overlay');
        overlays.forEach(overlay => overlay.remove());
        
        this.isInitialized = false;
    }
}

// Initialize prodigal welcome system
window.ProdigalWelcome = ProdigalWelcome;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.prodigalWelcome = new ProdigalWelcome();
    });
} else {
    window.prodigalWelcome = new ProdigalWelcome();
}
