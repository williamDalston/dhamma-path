/**
 * Clarity Sanctuary - A Sanctuary for Your Voice
 * 
 * The goal of this page is not performance; it is presence.
 * It's a safe space for the user to connect their inner thoughts 
 * to their spoken voice, building confidence through self-awareness, not critique.
 */

class ClaritySanctuary {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.isPlaying = false;
        this.currentAudio = null;
        this.breathPacerInterval = null;
        this.waveformInterval = null;
        this.currentPromptIndex = 0;
        this.hasPermission = false;
        
        // Prompts - Supportive and introspective
        this.prompts = [
            {
                id: 'intention',
                text: 'What is one intention you hold for today?',
                subtitle: 'Speak it into existence',
                icon: '💭'
            },
            {
                id: 'anticipation',
                text: 'Describe something you\'re looking forward to, in detail',
                subtitle: 'Let your excitement flow',
                icon: '🌟'
            },
            {
                id: 'values',
                text: 'Articulate a core value that will guide your actions today',
                subtitle: 'Connect with what matters',
                icon: '⚖️'
            },
            {
                id: 'challenge',
                text: 'Talk through a small challenge you\'re facing, as if to a trusted friend',
                subtitle: 'Speak with compassion',
                icon: '🤔'
            },
            {
                id: 'gratitude',
                text: 'What are you grateful for right now?',
                subtitle: 'Explain why',
                icon: '🙏'
            },
            {
                id: 'growth',
                text: 'Describe one way you\'ve grown recently and how it feels',
                subtitle: 'Honor your journey',
                icon: '🌱'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updatePromptDisplay();
        this.checkMicrophoneSupport();
        console.log('🎤 Clarity Sanctuary initialized');
    }
    
    bindEvents() {
        // Recording controls
        const recordButton = document.getElementById('record-button');
        const stopButton = document.getElementById('stop-button');
        const playButton = document.getElementById('play-button');
        const saveButton = document.getElementById('save-button');
        
        if (recordButton) {
            recordButton.addEventListener('click', () => this.startRecording());
        }
        
        if (stopButton) {
            stopButton.addEventListener('click', () => this.stopRecording());
        }
        
        if (playButton) {
            playButton.addEventListener('click', () => this.togglePlayback());
        }
        
        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveReflection());
        }
        
        // Prompt navigation
        const prevPromptBtn = document.getElementById('prev-prompt-btn');
        const nextPromptBtn = document.getElementById('next-prompt-btn');
        
        if (prevPromptBtn) {
            prevPromptBtn.addEventListener('click', () => this.previousPrompt());
        }
        
        if (nextPromptBtn) {
            nextPromptBtn.addEventListener('click', () => this.nextPrompt());
        }
        
        // Progress bar interaction
        const progressTrack = document.getElementById('progress-track');
        if (progressTrack) {
            progressTrack.addEventListener('click', (e) => this.seekAudio(e));
        }
        
        // Privacy toggle
        const privacyCheckbox = document.getElementById('privacy-checkbox');
        if (privacyCheckbox) {
            privacyCheckbox.addEventListener('change', (e) => this.togglePrivacy(e));
        }
        
