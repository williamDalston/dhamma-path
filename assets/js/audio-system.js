/**
 * Audio System for Ambient Sounds and Guided Meditation
 * Comprehensive audio management for enhanced meditation experience
 */

class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.audioNodes = {};
        this.currentSounds = new Map();
        this.isInitialized = false;
        this.pendingSounds = [];
        this.settings = {
            masterVolume: 0.7,
            ambientVolume: 0.5,
            voiceVolume: 0.8,
            fadeInDuration: 2000,
            fadeOutDuration: 3000,
            loopSounds: true,
            autoPlay: false
        };
        
        this.setupUserGestureListener();
    }
    
    setupUserGestureListener() {
        const initAudio = async () => {
            if (this.isInitialized) return;
            
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                }
                this.isInitialized = true;
                console.log('🎵 Audio system activated');
                
                // Initialize the full audio system
                this.initializeAudioSystem();
                
                // Process any pending sounds
                this.pendingSounds.forEach(sound => this.playSound(sound));
                this.pendingSounds = [];
                
            } catch (error) {
                console.log('🎵 Audio unavailable, continuing silently');
            }
        };

        // Listen for any user interaction
        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, initAudio, { once: true });
        });
    }
    
    playSound(soundName) {
        if (!this.isInitialized) {
            this.pendingSounds.push(soundName);
            return;
        }
        
        // Your actual sound playing logic here
        console.log(`🎵 Playing sound: ${soundName}`);
    }
    
    initializeAudioSystem() {
        this.loadSettings();
        this.setupAudioContext();
        this.createAmbientSounds();
        this.setupAudioControls();
        this.setupVoiceGuidance();
        
        // Resume audio context on user gesture (Chrome autoplay policy)
        document.addEventListener('click', () => {
            try { 
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
            } catch (e) {
                console.warn('AudioContext resume failed:', e);
            }
        }, { once: true });
    }
    
    loadSettings() {
        const stored = localStorage.getItem('audio-settings');
        if (stored) {
            this.settings = { ...this.settings, ...JSON.parse(stored) };
        }
    }
    
    saveSettings() {
        localStorage.setItem('audio-settings', JSON.stringify(this.settings));
    }
    
    async setupAudioContext() {
        try {
            // Create audio context with user gesture
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            console.log('Audio context initialized');
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
            // Set up user gesture handler to retry
            this.setupUserGestureHandler();
        }
    }
    
    setupUserGestureHandler() {
        const initAudio = () => {
            this.setupAudioContext();
        };
        
        // Try to initialize on first user interaction with enhanced gesture detection
        document.addEventListener('pointerdown', initAudio, { once: true, passive: true });
        document.addEventListener('click', initAudio, { once: true });
        document.addEventListener('touchstart', initAudio, { once: true });
        document.addEventListener('keydown', initAudio, { once: true });
    }

    // Add user gesture handler for AudioContext resume
    setupAudioResume() {
        window.addEventListener('pointerdown', async () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                try { 
                    await this.audioContext.resume(); 
                } catch(e) {
                    console.warn('AudioContext resume failed:', e);
                }
            }
        }, { once: true });
    }
    
    createAmbientSounds() {
        this.ambientSounds = {
            rain: {
                name: 'Rain',
                icon: '🌧️',
                description: 'Gentle rainfall for deep relaxation',
                generator: this.createRainSound.bind(this)
            },
            ocean: {
                name: 'Ocean Waves',
                icon: '🌊',
                description: 'Soothing ocean waves',
                generator: this.createOceanSound.bind(this)
            },
            forest: {
                name: 'Forest',
                icon: '🌲',
                description: 'Peaceful forest ambience',
                generator: this.createForestSound.bind(this)
            },
            birds: {
                name: 'Birds',
                icon: '🐦',
                description: 'Morning birdsong',
                generator: this.createBirdsSound.bind(this)
            },
            wind: {
                name: 'Wind',
                icon: '🍃',
                description: 'Gentle wind through trees',
                generator: this.createWindSound.bind(this)
            },
            silence: {
                name: 'Silence',
                icon: '🤫',
                description: 'Pure silence',
                generator: null
            }
        };
    }
    
    createRainSound() {
        if (!this.audioContext) return null;
        
        // Create rain effect using filtered noise
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        // Filter to make it sound like rain
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { source, gainNode };
    }
    
    createOceanSound() {
        if (!this.audioContext) return null;
        
        // Create ocean waves using filtered noise with modulation
        const bufferSize = this.audioContext.sampleRate * 4;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate ocean-like sound
        for (let i = 0; i < bufferSize; i++) {
            const time = i / this.audioContext.sampleRate;
            const wave = Math.sin(time * 0.1) * 0.5 + 0.5; // Slow wave
            const noise = (Math.random() * 2 - 1) * wave * 0.1;
            data[i] = noise;
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { source, gainNode };
    }
    
    createForestSound() {
        if (!this.audioContext) return null;
        
        // Create forest ambience with occasional bird sounds
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const time = i / this.audioContext.sampleRate;
            let sample = 0;
            
            // Add some gentle wind-like noise
            sample += (Math.random() * 2 - 1) * 0.02;
            
            // Add occasional bird chirps
            if (Math.random() < 0.001) {
                const chirpFreq = 800 + Math.random() * 400;
                sample += Math.sin(time * chirpFreq * 2 * Math.PI) * 0.1;
            }
            
            data[i] = sample;
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, this.audioContext.currentTime);
        filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { source, gainNode };
    }
    
    createBirdsSound() {
        if (!this.audioContext) return null;
        
        // Create birdsong using multiple oscillators
        const oscillators = [];
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        // Create multiple bird sounds
        for (let i = 0; i < 3; i++) {
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400 + i * 200, this.audioContext.currentTime);
            
            // Add frequency modulation for realistic bird sound
            const lfo = this.audioContext.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(2 + Math.random() * 3, this.audioContext.currentTime);
            
            const modulator = this.audioContext.createGain();
            modulator.gain.setValueAtTime(50, this.audioContext.currentTime);
            
            lfo.connect(modulator);
            modulator.connect(oscillator.frequency);
            oscillator.connect(gainNode);
            
            oscillators.push({ oscillator, lfo });
        }
        
        gainNode.connect(this.audioContext.destination);
        
        return { gainNode, oscillators };
    }
    
    createWindSound() {
        if (!this.audioContext) return null;
        
        // Create wind sound using filtered noise
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.05;
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { source, gainNode };
    }
    
    setupAudioControls() {
        this.createAudioControlPanel();
        this.setupAmbientSoundSelection();
    }
    
    createAudioControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'audio-control-panel';
        panel.className = 'audio-control-panel fixed bottom-4 left-4 z-40 bg-white/95 backdrop-blur-sm border border-sage-deep/20 rounded-lg p-4 shadow-lg transition-all duration-300 opacity-0 translate-y-[10px] pointer-events-none';
        
        panel.innerHTML = `
            <div class="audio-header flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-forest-deep">🎵 Audio</h3>
                <button class="close-audio-panel text-sage-deep hover:text-forest-deep transition-colors">×</button>
            </div>
            
            <div class="audio-controls space-y-4">
                <div class="ambient-selection">
                    <label class="text-sm font-medium text-charcoal mb-2 block">Ambient Sound</label>
                    <div class="sound-grid grid grid-cols-2 gap-2">
                        ${Object.entries(this.ambientSounds).map(([key, sound]) => `
                            <button class="sound-btn p-3 rounded-lg border border-sage-deep/20 hover:border-sage-deep/40 transition-all duration-200 hover:scale-105 ${key === 'silence' ? 'bg-sage-pale/30' : ''}" data-sound="${key}">
                                <div class="text-lg mb-1">${sound.icon}</div>
                                <div class="text-xs text-charcoal/70">${sound.name}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="volume-controls space-y-3">
                    <div class="volume-control">
                        <label class="text-sm font-medium text-charcoal mb-2 block">Master Volume</label>
                        <input type="range" id="master-volume" min="0" max="100" value="${this.settings.masterVolume * 100}" class="w-full">
                        <span class="text-xs text-sage-deep" id="master-volume-value">${Math.round(this.settings.masterVolume * 100)}%</span>
                    </div>
                    
                    <div class="volume-control">
                        <label class="text-sm font-medium text-charcoal mb-2 block">Ambient Volume</label>
                        <input type="range" id="ambient-volume" min="0" max="100" value="${this.settings.ambientVolume * 100}" class="w-full">
                        <span class="text-xs text-sage-deep" id="ambient-volume-value">${Math.round(this.settings.ambientVolume * 100)}%</span>
                    </div>
                </div>
                
                <div class="audio-options">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="loop-sounds" ${this.settings.loopSounds ? 'checked' : ''} class="audio-checkbox">
                        <span class="text-sm text-charcoal">Loop sounds</span>
                    </label>
                    
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="auto-play" ${this.settings.autoPlay ? 'checked' : ''} class="audio-checkbox">
                        <span class="text-sm text-charcoal">Auto-play on meditation start</span>
                    </label>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.setupPanelEventListeners(panel);
    }
    
    setupPanelEventListeners(panel) {
        // Close panel
        panel.querySelector('.close-audio-panel').addEventListener('click', () => {
            this.toggleAudioPanel();
        });
        
        // Sound selection
        panel.querySelectorAll('.sound-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const soundKey = e.currentTarget.dataset.sound;
                this.selectAmbientSound(soundKey);
                this.updateSoundButtons();
            });
        });
        
        // Volume controls
        const masterVolume = panel.querySelector('#master-volume');
        const ambientVolume = panel.querySelector('#ambient-volume');
        
        masterVolume.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            this.settings.masterVolume = value;
            this.updateMasterVolume();
            panel.querySelector('#master-volume-value').textContent = Math.round(value * 100) + '%';
            this.saveSettings();
        });
        
        ambientVolume.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            this.settings.ambientVolume = value;
            this.updateAmbientVolume();
            panel.querySelector('#ambient-volume-value').textContent = Math.round(value * 100) + '%';
            this.saveSettings();
        });
        
        // Options
        panel.querySelector('#loop-sounds').addEventListener('change', (e) => {
            this.settings.loopSounds = e.target.checked;
            this.saveSettings();
        });
        
        panel.querySelector('#auto-play').addEventListener('change', (e) => {
            this.settings.autoPlay = e.target.checked;
            this.saveSettings();
        });
    }
    
    setupAmbientSoundSelection() {
        // Add audio button to meditation timer
        this.addAudioButtonToTimer();
    }
    
    addAudioButtonToTimer() {
        // This would be called when timer page is loaded
        document.addEventListener('pageChanged', (e) => {
            if (e.detail.page === 'timer') {
                this.addAudioControlsToTimer();
            }
        });
    }
    
    addAudioControlsToTimer() {
        const timerContainer = document.querySelector('.timer-container');
        if (!timerContainer) return;
        
        const audioButton = document.createElement('button');
        audioButton.className = 'audio-toggle-btn fixed top-4 right-4 z-30 bg-white/90 backdrop-blur-sm border border-sage-deep/20 rounded-lg p-3 shadow-lg transition-all duration-300 hover:scale-105';
        audioButton.setAttribute('aria-label', 'Toggle audio settings');
        audioButton.innerHTML = `
            <span class="text-lg" aria-hidden="true">🎵</span>
            <span class="text-xs ml-1">Audio</span>
        `;
        
        audioButton.addEventListener('click', () => {
            this.toggleAudioPanel();
        });
        
        timerContainer.appendChild(audioButton);
    }
    
    toggleAudioPanel() {
        const panel = document.getElementById('audio-control-panel');
        if (panel.classList.contains('opacity-0')) {
            panel.classList.remove('opacity-0', 'translate-y-[10px]', 'pointer-events-none');
            panel.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
            panel.classList.add('opacity-0', 'translate-y-[10px]', 'pointer-events-none');
            panel.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
    }
    
    selectAmbientSound(soundKey) {
        // Stop current sounds
        this.stopAllSounds();
        
        if (soundKey === 'silence') {
            this.currentAmbientSound = null;
            return;
        }
        
        const sound = this.ambientSounds[soundKey];
        if (!sound || !sound.generator) return;
        
        try {
            const audioNodes = sound.generator();
            if (audioNodes) {
                this.currentAmbientSound = { soundKey, audioNodes };
                this.startAmbientSound(audioNodes);
            }
        } catch (error) {
            console.error('Failed to create ambient sound:', error);
        }
    }
    
    startAmbientSound(audioNodes) {
        const now = this.audioContext.currentTime;
        
        if (audioNodes.gainNode) {
            // Fade in
            audioNodes.gainNode.gain.setValueAtTime(0, now);
            audioNodes.gainNode.gain.linearRampToValueAtTime(
                this.settings.ambientVolume * this.settings.masterVolume,
                now + this.settings.fadeInDuration / 1000
            );
        }
        
        if (audioNodes.source) {
            audioNodes.source.start();
        }
        
        if (audioNodes.oscillators) {
            audioNodes.oscillators.forEach(({ oscillator, lfo }) => {
                oscillator.start();
                lfo.start();
            });
        }
    }
    
    stopAllSounds() {
        this.currentSounds.forEach((audioNodes, soundKey) => {
            this.stopSound(audioNodes);
        });
        this.currentSounds.clear();
        
        if (this.currentAmbientSound) {
            this.stopSound(this.currentAmbientSound.audioNodes);
            this.currentAmbientSound = null;
        }
    }
    
    stopSound(audioNodes) {
        const now = this.audioContext.currentTime;
        
        if (audioNodes.gainNode) {
            // Fade out
            audioNodes.gainNode.gain.linearRampToValueAtTime(0, now + this.settings.fadeOutDuration / 1000);
            
            setTimeout(() => {
                if (audioNodes.source) {
                    audioNodes.source.stop();
                }
                if (audioNodes.oscillators) {
                    audioNodes.oscillators.forEach(({ oscillator, lfo }) => {
                        oscillator.stop();
                        lfo.stop();
                    });
                }
            }, this.settings.fadeOutDuration);
        }
    }
    
    updateSoundButtons() {
        const panel = document.getElementById('audio-control-panel');
        if (!panel) return;
        
        panel.querySelectorAll('.sound-btn').forEach(btn => {
            btn.classList.remove('bg-sage-pale/30', 'border-sage-deep/40');
        });
        
        if (this.currentAmbientSound) {
            const activeBtn = panel.querySelector(`[data-sound="${this.currentAmbientSound.soundKey}"]`);
            if (activeBtn) {
                activeBtn.classList.add('bg-sage-pale/30', 'border-sage-deep/40');
            }
        } else {
            const silenceBtn = panel.querySelector('[data-sound="silence"]');
            if (silenceBtn) {
                silenceBtn.classList.add('bg-sage-pale/30', 'border-sage-deep/40');
            }
        }
    }
    
    updateMasterVolume() {
        this.currentSounds.forEach((audioNodes) => {
            if (audioNodes.gainNode) {
                audioNodes.gainNode.gain.setValueAtTime(
                    this.settings.masterVolume,
                    this.audioContext.currentTime
                );
            }
        });
        
        if (this.currentAmbientSound) {
            const ambientVolume = this.settings.ambientVolume * this.settings.masterVolume;
            if (this.currentAmbientSound.audioNodes.gainNode) {
                this.currentAmbientSound.audioNodes.gainNode.gain.setValueAtTime(
                    ambientVolume,
                    this.audioContext.currentTime
                );
            }
        }
    }
    
    updateAmbientVolume() {
        if (this.currentAmbientSound) {
            const ambientVolume = this.settings.ambientVolume * this.settings.masterVolume;
            if (this.currentAmbientSound.audioNodes.gainNode) {
                this.currentAmbientSound.audioNodes.gainNode.gain.setValueAtTime(
                    ambientVolume,
                    this.audioContext.currentTime
                );
            }
        }
    }
    
    setupVoiceGuidance() {
        this.voiceGuidance = {
            start: "Welcome to your meditation. Let's begin by finding a comfortable position.",
            breathe: "Breathe in slowly... and breathe out gently.",
            focus: "Focus on your breath. Notice the rise and fall of your chest.",
            body: "Scan your body from head to toe, releasing any tension.",
            mind: "When thoughts arise, gently return your attention to your breath.",
            end: "Slowly bring your attention back to the room. Your meditation is complete."
        };
        
        this.setupTextToSpeech();
    }
    
    setupTextToSpeech() {
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
            this.voiceSettings = {
                rate: 0.8,
                pitch: 1.0,
                volume: this.settings.voiceVolume
            };
        }
    }
    
    speakText(text) {
        if (!this.speechSynthesis) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.voiceSettings.rate;
        utterance.pitch = this.voiceSettings.pitch;
        utterance.volume = this.voiceSettings.volume * this.settings.masterVolume;
        
        this.speechSynthesis.speak(utterance);
    }
    
    // Meditation guidance methods
    startMeditationGuidance() {
        if (!this.settings.autoPlay) return;
        
        // Start ambient sound if selected
        if (this.currentAmbientSound && this.currentAmbientSound.soundKey !== 'silence') {
            this.startAmbientSound(this.currentAmbientSound.audioNodes);
        }
        
        // Begin voice guidance
        setTimeout(() => {
            this.speakText(this.voiceGuidance.start);
        }, 1000);
    }
    
    stopMeditationGuidance() {
        this.stopAllSounds();
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
    }
    
    // Event listeners
    setupEventListeners() {
        // Listen for meditation start
        document.addEventListener('timerStarted', () => {
            this.startMeditationGuidance();
        });
        
        // Listen for meditation end
        document.addEventListener('timerCompleted', () => {
            this.stopMeditationGuidance();
        });
        
        // Listen for page changes
        document.addEventListener('pageChanged', (e) => {
            if (e.detail.page !== 'timer') {
                this.stopMeditationGuidance();
            }
        });
        
        // Listen for visibility changes (pause when tab not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Optionally pause audio when tab is not visible
            } else {
                // Resume audio when tab becomes visible
            }
        });
    }
}

// Initialize audio system
document.addEventListener('DOMContentLoaded', () => {
    window.audioSystem = new AudioSystem();
});
