/**
 * Timer Page Error Handler
 * Ultra-robust error handling specifically for the meditation timer
 */

class TimerErrorHandler {
    constructor() {
        this.timer = null;
        this.errorCount = 0;
        this.maxRetries = 3;
        this.fallbackMode = false;
        this.init();
    }

    init() {
        this.setupTimerErrorHandlers();
        this.setupAudioErrorHandlers();
        this.setupProgressErrorHandlers();
        this.setupDurationErrorHandlers();
        this.setupStateErrorHandlers();
    }

    setupTimerErrorHandlers() {
        // Timer initialization errors
        this.handleTimerInitError = (error) => {
            console.error('Timer initialization error:', error);
            this.errorCount++;
            
            if (this.errorCount <= this.maxRetries) {
                this.showRecoveryNotification('Timer initialization failed', 'Retrying...', 'warning');
                setTimeout(() => this.reinitializeTimer(), 1000);
            } else {
                this.enableFallbackTimer();
            }
        };

        // Timer state corruption errors
        this.handleTimerStateError = (error) => {
            console.error('Timer state error:', error);
            this.showRecoveryNotification('Timer state corrupted', 'Resetting to safe state...', 'error');
            this.resetTimerToSafeState();
        };

        // Timer display errors
        this.handleTimerDisplayError = (error) => {
            console.error('Timer display error:', error);
            this.showRecoveryNotification('Display update failed', 'Switching to text display...', 'warning');
            this.enableTextDisplay();
        };
    }

    setupAudioErrorHandlers() {
        // Audio context errors
        this.handleAudioContextError = (error) => {
            console.error('Audio context error:', error);
            this.showRecoveryNotification('Audio system unavailable', 'Timer will work without sound', 'info');
            this.disableAudio();
        };

        // Audio loading errors
        this.handleAudioLoadError = (error) => {
            console.error('Audio load error:', error);
            this.showRecoveryNotification('Sound files unavailable', 'Using system sounds instead', 'warning');
            this.enableSystemSounds();
        };

        // Audio playback errors
        this.handleAudioPlaybackError = (error) => {
            console.error('Audio playback error:', error);
            this.showRecoveryNotification('Sound playback failed', 'Continuing without sound', 'info');
            this.disableAudio();
        };
    }

    setupProgressErrorHandlers() {
        // Progress circle errors
        this.handleProgressCircleError = (error) => {
            console.error('Progress circle error:', error);
            this.showRecoveryNotification('Visual progress failed', 'Showing text progress instead', 'warning');
            this.enableTextProgress();
        };

        // Progress calculation errors
        this.handleProgressCalculationError = (error) => {
            console.error('Progress calculation error:', error);
            this.showRecoveryNotification('Progress calculation failed', 'Using simple countdown', 'info');
            this.enableSimpleCountdown();
        };
    }

    setupDurationErrorHandlers() {
        // Duration selector errors
        this.handleDurationSelectorError = (error) => {
            console.error('Duration selector error:', error);
            this.showRecoveryNotification('Duration selector failed', 'Using default 10-minute timer', 'warning');
            this.setDefaultDuration();
        };

        // Duration validation errors
        this.handleDurationValidationError = (error) => {
            console.error('Duration validation error:', error);
            this.showRecoveryNotification('Invalid duration selected', 'Using safe default duration', 'error');
            this.setSafeDuration();
        };
    }

    setupStateErrorHandlers() {
        // Timer state persistence errors
        this.handleStatePersistenceError = (error) => {
            console.error('State persistence error:', error);
            this.showRecoveryNotification('Unable to save timer state', 'Continuing with current session', 'info');
            this.disableStatePersistence();
        };

        // Timer state restoration errors
        this.handleStateRestorationError = (error) => {
            console.error('State restoration error:', error);
            this.showRecoveryNotification('Unable to restore previous state', 'Starting fresh timer session', 'info');
            this.startFreshSession();
        };
    }

