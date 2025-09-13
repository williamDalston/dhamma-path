/**
 * Seamless Flow Engine - The Invisible Hand
 * Auto-advancing system that moves users from one activity to the next
 * with thoughtful Selah pauses for reflection and control
 */

class SeamlessFlowEngine {
    constructor() {
        this.isActive = false;
        this.currentFlow = [];
        this.currentIndex = 0;
        this.selahPause = 5000; // 5 seconds default
        this.lingerTime = 10000; // 10 seconds linger option
        this.flowTimer = null;
        this.selahTimer = null;
        this.lingerTimer = null;
        this.isLingering = false;
        this.userPreferences = this.loadUserPreferences();
        
        this.defaultFlow = [
            { type: 'meditation', duration: 300000, name: 'Morning Meditation' }, // 5 minutes
            { type: 'journal', duration: 180000, name: 'Reflection' }, // 3 minutes
            { type: 'workout', duration: 600000, name: 'Movement' }, // 10 minutes
            { type: 'clarity', duration: 240000, name: 'Voice Reflection' } // 4 minutes
        ];
        
        this.init();
    }

    init() {
        console.log('🌊 Initializing Seamless Flow Engine...');
        this.setupFlowControls();
        this.setupEventListeners();
        this.loadFlowHistory();
        this.isInitialized = true;
        console.log('✅ Seamless Flow Engine initialized');
    }

    setupFlowControls() {
        // Create flow control overlay
        this.createFlowOverlay();
        
        // Create Selah pause interface
        this.createSelahInterface();
        
        // Create linger option
        this.createLingerOption();
    }

    createFlowOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'flow-overlay';
        overlay.className = 'flow-overlay';
        overlay.innerHTML = `
            <div class="flow-overlay-content">
                <div class="flow-progress">
                    <div class="flow-progress-bar">
                        <div class="flow-progress-fill" id="flowProgressFill"></div>
                    </div>
                    <div class="flow-progress-text">
                        <span class="flow-current-activity" id="flowCurrentActivity">Starting your flow...</span>
                        <span class="flow-progress-counter" id="flowProgressCounter">1 of 4</span>
                    </div>
                </div>
                
                <div class="flow-controls">
                    <button class="flow-control-btn flow-pause-btn" id="flowPauseBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                            <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                        </svg>
                        Pause Flow
                    </button>
                    
                    <button class="flow-control-btn flow-skip-btn" id="flowSkipBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Skip
                    </button>
                    
                    <button class="flow-control-btn flow-stop-btn" id="flowStopBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        End Flow
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    createSelahInterface() {
        const selahOverlay = document.createElement('div');
        selahOverlay.id = 'selah-overlay';
        selahOverlay.className = 'selah-overlay';
        selahOverlay.innerHTML = `
            <div class="selah-content">
                <div class="selah-icon">
                    <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#selahGradient)" stroke-width="3" opacity="0.8"/>
                        <circle cx="50" cy="50" r="25" fill="url(#selahGradient)" opacity="0.6"/>
                        <circle cx="50" cy="50" r="8" fill="url(#selahGradient)"/>
                        <defs>
                            <linearGradient id="selahGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#1a4d3a;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#7a9b7a;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                
                <h2 class="selah-title">Selah</h2>
                <p class="selah-subtitle">A moment to pause and reflect</p>
                
                <div class="selah-timer">
                    <div class="selah-circle">
                        <div class="selah-circle-fill" id="selahCircleFill"></div>
                        <div class="selah-timer-text" id="selahTimerText">5</div>
                    </div>
                </div>
                
                <div class="selah-actions">
                    <button class="selah-action-btn selah-continue-btn" id="selahContinueBtn">
                        Continue Flow
                    </button>
                    
