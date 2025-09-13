/**
 * Welcome Screen - The Trust Covenant
 * Privacy-first welcome experience with immediate breathing exercise
 */

class WelcomeScreen {
    constructor() {
        this.isInitialized = false;
        this.breathingActive = false;
        this.breathingInterval = null;
        this.breathCycle = 0;
        this.breathTexts = ['Breathe In', 'Hold', 'Breathe Out', 'Rest'];
        
        this.init();
    }

    init() {
        console.log('🏠 Initializing Welcome Screen...');
        this.setupEventListeners();
        this.setupBreathingExercise();
        this.setupTrustCovenant();
        this.isInitialized = true;
        console.log('✅ Welcome Screen initialized');
    }

    setupEventListeners() {
        // Breathing exercise controls
        const startBreathingBtn = document.getElementById('startBreathing');
        if (startBreathingBtn) {
            startBreathingBtn.addEventListener('click', () => {
                this.toggleBreathing();
            });
        }

        // Begin flow button
        const beginFlowBtn = document.getElementById('beginFlow');
        if (beginFlowBtn) {
            beginFlowBtn.addEventListener('click', () => {
                this.beginFlow();
            });
        }

        // Privacy features hover effects
        const privacyFeatures = document.querySelectorAll('.privacy-feature');
        privacyFeatures.forEach(feature => {
            feature.addEventListener('mouseenter', () => {
                this.animatePrivacyFeature(feature, 'enter');
            });
            
            feature.addEventListener('mouseleave', () => {
                this.animatePrivacyFeature(feature, 'leave');
            });
        });
    }

    setupBreathingExercise() {
        // Setup breathing circle animation
        const breathCircle = document.querySelector('.breath-circle');
        if (breathCircle) {
            // Add click-to-start functionality
            breathCircle.addEventListener('click', () => {
                this.toggleBreathing();
            });
        }

        // Setup breath text animation
        this.updateBreathText('Breathe');
    }

