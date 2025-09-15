// Simple Timer System
// Clean, reliable timer functionality without complexity

class SimpleTimer {
    constructor(containerId = 'timer-container') {
        this.containerId = containerId;
        this.timeRemaining = 600; // 10 minutes default
        this.totalTime = 600;
        this.isRunning = false;
        this.intervalId = null;
        this.callbacks = {
            onStart: null,
            onPause: null,
            onComplete: null,
            onTick: null
        };
        
        this.init();
    }

    init() {
        this.createUI();
        this.setupEventListeners();
        this.updateDisplay();
    }

    createUI() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Timer container not found:', this.containerId);
            return;
        }

        container.innerHTML = `
            <div class="timer-display-container text-center">
                <div class="timer-display text-6xl font-bold text-forest-green mb-6" id="timer-display">10:00</div>
                <div class="timer-controls mb-4">
                    <div class="duration-selector mb-4">
                        <label for="timer-duration" class="block text-sm font-medium text-charcoal mb-2">Duration</label>
                        <select id="timer-duration" class="w-full max-w-xs mx-auto px-4 py-2 border-2 border-forest-green/30 rounded-lg">
                            <option value="300">5 minutes</option>
                            <option value="600" selected>10 minutes</option>
                            <option value="900">15 minutes</option>
                            <option value="1200">20 minutes</option>
                            <option value="1800">30 minutes</option>
                        </select>
                    </div>
                    <div class="control-buttons flex gap-3 justify-center">
                        <button id="timer-start-btn" class="px-6 py-3 bg-forest-green text-white rounded-lg font-semibold hover:bg-forest-deep transition-colors">
                            Start
                        </button>
                        <button id="timer-pause-btn" class="px-6 py-3 bg-earth-gold text-white rounded-lg font-semibold hover:bg-earth-gold/80 transition-colors hidden">
                            Pause
                        </button>
                        <button id="timer-reset-btn" class="px-6 py-3 bg-charcoal/70 text-white rounded-lg font-semibold hover:bg-charcoal transition-colors">
                            Reset
                        </button>
                    </div>
                </div>
                <div id="timer-status" class="text-charcoal/70 text-sm">Ready to begin</div>
            </div>
        `;
    }

    setupEventListeners() {
        const startBtn = document.getElementById('timer-start-btn');
        const pauseBtn = document.getElementById('timer-pause-btn');
        const resetBtn = document.getElementById('timer-reset-btn');
        const durationSelect = document.getElementById('timer-duration');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pause());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }

        if (durationSelect) {
            durationSelect.addEventListener('change', (e) => {
                if (!this.isRunning) {
                    this.setDuration(parseInt(e.target.value));
                }
            });
        }
    }

    setDuration(seconds) {
        this.timeRemaining = seconds;
        this.totalTime = seconds;
        this.updateDisplay();
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.updateButtons();
        this.updateStatus('Timer running...');

        if (this.callbacks.onStart) {
            this.callbacks.onStart();
        }

        this.intervalId = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();

            if (this.callbacks.onTick) {
                this.callbacks.onTick(this.timeRemaining);
            }

            if (this.timeRemaining <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearInterval(this.intervalId);
        this.updateButtons();
        this.updateStatus('Paused');

        if (this.callbacks.onPause) {
            this.callbacks.onPause();
        }
    }

    reset() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        
        const durationSelect = document.getElementById('timer-duration');
        if (durationSelect) {
            this.timeRemaining = parseInt(durationSelect.value);
            this.totalTime = this.timeRemaining;
        } else {
            this.timeRemaining = 600;
            this.totalTime = 600;
        }

        this.updateButtons();
        this.updateDisplay();
        this.updateStatus('Ready to begin');
    }

    complete() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.updateButtons();
        this.updateStatus('Timer complete! 🎉');

        if (this.callbacks.onComplete) {
            this.callbacks.onComplete();
        }

        // Show completion notification
        this.showCompletionNotification();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        const display = document.getElementById('timer-display');
        if (display) {
            display.textContent = timeString;
        }
    }

    updateButtons() {
        const startBtn = document.getElementById('timer-start-btn');
        const pauseBtn = document.getElementById('timer-pause-btn');

        if (this.isRunning) {
            if (startBtn) startBtn.classList.add('hidden');
            if (pauseBtn) pauseBtn.classList.remove('hidden');
        } else {
            if (startBtn) startBtn.classList.remove('hidden');
            if (pauseBtn) pauseBtn.classList.add('hidden');
        }
    }

    updateStatus(message) {
        const status = document.getElementById('timer-status');
        if (status) {
            status.textContent = message;
        }
    }

    showCompletionNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-forest-green text-white p-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-2xl">🎉</span>
                <span class="font-semibold">Timer Complete!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Public API methods
    getTimeRemaining() {
        return this.timeRemaining;
    }

    getTotalTime() {
        return this.totalTime;
    }

    isActive() {
        return this.isRunning;
    }

    onStart(callback) {
        this.callbacks.onStart = callback;
    }

    onPause(callback) {
        this.callbacks.onPause = callback;
    }

    onComplete(callback) {
        this.callbacks.onComplete = callback;
    }

    onTick(callback) {
        this.callbacks.onTick = callback;
    }

    destroy() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Export for global use
window.SimpleTimer = SimpleTimer;
