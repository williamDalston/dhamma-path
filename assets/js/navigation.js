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
        const templatePath = `assets/templates/${pageName}.html`;
        
        try {
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.status}`);
            }
            const content = await response.text();
            mainContent.innerHTML = content;
            
            // Trigger animations after content is loaded
            setTimeout(() => {
                this.triggerPageAnimations();
            }, 50);
            
        } catch (error) {
            console.error('❌ Template loading failed:', error);
            throw error;
        }
    }

    triggerPageAnimations() {
        // Trigger intersection observer for animations
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            if (window.AnimationSystem) {
                window.AnimationSystem.applyAnimation(element, element.dataset.animate, element.dataset.delay || 0);
            }
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
            'interview': this.getInterviewPageContent()
        };

        return pages[pageName] || pages['home'];
    }

    getHomePageContent() {
        return `
            <div class="text-center py-16">
                <h1 class="text-4xl font-bold text-charcoal mb-8">Welcome to The Dhamma Path</h1>
                <p class="text-xl text-charcoal/70 mb-8">Transform your mornings, transform your life</p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    <div class="bg-white/80 rounded-xl p-6 shadow-lg card-link">
                        <div class="text-4xl mb-4">🧘</div>
                        <h3 class="text-xl font-semibold mb-2">Meditate</h3>
                        <p class="text-charcoal/70">Start your day with mindfulness</p>
                    </div>
                    <div class="bg-white/80 rounded-xl p-6 shadow-lg card-link">
                        <div class="text-4xl mb-4">✍️</div>
                        <h3 class="text-xl font-semibold mb-2">Journal</h3>
                        <p class="text-charcoal/70">Reflect and grow</p>
                    </div>
                    <div class="bg-white/80 rounded-xl p-6 shadow-lg card-link">
                        <div class="text-4xl mb-4">💪</div>
                        <h3 class="text-xl font-semibold mb-2">Exercise</h3>
                        <p class="text-charcoal/70">7-minute workout</p>
                    </div>
                    <div class="bg-white/80 rounded-xl p-6 shadow-lg card-link">
                        <div class="text-4xl mb-4">🎤</div>
                        <h3 class="text-xl font-semibold mb-2">Practice</h3>
                        <p class="text-charcoal/70">Build confidence</p>
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
                    <textarea id="journal-textarea" class="w-full h-64 p-4 border-2 border-forest-green/30 rounded-xl resize-none" placeholder="What are you grateful for today? What did you learn? How are you feeling?"></textarea>
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

    getInterviewPageContent() {
        return `
            <div class="text-center py-16">
                <h1 class="text-4xl font-bold text-charcoal mb-8">🎤 Interview Practice</h1>
                <div class="bg-white/80 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
                    <h2 class="text-2xl font-semibold mb-4">Tell me about yourself</h2>
                    <p class="text-charcoal/70 mb-6">Practice your elevator pitch and build confidence</p>
                    <button id="interview-start-btn" class="px-6 py-3 bg-forest-green text-white rounded-xl font-semibold">Start Practice</button>
                </div>
            </div>
        `;
    }

    initializePageFeatures(pageName) {
        console.log(`🎯 Initializing ${pageName} page features...`);
        
        // Initialize page-specific functionality
        switch (pageName) {
            case 'timer':
                this.initializeTimerPage();
                break;
            case 'journal':
                this.initializeJournalPage();
                break;
            case 'workout':
                this.initializeWorkoutPage();
                break;
            case 'interview':
                this.initializeInterviewPage();
                break;
            case 'home':
                this.initializeHomePage();
                break;
        }
        
        // Initialize magnetic effects for all interactive elements
        this.initializeMagneticEffects();
        
        // Track page view in analytics
        if (window.AnalyticsSystem) {
            window.AnalyticsSystem.trackPageView(pageName);
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
                
                showNotification('Journal entry saved!', 'success');
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
            
            showNotification('Writing session complete!', 'success');
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
            
            showNotification('Workout complete! You did amazing!', 'success');
        }

        function showNotification(message, type = 'info') {
            if (window.dhammaPathApp && window.dhammaPathApp.showNotification) {
                window.dhammaPathApp.showNotification(message, type);
            }
        }

        // Initial setup
        updateExercise();
    }

    initializeInterviewPage() {
        this.initializeInterview();
        this.initializeInterviewTimer();
    }

    initializeInterviewTimer() {
        // Enhanced interview practice timer
        const startBtn = document.getElementById('interview-start-btn');
        const pauseBtn = document.getElementById('interview-pause-btn');
        const resetBtn = document.getElementById('interview-reset-btn');
        const display = document.getElementById('interview-display');
        const status = document.getElementById('interview-status');
        const prevBtn = document.getElementById('prev-question-btn');
        const nextBtn = document.getElementById('next-question-btn');
        const questionTitle = document.getElementById('question-title');
        const questionEmoji = document.getElementById('question-emoji');
        const questionDescription = document.getElementById('question-description');
        const progressCircle = document.getElementById('interview-progress-circle');

        if (!startBtn || !display) return;

        const questions = [
            { title: 'Tell me about yourself', emoji: '🎤', description: 'Practice your elevator pitch and build confidence in your communication skills.', duration: 120 },
            { title: 'Why do you want this job?', emoji: '💼', description: 'Explain your motivation and how this role aligns with your career goals.', duration: 120 },
            { title: 'What are your strengths?', emoji: '💪', description: 'Highlight your key skills and provide specific examples of how you use them.', duration: 120 },
            { title: 'What is your greatest weakness?', emoji: '🤔', description: 'Show self-awareness and how you work to improve areas of growth.', duration: 120 },
            { title: 'Where do you see yourself in 5 years?', emoji: '🚀', description: 'Share your career aspirations and how this role fits your long-term plan.', duration: 120 },
            { title: 'Why should we hire you?', emoji: '⭐', description: 'Summarize your unique value proposition and what you bring to the team.', duration: 120 }
        ];

        let currentQuestionIndex = 0;
        let timeRemaining = questions[0].duration;
        let totalTime = questions[0].duration;
        let isRunning = false;
        let timerInterval = null;

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    updateQuestion();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentQuestionIndex < questions.length - 1) {
                    currentQuestionIndex++;
                    updateQuestion();
                }
            });
        }

        // Start button
        startBtn.addEventListener('click', () => {
            if (isRunning) return;
            
            isRunning = true;
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            
            updateStatus('Practice in progress...');
            
            timerInterval = setInterval(() => {
                timeRemaining--;
                updateDisplay();
                updateProgressCircle();
                
                if (timeRemaining <= 0) {
                    nextQuestion();
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
            updateStatus('Practice paused');
        });

        // Reset button
        resetBtn.addEventListener('click', () => {
            isRunning = false;
            clearInterval(timerInterval);
            currentQuestionIndex = 0;
            updateQuestion();
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            updateStatus('Ready to practice your interview skills');
        });

        function updateQuestion() {
            const question = questions[currentQuestionIndex];
            timeRemaining = question.duration;
            totalTime = question.duration;
            
            if (questionTitle) questionTitle.textContent = question.title;
            if (questionEmoji) questionEmoji.textContent = question.emoji;
            if (questionDescription) questionDescription.textContent = question.description;
            
            updateDisplay();
            updateProgressCircle();
        }

        function nextQuestion() {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                updateQuestion();
            } else {
                completePractice();
            }
        }

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

        function completePractice() {
            isRunning = false;
            clearInterval(timerInterval);
            updateStatus('Practice complete! Great job!');
            
            showNotification('Interview practice complete! You\'re getting better!', 'success');
        }

        function showNotification(message, type = 'info') {
            if (window.dhammaPathApp && window.dhammaPathApp.showNotification) {
                window.dhammaPathApp.showNotification(message, type);
            }
        }

        // Initial setup
        updateQuestion();
    }

    initializeHomePage() {
        // Add click handlers for home page cards
        const cards = document.querySelectorAll('.card-premium');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const pages = ['timer', 'journal', 'workout', 'interview'];
                if (pages[index]) {
                    this.navigateToPage(pages[index]);
                }
            });
        });
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

    initializeInterview() {
        // Basic interview functionality
        console.log('🎤 Interview page initialized');
    }
}

// Export for use in other modules
window.NavigationManager = NavigationManager;
