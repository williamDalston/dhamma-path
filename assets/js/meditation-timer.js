/**
 * Meditation Timer Module
 * Handles meditation timer functionality with audio support
 */

class MeditationTimer {
    constructor() {
        console.log('🧘 MeditationTimer initialized');
        this.timeRemaining = 600; // 10 minutes default
        this.totalTime = 600;
        this.isRunning = false;
        this.intervalId = null;
        this.audioContext = null;
        this.audioBuffer = null;
        this.init();
    }

    init() {
        this.findElements();
        this.setupListeners();
        this.updateDisplay();
        this.initializeAudio();
    }

    findElements() {
        this.elements = {
            display: document.getElementById('timer-display'),
            startBtn: document.getElementById('timer-start-btn'),
            pauseBtn: document.getElementById('timer-pause-btn'),
            resetBtn: document.getElementById('timer-reset-btn'),
            durationBtns: document.querySelectorAll('.duration-btn'),
            status: document.getElementById('timer-status')
        };
        
        console.log('Timer elements found:', Object.keys(this.elements).reduce((acc, key) => {
            acc[key] = !!this.elements[key];
            return acc;
        }, {}));
    }

    setupListeners() {
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.start());
        }
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.addEventListener('click', () => this.pause());
        }
        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => this.reset());
        }
        
        // Setup duration button listeners
        if (this.elements.durationBtns) {
            this.elements.durationBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (!this.isRunning) {
                        const duration = parseInt(btn.dataset.duration);
                        this.timeRemaining = duration;
                        this.totalTime = duration;
                        
                        // Update active button
                        this.elements.durationBtns.forEach(b => {
                            b.classList.remove('btn-primary', 'active');
                            b.classList.add('btn-outline');
                        });
                        btn.classList.remove('btn-outline');
                        btn.classList.add('btn-primary', 'active');
                        
                        this.updateDisplay();
                    }
                });
            });
        }
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createBellSound();
        } catch (error) {
            console.log('Audio not supported:', error);
        }
    }

    createBellSound() {
        if (!this.audioContext) return;

        const sampleRate = this.audioContext.sampleRate;
        const duration = 2; // seconds
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // Create a bell-like sound using multiple sine waves
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 2); // Exponential decay
            
            // Fundamental frequency and harmonics
            const fundamental = 800; // Hz
            data[i] = envelope * (
                0.6 * Math.sin(2 * Math.PI * fundamental * t) +
                0.3 * Math.sin(2 * Math.PI * fundamental * 2.5 * t) +
                0.1 * Math.sin(2 * Math.PI * fundamental * 4 * t)
            );
        }

        this.audioBuffer = buffer;
    }

    playBell() {
        if (!this.audioContext || !this.audioBuffer) return;

        try {
            const source = this.audioContext.createBufferSource();
            source.buffer = this.audioBuffer;
            source.connect(this.audioContext.destination);
            source.start();
        } catch (error) {
            console.log('Could not play bell sound:', error);
        }
    }

    start() {
        if (this.isRunning) return;
        
        console.log('▶️ Timer started');
        this.isRunning = true;
        
        // Update UI
        if (this.elements.startBtn) {
            this.elements.startBtn.style.display = 'none';
        }
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.style.display = 'inline-block';
        }
        
        this.updateStatus('Meditation in progress...');
        
        // Dispatch timer started event
        document.dispatchEvent(new CustomEvent('timerStarted', {
            detail: { 
                duration: this.totalTime,
                timestamp: new Date()
            }
        }));
        
        // Start the timer
        this.intervalId = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();
            
            if (this.timeRemaining <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        if (!this.isRunning) return;
        
        console.log('⏸️ Timer paused');
        this.isRunning = false;
        clearInterval(this.intervalId);
        
        // Update UI
        if (this.elements.startBtn) {
            this.elements.startBtn.style.display = 'inline-block';
        }
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.style.display = 'none';
        }
        
        this.updateStatus('Paused');
    }

    reset() {
        console.log('🔄 Timer reset');
        this.isRunning = false;
        clearInterval(this.intervalId);
        
        // Reset time
        this.timeRemaining = parseInt(this.elements.durationSelect?.value || 600);
        this.totalTime = this.timeRemaining;
        
        // Update UI
        if (this.elements.startBtn) {
            this.elements.startBtn.style.display = 'inline-block';
        }
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.style.display = 'none';
        }
        
        this.updateDisplay();
        this.updateStatus('Ready to begin');
    }

    complete() {
        console.log('✅ Meditation complete!');
        this.isRunning = false;
        clearInterval(this.intervalId);
        
        // Play completion bell
        this.playBell();
        
        // Update UI
        if (this.elements.startBtn) {
            this.elements.startBtn.style.display = 'inline-block';
        }
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.style.display = 'none';
        }
        
        this.updateStatus('Meditation complete! 🎉');
        
        // Dispatch timer completed event
        document.dispatchEvent(new CustomEvent('timerCompleted', {
            detail: { 
                duration: this.totalTime,
                completedAt: new Date(),
                activity: 'meditation'
            }
        }));
        
        // Dispatch activity completed event
        document.dispatchEvent(new CustomEvent('activityCompleted', {
            detail: { 
                activity: 'meditation',
                duration: this.totalTime,
                completedAt: new Date()
            }
        }));
        
        // Show completion notification
        this.showCompletionNotification();
    }

    showCompletionNotification() {
        // Create a beautiful completion notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-forest-green text-white p-4 rounded-lg shadow-lg z-50 fade-in';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-2xl">🎉</span>
                <span class="font-semibold">Meditation Complete!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (this.elements.display) {
            this.elements.display.textContent = timeString;
        }

        // Update progress circle
        this.updateProgressCircle();
        
        // Update stats
        this.updateStats();
    }

    updateProgressCircle() {
        const progressCircle = document.getElementById('progress-circle');
        if (!progressCircle) return;

        const totalTime = this.totalTime;
        const remainingTime = this.timeRemaining;
        const progress = (totalTime - remainingTime) / totalTime;
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (progress * circumference);

        progressCircle.style.strokeDashoffset = offset;
        
        // Change color based on progress
        if (progress > 0.8) {
            progressCircle.style.stroke = '#B98B4C'; // Gold for near completion
        } else if (progress > 0.5) {
            progressCircle.style.stroke = '#6B8E6B'; // Light green for halfway
        } else {
            progressCircle.style.stroke = '#4A6C55'; // Forest green for start
        }
    }

    updateStats() {
        // Update session stats
        const sessionsElement = document.querySelector('.grid .text-2xl');
        if (sessionsElement && !this.isRunning) {
            const currentSessions = parseInt(sessionsElement.textContent) || 0;
            if (this.timeRemaining === 0) {
                sessionsElement.textContent = currentSessions + 1;
            }
        }
    }

    updateStatus(message) {
        if (this.elements.status) {
            this.elements.status.textContent = message;
        }
    }

    // Public method to get current state
    getState() {
        return {
            timeRemaining: this.timeRemaining,
            totalTime: this.totalTime,
            isRunning: this.isRunning
        };
    }

    // Cleanup method
    cleanup() {
        this.destroy();
    }
    
    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.isRunning = false;
    }
}

// Export for use in other modules
window.MeditationTimer = MeditationTimer;