    // Recovery Actions
    reinitializeTimer() {
        try {
            if (this.timer) {
                this.timer.destroy();
            }
            
            // Wait for cleanup
            setTimeout(() => {
                this.timer = new window.MeditationTimer();
                this.showRecoveryNotification('Timer reinitialized', 'Ready to use', 'success');
            }, 500);
        } catch (error) {
            console.error('Timer reinitialization failed:', error);
            this.enableFallbackTimer();
        }
    }

    enableFallbackTimer() {
        this.fallbackMode = true;
        this.showFallbackTimerUI();
        this.showRecoveryNotification('Fallback timer enabled', 'Basic functionality available', 'warning');
    }

    showFallbackTimerUI() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="text-center py-16">
                    <div class="mb-8">
                        <div class="text-8xl mb-4">⏱️</div>
                        <h1 class="text-4xl font-bold mb-4">Simple Timer</h1>
                        <p class="text-gray-600 mb-8">Basic timer functionality</p>
                    </div>
                    
                    <div class="mb-8">
                        <div id="fallback-timer-display" class="text-6xl font-bold mb-4">10:00</div>
                        <div class="text-lg text-gray-600 mb-6">Choose your duration</div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                        <button onclick="window.timerErrorHandler.startFallbackTimer(300)" 
                                class="btn-premium btn-outline">
                            5 min
                        </button>
                        <button onclick="window.timerErrorHandler.startFallbackTimer(600)" 
                                class="btn-premium btn-primary">
                            10 min
                        </button>
                        <button onclick="window.timerErrorHandler.startFallbackTimer(900)" 
                                class="btn-premium btn-outline">
                            15 min
                        </button>
                        <button onclick="window.timerErrorHandler.startFallbackTimer(1200)" 
                                class="btn-premium btn-outline">
                            20 min
                        </button>
                    </div>
                    
                    <div class="flex justify-center space-x-4">
                        <button id="fallback-start-btn" onclick="window.timerErrorHandler.toggleFallbackTimer()" 
                                class="btn-premium btn-success">
                            ▶️ Start
                        </button>
                        <button id="fallback-reset-btn" onclick="window.timerErrorHandler.resetFallbackTimer()" 
                                class="btn-premium btn-secondary">
                            🔄 Reset
                        </button>
                    </div>
                    
