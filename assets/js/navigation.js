/**
 * Navigation Module
 * Handles page navigation and mobile menu functionality
 */

class NavigationManager {
    constructor() {
        this.currentPage = 'home';
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        console.log('🚀 Setting up navigation system...');
        this.setupNavigationLinks();
        this.setupMobileMenu();
        console.log('✅ Navigation system initialized');
    }

    setupNavigationLinks() {
        const navLinks = document.querySelectorAll('.main-nav-link');
        console.log('📋 Found navigation links:', navLinks.length);
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                console.log('🔗 Navigation clicked:', page);
                this.navigateToPage(page);
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            console.log('🍔 Setting up mobile menu...');
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) return;

        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        if (this.isMobileMenuOpen) {
            mobileMenu.classList.remove('hidden');
            console.log('📱 Mobile menu opened');
        } else {
            mobileMenu.classList.add('hidden');
            console.log('📱 Mobile menu closed');
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && this.isMobileMenuOpen) {
            mobileMenu.classList.add('hidden');
            this.isMobileMenuOpen = false;
            console.log('📱 Mobile menu closed');
        }
    }

    navigateToPage(pageName) {
        console.log('🔄 Navigating to page:', pageName);
        
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error('❌ Main content not found');
            return;
        }

        this.currentPage = pageName;
        
        // Dispatch page change event for anticipation system
        document.dispatchEvent(new CustomEvent('pageChanged', {
            detail: { page: pageName, previousPage: this.previousPage }
        }));
        this.previousPage = pageName;
        
        // Close mobile menu when navigating
        this.closeMobileMenu();

        // Load page content from templates
        this.loadPageTemplate(pageName).then(() => {
            console.log('✅ Page loaded:', pageName);
            // Initialize page-specific functionality
            this.initializePageFeatures(pageName);
        }).catch(error => {
            console.error('❌ Failed to load page:', error);
            // Fallback to inline content
            const pageContent = this.getPageContent(pageName);
            mainContent.innerHTML = pageContent;
            this.initializePageFeatures(pageName);
        });
    }

    async loadPageTemplate(pageName) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        try {
            // Add loading state
            mainContent.innerHTML = this.getLoadingContent();
            
            // Load template from file
            const response = await fetch(`assets/templates/${pageName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${pageName}.html`);
            }
            
            const templateContent = await response.text();
            mainContent.innerHTML = templateContent;
            
            // Trigger animations after content loads
            setTimeout(() => {
                this.triggerAnimations();
            }, 50);
            
        } catch (error) {
            console.error('❌ Template loading failed:', error);
            throw error;
        }
    }

    getLoadingContent() {
        return `
            <div class="flex items-center justify-center min-h-[400px]">
                <div class="text-center">
                    <div class="loading-premium mx-auto mb-4"></div>
                    <p class="text-charcoal/70">Loading...</p>
                </div>
            </div>
        `;
    }

    triggerAnimations() {
        // Trigger intersection observer animations
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach((element, index) => {
            const delay = parseInt(element.dataset.delay) || 0;
            setTimeout(() => {
                const animationType = element.dataset.animate;
                element.classList.add(`animate-${animationType}`);
            }, delay);
        });
    }

    getPageContent(pageName) {
        const pages = {
            'home': this.getHomePageContent(),
            'timer': this.getTimerPageContent(),
            'journal': this.getJournalPageContent(),
            'workout': this.getWorkoutPageContent(),
            'clarity': this.getClarityPageContent(),
        };

        return pages[pageName] || pages['home'];
    }

    getHomePageContent() {
        return `
            <!-- Flow Start - The One Thing Approach -->
            <div class="flow-start min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
                <!-- Subtle Background Elements -->
                <div class="absolute inset-0 morphing-premium opacity-3 pointer-events-none"></div>
                
                <div class="relative z-10 max-w-2xl mx-auto text-center">
                    <!-- Personalized Greeting -->
                    <div class="greeting mb-12 animate-fade-up">
                        <h1 class="greeting-text text-4xl md:text-6xl font-bold text-charcoal mb-4 leading-tight">
                            Good morning, <span class="text-forest-deep">Alex</span>.
                        </h1>
                        <p class="greeting-subtitle text-xl md:text-2xl text-charcoal/70 font-medium">
                            Ready to begin your flow?
                        </p>
                    </div>
                    
                    <!-- Single Hero Action -->
                    <div class="hero-action mb-16 animate-fade-up">
                        <div class="activity-preview bg-white/60 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/30 shadow-xl max-w-md mx-auto">
                            <div class="activity-icon text-6xl mb-6 float-premium">🧘</div>
                            <div class="activity-info">
                                <h2 class="activity-title text-2xl md:text-3xl font-bold text-forest-deep mb-3">
                                    10-Minute Meditation
                                </h2>
                                <p class="activity-description text-charcoal/70 text-lg leading-relaxed">
                                    Start your day with mindful breathing and inner calm
                                </p>
                            </div>
                        </div>
                        
                        <button class="btn-primary btn-xl text-xl px-12 py-6 rounded-2xl shadow-hover hover:shadow-premium transform hover:scale-105 transition-all duration-300 begin-flow-btn" 
                                style="background: var(--gradient-premium); border: 2px solid var(--gold-medium);">
                            <span class="text-2xl mr-4">✨</span>Begin Flow
                        </button>
                    </div>
                    
                    <!-- Minimal Secondary Actions -->
                    <div class="secondary-actions animate-fade-up">
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <button class="btn-ghost btn-lg px-8 py-4 rounded-xl hover:bg-forest-green/10 transition-all duration-300 customize-flow-btn">
                                <span class="text-lg mr-3">⚙️</span>Customize Today's Flow
                            </button>
                            <button class="btn-ghost btn-lg px-8 py-4 rounded-xl hover:bg-forest-green/10 transition-all duration-300 view-progress-btn">
                                <span class="text-lg mr-3">📊</span>View Progress
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTimerPageContent() {
        return `
            <div class="text-center py-16">
                <h1 class="text-4xl font-bold text-charcoal mb-8">🧘 Meditation Timer</h1>
                <div class="bg-white/80 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
                    <div id="timer-display" class="text-6xl font-bold text-forest-green mb-6">10:00</div>
                    <div class="mb-6">
                        <select id="timer-duration" class="w-full px-4 py-3 border-2 border-forest-green/30 rounded-xl">
                            <option value="300">5 minutes</option>
                            <option value="600" selected>10 minutes</option>
                            <option value="900">15 minutes</option>
                            <option value="1200">20 minutes</option>
                        </select>
                    </div>
                    <div class="flex gap-4">
                        <button id="timer-start-btn" class="flex-1 px-6 py-3 bg-forest-green text-white rounded-xl font-semibold">Start</button>
                        <button id="timer-pause-btn" class="flex-1 px-6 py-3 bg-earth-gold text-white rounded-xl font-semibold hidden">Pause</button>
                        <button id="timer-reset-btn" class="flex-1 px-6 py-3 bg-charcoal/70 text-white rounded-xl font-semibold">Reset</button>
                    </div>
                    <div id="timer-status" class="mt-4 text-charcoal/70">Ready to begin</div>
                </div>
            </div>
        `;
    }

    getJournalPageContent() {
        return `
            <div class="text-center py-16">
                <h1 class="text-4xl font-bold text-charcoal mb-8">✍️ Journal</h1>
                <div class="bg-white/80 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
                    <textarea id="journal-textarea" class="w-full h-64 p-4 border-2 border-forest-green/30 rounded-xl resize-none" placeholder="What light touched your heart today? What wisdom emerged? How is your soul feeling?"></textarea>
                    <button id="journal-save-btn" class="mt-4 px-6 py-3 bg-forest-green text-white rounded-xl font-semibold">Save Entry</button>
                </div>
            </div>
        `;
    }

    getWorkoutPageContent() {
        return `
            <div class="text-center py-16">
                <h1 class="text-4xl font-bold text-charcoal mb-8">💪 7-Minute Workout</h1>
                <div class="bg-white/80 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
                    <div class="text-6xl mb-6">🏃‍♂️</div>
                    <h2 class="text-2xl font-semibold mb-4">Jumping Jacks</h2>
                    <div class="text-4xl font-bold text-forest-green mb-6">30</div>
                    <div class="flex gap-4">
                        <button id="workout-start-btn" class="flex-1 px-6 py-3 bg-forest-green text-white rounded-xl font-semibold">Start</button>
                        <button id="workout-pause-btn" class="flex-1 px-6 py-3 bg-earth-gold text-white rounded-xl font-semibold">Pause</button>
                    </div>
                </div>
            </div>
        `;
    }

    getClarityPageContent() {
        return `
            <!-- Clarity/Vocal Journal - Mindful Expression -->
            <div class="clarity-session min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
                <!-- Subtle Background Elements -->
                <div class="absolute inset-0 morphing-premium opacity-3 pointer-events-none"></div>
                
                <div class="relative z-10 max-w-2xl mx-auto text-center">
                    <!-- Clarity Header -->
                    <div class="clarity-header mb-12 animate-fade-up">
                        <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-sage-deep/20 to-forest-deep/20 rounded-full flex items-center justify-center">
                            <span class="text-3xl">🎤</span>
                        </div>
                        <h1 class="text-4xl md:text-5xl font-bold text-forest-deep mb-4 leading-tight">
                            Clarity
                        </h1>
                        <p class="text-xl md:text-2xl text-charcoal/70 font-medium max-w-lg mx-auto">
                            Transform your inner thoughts into clear, confident expression
                        </p>
                    </div>
                    
                    <!-- Expression Container -->
                    <div class="expression-container glass-control-strong mb-12 animate-fade-up">
                        <!-- Current Prompt -->
                        <div class="prompt-display mb-8">
                            <div class="prompt-icon text-4xl mb-4">💭</div>
                            <h2 class="prompt-title text-2xl md:text-3xl font-bold text-forest-deep mb-4" id="prompt-title">
                                What is one intention you hold for today?
                            </h2>
                            <p class="prompt-description text-lg text-charcoal/70 leading-relaxed" id="prompt-description">
                                Speak it into existence. Take your time and let your words flow naturally.
                            </p>
                        </div>
                        
                        <!-- Expression Timer -->
                        <div class="expression-timer mb-8">
                            <div class="timer-container relative">
                                <svg class="timer-circle w-32 h-32 mx-auto transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--sage-light)" stroke-width="3" opacity="0.3"/>
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--forest-deep)" stroke-width="3" 
                                            stroke-dasharray="283" stroke-dashoffset="283" id="timer-progress"
                                            class="transition-all duration-1000 ease-out"/>
                                </svg>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="timer-display text-2xl font-bold text-forest-deep" id="timer-display">
                                        Ready
                                    </div>
                                </div>
                            </div>
                            <p class="timer-guidance text-sm text-charcoal/60 mt-4" id="timer-guidance">
                                Speak for about a minute. Take your time.
                            </p>
                        </div>
                        
                        <!-- Recording Controls -->
                        <div class="recording-controls">
                            <button class="btn-primary btn-xl px-12 py-6 rounded-2xl shadow-hover hover:shadow-premium transform hover:scale-105 transition-all duration-300 start-expression-btn" 
                                    style="background: var(--gradient-calm); border: 2px solid var(--sage-medium);">
                                <span class="text-2xl mr-4">🎤</span>Begin Expression
                            </button>
                            
                            <button class="btn-ghost btn-lg px-8 py-4 rounded-xl hover:bg-sage-deep/10 transition-all duration-300 hidden" id="stop-expression-btn">
                                <span class="text-lg mr-3">⏹️</span>Complete
                            </button>
                            
                            <button class="btn-ghost btn-lg px-8 py-4 rounded-xl hover:bg-sage-deep/10 transition-all duration-300 hidden" id="listen-back-btn">
                                <span class="text-lg mr-3">🔊</span>Listen Back
                            </button>
                        </div>
                    </div>
                    
                    <!-- Clarity Cues -->
                    <div class="clarity-cues glass-card mb-8 animate-fade-up">
                        <h3 class="text-lg font-bold text-forest-deep mb-4">Clarity Cues</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-charcoal/70">
                            <div class="flex items-start space-x-2">
                                <span class="text-sage-deep">•</span>
                                <span>Speak slower than you think you need to</span>
                            </div>
                            <div class="flex items-start space-x-2">
                                <span class="text-sage-deep">•</span>
                                <span>It's okay to pause and breathe</span>
                            </div>
                            <div class="flex items-start space-x-2">
                                <span class="text-sage-deep">•</span>
                                <span>Focus on clarity, not perfection</span>
                            </div>
                            <div class="flex items-start space-x-2">
                                <span class="text-sage-deep">•</span>
                                <span>Let your authentic voice emerge</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Prompt Navigation -->
                    <div class="prompt-navigation flex justify-center space-x-4 mb-8">
                        <button class="btn-ghost btn-sm px-4 py-2 rounded-lg hover:bg-sage-deep/10 transition-all duration-300" id="prev-prompt-btn">
                            <span class="text-lg mr-2">←</span>Previous
                        </button>
                        <button class="btn-ghost btn-sm px-4 py-2 rounded-lg hover:bg-sage-deep/10 transition-all duration-300" id="next-prompt-btn">
                            Next<span class="text-lg ml-2">→</span>
                        </button>
                    </div>
                    
                    <!-- Reflection Section (Hidden initially) -->
                    <div class="reflection-section hidden" id="reflection-section">
                        <div class="glass-card mb-8">
                            <h3 class="text-xl font-bold text-forest-deep mb-4">Reflection</h3>
                            <p class="text-charcoal/70 mb-6">How did that feel? Notice the clarity and confidence in your voice.</p>
                            <div class="flex gap-4 justify-center">
                                <button class="btn-ghost btn-md px-6 py-3 rounded-xl hover:bg-sage-deep/10 transition-all duration-300" id="save-reflection-btn">
                                    <span class="mr-2">💾</span>Save Reflection
                                </button>
                                <button class="btn-ghost btn-md px-6 py-3 rounded-xl hover:bg-sage-deep/10 transition-all duration-300" id="new-expression-btn">
                                    <span class="mr-2">🔄</span>New Expression
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initializePageFeatures(pageName) {
        console.log(`🎯 Initializing ${pageName} page features...`);
        
        // Initialize page-specific functionality
        switch (pageName) {
            case 'welcome':
                this.initializeWelcomePage();
                break;
            case 'timer':
                this.initializeTimerPage();
                break;
            case 'journal':
                this.initializeJournalPage();
                break;
            case 'workout':
                this.initializeWorkoutPage();
                break;
            case 'gratitude':
                this.initializeGratitudePage();
                break;
            case 'wisdom':
                this.initializeWisdomPage();
                break;
            case 'analytics':
                this.initializeAnalyticsPage();
                break;
            case 'clarity':
                this.initializeClarityPage();
                break;
            case 'home':
                this.initializeHomePage();
                break;
        }
        
        // Initialize magnetic effects for all interactive elements
        this.initializeMagneticEffects();
        
        // Track page view in analytics
        if (window.analyticsSystem && typeof window.analyticsSystem.trackPageView === 'function') {
            window.analyticsSystem.trackPageView();
        }
    }

    initializeTimerPage() {
        setTimeout(() => {
            if (window.MeditationTimer) {
                // Clean up any existing timer
                if (window.meditationTimer) {
                    window.meditationTimer.cleanup();
                }
                window.meditationTimer = new window.MeditationTimer();
                console.log('✅ Meditation timer initialized');
            }
        }, 100);
    }

    initializeJournalPage() {
        this.initializeJournal();
        this.initializeJournalTimer();
    }

    initializeJournalTimer() {
        // Initialize journal timer functionality
        const startBtn = document.getElementById('journal-start-btn');
        const pauseBtn = document.getElementById('journal-pause-btn');
        const resetBtn = document.getElementById('journal-reset-btn');
        const display = document.getElementById('journal-display');
        const status = document.getElementById('journal-status');
        const textarea = document.getElementById('journal-textarea');
        const saveBtn = document.getElementById('journal-save-btn');
        const durationBtns = document.querySelectorAll('.journal-duration-btn');
        const progressCircle = document.getElementById('journal-progress-circle');

        if (!startBtn || !display) return;

        let timeRemaining = 600; // 10 minutes default
        let totalTime = 600;
        let isRunning = false;
        let timerInterval = null;

        // Duration button handlers
        durationBtns.forEach(button => {
            button.addEventListener('click', () => {
                durationBtns.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                if (!isRunning) {
                    timeRemaining = parseInt(button.dataset.duration);
                    totalTime = timeRemaining;
                    updateDisplay();
                }
            });
        });

        // Start button
        startBtn.addEventListener('click', () => {
            if (isRunning) return;
            
            isRunning = true;
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            textarea.disabled = false;
            textarea.focus();
            
            updateStatus('Writing in progress...');
            
            timerInterval = setInterval(() => {
                timeRemaining--;
                updateDisplay();
                updateProgressCircle();
                
                if (timeRemaining <= 0) {
                    completeJournal();
                }
            }, 1000);
        });

        // Pause button
        pauseBtn.addEventListener('click', () => {
            if (!isRunning) return;
            
            isRunning = false;
            clearInterval(timerInterval);
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            updateStatus('Session paused');
        });

        // Reset button
        resetBtn.addEventListener('click', () => {
            isRunning = false;
            clearInterval(timerInterval);
            timeRemaining = totalTime;
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            textarea.disabled = true;
            updateDisplay();
            updateProgressCircle();
            updateStatus('Ready to begin your mindful writing practice');
        });

        // Save button
        saveBtn.addEventListener('click', () => {
            const content = textarea.value.trim();
            if (content) {
                const entry = {
                    content,
                    timestamp: new Date().toISOString(),
                    duration: totalTime - timeRemaining
                };
                
                const entries = JSON.parse(localStorage.getItem('journal-entries') || '[]');
                entries.push(entry);
                localStorage.setItem('journal-entries', JSON.stringify(entries));
                
                showNotification('Your thoughts are safely held', 'success');
                textarea.value = '';
                saveBtn.disabled = true;
            }
        });

        // Textarea change handler
        textarea.addEventListener('input', () => {
            const content = textarea.value;
            const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
            const charCount = content.length;
            
            document.getElementById('word-count').textContent = wordCount;
            document.getElementById('char-count').textContent = charCount;
            
            saveBtn.disabled = !content.trim();
        });

        function updateDisplay() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        function updateProgressCircle() {
            if (!progressCircle) return;
            const progress = (totalTime - timeRemaining) / totalTime;
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (progress * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }

        function updateStatus(message) {
            if (status) status.textContent = message;
        }

        function completeJournal() {
            isRunning = false;
            clearInterval(timerInterval);
            updateStatus('Writing session complete! Great job!');
            textarea.disabled = false;
            saveBtn.disabled = !textarea.value.trim();
            
            showNotification('Your sacred reflection is complete!', 'success');
        }

        function showNotification(message, type = 'info') {
            // Use the app's notification system
            if (window.dhammaPathApp && window.dhammaPathApp.showNotification) {
                window.dhammaPathApp.showNotification(message, type);
            }
        }

        // Initial setup
        updateDisplay();
        updateProgressCircle();
    }

    initializeWorkoutPage() {
        this.initializeWorkout();
        this.initializeWorkoutTimer();
    }

    initializeWorkoutTimer() {
        // Enhanced workout timer with exercise navigation
        const startBtn = document.getElementById('workout-start-btn');
        const pauseBtn = document.getElementById('workout-pause-btn');
        const resetBtn = document.getElementById('workout-reset-btn');
        const display = document.getElementById('workout-display');
        const status = document.getElementById('workout-status');
        const prevBtn = document.getElementById('prev-exercise-btn');
        const nextBtn = document.getElementById('next-exercise-btn');
        const exerciseName = document.getElementById('exercise-name');
        const exerciseEmoji = document.getElementById('exercise-emoji');
        const exerciseDescription = document.getElementById('exercise-description');
        const progressCircle = document.getElementById('workout-progress-circle');

        if (!startBtn || !display) return;

        const exercises = [
            { name: 'Jumping Jacks', emoji: '🏃‍♂️', description: 'Start with feet together, arms at sides. Jump up spreading feet shoulder-width apart while bringing arms overhead.', duration: 30 },
            { name: 'Wall Sit', emoji: '🧘‍♂️', description: 'Sit against a wall with your knees at 90 degrees. Hold this position.', duration: 30 },
            { name: 'Push-ups', emoji: '🦵', description: 'Start in plank position. Lower your chest to the ground and push back up.', duration: 30 },
            { name: 'Abdominal Crunch', emoji: '💺', description: 'Lie on your back, knees bent. Lift your shoulders off the ground.', duration: 30 },
            { name: 'Step-up onto Chair', emoji: '🪑', description: 'Step up onto a chair with one foot, then the other. Step down and repeat.', duration: 30 },
            { name: 'Squats', emoji: '🦵', description: 'Stand with feet shoulder-width apart. Lower your body as if sitting in a chair.', duration: 30 },
            { name: 'Triceps Dip on Chair', emoji: '🪑', description: 'Sit on edge of chair, hands beside hips. Slide forward and lower body.', duration: 30 },
            { name: 'Plank', emoji: '🧘‍♂️', description: 'Hold a push-up position with your body in a straight line.', duration: 30 },
            { name: 'High Knees Running in Place', emoji: '🦵', description: 'Run in place, bringing knees up high toward your chest.', duration: 30 },
            { name: 'Lunges', emoji: '🦵', description: 'Step forward with one leg, lowering your hips until both knees are bent at 90 degrees.', duration: 30 },
            { name: 'Push-up and Rotation', emoji: '🦵', description: 'Do a push-up, then rotate to one side in plank position.', duration: 30 },
            { name: 'Side Plank', emoji: '🧘‍♂️', description: 'Lie on your side, prop up on your forearm. Hold your body in a straight line.', duration: 30 }
        ];

        let currentExerciseIndex = 0;
        let timeRemaining = exercises[0].duration;
        let totalTime = exercises[0].duration;
        let isRunning = false;
        let timerInterval = null;

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentExerciseIndex > 0) {
                    currentExerciseIndex--;
                    updateExercise();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentExerciseIndex < exercises.length - 1) {
                    currentExerciseIndex++;
                    updateExercise();
                }
            });
        }

        // Start button
        startBtn.addEventListener('click', () => {
            if (isRunning) return;
            
            isRunning = true;
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            
            updateStatus('Workout in progress...');
            
            timerInterval = setInterval(() => {
                timeRemaining--;
                updateDisplay();
                updateProgressCircle();
                
                if (timeRemaining <= 0) {
                    nextExercise();
                }
            }, 1000);
        });

        // Pause button
        pauseBtn.addEventListener('click', () => {
            if (!isRunning) return;
            
            isRunning = false;
            clearInterval(timerInterval);
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            updateStatus('Workout paused');
        });

        // Reset button
        resetBtn.addEventListener('click', () => {
            isRunning = false;
            clearInterval(timerInterval);
            currentExerciseIndex = 0;
            updateExercise();
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            updateStatus('Ready to begin your workout');
        });

        function updateExercise() {
            const exercise = exercises[currentExerciseIndex];
            timeRemaining = exercise.duration;
            totalTime = exercise.duration;
            
            if (exerciseName) exerciseName.textContent = exercise.name;
            if (exerciseEmoji) exerciseEmoji.textContent = exercise.emoji;
            if (exerciseDescription) exerciseDescription.textContent = exercise.description;
            
            updateDisplay();
            updateProgressCircle();
            
            // Update exercise list highlighting
            updateExerciseList();
        }

        function nextExercise() {
            if (currentExerciseIndex < exercises.length - 1) {
                currentExerciseIndex++;
                updateExercise();
            } else {
                completeWorkout();
            }
        }

        function updateExerciseList() {
            const exerciseItems = document.querySelectorAll('.exercise-item');
            exerciseItems.forEach((item, index) => {
                if (index === currentExerciseIndex) {
                    item.classList.add('border-forest-green/20', 'bg-forest-green/5');
                    item.classList.remove('border-gray-200');
                } else {
                    item.classList.remove('border-forest-green/20', 'bg-forest-green/5');
                    item.classList.add('border-gray-200');
                }
            });
        }

        function updateDisplay() {
            display.textContent = timeRemaining;
        }

        function updateProgressCircle() {
            if (!progressCircle) return;
            const progress = (totalTime - timeRemaining) / totalTime;
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (progress * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }

        function updateStatus(message) {
            if (status) status.textContent = message;
        }

        function completeWorkout() {
            isRunning = false;
            clearInterval(timerInterval);
            updateStatus('Workout complete! Great job!');
            
            showNotification('Your body honors your commitment!', 'success');
        }

        function showNotification(message, type = 'info') {
            if (window.dhammaPathApp && window.dhammaPathApp.showNotification) {
                window.dhammaPathApp.showNotification(message, type);
            }
        }

        // Initial setup
        updateExercise();
    }


    initializeWelcomePage() {
        console.log('🏠 Initializing welcome page features...');
        
        // Initialize welcome screen functionality
        if (window.welcomeScreen) {
            window.welcomeScreen.show();
        }
        
        // Hide navigation for welcome screen
        const navigation = document.querySelector('.main-nav');
        if (navigation) {
            navigation.style.display = 'none';
        }
    }

    initializeHomePage() {
        console.log('🏠 Initializing Sacred Gateway...');
        
        // Hide navigation for sacred gateway (singular focus)
        const navigation = document.querySelector('.main-nav');
        if (navigation) {
            navigation.style.display = 'none';
        }
        
        // Initialize Sacred Gateway
        if (window.sacredGateway) {
            console.log('🌅 Sacred Gateway already initialized');
        } else {
            console.log('🌅 Initializing new Sacred Gateway...');
            // The SacredGateway class will auto-initialize when DOM is ready
        }
        
    }
    
    showFlowBuilder() {
        const modal = document.getElementById('flow-builder-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    showProgressView() {
        // Show progress overview
        console.log('📊 Showing progress view');
        
        // Create progress modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-charcoal">Your Progress</h2>
                    <button class="close-progress-modal text-charcoal/60 hover:text-charcoal text-2xl">×</button>
                </div>
                
                <div class="space-y-6">
                    <!-- Streak Card -->
                    <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-lg font-semibold text-green-800">Current Streak</h3>
                                <p class="text-3xl font-bold text-green-900" id="progress-streak">7 days</p>
                            </div>
                            <div class="text-4xl">🔥</div>
                        </div>
                    </div>
                    
                    <!-- Activity Stats -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div class="text-blue-800 text-sm font-medium">Meditation</div>
                            <div class="text-2xl font-bold text-blue-900" id="progress-meditation">12 sessions</div>
                        </div>
                        <div class="bg-purple-50 rounded-xl p-4 border border-purple-200">
                            <div class="text-purple-800 text-sm font-medium">Journal</div>
                            <div class="text-2xl font-bold text-purple-900" id="progress-journal">8 entries</div>
                        </div>
                        <div class="bg-orange-50 rounded-xl p-4 border border-orange-200">
                            <div class="text-orange-800 text-sm font-medium">Workout</div>
                            <div class="text-2xl font-bold text-orange-900" id="progress-workout">5 sessions</div>
                        </div>
                        <div class="bg-pink-50 rounded-xl p-4 border border-pink-200">
                            <div class="text-pink-800 text-sm font-medium">Gratitude</div>
                            <div class="text-2xl font-bold text-pink-900" id="progress-gratitude">15 entries</div>
                        </div>
                    </div>
                    
                    <!-- Weekly Progress -->
                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">This Week</h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600">Completion Rate</span>
                                <span class="font-semibold text-gray-900" id="progress-completion">85%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600">Total Time</span>
                                <span class="font-semibold text-gray-900" id="progress-time">2h 30m</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 flex justify-end">
                    <button class="close-progress-modal bg-forest-green text-white px-6 py-2 rounded-lg hover:bg-forest-deep transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Load progress data
        this.loadProgressData();
        
        // Close modal handlers
        modal.querySelectorAll('.close-progress-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    loadProgressData() {
        // Load and display real progress data
        const history = JSON.parse(localStorage.getItem('morningFlowHistory') || '[]');
        const journalEntries = JSON.parse(localStorage.getItem('morningFlowJournalEntries') || '[]');
        const gratitudeEntries = JSON.parse(localStorage.getItem('morningFlowGratitudeEntries') || '[]');
        
        // Update elements
        const elements = {
            'progress-streak': Math.min(history.length, 30) + ' days',
            'progress-meditation': history.filter(s => s.type === 'meditation').length + ' sessions',
            'progress-journal': journalEntries.length + ' entries',
            'progress-workout': history.filter(s => s.type === 'workout').length + ' sessions',
            'progress-gratitude': gratitudeEntries.length + ' entries',
            'progress-completion': Math.round((history.filter(s => s.completed).length / Math.max(history.length, 1)) * 100) + '%',
            'progress-time': this.calculateTotalTime(history)
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    }
    
    calculateTotalTime(history) {
        const totalMinutes = history.reduce((total, session) => {
            return total + (session.duration || 0);
        }, 0);
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
    
    setupFlowBuilderModal() {
        // Close modal button
        const closeBtn = document.querySelector('#close-flow-builder');
        const cancelBtn = document.querySelector('#cancel-flow-builder');
        const modal = document.querySelector('#flow-builder-modal');
        
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
        
        if (cancelBtn && modal) {
            cancelBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
        
        // Save flow button
        const saveBtn = document.querySelector('#save-flow-builder');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveCustomFlow();
                modal.classList.add('hidden');
            });
        }
        
        // Duration sliders
        const sliders = document.querySelectorAll('.duration-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                const valueSpan = e.target.parentElement.querySelector('.duration-value');
                if (valueSpan) {
                    valueSpan.textContent = value + ' min';
                }
            });
        });
        
        // Click outside to close
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    }
    
    saveCustomFlow() {
        const meditationDuration = document.querySelector('#meditation-duration')?.value || 10;
        const journalDuration = document.querySelector('#journal-duration')?.value || 10;
        const exerciseDuration = document.querySelector('#exercise-duration')?.value || 10;
        
        const customFlow = {
            meditation: parseInt(meditationDuration),
            journal: parseInt(journalDuration),
            exercise: parseInt(exerciseDuration),
            timestamp: Date.now()
        };
        
        localStorage.setItem('customFlow', JSON.stringify(customFlow));
        
        if (window.dhammaPathApp && window.dhammaPathApp.showNotification) {
            window.dhammaPathApp.showNotification('Your sacred flow is preserved!', 'success');
        }
        
        console.log('💾 Custom flow saved:', customFlow);
    }
    
    generateSmartRecommendation() {
        // Simple smart recommendation logic
        const hour = new Date().getHours();
        const savedFlow = localStorage.getItem('customFlow');
        
        let recommendation = {
            activity: 'timer',
            title: '10-Minute Meditation',
            description: 'Start your day with mindful breathing and inner calm',
            icon: '🧘'
        };
        
        // Time-based recommendations
        if (hour < 6) {
            recommendation = {
                activity: 'timer',
                title: '5-Minute Meditation',
                description: 'Gentle morning meditation to start your day',
                icon: '🌅'
            };
        } else if (hour > 10) {
            recommendation = {
                activity: 'clarity',
                title: 'Vocal Expression',
                description: 'Articulate your intentions for the day ahead',
                icon: '🎤'
            };
        }
        
        // Update the activity preview if elements exist
        const activityIcon = document.querySelector('.activity-icon');
        const activityTitle = document.querySelector('.activity-title');
        const activityDescription = document.querySelector('.activity-description');
        
        if (activityIcon) activityIcon.textContent = recommendation.icon;
        if (activityTitle) activityTitle.textContent = recommendation.title;
        if (activityDescription) activityDescription.textContent = recommendation.description;
        
        // Store recommendation for use by Begin Flow button
        this.currentRecommendation = recommendation;
        
        console.log('🎯 Smart recommendation generated:', recommendation);
    }

    initializeMagneticEffects() {
        // Initialize magnetic effects for interactive elements
        const magneticElements = document.querySelectorAll('.magnetic');
        magneticElements.forEach(element => {
            if (window.AnimationSystem) {
                window.AnimationSystem.initMagneticElement(element);
            }
        });
    }

    initializeJournal() {
        const saveBtn = document.getElementById('journal-save-btn');
        const textarea = document.getElementById('journal-textarea');
        
        if (saveBtn && textarea) {
            saveBtn.addEventListener('click', () => {
                const content = textarea.value;
                if (content.trim()) {
                    localStorage.setItem('journal-entry-' + Date.now(), content);
                    alert('Journal entry saved!');
                    textarea.value = '';
                }
            });
        }
    }

    initializeWorkout() {
        // Basic workout functionality
        console.log('💪 Workout page initialized');
    }

    initializeGratitudePage() {
        console.log('✨ Initializing Gratitude Sanctuary...');
        
        // Initialize the Sanctuary System
        if (window.sanctuarySystem) {
            console.log('🏛️ Sanctuary System already initialized');
        } else {
            console.log('🏛️ Initializing new Sanctuary System...');
            // The SanctuarySystem class will auto-initialize when DOM is ready
        }
        
        // Track analytics
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: 'Three Points of Light - Gratitude Sanctuary',
                page_location: window.location.href
            });
        }
    }
    
    initializeWisdomPage() {
        console.log('📚 Initializing Wisdom Collection...');
        
        // Initialize the Wisdom Collection display
        if (window.mirrorOfDuality) {
            this.displayWisdomCollection();
        } else {
            console.log('🪞 Mirror of Duality not yet initialized');
            // Wait for initialization
            setTimeout(() => {
                if (window.mirrorOfDuality) {
                    this.displayWisdomCollection();
                }
            }, 1000);
        }
        
        // Track analytics
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: 'Wisdom Collection - Your Personal Insights',
                page_location: window.location.href
            });
        }
    }
    
    initializeAnalyticsPage() {
        console.log('📊 Initializing Analytics Dashboard...');
        
        // Initialize the Analytics Engine
        if (window.analyticsEngine) {
            this.setupAnalyticsDashboard();
        } else {
            console.log('📊 Analytics Engine not yet initialized');
            // Wait for initialization
            setTimeout(() => {
                if (window.analyticsEngine) {
                    this.setupAnalyticsDashboard();
                }
            }, 1000);
        }
        
        // Track analytics
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: 'Analytics Dashboard - Performance Monitoring',
                page_location: window.location.href
            });
        }
    }
    
    setupAnalyticsDashboard() {
        // Setup chart period buttons
        const periodButtons = document.querySelectorAll('.chart-period-btn');
        periodButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons
                periodButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update charts based on selected period
                this.updateCharts(e.target.dataset.period);
            });
        });
        
        // Setup refresh button
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshAnalyticsDashboard();
            });
        }
        
        // Initialize analytics data
        this.initializeAnalyticsData();
        
        // Start real-time updates
        this.startRealTimeUpdates();
    }
    
    updateCharts(period) {
        console.log(`📊 Updating charts for period: ${period}`);
        // In a real implementation, you'd update the charts with new data
        // based on the selected time period
    }
    
    refreshAnalyticsDashboard() {
        console.log('🔄 Refreshing analytics dashboard...');
        
        // Refresh the refresh icon
        const refreshIcon = document.querySelector('.refresh-icon');
        if (refreshIcon) {
            refreshIcon.style.animation = 'spin 1s linear infinite';
            setTimeout(() => {
                refreshIcon.style.animation = '';
            }, 1000);
        }
        
        // Trigger analytics engine refresh
        if (window.analyticsEngine) {
            window.analyticsEngine.updateMetrics();
            window.analyticsEngine.updateDashboard();
        }
    }
    
    initializeAnalyticsData() {
        // Load real data from localStorage and display it
        this.loadAnalyticsData();
    }
    
    loadAnalyticsData() {
        // Load meditation sessions
        const meditationSessions = JSON.parse(localStorage.getItem('morningFlowHistory') || '[]');
        const meditationCount = meditationSessions.filter(session => session.type === 'meditation').length;
        
        // Load journal entries
        const journalEntries = JSON.parse(localStorage.getItem('morningFlowJournalEntries') || '[]');
        const journalCount = journalEntries.length;
        
        // Load gratitude entries
        const gratitudeEntries = JSON.parse(localStorage.getItem('morningFlowGratitudeEntries') || '[]');
        const gratitudeCount = gratitudeEntries.length;
        
        // Load workout sessions
        const workoutSessions = JSON.parse(localStorage.getItem('morningFlowHistory') || '[]');
        const workoutCount = workoutSessions.filter(session => session.type === 'workout').length;
        
        // Update display
        const meditationEl = document.getElementById('meditation-count');
        const journalEl = document.getElementById('journal-count');
        const gratitudeEl = document.getElementById('gratitude-count');
        const workoutEl = document.getElementById('workout-count');
        
        if (meditationEl) meditationEl.textContent = meditationCount;
        if (journalEl) journalEl.textContent = journalCount;
        if (gratitudeEl) gratitudeEl.textContent = gratitudeCount;
        if (workoutEl) workoutEl.textContent = workoutCount;
        
        // Calculate streak
        this.calculateStreak();
        
        // Calculate completion rate
        this.calculateCompletionRate();
    }
    
    calculateStreak() {
        const history = JSON.parse(localStorage.getItem('morningFlowHistory') || '[]');
        const streakDays = document.getElementById('streak-days');
        if (streakDays) {
            // Simple streak calculation - in real app would be more sophisticated
            streakDays.textContent = Math.min(history.length, 30);
        }
    }
    
    calculateCompletionRate() {
        const history = JSON.parse(localStorage.getItem('morningFlowHistory') || '[]');
        const completionRate = document.getElementById('completion-rate');
        if (completionRate) {
            // Simple completion rate calculation
            const completed = history.filter(session => session.completed).length;
            const total = Math.max(history.length, 1);
            const rate = Math.round((completed / total) * 100);
            completionRate.textContent = `${rate}%`;
        }
    }
    
    startRealTimeUpdates() {
        // Real-time updates are handled by the Analytics Engine
        console.log('📊 Real-time analytics updates started');
    }
    
    displayWisdomCollection() {
        const wisdomCards = document.getElementById('wisdom-cards');
        const emptyState = document.getElementById('empty-state');
        
        if (!wisdomCards) return;
        
        const wisdomCollection = window.mirrorOfDuality.getWisdomCollection();
        
        if (wisdomCollection.length === 0) {
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }
        
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Clear existing cards
        wisdomCards.innerHTML = '';
        
        // Create wisdom cards
        wisdomCollection.forEach(insight => {
            const card = this.createWisdomCard(insight);
            wisdomCards.appendChild(card);
        });
    }
    
    createWisdomCard(insight) {
        const card = document.createElement('div');
        card.className = 'wisdom-card';
        
        const date = new Date(insight.timestamp).toLocaleDateString();
        const resonant = insight.resonant ? 'wisdom-card-resonant' : '';
        
        card.innerHTML = `
            <div class="wisdom-card-header">
                <div class="wisdom-card-icon">${insight.icon}</div>
                <div class="wisdom-card-title">${insight.title}</div>
            </div>
            <div class="wisdom-card-content">${insight.content}</div>
            <div class="wisdom-card-meta">
                <div class="wisdom-card-date">${date}</div>
                <div class="${resonant}">${insight.resonant ? 'Resonates' : ''}</div>
            </div>
        `;
        
        return card;
    }
    
    initializeClarityPage() {
        console.log('🎤 Initializing Clarity Sanctuary...');
        
        // Initialize the Clarity Sanctuary
        if (window.claritySanctuary) {
            console.log('🎤 Clarity Sanctuary already initialized');
        } else {
            console.log('🎤 Initializing new Clarity Sanctuary...');
            // The ClaritySanctuary class will auto-initialize when DOM is ready
        }
        
        // Track analytics
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: 'Clarity - A Sanctuary for Your Voice',
                page_location: window.location.href
            });
        }
    }

    initializeClarityLogic() {
        // Clarity prompts data
        const prompts = [
            {
                id: 'intention',
                icon: '💭',
                title: 'What is one intention you hold for today?',
                description: 'Speak it into existence. Take your time and let your words flow naturally.',
                guidance: 'Speak for about a minute. Take your time.'
            },
            {
                id: 'beauty',
                icon: '🌸',
                title: 'Describe something you find beautiful, in detail',
                description: 'Paint a picture with your words. What makes it beautiful to you?',
                guidance: 'Speak for about a minute. Take your time.'
            },
            {
                id: 'values',
                icon: '⚖️',
                title: 'Articulate a core value that will guide your actions today',
                description: 'What principle will you carry with you today? How will it influence your choices?',
                guidance: 'Speak for about a minute. Take your time.'
            },
            {
                id: 'problem',
                icon: '🤔',
                title: 'Talk through a small problem you\'re pondering',
                description: 'Explain it as if to a wise friend. What are you considering?',
                guidance: 'Speak for about a minute. Take your time.'
            },
            {
                id: 'gratitude',
                icon: '🙏',
                title: 'What are you grateful for right now?',
                description: 'Explain why this brings you gratitude. How does it feel?',
                guidance: 'Speak for about a minute. Take your time.'
            },
            {
                id: 'growth',
                icon: '🌱',
                title: 'Describe one way you\'ve grown recently',
                description: 'How does this growth feel? What has changed?',
                guidance: 'Speak for about a minute. Take your time.'
            }
        ];

        let currentPromptIndex = 0;
        let isRecording = false;
        let mediaRecorder = null;
        let recordedChunks = [];
        let audioBlob = null;

        // Update prompt display
        function updatePromptDisplay() {
            const prompt = prompts[currentPromptIndex];
            const promptTitle = document.getElementById('prompt-title');
            const promptDescription = document.getElementById('prompt-description');
            const promptIcon = document.querySelector('.prompt-icon');
            const timerGuidance = document.getElementById('timer-guidance');

            if (promptTitle) promptTitle.textContent = prompt.title;
            if (promptDescription) promptDescription.textContent = prompt.description;
            if (promptIcon) promptIcon.textContent = prompt.icon;
            if (timerGuidance) timerGuidance.textContent = prompt.guidance;
        }

        // Start expression recording
        function startExpression() {
            if (isRecording) return;

            // Request microphone access
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    recordedChunks = [];

                    mediaRecorder.ondataavailable = event => {
                        if (event.data.size > 0) {
                            recordedChunks.push(event.data);
                        }
                    };

                    mediaRecorder.onstop = () => {
                        audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
                        stream.getTracks().forEach(track => track.stop());
                        
                        // Show reflection section
                        const reflectionSection = document.getElementById('reflection-section');
                        if (reflectionSection) {
                            reflectionSection.classList.remove('hidden');
                        }
                    };

                    // Start recording
                    mediaRecorder.start();
                    isRecording = true;

                    // Update UI
                    const startBtn = document.querySelector('.start-expression-btn');
                    const stopBtn = document.getElementById('stop-expression-btn');
                    const listenBtn = document.getElementById('listen-back-btn');
                    const timerDisplay = document.getElementById('timer-display');
                    const timerProgress = document.getElementById('timer-progress');

                    if (startBtn) startBtn.classList.add('hidden');
                    if (stopBtn) stopBtn.classList.remove('hidden');
                    if (listenBtn) listenBtn.classList.add('hidden');

                    // Start timer
                    let timeElapsed = 0;
                    const timerInterval = setInterval(() => {
                        timeElapsed++;
                        const minutes = Math.floor(timeElapsed / 60);
                        const seconds = timeElapsed % 60;
                        
                        if (timerDisplay) {
                            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                        }

                        // Update progress circle (60 seconds = full circle)
                        if (timerProgress) {
                            const progress = Math.min(timeElapsed / 60, 1);
                            const circumference = 2 * Math.PI * 45;
                            const offset = circumference - (progress * circumference);
                            timerProgress.style.strokeDashoffset = offset;
                        }
                    }, 1000);

                    // Store timer interval for cleanup
                    window.clarityTimerInterval = timerInterval;

                })
                .catch(error => {
                    console.error('Error accessing microphone:', error);
                    if (window.dhammaPathApp && window.dhammaPathApp.showNotification) {
                        window.dhammaPathApp.showNotification('Your voice needs permission to be heard', 'warning');
                    }
                });
        }

        // Stop expression recording
        function stopExpression() {
            if (!isRecording || !mediaRecorder) return;

            mediaRecorder.stop();
            isRecording = false;

            // Clear timer
            if (window.clarityTimerInterval) {
                clearInterval(window.clarityTimerInterval);
            }

            // Update UI
            const startBtn = document.querySelector('.start-expression-btn');
            const stopBtn = document.getElementById('stop-expression-btn');
            const listenBtn = document.getElementById('listen-back-btn');

            if (startBtn) startBtn.classList.add('hidden');
            if (stopBtn) stopBtn.classList.add('hidden');
            if (listenBtn) listenBtn.classList.remove('hidden');

            // Show reflection section
            const reflectionSection = document.getElementById('reflection-section');
            if (reflectionSection) {
                reflectionSection.classList.remove('hidden');
            }

            // Show completion notification
            if (window.dhammaPathApp && window.dhammaPathApp.showNotification) {
                window.dhammaPathApp.showNotification('Your voice has been honored!', 'success');
            }
        }

        // Listen back to recording
        function listenBack() {
            if (!audioBlob) return;

            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            // Create a simple audio player
            const audioPlayer = document.createElement('div');
            audioPlayer.className = 'glass-card p-4 mb-4';
            audioPlayer.innerHTML = `
                <div class="flex items-center justify-center space-x-4">
                    <button class="btn-ghost btn-sm" id="play-recording">
                        <span class="text-lg mr-2">▶️</span>Play
                    </button>
                    <span class="text-sm text-charcoal/60">Your expression</span>
                </div>
            `;

            const reflectionSection = document.getElementById('reflection-section');
            if (reflectionSection) {
                reflectionSection.insertBefore(audioPlayer, reflectionSection.firstChild);
            }

            // Play button handler
            document.getElementById('play-recording')?.addEventListener('click', () => {
                audio.play();
            });
        }

        // Save reflection
        function saveReflection() {
            const reflection = {
                prompt: prompts[currentPromptIndex],
                timestamp: new Date().toISOString(),
                audioBlob: audioBlob ? audioBlob.size : 0,
                duration: 60 // This would be calculated from actual recording time
            };

            // Save to localStorage
            const reflections = JSON.parse(localStorage.getItem('clarityReflections') || '[]');
            reflections.push(reflection);
            localStorage.setItem('clarityReflections', JSON.stringify(reflections));

            if (window.dhammaPathApp && window.dhammaPathApp.showNotification) {
                window.dhammaPathApp.showNotification('Your reflection is preserved!', 'success');
            }
        }

        // New expression
        function newExpression() {
            // Reset UI
            const startBtn = document.querySelector('.start-expression-btn');
            const stopBtn = document.getElementById('stop-expression-btn');
            const listenBtn = document.getElementById('listen-back-btn');
            const reflectionSection = document.getElementById('reflection-section');
            const timerDisplay = document.getElementById('timer-display');
            const timerProgress = document.getElementById('timer-progress');

            if (startBtn) startBtn.classList.remove('hidden');
            if (stopBtn) stopBtn.classList.add('hidden');
            if (listenBtn) listenBtn.classList.add('hidden');
            if (reflectionSection) reflectionSection.classList.add('hidden');
            if (timerDisplay) timerDisplay.textContent = 'Ready';
            if (timerProgress) timerProgress.style.strokeDashoffset = '283';

            // Reset state
            isRecording = false;
            mediaRecorder = null;
            recordedChunks = [];
            audioBlob = null;

            // Clear any existing audio player
            const existingPlayer = document.querySelector('.glass-card p-4');
            if (existingPlayer && existingPlayer.querySelector('#play-recording')) {
                existingPlayer.remove();
            }
        }

        // Event listeners
        const startBtn = document.querySelector('.start-expression-btn');
        const stopBtn = document.getElementById('stop-expression-btn');
        const listenBtn = document.getElementById('listen-back-btn');
        const saveBtn = document.getElementById('save-reflection-btn');
        const newBtn = document.getElementById('new-expression-btn');
        const prevBtn = document.getElementById('prev-prompt-btn');
        const nextBtn = document.getElementById('next-prompt-btn');

        if (startBtn) startBtn.addEventListener('click', startExpression);
        if (stopBtn) stopBtn.addEventListener('click', stopExpression);
        if (listenBtn) listenBtn.addEventListener('click', listenBack);
        if (saveBtn) saveBtn.addEventListener('click', saveReflection);
        if (newBtn) newBtn.addEventListener('click', newExpression);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPromptIndex > 0) {
                    currentPromptIndex--;
                    updatePromptDisplay();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentPromptIndex < prompts.length - 1) {
                    currentPromptIndex++;
                    updatePromptDisplay();
                }
            });
        }

        // Initialize
        updatePromptDisplay();
    }

    initializeClarityPrompts() {
        // This could be expanded to include a prompts modal
        console.log('🎤 Clarity prompts initialized');
    }

}

// Export for use in other modules
window.NavigationManager = NavigationManager;