    setupTrustCovenant() {
        // Animate privacy badge on load
        const privacyBadge = document.querySelector('.privacy-badge');
        if (privacyBadge) {
            setTimeout(() => {
                privacyBadge.style.opacity = '0';
                privacyBadge.style.transform = 'translateY(-20px)';
                privacyBadge.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    privacyBadge.style.opacity = '1';
                    privacyBadge.style.transform = 'translateY(0)';
                }, 100);
            }, 500);
        }

        // Animate trust messages
        const trustMessages = document.querySelectorAll('.trust-message');
        trustMessages.forEach((message, index) => {
            setTimeout(() => {
                message.style.opacity = '0';
                message.style.transform = 'translateY(20px)';
                message.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    message.style.opacity = '1';
                    message.style.transform = 'translateY(0)';
                }, 100);
            }, 800 + (index * 200));
        });

        // Animate privacy features
        const privacyFeatures = document.querySelectorAll('.privacy-feature');
        privacyFeatures.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateX(-30px)';
                feature.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    feature.style.opacity = '1';
                    feature.style.transform = 'translateX(0)';
                }, 100);
            }, 1200 + (index * 150));
        });
    }

    toggleBreathing() {
        if (this.breathingActive) {
            this.stopBreathing();
        } else {
            this.startBreathing();
        }
    }

    startBreathing() {
        console.log('🫁 Starting breathing exercise...');
        
        this.breathingActive = true;
        const breathCircle = document.querySelector('.breath-circle');
        const startBtn = document.getElementById('startBreathing');
        
        if (breathCircle) {
            breathCircle.classList.add('breathing');
        }
        
        if (startBtn) {
            startBtn.classList.add('breathing');
            startBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="4" height="4" rx="1" fill="currentColor"/>
                    <rect x="14" y="6" width="4" height="4" rx="1" fill="currentColor"/>
                    <rect x="6" y="14" width="4" height="4" rx="1" fill="currentColor"/>
                    <rect x="14" y="14" width="4" height="4" rx="1" fill="currentColor"/>
                </svg>
                Stop Breathing
            `;
        }
        
        // Start breath cycle
        this.breathCycle = 0;
        this.breathingInterval = setInterval(() => {
            this.updateBreathCycle();
        }, 4000); // 4 seconds per cycle
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
        
        // Track breathing start
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('breathing_exercise_started', {
                location: 'welcome_screen',
                duration: 'unlimited'
            });
        }
    }

    stopBreathing() {
        console.log('🫁 Stopping breathing exercise...');
        
        this.breathingActive = false;
        const breathCircle = document.querySelector('.breath-circle');
        const startBtn = document.getElementById('startBreathing');
        
        if (breathCircle) {
            breathCircle.classList.remove('breathing');
        }
        
        if (startBtn) {
            startBtn.classList.remove('breathing');
            startBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
                Start Breathing
            `;
        }
        
        // Clear breathing interval
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }
        
        // Reset breath text
        this.updateBreathText('Breathe');
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
        
        // Track breathing stop
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('breathing_exercise_stopped', {
                location: 'welcome_screen',
                duration: 'unlimited'
            });
        }
    }

    updateBreathCycle() {
        this.breathCycle = (this.breathCycle + 1) % this.breathTexts.length;
        const breathText = this.breathTexts[this.breathCycle];
        this.updateBreathText(breathText);
        
        // Provide subtle haptic feedback for each breath phase
        if (window.hapticStorytelling && this.breathCycle === 0) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'gentle');
        }
    }

    updateBreathText(text) {
        const breathTextElement = document.querySelector('.breath-text');
        if (breathTextElement) {
            breathTextElement.style.opacity = '0';
            breathTextElement.style.transform = 'scale(0.8)';
            breathTextElement.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                breathTextElement.textContent = text;
                breathTextElement.style.opacity = '1';
                breathTextElement.style.transform = 'scale(1)';
            }, 150);
        }
    }

    animatePrivacyFeature(feature, action) {
        const icon = feature.querySelector('.feature-icon');
        if (icon) {
            if (action === 'enter') {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'all 0.3s ease';
            } else {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.transition = 'all 0.3s ease';
            }
        }
    }

    beginFlow() {
        console.log('🌅 Beginning morning flow...');
        
        // Stop breathing if active
        if (this.breathingActive) {
            this.stopBreathing();
        }
        
        // Track flow start
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('morning_flow_started', {
                location: 'welcome_screen',
                source: 'begin_button'
            });
        }
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'medium');
        }
        
        // Animate button press
        const beginBtn = document.getElementById('beginFlow');
        if (beginBtn) {
            beginBtn.style.transform = 'scale(0.95)';
            beginBtn.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                beginBtn.style.transform = 'scale(1)';
            }, 100);
        }
        
        // Navigate to home page
        setTimeout(() => {
            if (window.navigationManager) {
                window.navigationManager.navigateToPage('home');
            } else {
                // Fallback navigation
                window.location.href = '#home';
            }
        }, 200);
    }

    // Public API
    show() {
        if (!this.isInitialized) {
            this.init();
        }
        
        // Reset breathing state
        this.breathingActive = false;
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }
        
        // Reset breath text
        this.updateBreathText('Breathe');
        
        // Reset button states
        const startBtn = document.getElementById('startBreathing');
        const breathCircle = document.querySelector('.breath-circle');
        
        if (startBtn) {
            startBtn.classList.remove('breathing');
            startBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
                Start Breathing
            `;
        }
        
        if (breathCircle) {
            breathCircle.classList.remove('breathing');
        }
        
        // Track welcome screen view
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('welcome_screen_viewed', {
                timestamp: Date.now(),
                user_type: 'new_user'
            });
        }
    }

    hide() {
        // Stop breathing if active
        if (this.breathingActive) {
            this.stopBreathing();
        }
        
        // Track welcome screen exit
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('welcome_screen_exited', {
                timestamp: Date.now(),
                breathing_completed: this.breathingActive
            });
        }
    }

    // Cleanup
    destroy() {
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }
        
        this.breathingActive = false;
        this.isInitialized = false;
    }
}

// Initialize welcome screen
window.WelcomeScreen = WelcomeScreen;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.welcomeScreen = new WelcomeScreen();
    });
} else {
    window.welcomeScreen = new WelcomeScreen();
}