                    <button class="selah-action-btn selah-linger-btn" id="selahLingerBtn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Linger Here
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(selahOverlay);
    }

    createLingerOption() {
        const lingerOverlay = document.createElement('div');
        lingerOverlay.id = 'linger-overlay';
        lingerOverlay.className = 'linger-overlay';
        lingerOverlay.innerHTML = `
            <div class="linger-content">
                <div class="linger-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>
                
                <p class="linger-text">Taking your time...</p>
                
                <div class="linger-actions">
                    <button class="linger-action-btn linger-continue-btn" id="lingerContinueBtn">
                        Ready to Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(lingerOverlay);
    }

    setupEventListeners() {
        // Flow control buttons
        const pauseBtn = document.getElementById('flowPauseBtn');
        const skipBtn = document.getElementById('flowSkipBtn');
        const stopBtn = document.getElementById('flowStopBtn');
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.toggleFlow());
        }
        
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipCurrentActivity());
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopFlow());
        }
        
        // Selah actions
        const selahContinueBtn = document.getElementById('selahContinueBtn');
        const selahLingerBtn = document.getElementById('selahLingerBtn');
        
        if (selahContinueBtn) {
            selahContinueBtn.addEventListener('click', () => this.continueFlow());
        }
        
        if (selahLingerBtn) {
            selahLingerBtn.addEventListener('click', () => this.lingerHere());
        }
        
        // Linger actions
        const lingerContinueBtn = document.getElementById('lingerContinueBtn');
        
        if (lingerContinueBtn) {
            lingerContinueBtn.addEventListener('click', () => this.continueFromLinger());
        }
    }

    startFlow(customFlow = null) {
        console.log('🌊 Starting seamless flow...');
        
        this.currentFlow = customFlow || this.defaultFlow;
        this.currentIndex = 0;
        this.isActive = true;
        
        // Show flow overlay
        this.showFlowOverlay();
        
        // Start first activity
        this.startCurrentActivity();
        
        // Track flow start
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('seamless_flow_started', {
                flow_length: this.currentFlow.length,
                custom_flow: !!customFlow
            });
        }
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'medium');
        }
    }

    startCurrentActivity() {
        if (this.currentIndex >= this.currentFlow.length) {
            this.completeFlow();
            return;
        }
        
        const activity = this.currentFlow[this.currentIndex];
        console.log('🎯 Starting activity:', activity.name);
        
        // Update progress
        this.updateProgress();
        
        // Navigate to activity page
        if (window.navigationManager) {
            window.navigationManager.navigateToPage(activity.type);
        }
        
        // Set timer for activity duration
        this.flowTimer = setTimeout(() => {
            this.completeCurrentActivity();
        }, activity.duration);
        
        // Track activity start
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('flow_activity_started', {
                activity_type: activity.type,
                duration: activity.duration,
                position: this.currentIndex + 1
            });
        }
    }

    completeCurrentActivity() {
        console.log('✅ Activity completed, starting Selah pause...');
        
        // Clear flow timer
        if (this.flowTimer) {
            clearTimeout(this.flowTimer);
            this.flowTimer = null;
        }
        
        // Track activity completion
        if (window.analyticsSystem) {
            const activity = this.currentFlow[this.currentIndex];
            window.analyticsSystem.trackEvent('flow_activity_completed', {
                activity_type: activity.type,
                duration: activity.duration,
                position: this.currentIndex + 1
            });
        }
        
        // Start Selah pause
        this.startSelahPause();
    }

    startSelahPause() {
        console.log('⏸️ Starting Selah pause...');
        
        // Show Selah overlay
        this.showSelahOverlay();
        
        // Start Selah timer
        let timeLeft = this.selahPause / 1000;
        this.updateSelahTimer(timeLeft);
        
        this.selahTimer = setInterval(() => {
            timeLeft -= 1;
            this.updateSelahTimer(timeLeft);
            
            if (timeLeft <= 0) {
                this.endSelahPause();
            }
        }, 1000);
        
        // Track Selah start
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('selah_pause_started', {
                duration: this.selahPause,
                position: this.currentIndex + 1
            });
        }
    }

    endSelahPause() {
        console.log('▶️ Ending Selah pause...');
        
        // Clear Selah timer
        if (this.selahTimer) {
            clearInterval(this.selahTimer);
            this.selahTimer = null;
        }
        
        // Hide Selah overlay
        this.hideSelahOverlay();
        
        // Move to next activity
        this.currentIndex++;
        this.startCurrentActivity();
        
        // Track Selah completion
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('selah_pause_completed', {
                duration: this.selahPause,
                position: this.currentIndex
            });
        }
    }

    lingerHere() {
        console.log('⏳ User chose to linger...');
        
        // Clear Selah timer
        if (this.selahTimer) {
            clearInterval(this.selahTimer);
            this.selahTimer = null;
        }
        
        // Hide Selah overlay
        this.hideSelahOverlay();
        
        // Show linger overlay
        this.showLingerOverlay();
        
        // Set linger timer
        this.isLingering = true;
        this.lingerTimer = setTimeout(() => {
            this.endLingerPeriod();
        }, this.lingerTime);
        
        // Track linger choice
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('linger_chosen', {
                position: this.currentIndex + 1,
                linger_duration: this.lingerTime
            });
        }
    }

    continueFromLinger() {
        console.log('▶️ Continuing from linger...');
        
        // Clear linger timer
        if (this.lingerTimer) {
            clearTimeout(this.lingerTimer);
            this.lingerTimer = null;
        }
        
        // Hide linger overlay
        this.hideLingerOverlay();
        
        // Move to next activity
        this.isLingering = false;
        this.currentIndex++;
        this.startCurrentActivity();
        
        // Track linger completion
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('linger_completed', {
                position: this.currentIndex
            });
        }
    }

    endLingerPeriod() {
        console.log('⏰ Linger period ended automatically...');
        
        // Hide linger overlay
        this.hideLingerOverlay();
        
        // Move to next activity
        this.isLingering = false;
        this.currentIndex++;
        this.startCurrentActivity();
        
        // Track auto-linger completion
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('linger_auto_completed', {
                position: this.currentIndex
            });
        }
    }

    continueFlow() {
        console.log('▶️ Continuing flow immediately...');
        
        // Clear Selah timer
        if (this.selahTimer) {
            clearInterval(this.selahTimer);
            this.selahTimer = null;
        }
        
        // Hide Selah overlay
        this.hideSelahOverlay();
        
        // Move to next activity
        this.currentIndex++;
        this.startCurrentActivity();
        
        // Track immediate continue
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('selah_continued_immediately', {
                position: this.currentIndex
            });
        }
    }

    skipCurrentActivity() {
        console.log('⏭️ Skipping current activity...');
        
        // Clear flow timer
        if (this.flowTimer) {
            clearTimeout(this.flowTimer);
            this.flowTimer = null;
        }
        
        // Track skip
        if (window.analyticsSystem) {
            const activity = this.currentFlow[this.currentIndex];
            window.analyticsSystem.trackEvent('flow_activity_skipped', {
                activity_type: activity.type,
                position: this.currentIndex + 1
            });
        }
        
        // Move to next activity
        this.currentIndex++;
        this.startCurrentActivity();
    }

    toggleFlow() {
        if (this.isActive) {
            this.pauseFlow();
        } else {
            this.resumeFlow();
        }
    }

    pauseFlow() {
        console.log('⏸️ Pausing flow...');
        
        this.isActive = false;
        
        // Clear all timers
        if (this.flowTimer) {
            clearTimeout(this.flowTimer);
            this.flowTimer = null;
        }
        
        if (this.selahTimer) {
            clearInterval(this.selahTimer);
            this.selahTimer = null;
        }
        
        if (this.lingerTimer) {
            clearTimeout(this.lingerTimer);
            this.lingerTimer = null;
        }
        
        // Update pause button
        const pauseBtn = document.getElementById('flowPauseBtn');
        if (pauseBtn) {
            pauseBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
                Resume Flow
            `;
        }
        
        // Track pause
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('flow_paused', {
                position: this.currentIndex + 1
            });
        }
    }

    resumeFlow() {
        console.log('▶️ Resuming flow...');
        
        this.isActive = true;
        
        // Update pause button
        const pauseBtn = document.getElementById('flowPauseBtn');
        if (pauseBtn) {
            pauseBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                </svg>
                Pause Flow
            `;
        }
        
        // Continue with current activity
        if (this.isLingering) {
            this.endLingerPeriod();
        } else {
            this.startCurrentActivity();
        }
        
        // Track resume
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('flow_resumed', {
                position: this.currentIndex + 1
            });
        }
    }

    stopFlow() {
        console.log('🛑 Stopping flow...');
        
        this.isActive = false;
        
        // Clear all timers
        if (this.flowTimer) {
            clearTimeout(this.flowTimer);
            this.flowTimer = null;
        }
        
        if (this.selahTimer) {
            clearInterval(this.selahTimer);
            this.selahTimer = null;
        }
        
        if (this.lingerTimer) {
            clearTimeout(this.lingerTimer);
            this.lingerTimer = null;
        }
        
        // Hide all overlays
        this.hideFlowOverlay();
        this.hideSelahOverlay();
        this.hideLingerOverlay();
        
        // Navigate to home
        if (window.navigationManager) {
            window.navigationManager.navigateToPage('home');
        }
        
        // Track stop
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('flow_stopped', {
                position: this.currentIndex + 1,
                activities_completed: this.currentIndex
            });
        }
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
    }

    completeFlow() {
        console.log('🎉 Flow completed!');
        
        this.isActive = false;
        
        // Hide flow overlay
        this.hideFlowOverlay();
        
        // Show completion celebration
        this.showFlowCompletion();
        
        // Track completion
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('flow_completed', {
                total_activities: this.currentFlow.length,
                total_duration: this.calculateTotalDuration()
            });
        }
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'strong');
        }
        
        // Save flow history
        this.saveFlowHistory();
    }

    showFlowCompletion() {
        const completionOverlay = document.createElement('div');
        completionOverlay.className = 'flow-completion-overlay';
        completionOverlay.innerHTML = `
            <div class="flow-completion-content">
                <div class="completion-icon">
                    <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#completionGradient)" stroke-width="3" opacity="0.8"/>
                        <circle cx="50" cy="50" r="25" fill="url(#completionGradient)" opacity="0.6"/>
                        <circle cx="50" cy="50" r="8" fill="url(#completionGradient)"/>
                        <defs>
                            <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#1a4d3a;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#7a9b7a;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                
                <h2 class="completion-title">Flow Complete</h2>
                <p class="completion-subtitle">You've created a beautiful morning ritual</p>
                
                <div class="completion-stats">
                    <div class="completion-stat">
                        <span class="stat-number">${this.currentFlow.length}</span>
                        <span class="stat-label">Activities</span>
                    </div>
                    <div class="completion-stat">
                        <span class="stat-number">${Math.round(this.calculateTotalDuration() / 60000)}</span>
                        <span class="stat-label">Minutes</span>
                    </div>
                </div>
                
                <button class="completion-btn" onclick="this.parentElement.parentElement.remove()">
                    Continue to Home
                </button>
            </div>
        `;
        
        document.body.appendChild(completionOverlay);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (completionOverlay.parentElement) {
                completionOverlay.remove();
            }
        }, 5000);
    }

    updateProgress() {
        const activity = this.currentFlow[this.currentIndex];
        const progress = ((this.currentIndex + 1) / this.currentFlow.length) * 100;
        
        // Update progress bar
        const progressFill = document.getElementById('flowProgressFill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        // Update current activity
        const currentActivity = document.getElementById('flowCurrentActivity');
        if (currentActivity) {
            currentActivity.textContent = activity.name;
        }
        
        // Update progress counter
        const progressCounter = document.getElementById('flowProgressCounter');
        if (progressCounter) {
            progressCounter.textContent = `${this.currentIndex + 1} of ${this.currentFlow.length}`;
        }
    }

    updateSelahTimer(timeLeft) {
        const timerText = document.getElementById('selahTimerText');
        const circleFill = document.getElementById('selahCircleFill');
        
        if (timerText) {
            timerText.textContent = Math.ceil(timeLeft);
        }
        
        if (circleFill) {
            const progress = ((this.selahPause / 1000 - timeLeft) / (this.selahPause / 1000)) * 100;
            circleFill.style.strokeDashoffset = `${100 - progress}%`;
        }
    }

    showFlowOverlay() {
        const overlay = document.getElementById('flow-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateY(20px)';
            overlay.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                overlay.style.opacity = '1';
                overlay.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    hideFlowOverlay() {
        const overlay = document.getElementById('flow-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateY(20px)';
            overlay.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    showSelahOverlay() {
        const overlay = document.getElementById('selah-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(0.8)';
            overlay.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                overlay.style.opacity = '1';
                overlay.style.transform = 'scale(1)';
            }, 50);
        }
    }

    hideSelahOverlay() {
        const overlay = document.getElementById('selah-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(0.8)';
            overlay.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    showLingerOverlay() {
        const overlay = document.getElementById('linger-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateY(20px)';
            overlay.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                overlay.style.opacity = '1';
                overlay.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    hideLingerOverlay() {
        const overlay = document.getElementById('linger-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateY(20px)';
            overlay.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    calculateTotalDuration() {
        return this.currentFlow.reduce((total, activity) => total + activity.duration, 0);
    }

    loadUserPreferences() {
        const preferences = localStorage.getItem('morningFlowPreferences');
        if (preferences) {
            return JSON.parse(preferences);
        }
        return {
            selahPause: 5000,
            lingerTime: 10000,
            autoAdvance: true
        };
    }

    saveUserPreferences() {
        localStorage.setItem('morningFlowPreferences', JSON.stringify(this.userPreferences));
    }

    loadFlowHistory() {
        const history = localStorage.getItem('morningFlowHistory');
        if (history) {
            return JSON.parse(history);
        }
        return [];
    }

    saveFlowHistory() {
        const history = this.loadFlowHistory();
        const flowRecord = {
            timestamp: Date.now(),
            activities: this.currentFlow.length,
            duration: this.calculateTotalDuration(),
            completed: this.currentIndex === this.currentFlow.length
        };
        
        history.unshift(flowRecord);
        
        // Keep only last 30 flows
        if (history.length > 30) {
            history.splice(30);
        }
        
        localStorage.setItem('morningFlowHistory', JSON.stringify(history));
    }

    // Public API
    startDefaultFlow() {
        this.startFlow();
    }

    startCustomFlow(flow) {
        this.startFlow(flow);
    }

    isFlowActive() {
        return this.isActive;
    }

    getCurrentActivity() {
        if (this.currentIndex < this.currentFlow.length) {
            return this.currentFlow[this.currentIndex];
        }
        return null;
    }

    getFlowProgress() {
        return {
            current: this.currentIndex + 1,
            total: this.currentFlow.length,
            percentage: ((this.currentIndex + 1) / this.currentFlow.length) * 100
        };
    }

    // Cleanup
    destroy() {
        if (this.flowTimer) {
            clearTimeout(this.flowTimer);
        }
        if (this.selahTimer) {
            clearInterval(this.selahTimer);
        }
        if (this.lingerTimer) {
            clearTimeout(this.lingerTimer);
        }
        
        // Remove overlays
        const overlays = ['flow-overlay', 'selah-overlay', 'linger-overlay'];
        overlays.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });
        
        this.isActive = false;
        this.isInitialized = false;
    }
}

// Initialize seamless flow engine
window.SeamlessFlowEngine = SeamlessFlowEngine;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.seamlessFlowEngine = new SeamlessFlowEngine();
    });
} else {
    window.seamlessFlowEngine = new SeamlessFlowEngine();
}