        // Prompt selection modal
        this.bindPromptModalEvents();
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isRecording) {
                this.pauseRecording();
            }
        });
        
        // Handle app interruptions
        window.addEventListener('beforeunload', () => {
            if (this.isRecording) {
                this.stopRecording();
            }
        });
    }
    
    bindPromptModalEvents() {
        const promptsModal = document.getElementById('prompts-modal');
        const closeModalBtn = document.getElementById('close-prompts-modal');
        const cancelBtn = document.getElementById('cancel-prompts-modal');
        const selectBtn = document.getElementById('select-prompt-btn');
        
        // Open modal when clicking navigation buttons
        const prevBtn = document.getElementById('prev-prompt-btn');
        const nextBtn = document.getElementById('next-prompt-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                if (e.shiftKey) {
                    e.preventDefault();
                    this.openPromptModal();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                if (e.shiftKey) {
                    e.preventDefault();
                    this.openPromptModal();
                }
            });
        }
        
        // Modal controls
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closePromptModal());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closePromptModal());
        }
        
        if (selectBtn) {
            selectBtn.addEventListener('click', () => this.selectPromptFromModal());
        }
        
        // Prompt card selection
        const promptCards = document.querySelectorAll('.prompt-card');
        promptCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove previous selection
                promptCards.forEach(c => c.classList.remove('selected'));
                // Add selection to clicked card
                card.classList.add('selected');
                this.selectedPromptId = card.dataset.prompt;
            });
        });
        
        // Close modal on backdrop click
        if (promptsModal) {
            promptsModal.addEventListener('click', (e) => {
                if (e.target === promptsModal) {
                    this.closePromptModal();
                }
            });
        }
    }
    
    async checkMicrophoneSupport() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showMicrophoneError('Your browser doesn\'t support audio recording');
            return false;
        }
        
        try {
            // Test microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });
            
            // Stop the test stream
            stream.getTracks().forEach(track => track.stop());
            this.hasPermission = true;
            console.log('🎤 Microphone permission granted');
            return true;
            
        } catch (error) {
            console.log('🎤 Microphone permission not granted:', error);
            this.hasPermission = false;
            return false;
        }
    }
    
    async startRecording() {
        if (!this.hasPermission) {
            await this.requestMicrophonePermission();
            return;
        }
        
        try {
            // Get microphone stream
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100
                }
            });
            
            // Create MediaRecorder
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            
            this.audioChunks = [];
            
            // Handle data available
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            // Handle recording stop
            this.mediaRecorder.onstop = () => {
                this.processRecording();
                stream.getTracks().forEach(track => track.stop());
            };
            
            // Start recording
            this.mediaRecorder.start(100); // Collect data every 100ms
            this.isRecording = true;
            
            // Update UI
            this.showRecordingState();
            this.startBreathPacer();
            this.startWaveformAnimation();
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
            
            console.log('🎤 Recording started');
            
        } catch (error) {
            console.error('🎤 Recording failed:', error);
            this.showMicrophoneError('Unable to start recording. Please check your microphone permissions.');
        }
    }
    
    async requestMicrophonePermission() {
        const userConfirmed = confirm(
            'MorningFlow needs access to your microphone to capture your Clarity recordings. ' +
            'Your recordings are always stored privately on this device.\n\n' +
            'Would you like to grant microphone access?'
        );
        
        if (!userConfirmed) {
            this.showMicrophoneError('Microphone access is needed for this exercise. You can enable it anytime in your device\'s Settings.');
            return;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });
            
            // Stop the test stream
            stream.getTracks().forEach(track => track.stop());
            this.hasPermission = true;
            
            // Now start recording
            this.startRecording();
            
        } catch (error) {
            console.error('🎤 Permission denied:', error);
            this.showMicrophoneError('Microphone access is needed for this exercise. You can enable it anytime in your device\'s Settings.');
        }
    }
    
    stopRecording() {
        if (!this.mediaRecorder || !this.isRecording) return;
        
        this.mediaRecorder.stop();
        this.isRecording = false;
        
        // Stop animations
        this.stopBreathPacer();
        this.stopWaveformAnimation();
        
        // Update UI
        this.showPlaybackState();
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        console.log('🎤 Recording stopped');
    }
    
    pauseRecording() {
        if (!this.mediaRecorder || !this.isRecording) return;
        
        this.mediaRecorder.pause();
        this.stopBreathPacer();
        this.stopWaveformAnimation();
        
        // Show resume option
        const stopButton = document.getElementById('stop-button');
        if (stopButton) {
            stopButton.innerHTML = `
                <svg class="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21"/>
                </svg>
            `;
            stopButton.onclick = () => this.resumeRecording();
        }
    }
    
    resumeRecording() {
        if (!this.mediaRecorder) return;
        
        this.mediaRecorder.resume();
        this.startBreathPacer();
        this.startWaveformAnimation();
        
        // Restore stop button
        const stopButton = document.getElementById('stop-button');
        if (stopButton) {
            stopButton.innerHTML = `
                <svg class="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                </svg>
            `;
            stopButton.onclick = () => this.stopRecording();
        }
    }
    
    processRecording() {
        if (this.audioChunks.length === 0) {
            this.showError('No audio was recorded. Please try again.');
            return;
        }
        
        // Create audio blob
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
        
        // Create audio URL
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create audio element
        this.currentAudio = new Audio(audioUrl);
        this.currentAudio.preload = 'metadata';
        
        // Set up audio event listeners
        this.currentAudio.addEventListener('loadedmetadata', () => {
            this.updateDurationDisplay();
        });
        
        this.currentAudio.addEventListener('timeupdate', () => {
            this.updateProgressBar();
        });
        
        this.currentAudio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
        
        console.log('🎤 Recording processed successfully');
    }
    
    togglePlayback() {
        if (!this.currentAudio) return;
        
        if (this.isPlaying) {
            this.currentAudio.pause();
            this.isPlaying = false;
        } else {
            this.currentAudio.play().catch(error => {
                console.error('🎤 Playback failed:', error);
                this.showError('Unable to play audio. Please try again.');
            });
            this.isPlaying = true;
        }
        
        this.updatePlayButton();
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    updatePlayButton() {
        const playButton = document.getElementById('play-button');
        if (!playButton) return;
        
        if (this.isPlaying) {
            playButton.innerHTML = `
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
            `;
        } else {
            playButton.innerHTML = `
                <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21"/>
                </svg>
            `;
        }
    }
    
    seekAudio(event) {
        if (!this.currentAudio) return;
        
        const progressTrack = event.currentTarget;
        const rect = progressTrack.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        
        this.currentAudio.currentTime = this.currentAudio.duration * percentage;
        this.updateProgressBar();
    }
    
    updateProgressBar() {
        if (!this.currentAudio) return;
        
        const progressFill = document.getElementById('progress-fill');
        const currentTimeSpan = document.getElementById('current-time');
        
        if (progressFill) {
            const percentage = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
        if (currentTimeSpan) {
            currentTimeSpan.textContent = this.formatTime(this.currentAudio.currentTime);
        }
    }
    
    updateDurationDisplay() {
        const durationSpan = document.getElementById('duration');
        if (durationSpan && this.currentAudio) {
            durationSpan.textContent = this.formatTime(this.currentAudio.duration);
        }
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    startBreathPacer() {
        const breathPacerFill = document.getElementById('breath-pacer-fill');
        if (breathPacerFill) {
            // Start the 90-second breath pacer
            breathPacerFill.style.width = '0%';
            setTimeout(() => {
                breathPacerFill.style.width = '100%';
            }, 100);
        }
    }
    
    stopBreathPacer() {
        const breathPacerFill = document.getElementById('breath-pacer-fill');
        if (breathPacerFill) {
            breathPacerFill.style.width = '0%';
        }
    }
    
    startWaveformAnimation() {
        const waveBars = document.querySelectorAll('.wave-bar');
        waveBars.forEach((bar, index) => {
            bar.style.animation = `wavePulse 1.5s ease-in-out infinite`;
            bar.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    stopWaveformAnimation() {
        const waveBars = document.querySelectorAll('.wave-bar');
        waveBars.forEach(bar => {
            bar.style.animation = 'none';
            bar.style.height = '1rem';
            bar.style.opacity = '0.6';
        });
    }
    
    showRecordingState() {
        const preRecordingState = document.getElementById('pre-recording-state');
        const recordingState = document.getElementById('recording-state');
        const gentleGuidance = document.getElementById('gentle-guidance');
        
        if (preRecordingState) preRecordingState.classList.add('hidden');
        if (recordingState) recordingState.classList.remove('hidden');
        if (gentleGuidance) gentleGuidance.classList.add('hidden');
    }
    
    showPlaybackState() {
        const recordingState = document.getElementById('recording-state');
        const playbackState = document.getElementById('playback-state');
        const gentleGuidance = document.getElementById('gentle-guidance');
        
        if (recordingState) recordingState.classList.add('hidden');
        if (playbackState) playbackState.classList.remove('hidden');
        if (gentleGuidance) gentleGuidance.classList.remove('hidden');
    }
    
    showPreRecordingState() {
        const preRecordingState = document.getElementById('pre-recording-state');
        const recordingState = document.getElementById('recording-state');
        const playbackState = document.getElementById('playback-state');
        const gentleGuidance = document.getElementById('gentle-guidance');
        
        if (preRecordingState) preRecordingState.classList.remove('hidden');
        if (recordingState) recordingState.classList.add('hidden');
        if (playbackState) playbackState.classList.add('hidden');
        if (gentleGuidance) gentleGuidance.classList.remove('hidden');
    }
    
    previousPrompt() {
        this.currentPromptIndex = (this.currentPromptIndex - 1 + this.prompts.length) % this.prompts.length;
        this.updatePromptDisplay();
    }
    
    nextPrompt() {
        this.currentPromptIndex = (this.currentPromptIndex + 1) % this.prompts.length;
        this.updatePromptDisplay();
    }
    
    updatePromptDisplay() {
        const prompt = this.prompts[this.currentPromptIndex];
        const promptText = document.getElementById('prompt-text');
        const promptSubtitle = document.getElementById('prompt-subtitle');
        
        if (promptText) {
            promptText.textContent = prompt.text;
        }
        
        if (promptSubtitle) {
            promptSubtitle.textContent = prompt.subtitle;
        }
    }
    
    openPromptModal() {
        const modal = document.getElementById('prompts-modal');
        if (modal) {
            modal.classList.remove('hidden');
            // Reset selection
            this.selectedPromptId = null;
            document.querySelectorAll('.prompt-card').forEach(card => {
                card.classList.remove('selected');
            });
        }
    }
    
    closePromptModal() {
        const modal = document.getElementById('prompts-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    selectPromptFromModal() {
        if (!this.selectedPromptId) return;
        
        const promptIndex = this.prompts.findIndex(p => p.id === this.selectedPromptId);
        if (promptIndex !== -1) {
            this.currentPromptIndex = promptIndex;
            this.updatePromptDisplay();
        }
        
        this.closePromptModal();
    }
    
    togglePrivacy(event) {
        const isPrivate = event.target.checked;
        const privacyIcon = document.querySelector('.privacy-icon');
        
        if (privacyIcon) {
            privacyIcon.textContent = isPrivate ? '🔒' : '🔓';
        }
    }
    
    async saveReflection() {
        const reflectionText = document.getElementById('reflection-textarea')?.value || '';
        const isPrivate = document.getElementById('privacy-checkbox')?.checked || false;
        
        if (!this.currentAudio) {
            this.showError('No recording to save. Please record something first.');
            return;
        }
        
        try {
            // Create reflection entry
            const reflection = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                prompt: this.prompts[this.currentPromptIndex],
                audioBlob: this.audioChunks,
                reflection: reflectionText,
                isPrivate: isPrivate,
                duration: this.currentAudio.duration
            };
            
            // Save to localStorage
            this.saveReflectionToStorage(reflection);
            
            // Show success message
            this.showSuccess('Your reflection has been saved privately to this device.');
            
            // Reset for new recording
            this.resetForNewRecording();
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            
            console.log('💾 Reflection saved successfully');
            
        } catch (error) {
            console.error('💾 Save failed:', error);
            this.showError('Unable to save reflection. Please try again.');
        }
    }
    
    saveReflectionToStorage(reflection) {
        try {
            const existingReflections = JSON.parse(localStorage.getItem('clarityReflections') || '[]');
            
            // Convert audio blob to base64 for storage
            const audioBlob = new Blob(reflection.audioBlob, { type: 'audio/webm;codecs=opus' });
            const reader = new FileReader();
            
            reader.onload = () => {
                reflection.audioData = reader.result;
                delete reflection.audioBlob; // Remove blob, keep base64
                
                existingReflections.push(reflection);
                localStorage.setItem('clarityReflections', JSON.stringify(existingReflections));
                
                // Clean up audio URL
                if (this.currentAudio && this.currentAudio.src) {
                    URL.revokeObjectURL(this.currentAudio.src);
                }
            };
            
            reader.readAsDataURL(audioBlob);
            
        } catch (error) {
            console.error('💾 Storage failed:', error);
            throw error;
        }
    }
    
    resetForNewRecording() {
        // Reset UI
        this.showPreRecordingState();
        
        // Reset audio
        this.currentAudio = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.isPlaying = false;
        
        // Reset form
        const reflectionTextarea = document.getElementById('reflection-textarea');
        const privacyCheckbox = document.getElementById('privacy-checkbox');
        
        if (reflectionTextarea) reflectionTextarea.value = '';
        if (privacyCheckbox) privacyCheckbox.checked = false;
        
        // Reset progress
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) progressFill.style.width = '0%';
        
        const currentTime = document.getElementById('current-time');
        const duration = document.getElementById('duration');
        if (currentTime) currentTime.textContent = '0:00';
        if (duration) duration.textContent = '0:00';
    }
    
    showMicrophoneError(message) {
        const recordButton = document.getElementById('record-button');
        if (recordButton) {
            recordButton.disabled = true;
            recordButton.innerHTML = `
                <div class="text-center">
                    <div class="text-white text-sm mb-2">🎤</div>
                    <div class="text-white text-xs">Microphone needed</div>
                </div>
            `;
        }
        
        this.showError(message);
    }
    
    showError(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 300);
        }, 3000);
    }
    
    showSuccess(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.clarity-sanctuary')) {
        window.claritySanctuary = new ClaritySanctuary();
        console.log('🎤 Clarity Sanctuary ready');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClaritySanctuary;
}