                    <div class="mt-8">
                        <button onclick="window.location.href='/'" 
                                class="btn-premium btn-outline">
                            ← Back to Home
                        </button>
                    </div>
                </div>
            `;
        }
    }

    startFallbackTimer(duration) {
        this.fallbackDuration = duration;
        this.fallbackTimeRemaining = duration;
        this.updateFallbackDisplay();
        this.showRecoveryNotification('Timer set', `${Math.floor(duration/60)} minutes`, 'success');
    }

    toggleFallbackTimer() {
        if (this.fallbackInterval) {
            this.pauseFallbackTimer();
        } else {
            this.resumeFallbackTimer();
        }
    }

    pauseFallbackTimer() {
        clearInterval(this.fallbackInterval);
        this.fallbackInterval = null;
        document.getElementById('fallback-start-btn').innerHTML = '▶️ Resume';
        this.showRecoveryNotification('Timer paused', 'Click resume to continue', 'info');
    }

    resumeFallbackTimer() {
        this.fallbackInterval = setInterval(() => {
            this.fallbackTimeRemaining--;
            this.updateFallbackDisplay();
            
            if (this.fallbackTimeRemaining <= 0) {
                this.completeFallbackTimer();
            }
        }, 1000);
        
        document.getElementById('fallback-start-btn').innerHTML = '⏸️ Pause';
    }

    resetFallbackTimer() {
        clearInterval(this.fallbackInterval);
        this.fallbackInterval = null;
        this.fallbackTimeRemaining = this.fallbackDuration || 600;
        this.updateFallbackDisplay();
        document.getElementById('fallback-start-btn').innerHTML = '▶️ Start';
        this.showRecoveryNotification('Timer reset', 'Ready to start again', 'info');
    }

    updateFallbackDisplay() {
        const minutes = Math.floor(this.fallbackTimeRemaining / 60);
        const seconds = this.fallbackTimeRemaining % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('fallback-timer-display').textContent = display;
    }

    completeFallbackTimer() {
        clearInterval(this.fallbackInterval);
        this.fallbackInterval = null;
        this.showRecoveryNotification('Timer complete!', 'Well done on your meditation', 'success');
        
        // Show completion message
        setTimeout(() => {
            alert('🎉 Meditation Complete!\n\nTake a moment to appreciate your practice.');
        }, 1000);
    }

    resetTimerToSafeState() {
        if (this.timer) {
            this.timer.reset();
        }
        this.errorCount = 0;
        this.showRecoveryNotification('Timer reset', 'Safe state restored', 'success');
    }

    enableTextDisplay() {
        const progressCircle = document.querySelector('.progress-circle');
        if (progressCircle) {
            progressCircle.style.display = 'none';
        }
        
        const textProgress = document.createElement('div');
        textProgress.id = 'text-progress';
        textProgress.className = 'text-center text-2xl font-bold mb-4';
        textProgress.textContent = 'Progress: 0%';
        
        const timerDisplay = document.querySelector('.timer-display');
        if (timerDisplay && !document.getElementById('text-progress')) {
            timerDisplay.parentElement.appendChild(textProgress);
        }
    }

    disableAudio() {
        if (this.timer && this.timer.audioContext) {
            this.timer.audioContext.close();
            this.timer.audioContext = null;
        }
        
        // Hide audio controls
        const audioControls = document.querySelector('.audio-controls');
        if (audioControls) {
            audioControls.style.display = 'none';
        }
    }

    enableSystemSounds() {
        // Use Web Audio API for simple beep sounds
        this.systemAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.playSystemSound = () => {
            const oscillator = this.systemAudioContext.createOscillator();
            const gainNode = this.systemAudioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.systemAudioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.systemAudioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, this.systemAudioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.systemAudioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(this.systemAudioContext.currentTime + 0.5);
        };
    }

    enableTextProgress() {
        this.enableTextDisplay();
        
        // Update progress text
        if (this.timer) {
            const originalUpdateDisplay = this.timer.updateDisplay;
            this.timer.updateDisplay = () => {
                originalUpdateDisplay.call(this.timer);
                
                const textProgress = document.getElementById('text-progress');
                if (textProgress && this.timer.timeRemaining && this.timer.totalTime) {
                    const progress = Math.round(((this.timer.totalTime - this.timer.timeRemaining) / this.timer.totalTime) * 100);
                    textProgress.textContent = `Progress: ${progress}%`;
                }
            };
        }
    }

    enableSimpleCountdown() {
        if (this.timer) {
            this.timer.updateDisplay = () => {
                const minutes = Math.floor(this.timer.timeRemaining / 60);
                const seconds = this.timer.timeRemaining % 60;
                const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                const timerDisplay = document.getElementById('timer-display');
                if (timerDisplay) {
                    timerDisplay.textContent = display;
                }
            };
        }
    }

    setDefaultDuration() {
        const durationSelector = document.getElementById('timer-duration');
        if (durationSelector) {
            durationSelector.value = '600';
            durationSelector.disabled = true;
        }
    }

    setSafeDuration() {
        const durationSelector = document.getElementById('timer-duration');
        if (durationSelector) {
            durationSelector.value = '600';
            durationSelector.disabled = true;
        }
        
        if (this.timer) {
            this.timer.totalTime = 600;
            this.timer.timeRemaining = 600;
        }
    }

    disableStatePersistence() {
        if (this.timer) {
            this.timer.saveState = () => {}; // Disable saving
        }
    }

    startFreshSession() {
        if (this.timer) {
            this.timer.reset();
        }
        localStorage.removeItem('timer-state');
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
    setTimer(timer) {
        this.timer = timer;
    }

    getErrorStats() {
        return {
            errorCount: this.errorCount,
            fallbackMode: this.fallbackMode,
            maxRetries: this.maxRetries
        };
    }

    reset() {
        this.errorCount = 0;
        this.fallbackMode = false;
        clearInterval(this.fallbackInterval);
    }
}

// Initialize timer error handler
window.TimerErrorHandler = TimerErrorHandler;

// Auto-initialize when timer page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('timer') || document.getElementById('timer-display')) {
        window.timerErrorHandler = new TimerErrorHandler();
    }
});
